import React, { useRef, useEffect } from 'react';
import { MessageBubble } from './MessageBubble';
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
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
      {messages.map((message, idx) => (
        <MessageBubble
          key={message.id || idx}
          message={message}
          isLastAssistant={idx === lastAssistantIndex}
          onRegenerate={onRegenerate}
          onSpeak={onSpeak}
        />
      ))}

      {/* Typing / Reasoning Indicator */}
      {isLoading && (
        <div className="flex items-center gap-2.5 text-xs text-[#B8B8B8] py-1">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#E11D48] to-[#9F1239] flex items-center justify-center text-[#F5F5F5] font-display font-black text-xs shadow-sm shadow-[#E11D48]/20 flex-shrink-0">
            A
          </div>
          <div className="px-4 py-2.5 rounded-2xl bg-[#222222] border border-[#383034] flex items-center gap-1.5 shadow-md">
            <span className="w-2 h-2 rounded-full bg-[#E11D48] animate-ping" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#BE123C] animate-pulse" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#9F1239] animate-pulse" />
            <span className="text-[#B8B8B8] font-mono text-[11px] ml-1.5">Alpha is reasoning...</span>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};
