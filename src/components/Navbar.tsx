import React from 'react';
import { PanelLeft, Settings, User as UserIcon } from 'lucide-react';
import { ChatModeTabs } from './ChatModeTabs';
import { Robot3D } from './Robot3D';
import type { AIMode, SystemStatus, ResponseLengthMode, User } from '../types';

interface NavbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  activeMode: AIMode;
  onSelectMode: (mode: AIMode) => void;
  onOpenSettings: () => void;
  systemStatus: SystemStatus | null;
  onNewChat: () => void;
  hasUserMessages?: boolean;
  robotState?: 'idle' | 'thinking' | 'speaking';
  responseLength?: ResponseLengthMode;
  onSelectResponseLength?: (mode: ResponseLengthMode) => void;
  user?: User | null;
  isAuthenticated?: boolean;
  onOpenAuth?: (mode?: 'signin' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  isSidebarOpen,
  activeMode,
  onSelectMode,
  onOpenSettings,
  systemStatus,
  onNewChat,
  hasUserMessages = false,
  robotState = 'idle',
  responseLength = 'balanced',
  onSelectResponseLength,
  user,
  isAuthenticated = false,
  onOpenAuth,
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

      {/* Right: Real-time Status Badge, Active Mascot & Settings Trigger */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        
        {/* Unobtrusive Active Mascot Companion (Displayed in header during conversations) */}
        {hasUserMessages && (
          <div
            className="flex items-center gap-2 px-2 py-1 rounded-xl bg-[#131020]/90 border border-[#8B5CF6]/40 shadow-[0_0_12px_rgba(139,92,246,0.2)] animate-in fade-in zoom-in-95 duration-200"
            title={`Alpha Robot Mascot (${robotState})`}
          >
            <div className="w-8 h-8 rounded-lg bg-[#080811] border border-[#8B5CF6]/30 overflow-hidden flex items-center justify-center relative flex-shrink-0">
              <Robot3D state={robotState} width={34} height={34} />
            </div>
            <div className="hidden sm:flex flex-col text-left pr-1">
              <span className="text-[11px] font-bold text-[#F8FAFC] leading-none">
                Alpha
              </span>
              <span className="text-[9px] font-mono text-[#B794F4] leading-tight">
                {robotState === 'thinking'
                  ? 'Thinking...'
                  : robotState === 'speaking'
                  ? 'Speaking...'
                  : 'Ready'}
              </span>
            </div>
          </div>
        )}

        {/* Quick Response Length Style Toggle Badge */}
        <button
          onClick={() => {
            const nextMode: ResponseLengthMode =
              responseLength === 'quick'
                ? 'balanced'
                : responseLength === 'balanced'
                ? 'detailed'
                : 'quick';
            onSelectResponseLength?.(nextMode);
          }}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#131020] hover:bg-[#1E1638] border border-[#251E3E] hover:border-[#8B5CF6]/50 text-[11px] font-mono transition-all cursor-pointer"
          title="Click to cycle response style: Quick -> Balanced -> Detailed"
        >
          <span className="text-[#A1A1AA]">Style:</span>
          <span
            className={`font-semibold ${
              responseLength === 'quick'
                ? 'text-[#38BDF8]'
                : responseLength === 'detailed'
                ? 'text-[#F472B6]'
                : 'text-[#B794F4]'
            }`}
          >
            {responseLength === 'quick'
              ? '⚡ Quick'
              : responseLength === 'detailed'
              ? '📖 Detailed'
              : '⚖️ Balanced'}
          </span>
        </button>

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

        {/* User Auth Profile Trigger */}
        {isAuthenticated && user ? (
          <div
            className="flex items-center gap-2 pl-1 cursor-pointer"
            onClick={onOpenSettings}
            title={`Signed in as ${user.full_name}`}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#38BDF8] p-[1px]">
              <div className="w-full h-full rounded-full bg-[#080811] flex items-center justify-center">
                <span className="font-bold text-xs text-[#B794F4]">
                  {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => onOpenAuth?.('signin')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#8B5CF6]/20 to-[#38BDF8]/15 hover:from-[#8B5CF6]/35 hover:to-[#38BDF8]/30 border border-[#8B5CF6]/40 text-[#F8FAFC] text-xs font-semibold transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
            title="Sign In or Create Account"
          >
            <UserIcon className="w-3.5 h-3.5 text-[#B794F4]" />
            <span className="hidden sm:inline">Sign In</span>
          </button>
        )}

      </div>

    </header>
  );
};
