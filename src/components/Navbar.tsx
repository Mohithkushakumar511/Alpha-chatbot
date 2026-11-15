import React from 'react';
import { PanelLeft, Settings } from 'lucide-react';
import { ChatModeTabs } from './ChatModeTabs';
import type { AIMode, SystemStatus } from '../types';

interface NavbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  activeMode: AIMode;
  onSelectMode: (mode: AIMode) => void;
  onOpenSettings: () => void;
  systemStatus: SystemStatus | null;
  onNewChat: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  isSidebarOpen,
  activeMode,
  onSelectMode,
  onOpenSettings,
  systemStatus,
  onNewChat,
}) => {
  const groqConnected = systemStatus?.groq?.connected ?? false;
  const serverOnline = systemStatus?.server?.online ?? false;

  return (
    <header className="w-full h-16 px-3 sm:px-6 border-b border-[#251E3E] bg-[#080811]/90 backdrop-blur-xl flex items-center justify-between sticky top-0 z-30 shadow-md shadow-black/50">
      
      {/* Left: Sidebar Toggle + Brand */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#1E1638] border border-transparent hover:border-[#251E3E] transition-all cursor-pointer"
          title={isSidebarOpen ? 'Collapse sidebar' : 'Open sidebar'}
        >
          <PanelLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Brand (Visible especially when sidebar is closed or on mobile) */}
        <div
          onClick={onNewChat}
          className="flex items-center gap-2 cursor-pointer group"
          title="Return to Welcome Screen"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-[#8B5CF6] via-[#6D28D9] to-[#38BDF8] p-[1px] shadow-[0_0_12px_rgba(139,92,246,0.3)]">
            <div className="w-full h-full rounded-lg bg-[#080811] flex items-center justify-center">
              <span className="font-display font-black text-xs sm:text-sm text-white">
                α
              </span>
            </div>
          </div>
          <span className="font-display font-black text-sm sm:text-base tracking-[1.5px] text-[#F8FAFC] hidden sm:inline">
            ALPHA <span className="text-[#8B5CF6]">AI</span>
          </span>
        </div>
      </div>

      {/* Center: Mode Switcher Tabs */}
      <div className="flex items-center justify-center flex-1 max-w-md mx-2">
        <ChatModeTabs activeMode={activeMode} onSelectMode={onSelectMode} />
      </div>

      {/* Right: Real-time Status Badge & Settings Trigger */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        
        {/* Status indicator capsule */}
        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#131020] border border-[#251E3E] text-[11px] font-mono text-[#A1A1AA]">
          <span
            className={`w-2 h-2 rounded-full ${
              groqConnected
                ? 'bg-[#38BDF8] shadow-[0_0_6px_#38BDF8]'
                : serverOnline
                ? 'bg-[#8B5CF6] shadow-[0_0_6px_#8B5CF6]'
                : 'bg-[#A1A1AA]/50'
            }`}
          />
          <span className="text-[#F8FAFC]">
            {groqConnected ? 'Groq LPU Active' : serverOnline ? 'Online' : 'Connecting'}
          </span>
        </div>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-[#131020] hover:bg-[#1E1638] border border-[#251E3E] hover:border-[#8B5CF6]/50 text-[#A1A1AA] hover:text-[#F8FAFC] text-xs font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-sm"
          title="Open Settings"
        >
          <Settings className="w-4 h-4 text-[#8B5CF6]" />
          <span className="hidden sm:inline">Settings</span>
        </button>

      </div>

    </header>
  );
};
