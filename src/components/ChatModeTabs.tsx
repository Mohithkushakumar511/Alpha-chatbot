import React from 'react';
import { MessageSquare, Sparkles, Globe, Code2, GraduationCap } from 'lucide-react';
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
    { id: 'code', label: 'Code', icon: Code2 },
    { id: 'create', label: 'Create', icon: Sparkles },
    { id: 'search', label: 'Search', icon: Globe },
    { id: 'learn', label: 'Learn', icon: GraduationCap },
  ];

  return (
    <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#0E0C1B]/80 border border-[#251E3E] backdrop-blur-xl shadow-inner max-w-full overflow-x-auto">
      {modes.map((m) => {
        const Icon = m.icon;
        const isActive = activeMode === m.id;

        return (
          <button
            key={m.id}
            onClick={() => onSelectMode(m.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer whitespace-nowrap select-none ${
              isActive
                ? 'bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] text-[#F8FAFC] shadow-[0_0_15px_rgba(139,92,246,0.45)] border border-[#B794F4]/40 font-semibold'
                : 'text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#1E1638]/70 border border-transparent'
            }`}
          >
            <Icon
              className={`w-3.5 h-3.5 ${
                isActive ? 'text-white' : 'text-[#A1A1AA] group-hover:text-[#B794F4]'
              }`}
            />
            <span>{m.label}</span>
          </button>
        );
      })}
    </div>
  );
};
