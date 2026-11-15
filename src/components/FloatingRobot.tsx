import React, { useState } from 'react';
import { Robot3D } from './Robot3D';
import {
  Lightbulb,
  Code,
  Search,
  Sparkles,
} from 'lucide-react';
import type { AIMode } from '../types';

interface FloatingRobotProps {
  onOpenChat: (mode?: AIMode) => void;
  robotState?: 'idle' | 'thinking' | 'speaking';
  onOpenIntegration?: () => void;
}

export const FloatingRobot: React.FC<FloatingRobotProps> = ({
  onOpenChat,
  robotState = 'idle',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <aside
      aria-label="ALPHA AI Companion Mascot"
      className="fixed bottom-4 right-6 sm:bottom-6 sm:right-10 z-30 flex flex-col items-center select-none pointer-events-none transition-all duration-300"
    >
      {/* Outer Container */}
      <div className="relative flex flex-col items-center justify-center">

        {/* 1. TOP-LEFT SPEECH BUBBLE */}
        <div className="absolute -top-14 -left-12 sm:-top-16 sm:-left-16 z-30 pointer-events-auto">
          <div
            onClick={() => onOpenChat('chat')}
            className="relative group cursor-pointer px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl bg-[#131020]/95 hover:bg-[#1C1635] border border-[#8B5CF6]/70 hover:border-[#B794F4] shadow-[0_0_24px_rgba(139,92,246,0.35)] hover:shadow-[0_0_34px_rgba(139,92,246,0.6)] backdrop-blur-xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 min-w-[155px] sm:min-w-[170px]"
          >
            {/* Header: Sparkle + "Hello buddy!" */}
            <div className="flex items-center gap-1.5 text-[#B794F4] font-semibold text-xs sm:text-[13px] leading-snug">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8B5CF6] fill-[#8B5CF6]/40" />
              <span className="text-[#F8FAFC] font-bold tracking-wide">Hello buddy!</span>
            </div>

            {/* Subtext */}
            <div className="text-[10px] sm:text-[11px] text-[#A1A1AA] font-normal mt-0.5 leading-snug">
              How can I help you<br />today?
            </div>

            {/* Speech bubble pointer arrow */}
            <div className="absolute -bottom-2 right-8 w-3.5 h-3.5 bg-[#131020] border-r border-b border-[#8B5CF6] transform rotate-45 z-10" />
          </div>
        </div>

        {/* 2. ORBITING LASER TRACK LINE */}
        <div className="absolute inset-0 m-auto w-[250px] sm:w-[270px] h-[145px] rounded-[50%] border border-[#8B5CF6]/35 shadow-[0_0_15px_rgba(139,92,246,0.3)] transform -rotate-12 pointer-events-none z-10 animate-pulse-glow" />

        {/* 3. THREE FLOATING QUICK ACTION CARDS */}

        {/* TOP-RIGHT CARD: "Code" */}
        <div className="absolute top-2 -right-8 sm:top-2 sm:-right-12 z-25 pointer-events-auto">
          <button
            onClick={() => onOpenChat('code')}
            className="group flex flex-col items-center justify-center px-3 py-2 rounded-2xl bg-[#131020]/90 hover:bg-[#1E1638] border border-[#8B5CF6]/60 hover:border-[#38BDF8] shadow-[0_0_18px_rgba(139,92,246,0.25)] backdrop-blur-xl transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer min-w-[70px]"
            title="Write Code"
          >
            <Code className="w-4 h-4 text-[#38BDF8] transition-transform group-hover:scale-110 mb-0.5" />
            <span className="text-[10px] text-[#F8FAFC] font-semibold">Code</span>
          </button>
        </div>

        {/* MIDDLE-LEFT CARD: "Think" */}
        <div className="absolute top-18 -left-8 sm:top-18 sm:-left-12 z-25 pointer-events-auto">
          <button
            onClick={() => onOpenChat('chat')}
            className="group flex flex-col items-center justify-center px-3 py-2 rounded-2xl bg-[#131020]/90 hover:bg-[#1E1638] border border-[#8B5CF6]/60 hover:border-[#B794F4] shadow-[0_0_18px_rgba(139,92,246,0.25)] backdrop-blur-xl transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer min-w-[64px]"
            title="Reasoning"
          >
            <Lightbulb className="w-4 h-4 text-[#B794F4] transition-transform group-hover:scale-110 mb-0.5" />
            <span className="text-[10px] text-[#F8FAFC] font-semibold">Think</span>
          </button>
        </div>

        {/* MIDDLE-RIGHT CARD: "Search" */}
        <div className="absolute top-20 -right-10 sm:top-20 sm:-right-14 z-25 pointer-events-auto">
          <button
            onClick={() => onOpenChat('search')}
            className="group flex flex-col items-center justify-center px-3 py-2 rounded-2xl bg-[#131020]/90 hover:bg-[#1E1638] border border-[#8B5CF6]/60 hover:border-[#38BDF8] shadow-[0_0_18px_rgba(139,92,246,0.25)] backdrop-blur-xl transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer min-w-[64px]"
            title="Live Search"
          >
            <Search className="w-4 h-4 text-[#38BDF8] transition-transform group-hover:scale-110 mb-0.5" />
            <span className="text-[10px] text-[#F8FAFC] font-semibold">Search</span>
          </button>
        </div>

        {/* 4. 3D ROBOT CANVAS WITH ORIGINAL MESH & SCALING */}
        <div
          onClick={() => onOpenChat()}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="pointer-events-auto relative cursor-pointer transition-transform duration-300 transform hover:scale-105 active:scale-95 flex flex-col items-center select-none z-20 animate-bot-float"
          title="Alpha Robot Companion"
        >
          {/* Ambient purple & cyan glow aura */}
          <div
            className={`absolute inset-0 rounded-full blur-3xl pointer-events-none transition-all duration-500 ${
              isHovered ? 'bg-[#8B5CF6]/35 scale-110' : 'bg-[#8B5CF6]/20'
            }`}
          />

          <div className="relative z-10 w-[200px] h-[240px] sm:w-[220px] sm:h-[260px] flex items-center justify-center">
            <Robot3D state={robotState} width={220} height={260} />
          </div>
        </div>

      </div>
    </aside>
  );
};
