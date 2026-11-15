import React from 'react';
import { Robot3D } from './Robot3D';
import { Sparkles, Code, Lightbulb, GraduationCap, ArrowRight, User as UserIcon, Zap, CheckCircle2 } from 'lucide-react';
import type { AIMode } from '../types';

interface WelcomeScreenProps {
  robotState?: 'idle' | 'thinking' | 'speaking';
  onSelectPrompt: (prompt: string, mode?: AIMode) => void;
  activeMode: AIMode;
  isInputActive?: boolean;
  onContinueGuest?: () => void;
  onOpenAuth?: (mode?: 'signin' | 'register') => void;
  isAuthenticated?: boolean;
  userName?: string;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  robotState = 'idle',
  onSelectPrompt,
  isInputActive = false,
  onContinueGuest,
  onOpenAuth,
  isAuthenticated = false,
  userName,
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
    <div className="w-full flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto px-4 py-4 sm:py-8 text-center animate-in fade-in duration-300">
      
      {/* 1. Futuristic Robot Mascot in the Centre */}
      <div
        className={`relative flex flex-col items-center justify-center transition-all duration-500 ease-out ${
          isInputActive
            ? 'scale-80 -translate-y-3 opacity-80 mb-2 sm:mb-3'
            : 'scale-100 translate-y-0 opacity-100 mb-4 sm:mb-6'
        }`}
      >
        {/* Soft Purple & Cyan Holographic Radial Glow (Restricted strictly behind mascot) */}
        <div className="absolute inset-0 m-auto w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-gradient-to-tr from-[#8B5CF6]/20 via-[#6D28D9]/15 to-[#38BDF8]/15 blur-3xl pointer-events-none -z-10 animate-pulse-glow" />

        {/* Subtle Hologram Orbital Ring (Restricted to welcome screen only) */}
        <div className="absolute inset-0 m-auto w-48 h-28 sm:w-56 sm:h-32 rounded-full border border-[#8B5CF6]/20 shadow-[0_0_12px_rgba(139,92,246,0.15)] transform -rotate-12 pointer-events-none -z-5" />
        
        {/* Robot 3D Canvas with gentle, calm floating animation */}
        <div className="animate-bot-float cursor-pointer select-none">
          {/* Responsive 3D Canvas scaling */}
          <div className="block sm:hidden">
            <Robot3D state={robotState} width={190} height={220} />
          </div>
          <div className="hidden sm:block">
            <Robot3D state={robotState} width={230} height={260} />
          </div>
        </div>

        {/* Holographic Status Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#131020]/90 border border-[#8B5CF6]/30 backdrop-blur-md text-[10px] sm:text-[11px] font-mono text-[#B794F4] shadow-sm mt-0.5 pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-ping" />
          <span>ALPHA COMPANION READY</span>
        </div>
      </div>

      {/* 2. Welcome Headings */}
      <div
        className={`max-w-2xl mx-auto transition-all duration-300 ${
          isInputActive ? 'mb-4 sm:mb-6' : 'mb-6 sm:mb-8'
        }`}
      >
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-2 text-[#F8FAFC]">
          Welcome to{' '}
          <span className="bg-gradient-to-r from-[#F8FAFC] via-[#B794F4] to-[#8B5CF6] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(139,92,246,0.35)]">
            Alpha AI
          </span>
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-[#A1A1AA] max-w-lg mx-auto leading-relaxed font-normal">
          Your intelligent companion, ready to think, create and explore.
        </p>

        {/* Guest & Auth Choice Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-4 sm:mt-5">
          {isAuthenticated ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#131020]/90 border border-[#8B5CF6]/50 text-xs font-mono text-[#F8FAFC]">
              <CheckCircle2 className="w-4 h-4 text-[#38BDF8]" />
              <span>Signed in as <strong className="text-[#B794F4]">{userName || 'Member'}</strong></span>
            </div>
          ) : (
            <>
              {/* Option 1: Continue as Guest (Primary Action) */}
              <button
                type="button"
                onClick={onContinueGuest}
                className="group px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9] hover:from-[#9061F9] hover:to-[#7E3AF2] text-white font-semibold text-xs sm:text-sm shadow-md shadow-[#8B5CF6]/30 hover:shadow-[0_0_24px_rgba(139,92,246,0.55)] transition-all duration-200 cursor-pointer flex items-center gap-2 hover:scale-105 active:scale-95"
              >
                <Zap className="w-4 h-4 text-[#38BDF8] fill-[#38BDF8]/40" />
                <span>Continue as Guest</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>

              {/* Option 2: Sign In / Create Account (Secondary Option) */}
              <button
                type="button"
                onClick={() => onOpenAuth?.('signin')}
                className="px-4 py-2.5 rounded-2xl bg-[#131020]/90 hover:bg-[#1E1638] border border-[#251E3E] hover:border-[#8B5CF6]/60 text-[#A1A1AA] hover:text-[#F8FAFC] text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-2 backdrop-blur-xl"
              >
                <UserIcon className="w-4 h-4 text-[#8B5CF6]" />
                <span>Sign In / Create Account</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* 3. Suggested Prompt Cards Grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5 max-w-2xl mx-auto mb-2 text-left">
        {promptCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              onClick={() => onSelectPrompt(card.prompt, card.mode)}
              className="group relative p-3 sm:p-3.5 rounded-2xl bg-[#131020]/80 hover:bg-[#1C1635]/90 border border-[#251E3E] hover:border-[#8B5CF6]/60 backdrop-blur-xl shadow-md shadow-black/30 hover:shadow-[0_0_20px_rgba(139,92,246,0.2)] transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer select-none"
            >
              <div className="flex items-start justify-between mb-1.5">
                <div className="w-7 h-7 rounded-lg bg-[#1E1638] border border-[#251E3E] flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                  <Icon className={`w-3.5 h-3.5 ${card.iconColor}`} />
                </div>
                <span className="text-[9.5px] font-mono font-medium px-2 py-0.5 rounded-full bg-[#080811]/70 border border-[#251E3E] text-[#A1A1AA] group-hover:text-[#B794F4] transition-colors">
                  {card.badge}
                </span>
              </div>

              <h3 className="font-display font-semibold text-xs sm:text-[13px] text-[#F8FAFC] group-hover:text-[#B794F4] transition-colors mb-0.5">
                {card.title}
              </h3>
              <p className="text-[11px] text-[#A1A1AA] leading-relaxed line-clamp-2">
                {card.description}
              </p>

              <div className="mt-2 flex items-center gap-1 text-[10px] font-medium text-[#38BDF8] opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Try this prompt</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
