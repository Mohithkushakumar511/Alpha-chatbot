import React from 'react';
import { MessageSquare, Sparkles, Globe, Code2, BookOpen } from 'lucide-react';
import type { AIMode } from '../types';

interface ChatModeTabsProps {
  activeMode: AIMode;
  onSelectMode: (mode: AIMode) => void;
}

export const ChatModeTabs: React.FC<ChatModeTabsProps> = ({
  activeMode,
  onSelectMode,
}) => {
  const modes: { id: AIMode; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'create', label: 'Create', icon: Sparkles },
    { id: 'search', label: 'Search', icon: Globe },
    { id: 'code', label: 'Code', icon: Code2 },
    { id: 'learn', label: 'Learn', icon: BookOpen },
  ];

  return (
    <div className="px-3 py-2 border-b border-[#383034] bg-[#202020]/80 flex items-center justify-between gap-1 overflow-x-auto flex-shrink-0">
      {modes.map((m) => {
        const Icon = m.icon;
        const isActive = activeMode === m.id;

        return (
          <button
            key={m.id}
            onClick={() => onSelectMode(m.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              isActive
                ? 'bg-[#E11D48] border border-[#F43F5E]/70 text-[#F5F5F5] shadow-[0_0_12px_rgba(225,29,72,0.35)] font-semibold'
                : 'text-[#B8B8B8] hover:text-[#F5F5F5] hover:bg-[#202020] border border-transparent'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#F5F5F5]' : 'text-[#B8B8B8]'}`} />
            <span>{m.label}</span>
          </button>
        );
      })}
    </div>
  );
};
