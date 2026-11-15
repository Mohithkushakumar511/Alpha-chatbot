import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { MessageList } from './components/MessageList';
import { MessageComposer } from './components/MessageComposer';
import { SettingsModal } from './components/SettingsModal';
import { AuthModal } from './components/AuthModal';
import { CodeInterface } from './components/modes/CodeInterface';
import { CreateInterface } from './components/modes/CreateInterface';
import { SearchInterface } from './components/modes/SearchInterface';
import { LearnInterface } from './components/modes/LearnInterface';
import type { AIMode, Message, Conversation, SystemStatus, ResponseLengthMode, User } from './types';

const STORAGE_KEY = 'alpha_conversations_v1';
const RESPONSE_LENGTH_KEY = 'alpha_response_length_v1';
const AUTH_TOKEN_KEY = 'alpha_auth_token_v1';

const getApiBase = (): string => {
  const envUrl = (import.meta.env.VITE_API_URL || '').trim();

  // If running locally in development on localhost, communicate with local FastAPI backend
  if (typeof window !== 'undefined') {
    const isLocalhost =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';

    if (isLocalhost) {
      return 'http://127.0.0.1:3001';
    }
  }

  if (!envUrl) {
    return 'http://127.0.0.1:3001';
  }
  const formatted = envUrl.startsWith('http://') || envUrl.startsWith('https://')
    ? envUrl
    : `https://${envUrl}`;
  return formatted.replace(/\/+$/, '');
};

const API_BASE = getApiBase();

export const App: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [activeMode, setActiveMode] = useState<AIMode>('chat');
  const [responseLength, setResponseLength] = useState<ResponseLengthMode>(() => {
    try {
      const saved = localStorage.getItem(RESPONSE_LENGTH_KEY) as ResponseLengthMode | null;
      if (saved && ['quick', 'balanced', 'detailed'].includes(saved)) {
        return saved;
      }
    } catch {}
    return 'balanced';
  });
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);

  const handleSelectResponseLength = (mode: ResponseLengthMode) => {
    setResponseLength(mode);
    try {
      localStorage.setItem(RESPONSE_LENGTH_KEY, mode);
    } catch {}
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Authentication & Guest Mode State
  const [user, setUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(AUTH_TOKEN_KEY);
    } catch {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialMode, setAuthModalInitialMode] = useState<'signin' | 'register'>('signin');
  const isAuthenticated = Boolean(user && authToken);

  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [robotState, setRobotState] = useState<'idle' | 'thinking' | 'speaking'>('idle');

  const abortControllerRef = useRef<AbortController | null>(null);
  const recognitionRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Helper: Create a fresh new unique conversation session
  const createFreshConversation = (targetMode: AIMode = 'chat'): Conversation => {
    const welcomeMsg: Message = {
      id: 'welcome-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      role: 'assistant',
      content: `Hey, I'm ALPHA 👋 Your futuristic AI universe companion in ${targetMode.toUpperCase()} mode. What would you like to explore today?`,
      timestamp: new Date().toISOString(),
      mode: targetMode,
    };

    return {
      id: 'conv-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      title: `${targetMode.charAt(0).toUpperCase() + targetMode.slice(1)} Session`,
      mode: targetMode,
      messages: [welcomeMsg],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  };

  // Set default sidebar open on large screens
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      setIsSidebarOpen(true);
    }
  }, []);

  // ALWAYS initialize a fresh new empty conversation on website launch or reload
  useEffect(() => {
    fetchSystemStatus();
    const interval = setInterval(fetchSystemStatus, 30000);

    const freshConv = createFreshConversation('chat');
    setActiveConvId(freshConv.id);
    setMessages(freshConv.messages);
    setActiveMode('chat');
    setInput('');
    setRobotState('idle');

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        let parsed: Conversation[] = JSON.parse(stored);
        parsed = parsed.map((conv) => ({
          ...conv,
          messages: conv.messages.map((m) =>
            m.content.includes("Your intelligent companion for conversations")
              ? { ...m, content: "Hey, I'm ALPHA! How can I help you?" }
              : m
          ),
        }));
        // Preserve all saved conversations that contain user messages in history
        const savedHistory = parsed.filter((c) => c.messages.some((m) => m.role === 'user'));
        setConversations([freshConv, ...savedHistory]);
      } else {
        setConversations([freshConv]);
      }
    } catch (err) {
      console.error('Failed to load chat history from LocalStorage:', err);
      setConversations([freshConv]);
    }

    return () => clearInterval(interval);
  }, []);

  // Verify stored session on mount
  useEffect(() => {
    const verifyUserSession = async () => {
      const token = authToken || localStorage.getItem(AUTH_TOKEN_KEY);
      if (!token) return;

      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
            setAuthToken(token);
            await fetchUserConversations(token);
            return;
          }
        }
        // If expired or invalid
        localStorage.removeItem(AUTH_TOKEN_KEY);
        setUser(null);
        setAuthToken(null);
      } catch (err) {
        console.error('Session check failed:', err);
      }
    };

    verifyUserSession();
  }, []);

  const fetchUserConversations = async (token: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.conversations && Array.isArray(data.conversations)) {
          const userConvs = data.conversations.filter((c: Conversation) =>
            c.messages.some((m) => m.role === 'user')
          );
          setConversations((prev) => {
            // Keep the active fresh chat at the top and display user's saved chats in history
            const activeFresh = prev.find((c) => !c.messages.some((m) => m.role === 'user'));
            if (activeFresh) {
              return [activeFresh, ...userConvs.filter((c: Conversation) => c.id !== activeFresh.id)];
            }
            return userConvs;
          });
          // Do not override activeConvId or messages: keep fresh new chat active
        }
      }
    } catch (err) {
      console.error('Failed to fetch user conversations:', err);
    }
  };

  const handleOpenAuth = (mode: 'signin' | 'register' = 'signin') => {
    setAuthModalInitialMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (token: string, newUser: User) => {
    setAuthToken(token);
    setUser(newUser);
    try {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } catch {}
    fetchUserConversations(token);
  };

  const handleLogout = async () => {
    if (authToken) {
      try {
        await fetch(`${API_BASE}/api/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${authToken}` },
        });
      } catch {}
    }
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    } catch {}
    setUser(null);
    setAuthToken(null);
  };

  const handleTransferConversations = async (token: string) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const convs = stored ? JSON.parse(stored) : conversations;
      const validConvs = (convs || []).filter((c: Conversation) =>
        c.messages.some((m) => m.role === 'user')
      );

      if (validConvs.length === 0) return;

      const res = await fetch(`${API_BASE}/api/conversations/transfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ conversations: validConvs }),
      });

      if (!res.ok) {
        throw new Error('Failed to transfer conversations.');
      }

      const data = await res.json();
      if (data.conversations && Array.isArray(data.conversations)) {
        setConversations(data.conversations);
      }
    } catch (err) {
      console.error('Error in handleTransferConversations:', err);
      throw err;
    }
  };

  const handleClearAllConversations = async () => {
    if (authToken) {
      try {
        await fetch(`${API_BASE}/api/conversations`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${authToken}` },
        });
      } catch (err) {
        console.error('Failed to clear account conversations:', err);
      }
    }

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}

    setConversations([]);
    initNewChat();
  };

  const handleContinueGuest = () => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.focus();
    }
  };

  useEffect(() => {
    try {
      // Persist only conversations with actual user messages in storage
      const toStore = conversations.filter((c) => c.messages.some((m) => m.role === 'user'));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    } catch (err) {
      console.error('Failed to persist to LocalStorage:', err);
    }
  }, [conversations]);

  const fetchSystemStatus = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/status`);
      if (res.ok) {
        const data = await res.json();
        setSystemStatus(data);
      } else {
        setSystemStatus({
          server: { online: false, label: 'Connecting...' },
          groq: { connected: false, label: 'Unavailable' },
          langSearch: { connected: false, label: 'Unavailable' },
          voice: { available: true, label: 'Browser Audio' },
        });
      }
    } catch {
      setSystemStatus({
        server: { online: false, label: 'Connecting...' },
        groq: { connected: false, label: 'Unavailable' },
        langSearch: { connected: false, label: 'Unavailable' },
        voice: { available: true, label: 'Browser Audio' },
      });
    }
  };

  const initNewChat = (mode?: AIMode) => {
    const targetMode = mode || activeMode || 'chat';
    const freshConv = createFreshConversation(targetMode);

    setConversations((prev) => {
      // Preserve all previous conversations that contain user messages
      const withUserMsgs = prev.filter((c) => c.messages.some((m) => m.role === 'user'));
      return [freshConv, ...withUserMsgs];
    });

    setActiveConvId(freshConv.id);
    setMessages(freshConv.messages);
    setActiveMode(targetMode);
    setInput('');
    setRobotState('idle');
  };

  const handleSelectConversation = (id: string) => {
    const conv = conversations.find((c) => c.id === id);
    if (conv) {
      setActiveConvId(conv.id);
      setMessages(conv.messages);
      if (conv.mode) {
        setActiveMode(conv.mode);
      }
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      }
    }
  };

  const handleRenameConversation = (id: string, newTitle: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: newTitle, updatedAt: new Date().toISOString() } : c))
    );
  };

  const handleDeleteConversation = (id: string) => {
    const remaining = conversations.filter((c) => c.id !== id);
    setConversations(remaining);

    if (authToken) {
      fetch(`${API_BASE}/api/conversations/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      }).catch(() => {});
    }

    if (activeConvId === id) {
      initNewChat();
    }
  };

  const handleSelectMode = (newMode: AIMode) => {
    setActiveMode(newMode);
    if (activeConvId) {
      setConversations((prev) =>
        prev.map((c) => (c.id === activeConvId ? { ...c, mode: newMode, updatedAt: new Date().toISOString() } : c))
      );
    }
  };

  const handleSend = async (overridePrompt?: string, modeOverride?: AIMode) => {
    const textToSend = (overridePrompt || input).trim();
    if (!textToSend || isLoading) return;

    const chosenMode = modeOverride || activeMode;
    if (modeOverride && modeOverride !== activeMode) {
      setActiveMode(modeOverride);
    }

    setInput('');

    const userMsg: Message = {
      id: 'msg-' + Date.now(),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toISOString(),
      mode: chosenMode,
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);
    setRobotState('thinking');

    if (messages.length <= 1 && activeConvId) {
      const summaryTitle = textToSend.slice(0, 30) + (textToSend.length > 30 ? '...' : '');
      handleRenameConversation(activeConvId, summaryTitle);
    }

    try {
      abortControllerRef.current = new AbortController();

      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
          mode: chosenMode,
          response_length: responseLength,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }

      const data = await response.json();

      const assistantMsg: Message = {
        id: 'msg-reply-' + Date.now(),
        role: 'assistant',
        content: data.reply || 'No response generated.',
        timestamp: data.timestamp || new Date().toISOString(),
        mode: chosenMode,
        responseLength: responseLength,
        sources: data.sources || [],
      };

      const finalMessages = [...updatedMessages, assistantMsg];
      setMessages(finalMessages);

      if (activeConvId) {
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConvId
              ? { ...c, messages: finalMessages, mode: chosenMode, updatedAt: new Date().toISOString() }
              : c
          )
        );

        if (authToken) {
          const currentConv = conversations.find((c) => c.id === activeConvId);
          fetch(`${API_BASE}/api/conversations`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({
              id: activeConvId,
              title: currentConv?.title || 'New Chat',
              mode: chosenMode,
              messages: finalMessages,
            }),
          }).catch(() => {});
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return;
      }

      const isConnectionError =
        !err.message ||
        err.message.includes('Failed to fetch') ||
        err.message.includes('NetworkError') ||
        err.message.includes('Load failed') ||
        err.message.includes('502') ||
        err.message.includes('503');

      const friendlyMessage = isConnectionError
        ? `⚠️ **Backend is waking up or unreachable.**\n\nIf you are using Render free tier, the service spins down after inactivity and takes ~30–60 seconds to wake up. Please wait a moment and try again.`
        : `⚠️ **Error generating response:** ${err.message || 'Please check your connection and try again.'}`;

      const errorMsg: Message = {
        id: 'msg-err-' + Date.now(),
        role: 'assistant',
        content: friendlyMessage,
        timestamp: new Date().toISOString(),
        mode: chosenMode,
      };

      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      setRobotState('idle');
      abortControllerRef.current = null;
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
      setRobotState('idle');
    }
  };

  const handleRegenerate = () => {
    if (messages.length < 2 || isLoading) return;
    const lastUserIndex = messages.map((m) => m.role).lastIndexOf('user');
    if (lastUserIndex === -1) return;

    const lastUserPrompt = messages[lastUserIndex].content;
    const historyUpToUser = messages.slice(0, lastUserIndex);
    setMessages(historyUpToUser);

    handleSend(lastUserPrompt);
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleSpeak = async (text: string) => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    setRobotState('speaking');
    const cleanSpeech = text.replace(/```[\s\S]*?```/g, '').replace(/[#*_`]/g, '').trim().slice(0, 350);

    try {
      const res = await fetch(`${API_BASE}/api/voice/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanSpeech }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        audioPlayerRef.current = audio;
        audio.onended = () => setRobotState('idle');
        audio.onerror = () => fallbackWebSpeech(cleanSpeech);
        audio.play();
        return;
      }
      fallbackWebSpeech(cleanSpeech);
    } catch {
      fallbackWebSpeech(cleanSpeech);
    }
  };

  const fallbackWebSpeech = (text: string) => {
    if (!('speechSynthesis' in window)) {
      setRobotState('idle');
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.onend = () => setRobotState('idle');
    utterance.onerror = () => setRobotState('idle');
    window.speechSynthesis.speak(utterance);
  };

  const hasUserMessages = messages.some((m) => m.role === 'user');

  return (
    <div className="min-h-screen w-full flex bg-[#080811] text-[#F8FAFC] alpha-universe-bg overflow-hidden relative">
      
      {/* 1. Left Collapsible Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen((prev) => !prev)}
        conversations={conversations}
        activeConvId={activeConvId}
        onSelectConversation={handleSelectConversation}
        onNewChat={() => initNewChat()}
        onRenameConversation={handleRenameConversation}
        onDeleteConversation={handleDeleteConversation}
        onClearAllConversations={handleClearAllConversations}
        onOpenSettings={() => setIsSettingsOpen(true)}
        systemStatus={systemStatus}
        user={user}
        isAuthenticated={isAuthenticated}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
      />

      {/* 2. Main Platform Area */}
      <div
        className={`flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300 ${
          isSidebarOpen ? 'lg:pl-72 sm:lg:pl-80' : 'pl-0'
        }`}
      >
        {/* Top Navigation Bar with Mode Switcher */}
        <Navbar
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          isSidebarOpen={isSidebarOpen}
          activeMode={activeMode}
          onSelectMode={handleSelectMode}
          onOpenSettings={() => setIsSettingsOpen(true)}
          systemStatus={systemStatus}
          onNewChat={() => initNewChat()}
          hasUserMessages={hasUserMessages}
          robotState={robotState}
          responseLength={responseLength}
          onSelectResponseLength={handleSelectResponseLength}
          user={user}
          isAuthenticated={isAuthenticated}
          onOpenAuth={handleOpenAuth}
        />

        {/* Dynamic Center Stage: 5 Distinct Specialized Mode Interfaces */}
        <main className="flex-1 w-full flex flex-col overflow-y-auto relative">
          
          {/* MODE 1: CHAT */}
          {activeMode === 'chat' && (
            !hasUserMessages ? (
              <WelcomeScreen
                robotState={robotState}
                onSelectPrompt={(prompt, mode) => handleSend(prompt, mode)}
                activeMode={activeMode}
                isInputActive={isInputFocused || Boolean(input.trim())}
                onContinueGuest={handleContinueGuest}
                onOpenAuth={handleOpenAuth}
                isAuthenticated={isAuthenticated}
                userName={user?.full_name}
              />
            ) : (
              <MessageList
                messages={messages}
                isLoading={isLoading}
                onRegenerate={handleRegenerate}
                onSpeak={handleSpeak}
                onStop={handleStop}
              />
            )
          )}

          {/* MODE 2: CODE */}
          {activeMode === 'code' && (
            <CodeInterface
              messages={messages}
              isLoading={isLoading}
              onSend={(prompt) => handleSend(prompt, 'code')}
              onStop={handleStop}
              onRegenerate={handleRegenerate}
            />
          )}

          {/* MODE 3: CREATE */}
          {activeMode === 'create' && (
            <CreateInterface
              messages={messages}
              isLoading={isLoading}
              onSend={(prompt) => handleSend(prompt, 'create')}
              onStop={handleStop}
              onRegenerate={handleRegenerate}
            />
          )}

          {/* MODE 4: SEARCH */}
          {activeMode === 'search' && (
            <SearchInterface
              messages={messages}
              isLoading={isLoading}
              onSend={(prompt) => handleSend(prompt, 'search')}
              onStop={handleStop}
              onRegenerate={handleRegenerate}
              systemStatus={systemStatus}
            />
          )}

          {/* MODE 5: LEARN */}
          {activeMode === 'learn' && (
            <LearnInterface
              messages={messages}
              isLoading={isLoading}
              onSend={(prompt) => handleSend(prompt, 'learn')}
              onStop={handleStop}
              onRegenerate={handleRegenerate}
            />
          )}

        </main>

        {/* Floating Message Input Area at the bottom (Primary in Chat Mode) */}
        {activeMode === 'chat' && (
          <footer className="w-full flex-shrink-0 z-20">
            <MessageComposer
              input={input}
              setInput={setInput}
              onSend={() => handleSend()}
              isLoading={isLoading}
              onStop={handleStop}
              isListening={isListening}
              onToggleVoice={toggleVoiceInput}
              activeModeLabel="CHAT"
              onFocusChange={setIsInputFocused}
              responseLength={responseLength}
              onSelectResponseLength={handleSelectResponseLength}
            />
          </footer>
        )}

      </div>

      {/* Settings & Integration Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        systemStatus={systemStatus}
        responseLength={responseLength}
        onSelectResponseLength={handleSelectResponseLength}
        user={user}
        isAuthenticated={isAuthenticated}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
      />

      {/* Authentication & Account Creation Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        apiBase={API_BASE}
        onAuthSuccess={handleAuthSuccess}
        guestConversations={conversations.filter((c) => c.messages.some((m) => m.role === 'user'))}
        onTransferConversations={handleTransferConversations}
        initialMode={authModalInitialMode}
      />

    </div>
  );
};

export default App;
