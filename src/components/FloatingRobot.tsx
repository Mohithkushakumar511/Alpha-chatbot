import React, { useState } from 'react';
import { Robot3D } from './Robot3D';
import {
  Lightbulb,
  AudioLines,
  Code,
  Search,
  Calendar,
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
      className="fixed bottom-3 right-16 sm:bottom-6 sm:right-24 md:right-28 z-40 flex flex-col items-center select-none pointer-events-none transition-all duration-300"
    >
      {/* Outer Container */}
      <div className="relative flex flex-col items-center justify-center">

        {/* 1. TOP-LEFT SPEECH BUBBLE */}
        <div className="absolute -top-14 -left-14 sm:-top-16 sm:-left-18 z-30 pointer-events-auto">
          <div
            onClick={() => onOpenChat('chat')}
            className="relative group cursor-pointer px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl bg-[#181818]/95 hover:bg-[#202020] border border-[#E11D48]/80 hover:border-[#F43F5E] shadow-[0_0_24px_rgba(225,29,72,0.3)] hover:shadow-[0_0_34px_rgba(225,29,72,0.5)] backdrop-blur-xl transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 min-w-[160px] sm:min-w-[175px]"
          >
            {/* Header: Sparkle + "Hello Mohith!" */}
            <div className="flex items-center gap-1.5 text-[#F43F5E] font-semibold text-xs sm:text-[13px] leading-snug">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E11D48] fill-[#E11D48]/40" />
              <span className="text-[#F5F5F5] font-bold tracking-wide">Hello Mohith!</span>
            </div>

            {/* Subtext: "How can I help you today?" */}
            <div className="text-[10px] sm:text-[11px] text-[#B8B8B8] font-normal mt-0.5 leading-snug">
              How can I help you<br />today?
            </div>

            {/* Speech bubble pointer arrow */}
            <div className="absolute -bottom-2 right-8 w-3.5 h-3.5 bg-[#181818] border-r-2 border-b-2 border-[#E11D48] transform rotate-45 z-10" />
          </div>
        </div>

        {/* 2. ORBITING LASER TRACK LINE */}
        <div className="absolute inset-0 m-auto w-[270px] sm:w-[290px] h-[155px] rounded-[50%] border border-[#E11D48]/35 shadow-[0_0_15px_rgba(225,29,72,0.25)] transform -rotate-12 pointer-events-none z-10" />

        {/* 3. FIVE FLOATING ORBITAL FEATURE CARDS */}

        {/* TOP-RIGHT CARD: "</> Write Code" */}
        <div className="absolute top-2 -right-10 sm:top-2 sm:-right-14 z-25 pointer-events-auto">
          <button
            onClick={() => onOpenChat('code')}
            className="group flex flex-col items-center justify-center px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-2xl bg-[#181818]/90 hover:bg-[#202020] border border-[#E11D48]/75 hover:border-[#F43F5E] shadow-[0_0_18px_rgba(225,29,72,0.3)] hover:shadow-[0_0_28px_rgba(225,29,72,0.5)] backdrop-blur-xl transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer min-w-[76px] sm:min-w-[84px]"
            title="Write Code"
          >
            <Code className="w-4 h-4 sm:w-5 sm:h-5 text-[#E11D48] group-hover:text-[#F43F5E] transition-colors mb-0.5" />
            <span className="text-[9.5px] sm:text-[10.5px] text-[#F5F5F5] font-semibold tracking-tight whitespace-nowrap">
              Write Code
            </span>
          </button>
        </div>

        {/* MIDDLE-LEFT CARD: "💡 Think" */}
        <div className="absolute top-20 -left-10 sm:top-20 sm:-left-14 z-25 pointer-events-auto">
          <button
            onClick={() => onOpenChat('chat')}
            className="group flex flex-col items-center justify-center px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-2xl bg-[#181818]/90 hover:bg-[#202020] border border-[#E11D48]/75 hover:border-[#F43F5E] shadow-[0_0_18px_rgba(225,29,72,0.3)] hover:shadow-[0_0_28px_rgba(225,29,72,0.5)] backdrop-blur-xl transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer min-w-[62px] sm:min-w-[70px]"
            title="Deep Thinking & Chat"
          >
            <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-[#E11D48] group-hover:text-[#F43F5E] transition-colors mb-0.5" />
            <span className="text-[9.5px] sm:text-[10.5px] text-[#F5F5F5] font-semibold tracking-tight">
              Think
            </span>
          </button>
        </div>

        {/* MIDDLE-RIGHT CARD: "🔍 Search" */}
        <div className="absolute top-22 -right-12 sm:top-22 sm:-right-16 z-25 pointer-events-auto">
          <button
            onClick={() => onOpenChat('search')}
            className="group flex flex-col items-center justify-center px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-2xl bg-[#181818]/90 hover:bg-[#202020] border border-[#E11D48]/75 hover:border-[#F43F5E] shadow-[0_0_18px_rgba(225,29,72,0.3)] hover:shadow-[0_0_28px_rgba(225,29,72,0.5)] backdrop-blur-xl transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer min-w-[62px] sm:min-w-[70px]"
            title="Search Web"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#E11D48] group-hover:text-[#F43F5E] transition-colors mb-0.5" />
            <span className="text-[9.5px] sm:text-[10.5px] text-[#F5F5F5] font-semibold tracking-tight">
              Search
            </span>
          </button>
        </div>

        {/* LOWER-LEFT CARD: "ılı. Talk" */}
        <div className="absolute bottom-12 -left-8 sm:bottom-14 sm:-left-12 z-25 pointer-events-auto">
          <button
            onClick={() => onOpenChat('chat')}
            className="group flex flex-col items-center justify-center px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-2xl bg-[#181818]/90 hover:bg-[#202020] border border-[#E11D48]/75 hover:border-[#F43F5E] shadow-[0_0_18px_rgba(225,29,72,0.3)] hover:shadow-[0_0_28px_rgba(225,29,72,0.5)] backdrop-blur-xl transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer min-w-[60px] sm:min-w-[68px]"
            title="Voice Talk"
          >
            <AudioLines className="w-4 h-4 sm:w-5 sm:h-5 text-[#E11D48] group-hover:text-[#F43F5E] transition-colors mb-0.5" />
            <span className="text-[9.5px] sm:text-[10.5px] text-[#F5F5F5] font-semibold tracking-tight">
              Talk
            </span>
          </button>
        </div>

        {/* LOWER-RIGHT CARD: "📅 Schedule" */}
        <div className="absolute bottom-10 -right-10 sm:bottom-12 sm:-right-14 z-25 pointer-events-auto">
          <button
            onClick={() => onOpenChat('create')}
            className="group flex flex-col items-center justify-center px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-2xl bg-[#181818]/90 hover:bg-[#202020] border border-[#E11D48]/75 hover:border-[#F43F5E] shadow-[0_0_18px_rgba(225,29,72,0.3)] hover:shadow-[0_0_28px_rgba(225,29,72,0.5)] backdrop-blur-xl transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer min-w-[70px] sm:min-w-[78px]"
            title="Schedule & Tasks"
          >
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#E11D48] group-hover:text-[#F43F5E] transition-colors mb-0.5" />
            <span className="text-[9.5px] sm:text-[10.5px] text-[#F5F5F5] font-semibold tracking-tight whitespace-nowrap">
              Schedule
            </span>
          </button>
        </div>

        {/* 4. 3D ROBOT CANVAS */}
        <div
          onClick={() => onOpenChat()}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="pointer-events-auto relative cursor-pointer transition-transform duration-300 transform hover:scale-105 active:scale-95 flex flex-col items-center select-none z-20"
          title="Click to chat with Alpha"
        >
          {/* Ambient red backlight aura */}
          <div
            className={`absolute inset-0 rounded-full blur-3xl pointer-events-none transition-all duration-500 ${
              isHovered ? 'bg-[#E11D48]/30 scale-110' : 'bg-[#E11D48]/15'
            }`}
          />

          {/* Exact dimensions preserved */}
          <div className="relative z-10 w-[220px] h-[260px] sm:w-[250px] sm:h-[295px] flex items-center justify-center">
            <Robot3D state={robotState} width={250} height={295} />
          </div>
        </div>

      </div>
    </aside>
  );
};
