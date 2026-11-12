import React from 'react';
import { X, RotateCcw, History, Minus, Maximize2, Minimize2 } from 'lucide-react';

interface ChatHeaderProps {
  onClose: () => void;
  onNewChat: () => void;
  onToggleHistory: () => void;
  isHistoryOpen: boolean;
  isMaximized: boolean;
  onToggleMaximize: () => void;
  onMinimize: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  onClose,
  onNewChat,
  onToggleHistory,
  isHistoryOpen,
  isMaximized,
  onToggleMaximize,
  onMinimize,
}) => {
  return (
    <div className="px-4 py-3.5 border-b border-[#383034] bg-[#0A0A0A]/95 backdrop-blur-md flex items-center justify-between flex-shrink-0">
      
      {/* Brand & Subtitle */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#E11D48] to-[#9F1239] flex items-center justify-center shadow-sm shadow-[#E11D48]/30">
          <span className="font-display font-black text-[#F5F5F5] text-xs">A</span>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-display font-black text-sm tracking-[1.5px] text-[#F5F5F5] leading-none">
              <span className="text-[#E11D48]">A</span>LPHA
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48] animate-pulse" />
          </div>
          <span className="text-[10px] font-mono font-bold text-[#E11D48]/90 tracking-wider uppercase mt-0.5">
            YOUR AI COMPANION
          </span>
        </div>
      </div>

      {/* Action Controls: History, New Chat, Minimize, Maximize/Restore, Close */}
      <div className="flex items-center gap-1">
        {/* History Button */}
        <button
          onClick={onToggleHistory}
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            isHistoryOpen
              ? 'bg-[#251719] text-[#E11D48] border border-[#E11D48]/60'
              : 'text-[#B8B8B8] hover:text-[#F5F5F5] hover:bg-[#202020]'
          }`}
          title="Conversation History"
        >
          <History className="w-4 h-4" />
        </button>

        {/* New Conversation Button */}
        <button
          onClick={onNewChat}
          className="p-2 rounded-xl text-[#B8B8B8] hover:text-[#F5F5F5] hover:bg-[#202020] transition-all cursor-pointer"
          title="New Conversation"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Minimize Button */}
        <button
          onClick={onMinimize}
          className="p-2 rounded-xl text-[#B8B8B8] hover:text-[#F5F5F5] hover:bg-[#202020] transition-all cursor-pointer"
          title="Minimize Chat"
        >
          <Minus className="w-4 h-4" />
        </button>

        {/* Maximize / Restore Button */}
        <button
          onClick={onToggleMaximize}
          className="p-2 rounded-xl text-[#B8B8B8] hover:text-[#F5F5F5] hover:bg-[#202020] transition-all cursor-pointer"
          title={isMaximized ? 'Restore Normal Size' : 'Maximize Chat'}
        >
          {isMaximized ? (
            <Minimize2 className="w-4 h-4 text-[#E11D48]" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </button>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="p-2 rounded-xl text-[#B8B8B8] hover:text-[#F43F5E] hover:bg-[#E11D48]/15 transition-all cursor-pointer ml-1"
          title="Close Chat"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
