import React, { useRef, useEffect } from 'react';
import { MessageBubble } from './MessageBubble';
import { Bot } from 'lucide-react';
import type { Message } from '../types';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  onRegenerate: () => void;
  onSpeak: (text: string) => void;
  onStop: () => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isLoading,
  onRegenerate,
  onSpeak,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const lastAssistantIndex = messages.map((m) => m.role).lastIndexOf('assistant');

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto overflow-y-auto px-4 py-4 sm:py-6 pb-10 space-y-4">
      {messages.map((message, idx) => (
        <MessageBubble
          key={message.id || idx}
          message={message}
          isLastAssistant={idx === lastAssistantIndex}
          onRegenerate={onRegenerate}
          onSpeak={onSpeak}
        />
      ))}

      {/* Typing & Reasoning Indicator with 3 Animated Dots */}
      {isLoading && (
        <div className="flex items-center gap-3 py-2 animate-in fade-in duration-300">
          <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-[#8B5CF6] via-[#6D28D9] to-[#38BDF8] p-[1px] shadow-[0_0_12px_rgba(139,92,246,0.35)] flex-shrink-0">
            <div className="w-full h-full rounded-xl bg-[#080811] flex items-center justify-center">
              <Bot className="w-4 h-4 text-[#B794F4]" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#38BDF8] animate-ping" />
          </div>

          <div className="px-4 py-3 rounded-2xl bg-[#131020]/90 border border-[#251E3E] backdrop-blur-xl flex items-center gap-2 shadow-lg shadow-black/50">
            {/* 3 Animated Glowing Dots */}
            <div className="flex items-center gap-1.5 px-0.5">
              <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 rounded-full bg-[#B794F4] animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-bounce" />
            </div>
            <span className="text-xs text-[#A1A1AA] font-mono ml-2">
              Alpha is thinking...
            </span>
          </div>
        </div>
      )}

      <div ref={bottomRef} className="h-6 flex-shrink-0" />
    </div>
  );
};
