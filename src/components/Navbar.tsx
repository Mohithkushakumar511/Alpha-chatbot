import React from 'react';
import { Bot, Code2 } from 'lucide-react';

interface NavbarProps {
  onOpenIntegration: () => void;
  onWakeAlpha: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenIntegration,
  onWakeAlpha,
}) => {
  return (
    <header className="w-full h-16 sm:h-20 px-4 sm:px-8 border-b border-[#383034] bg-[#0A0A0A]/95 backdrop-blur-xl flex items-center justify-between sticky top-0 z-30 shadow-lg shadow-black/50">
      
      {/* Left: Rounded-square ALPHA logo & Brand Name */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E11D48] via-[#BE123C] to-[#9F1239] flex items-center justify-center shadow-md shadow-[#E11D48]/30">
          <span className="font-display font-black text-[#F5F5F5] text-base">A</span>
        </div>
        <span className="font-display font-black text-xl tracking-[2px] text-[#F5F5F5]">
          <span className="text-[#E11D48]">A</span>LPHA
        </span>
      </div>

      {/* Right: Integration Code & Glowing Wake Alpha Buttons */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <button
          onClick={onOpenIntegration}
          className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-[#202020]/80 hover:bg-[#251719] border border-[#383034] hover:border-[#E11D48] text-[#B8B8B8] hover:text-[#F5F5F5] text-xs font-semibold transition-all cursor-pointer"
        >
          <Code2 className="w-3.5 h-3.5 text-[#E11D48]" />
          <span className="hidden sm:inline">Integration Code</span>
        </button>

        <button
          onClick={onWakeAlpha}
          className="flex items-center gap-1.5 sm:gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-[#E11D48] hover:bg-[#9F1239] text-[#F5F5F5] font-display font-bold text-xs tracking-wide shadow-md shadow-[#E11D48]/30 hover:shadow-[#E11D48]/50 hover:scale-102 active:scale-98 transition-all cursor-pointer"
        >
          <Bot className="w-4 h-4 fill-[#F5F5F5]" />
          <span>Wake Alpha</span>
        </button>
      </div>

    </header>
  );
};
