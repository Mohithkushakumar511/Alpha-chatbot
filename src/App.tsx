import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ApiStatusBar } from './components/ApiStatusBar';
import { FeatureCards } from './components/FeatureCards';
import { FloatingRobot } from './components/FloatingRobot';
import { ChatPanel } from './components/ChatPanel';
import { IntegrationModal } from './components/IntegrationModal';
import type { AIMode, Message, Conversation, SystemStatus } from './types';

const STORAGE_KEY = 'alpha_conversations_v1';
const ACTIVE_CONV_KEY = 'alpha_active_conv_v1';

const getApiBase = (): string => {
  const envUrl = (import.meta.env.VITE_API_URL || '').trim();
  if (!envUrl) {
    return 'http://localhost:3001';
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
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isIntegrationOpen, setIsIntegrationOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [robotState, setRobotState] = useState<'idle' | 'thinking' | 'speaking'>('idle');

  const abortControllerRef = useRef<AbortController | null>(null);
  const recognitionRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetchSystemStatus();
    const interval = setInterval(fetchSystemStatus, 30000);

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const savedActiveId = localStorage.getItem(ACTIVE_CONV_KEY);

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
        setConversations(parsed);

        const found = parsed.find((c) => c.id === savedActiveId) || parsed[0];
        if (found) {
          setActiveConvId(found.id);
          setMessages(found.messages);
          setActiveMode(found.mode);
        } else {
          initNewChat();
        }
      } else {
        initNewChat();
      }
    } catch (err) {
      console.error('Failed to load chat history from LocalStorage:', err);
      initNewChat();
    }

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (conversations.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
      } catch (err) {
        console.error('Failed to persist to LocalStorage:', err);
      }
    }
  }, [conversations]);

  useEffect(() => {
    if (activeConvId) {
      localStorage.setItem(ACTIVE_CONV_KEY, activeConvId);
    }
  }, [activeConvId]);

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

  const initNewChat = () => {
    const welcomeMsg: Message = {
      id: 'welcome-' + Date.now(),
      role: 'assistant',
      content: "Hey! I'm ALPHA 👋\nWhat would you like to do today?",
      timestamp: new Date().toISOString(),
      mode: 'chat',
    };

    const newConv: Conversation = {
      id: 'conv-' + Date.now(),
      title: 'New Conversation',
      mode: 'chat',
      messages: [welcomeMsg],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setConversations((prev) => {
      const withUserMsgs = prev.filter((c) => c.messages.some((m) => m.role === 'user'));
      return [newConv, ...withUserMsgs];
    });
    setActiveConvId(newConv.id);
    setMessages([welcomeMsg]);
    setActiveMode('chat');
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
    handleStop();
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setRobotState('idle');
    setInput('');
    initNewChat();
  };

  const handleSelectConversation = (id: string) => {
    const conv = conversations.find((c) => c.id === id);
    if (conv) {
      setActiveConvId(conv.id);
      setMessages(conv.messages);
      setActiveMode(conv.mode);
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

    if (activeConvId === id) {
      if (remaining.length > 0) {
        setActiveConvId(remaining[0].id);
        setMessages(remaining[0].messages);
        setActiveMode(remaining[0].mode);
      } else {
        initNewChat();
      }
    }
  };

  const handleSend = async (overridePrompt?: string, modeOverride?: AIMode) => {
    const textToSend = (overridePrompt || input).trim();
    if (!textToSend || isLoading) return;

    const chosenMode = modeOverride || activeMode;
    if (modeOverride) setActiveMode(modeOverride);

    setIsChatOpen(true);
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
      const summaryTitle = textToSend.slice(0, 32) + (textToSend.length > 32 ? '...' : '');
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
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${response.status}`);
      }

      const data = await response.json();

      const assistantMsg: Message = {
        id: 'msg-reply-' + Date.now(),
        role: 'assistant',
        content: data.reply || 'No response generated.',
        timestamp: data.timestamp || new Date().toISOString(),
        mode: chosenMode,
        sources: data.sources || [],
      };

      const finalMessages = [...updatedMessages, assistantMsg];
      setMessages(finalMessages);

      if (activeConvId) {
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConvId
              ? { ...c, messages: finalMessages, updatedAt: new Date().toISOString() }
              : c
          )
        );
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

  return (
    <div className="min-h-screen w-full flex flex-col alpha-ambient-bg text-[#F5F5F5] overflow-x-hidden">
      <Navbar
        onOpenIntegration={() => setIsIntegrationOpen(true)}
        onWakeAlpha={() => setIsChatOpen(true)}
      />

      <main className="flex-1 w-full flex flex-col items-center">
        <HeroSection
          onSearchSubmit={(query) => handleSend(query)}
          onChatWithAlpha={() => setIsChatOpen(true)}
          onViewIntegrationCode={() => setIsIntegrationOpen(true)}
          onSelectSuggestion={(prompt, mode) => handleSend(prompt, mode)}
        />

        <ApiStatusBar systemStatus={systemStatus} />

        <FeatureCards onSelectFeature={() => setIsChatOpen(true)} />
      </main>

      <FloatingRobot
        onOpenChat={(mode) => {
          if (mode) setActiveMode(mode);
          setIsChatOpen(true);
        }}
        robotState={robotState}
        onOpenIntegration={() => setIsIntegrationOpen(true)}
      />

      <ChatPanel
        isOpen={isChatOpen}
        onClose={handleCloseChat}
        activeMode={activeMode}
        onSelectMode={(mode) => setActiveMode(mode)}
        messages={messages}
        input={input}
        setInput={setInput}
        onSend={() => handleSend()}
        isLoading={isLoading}
        onStop={handleStop}
        isListening={isListening}
        onToggleVoice={toggleVoiceInput}
        onRegenerate={handleRegenerate}
        onSpeak={handleSpeak}
        conversations={conversations}
        activeConvId={activeConvId}
        onSelectConversation={handleSelectConversation}
        onNewChat={initNewChat}
        onRenameConversation={handleRenameConversation}
        onDeleteConversation={handleDeleteConversation}
      />

      <IntegrationModal
        isOpen={isIntegrationOpen}
        onClose={() => setIsIntegrationOpen(false)}
      />
    </div>
  );
};

export default App;
