import React from 'react';
import { Robot3D } from './Robot3D';
import { Sparkles, Code, Lightbulb, GraduationCap, ArrowRight } from 'lucide-react';
import type { AIMode } from '../types';

interface WelcomeScreenProps {
  robotState?: 'idle' | 'thinking' | 'speaking';
  onSelectPrompt: (prompt: string, mode?: AIMode) => void;
  activeMode: AIMode;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  robotState = 'idle',
  onSelectPrompt,
}) => {
  const promptCards = [
    {
      id: 'explain',
      icon: Lightbulb,
      title: 'Explain something to me',
      description: 'Explain quantum computing in simple, intuitive terms with analogies.',
      prompt: 'Explain quantum computing in simple, intuitive terms with analogies.',
      mode: 'chat' as AIMode,
      badge: 'Reasoning',
      gradient: 'from-[#8B5CF6]/20 to-[#6D28D9]/10',
      iconColor: 'text-[#B794F4]',
    },
    {
      id: 'code',
      icon: Code,
      title: 'Write code',
      description: 'Build a modern, type-safe React hook with TypeScript and cleanup.',
      prompt: 'Write a clean, reusable React hook with TypeScript for handling debounce and API fetch caching.',
      mode: 'code' as AIMode,
      badge: 'Code Engine',
      gradient: 'from-[#38BDF8]/20 to-[#8B5CF6]/10',
      iconColor: 'text-[#38BDF8]',
    },
    {
      id: 'create',
      icon: Sparkles,
      title: 'Generate ideas',
      description: 'Brainstorm 5 innovative futuristic product concepts for 2026.',
      prompt: 'Brainstorm 5 cutting-edge AI product concepts that solve real-world problems in 2026.',
      mode: 'create' as AIMode,
      badge: 'Creative',
      gradient: 'from-[#EC4899]/20 to-[#8B5CF6]/10',
      iconColor: 'text-[#F472B6]',
    },
    {
      id: 'learn',
      icon: GraduationCap,
      title: 'Help me learn',
      description: 'Step-by-step masterclass on how neural networks and LLMs work.',
      prompt: 'Teach me how neural network attention mechanisms work from first principles.',
      mode: 'learn' as AIMode,
      badge: 'Learning',
      gradient: 'from-[#10B981]/20 to-[#8B5CF6]/10',
      iconColor: 'text-[#34D399]',
    },
  ];

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto px-4 py-6 sm:py-10 text-center animate-in fade-in duration-500">
      
      {/* 1. Futuristic Robot Mascot in the Centre */}
      <div className="relative flex flex-col items-center justify-center mb-6">
        
        {/* Soft Purple & Cyan Holographic Radial Glow */}
        <div className="absolute inset-0 m-auto w-72 h-72 sm:w-84 sm:h-84 rounded-full bg-gradient-to-tr from-[#8B5CF6]/25 via-[#6D28D9]/20 to-[#38BDF8]/20 blur-3xl pointer-events-none -z-10 animate-pulse-glow" />

        {/* Floating Hologram Orbital Ring */}
        <div className="absolute inset-0 m-auto w-64 h-36 rounded-full border border-[#8B5CF6]/30 shadow-[0_0_20px_rgba(139,92,246,0.25)] transform -rotate-12 pointer-events-none -z-5" />
        
        {/* Robot 3D Canvas with smooth floating animation */}
        <div className="animate-bot-float cursor-pointer transform hover:scale-105 transition-transform duration-300">
          <Robot3D state={robotState} width={260} height={290} />
        </div>

        {/* Holographic Status Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#131020]/90 border border-[#8B5CF6]/40 backdrop-blur-md text-[11px] font-mono text-[#B794F4] shadow-[0_0_15px_rgba(139,92,246,0.25)] mt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-ping" />
          <span>ALPHA NEURAL COMPANION ACTIVE</span>
        </div>
      </div>

      {/* 2. Welcome Headings */}
      <div className="max-w-2xl mx-auto mb-8 sm:mb-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-3 text-[#F8FAFC]">
          Welcome to{' '}
          <span className="bg-gradient-to-r from-[#F8FAFC] via-[#B794F4] to-[#8B5CF6] bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(139,92,246,0.4)]">
            Alpha AI
          </span>
        </h1>
        <p className="text-sm sm:text-base text-[#A1A1AA] max-w-lg mx-auto leading-relaxed font-normal">
          Your intelligent companion, ready to think, create and explore.
        </p>
      </div>

      {/* 3. Suggested Prompt Cards Grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-2xl mx-auto mb-2 text-left">
        {promptCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              onClick={() => onSelectPrompt(card.prompt, card.mode)}
              className="group relative p-4 rounded-2xl bg-[#131020]/80 hover:bg-[#1C1635]/90 border border-[#251E3E] hover:border-[#8B5CF6]/60 backdrop-blur-xl shadow-lg shadow-black/40 hover:shadow-[0_0_25px_rgba(139,92,246,0.25)] transition-all duration-300 transform hover:-translate-y-1 cursor-pointer select-none"
            >
              {/* Subtle top card glow */}
              <div
                className={`absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-bl ${card.gradient} blur-xl pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity`}
              />

              <div className="flex items-start justify-between mb-2">
                <div className="w-8 h-8 rounded-xl bg-[#1E1638] border border-[#251E3E] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                  <Icon className={`w-4 h-4 ${card.iconColor}`} />
                </div>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-[#080811]/70 border border-[#251E3E] text-[#A1A1AA] group-hover:text-[#B794F4] transition-colors">
                  {card.badge}
                </span>
              </div>

              <h3 className="font-display font-semibold text-sm text-[#F8FAFC] group-hover:text-[#B794F4] transition-colors mb-1">
                {card.title}
              </h3>
              <p className="text-xs text-[#A1A1AA] leading-relaxed line-clamp-2">
                {card.description}
              </p>

              <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-[#38BDF8] opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-4px] group-hover:translate-x-0 duration-200">
                <span>Start conversation</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
