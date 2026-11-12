import React, { useState } from 'react';
import { ArrowRight, Code, Search, Sparkles } from 'lucide-react';
import type { AIMode } from '../types';

interface HeroSectionProps {
  onSearchSubmit: (query: string) => void;
  onChatWithAlpha: () => void;
  onViewIntegrationCode: () => void;
  onSelectSuggestion: (prompt: string, mode?: AIMode) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearchSubmit,
  onChatWithAlpha,
  onViewIntegrationCode,
  onSelectSuggestion,
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearchSubmit(query.trim());
      setQuery('');
    }
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-4 pt-10 sm:pt-14 md:pt-16 pb-2 flex flex-col items-center text-center">
      
      {/* Subtitle Badge: "YOUR AI COMPANION" */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#251719] border border-[#383034] text-[#E11D48] font-mono text-[11px] font-bold tracking-[2.5px] uppercase mb-4 shadow-sm shadow-[#E11D48]/10">
        <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48] animate-pulse shadow-[0_0_6px_#E11D48]" />
        <span>YOUR AI COMPANION</span>
      </div>

      {/* Main Heading: "Meet ALPHA" */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 leading-tight text-[#F5F5F5]">
        Meet{' '}
        <span className="bg-gradient-to-r from-[#F43F5E] via-[#E11D48] to-[#BE123C] bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(225,29,72,0.35)]">
          ALPHA
        </span>
      </h1>

      {/* Description */}
      <p className="text-sm sm:text-base md:text-lg text-[#B8B8B8] max-w-xl mx-auto leading-relaxed mb-6 font-normal">
        Your intelligent companion for conversations, coding, creativity, research, and learning.
      </p>

      {/* Main Center Search Bar */}
      <div className="w-full max-w-2xl mx-auto mb-6 px-1">
        <div className="relative group">
          {/* Ambient Warm Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#251719]/40 via-[#BE123C]/20 to-[#E11D48]/25 rounded-3xl blur-lg opacity-75 group-hover:opacity-100 group-focus-within:opacity-100 transition duration-500" />

          {/* Search Form Container */}
          <form
            onSubmit={handleSubmit}
            className="relative flex items-center bg-[#181818]/90 backdrop-blur-xl border border-[#383034] group-focus-within:border-[#E11D48] group-focus-within:shadow-[0_0_24px_rgba(225,29,72,0.25)] rounded-2xl sm:rounded-3xl p-2 sm:p-2.5 transition-all shadow-2xl shadow-black/70"
          >
            <div className="pl-3 pr-2 text-[#E11D48] flex items-center justify-center flex-shrink-0">
              <Search className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-[0_0_8px_rgba(225,29,72,0.4)]" />
            </div>

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask Alpha anything..."
              className="w-full bg-transparent px-2 sm:px-3 py-2 sm:py-2.5 text-sm sm:text-base text-[#F5F5F5] placeholder:text-[#B8B8B8]/60 outline-none font-normal"
              autoFocus
            />

            <div className="flex items-center gap-2 pr-1 flex-shrink-0">
              {/* Keyboard Enter Hint */}
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono text-[#E11D48] bg-[#151515] border border-[#383034] select-none">
                ↵ Enter
              </span>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!query.trim()}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-[#E11D48] hover:bg-[#9F1239] text-[#F5F5F5] flex items-center justify-center shadow-md shadow-[#E11D48]/30 hover:shadow-[#E11D48]/50 disabled:opacity-35 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all cursor-pointer"
                title="Ask Alpha"
              >
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 3 Clickable Suggestion Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 text-xs sm:text-sm max-w-2xl mb-6">
        <button
          onClick={() => onSelectSuggestion('Hey Alpha, what can you do?', 'chat')}
          className="px-4 py-2 rounded-full bg-[#181818]/80 hover:bg-[#202020] border border-[#383034] hover:border-[#E11D48] text-[#B8B8B8] hover:text-[#F5F5F5] transition-all shadow-sm cursor-pointer active:scale-98"
        >
          ✨ Hey Alpha, what can you do?
        </button>

        <button
          onClick={() => onSelectSuggestion('Code: Debug a function', 'code')}
          className="px-4 py-2 rounded-full bg-[#181818]/80 hover:bg-[#202020] border border-[#383034] hover:border-[#E11D48] text-[#B8B8B8] hover:text-[#F5F5F5] transition-all shadow-sm cursor-pointer active:scale-98"
        >
          💻 Code: Debug a function
        </button>

        <button
          onClick={() => onSelectSuggestion('Create: 3 App Names', 'create')}
          className="px-4 py-2 rounded-full bg-[#181818]/80 hover:bg-[#202020] border border-[#383034] hover:border-[#E11D48] text-[#B8B8B8] hover:text-[#F5F5F5] transition-all shadow-sm cursor-pointer active:scale-98"
        >
          💡 Create: 3 App Names
        </button>
      </div>

      {/* Action Buttons: "Chat with Alpha" and "View Integration Code" */}
      <div className="flex flex-wrap items-center justify-center gap-3.5 mb-2 w-full max-w-md">
        <button
          onClick={onChatWithAlpha}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-2xl bg-[#E11D48] hover:bg-[#9F1239] text-[#F5F5F5] font-display font-bold text-sm shadow-lg shadow-[#E11D48]/30 hover:shadow-[#E11D48]/50 transform hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
        >
          <span>Open Full Chat</span>
          <Sparkles className="w-4 h-4" />
        </button>

        <button
          onClick={onViewIntegrationCode}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-[#181818]/80 hover:bg-[#202020] border border-[#383034] hover:border-[#E11D48] text-[#B8B8B8] hover:text-[#F5F5F5] text-sm font-semibold transition-all shadow-md cursor-pointer hover:shadow-[#E11D48]/10"
        >
          <Code className="w-4 h-4 text-[#E11D48]" />
          <span>View Integration Code</span>
        </button>
      </div>

    </section>
  );
};
