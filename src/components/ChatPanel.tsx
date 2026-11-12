import React, { useState, useEffect } from 'react';
import { ChatHeader } from './ChatHeader';
import { ChatModeTabs } from './ChatModeTabs';
import { MessageList } from './MessageList';
import { MessageComposer } from './MessageComposer';
import { ChatHistory } from './ChatHistory';
import { Maximize2, X } from 'lucide-react';
import type { AIMode, Message, Conversation } from '../types';

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeMode: AIMode;
  onSelectMode: (mode: AIMode) => void;
  messages: Message[];
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  onStop: () => void;
  isListening: boolean;
  onToggleVoice: () => void;
  onRegenerate: () => void;
  onSpeak: (text: string) => void;
  conversations: Conversation[];
  activeConvId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  onDeleteConversation: (id: string) => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  isOpen,
  onClose,
  activeMode,
  onSelectMode,
  messages,
  input,
  setInput,
  onSend,
  isLoading,
  onStop,
  isListening,
  onToggleVoice,
  onRegenerate,
  onSpeak,
  conversations,
  activeConvId,
  onSelectConversation,
  onNewChat,
  onRenameConversation,
  onDeleteConversation,
}) => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsMinimized(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const activeConv = conversations.find((c) => c.id === activeConvId);

  if (isMinimized) {
    return (
      <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 pointer-events-auto animate-in fade-in slide-in-from-bottom-3 duration-200">
        <div
          onClick={() => setIsMinimized(false)}
          className="group flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-[#181818]/95 hover:bg-[#202020] border border-[#383034] hover:border-[#E11D48] shadow-2xl shadow-black/80 backdrop-blur-2xl cursor-pointer transition-all duration-200 transform hover:scale-102 active:scale-98 select-none"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#E11D48] to-[#9F1239] flex items-center justify-center shadow-md shadow-[#E11D48]/30 flex-shrink-0">
            <span className="font-display font-black text-[#F5F5F5] text-xs">A</span>
          </div>

          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-xs tracking-wider text-[#F5F5F5]">ALPHA CHAT</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48] animate-pulse shadow-[0_0_6px_#E11D48]" />
            </div>
            <span className="text-[10px] text-[#B8B8B8] font-mono truncate max-w-[140px] sm:max-w-[180px]">
              {activeConv?.title || 'Active Session'}
            </span>
          </div>

          <div className="flex items-center gap-1 ml-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setIsMinimized(false)}
              className="p-1.5 rounded-lg text-[#B8B8B8] hover:text-[#F5F5F5] hover:bg-[#202020] transition-colors cursor-pointer"
              title="Maximize / Restore Chat"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#B8B8B8] hover:text-[#F43F5E] hover:bg-[#E11D48]/15 transition-colors cursor-pointer"
              title="Close & Clear Chat"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
        isMaximized
          ? 'p-2 sm:p-6 bg-black/75 backdrop-blur-md'
          : 'sm:items-end sm:justify-end sm:p-6 bg-black/60 sm:bg-black/35 backdrop-blur-sm sm:backdrop-blur-[2px]'
      } pointer-events-auto`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-[#181818]/95 border border-[#383034] rounded-2xl sm:rounded-3xl shadow-2xl shadow-black/80 backdrop-blur-2xl flex flex-col overflow-hidden transition-all duration-300 animate-in fade-in ${
          isMaximized
            ? 'w-full h-full sm:w-[94vw] sm:h-[92vh] sm:max-w-[1440px] sm:max-h-[940px]'
            : 'w-full h-full sm:w-[490px] md:w-[510px] sm:h-[84vh] sm:max-h-[820px] slide-in-from-bottom-4 sm:slide-in-from-right-4'
        }`}
      >
        <ChatHeader
          onClose={onClose}
          onNewChat={() => {
            onNewChat();
            setIsHistoryOpen(false);
          }}
          onToggleHistory={() => setIsHistoryOpen(!isHistoryOpen)}
          isHistoryOpen={isHistoryOpen}
          isMaximized={isMaximized}
          onToggleMaximize={() => setIsMaximized(!isMaximized)}
          onMinimize={() => setIsMinimized(true)}
        />

        <ChatModeTabs
          activeMode={activeMode}
          onSelectMode={(mode) => {
            onSelectMode(mode);
            setIsHistoryOpen(false);
          }}
        />

        {isHistoryOpen ? (
          <ChatHistory
            conversations={conversations}
            activeId={activeConvId}
            onSelectConversation={(id) => {
              onSelectConversation(id);
              setIsHistoryOpen(false);
            }}
            onNewChat={() => {
              onNewChat();
              setIsHistoryOpen(false);
            }}
            onRenameConversation={onRenameConversation}
            onDeleteConversation={onDeleteConversation}
          />
        ) : (
          <MessageList
            messages={messages}
            isLoading={isLoading}
            onRegenerate={onRegenerate}
            onSpeak={onSpeak}
            onStop={onStop}
          />
        )}

        <MessageComposer
          input={input}
          setInput={setInput}
          onSend={onSend}
          isLoading={isLoading}
          onStop={onStop}
          isListening={isListening}
          onToggleVoice={onToggleVoice}
        />
      </div>
    </div>
  );
};
