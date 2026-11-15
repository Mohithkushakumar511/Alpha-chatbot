import React, { useState } from 'react';
import {
  Plus,
  Search,
  MessageSquare,
  Edit2,
  Trash2,
  Check,
  X,
  Settings,
  Sparkles,
  PanelLeftClose,
  User,
  LogOut,
  LogIn,
  UserPlus,
} from 'lucide-react';
import type { Conversation, SystemStatus, User as UserType } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  conversations: Conversation[];
  activeConvId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  onDeleteConversation: (id: string) => void;
  onClearAllConversations?: () => void;
  onOpenSettings: () => void;
  systemStatus: SystemStatus | null;
  user: UserType | null;
  isAuthenticated: boolean;
  onOpenAuth: (mode?: 'signin' | 'register') => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  conversations,
  activeConvId,
  onSelectConversation,
  onNewChat,
  onRenameConversation,
  onDeleteConversation,
  onClearAllConversations,
  onOpenSettings,
  systemStatus,
  user,
  isAuthenticated,
  onOpenAuth,
  onLogout,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const startRename = (conv: Conversation) => {
    setEditingId(conv.id);
    setEditTitle(conv.title);
  };

  const saveRename = (id: string) => {
    if (editTitle.trim()) {
      onRenameConversation(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const serverOnline = systemStatus?.server?.online ?? false;
  const groqConnected = systemStatus?.groq?.connected ?? false;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onToggle}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col w-72 sm:w-80 bg-[#0B0914]/95 border-r border-[#251E3E] backdrop-blur-2xl transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:-translate-x-full'
        }`}
      >
        {/* Top Header: Brand & Mascot Logo */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#251E3E]/70 flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Holographic Logo Badge */}
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#8B5CF6] via-[#6D28D9] to-[#38BDF8] p-[1px] shadow-[0_0_15px_rgba(139,92,246,0.4)]">
              <div className="w-full h-full rounded-xl bg-[#080811] flex items-center justify-center">
                <span className="font-display font-extrabold text-sm tracking-wider bg-gradient-to-r from-[#F8FAFC] via-[#B794F4] to-[#38BDF8] bg-clip-text text-transparent">
                  α
                </span>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-base tracking-[1.5px] text-[#F8FAFC]">
                  ALPHA
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#B794F4]">
                  AI
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#A1A1AA] tracking-wider uppercase">
                Futuristic Universe
              </span>
            </div>
          </div>

          {/* Collapse Button */}
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#1E1638] transition-colors cursor-pointer"
            title="Collapse Sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-3 pb-2 flex-shrink-0">
          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6]/15 via-[#6D28D9]/20 to-[#38BDF8]/15 hover:from-[#8B5CF6]/25 hover:to-[#38BDF8]/25 border border-[#8B5CF6]/40 hover:border-[#8B5CF6] text-[#F8FAFC] text-xs font-semibold shadow-md shadow-[#8B5CF6]/10 hover:shadow-[#8B5CF6]/25 transition-all duration-200 group cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-[#8B5CF6] flex items-center justify-center text-white shadow-sm shadow-[#8B5CF6]/40 group-hover:scale-105 transition-transform">
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <span className="font-medium tracking-wide">New Chat</span>
            </div>
            <Sparkles className="w-3.5 h-3.5 text-[#B794F4] opacity-75 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

        {/* Search Conversations Input */}
        <div className="px-3 pb-2 flex-shrink-0">
          <div className="relative flex items-center bg-[#131020]/90 border border-[#251E3E] focus-within:border-[#8B5CF6]/60 focus-within:shadow-[0_0_12px_rgba(139,92,246,0.2)] rounded-xl px-2.5 py-1.5 transition-all">
            <Search className="w-3.5 h-3.5 text-[#A1A1AA] flex-shrink-0 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full bg-transparent text-xs text-[#F8FAFC] placeholder:text-[#A1A1AA]/60 outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-[#A1A1AA] hover:text-[#F8FAFC] cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Chat History Section */}
        <div className="px-3 pt-2 pb-1 flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#A1A1AA] flex-shrink-0">
          <span>Recent Sessions</span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#A1A1AA]/70">{conversations.length}</span>
            {conversations.length > 0 && onClearAllConversations && (
              <button
                type="button"
                onClick={onClearAllConversations}
                className="text-[10px] font-mono text-[#A1A1AA] hover:text-[#EC4899] transition-colors cursor-pointer"
                title="Clear all conversations"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-1 space-y-1">
          {filteredConversations.length === 0 ? (
            <div className="text-center py-10 px-4 text-[#A1A1AA]/50 text-xs">
              {searchQuery ? 'No matching conversations' : 'No previous conversations yet.'}
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isActive = conv.id === activeConvId;
              const isEditing = conv.id === editingId;

              return (
                <div
                  key={conv.id}
                  onClick={() => !isEditing && onSelectConversation(conv.id)}
                  className={`group relative flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#8B5CF6]/25 to-[#1E1638] border border-[#8B5CF6]/60 text-[#F8FAFC] shadow-sm shadow-[#8B5CF6]/15'
                      : 'hover:bg-[#1E1638]/70 border border-transparent text-[#A1A1AA] hover:text-[#F8FAFC]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <MessageSquare
                      className={`w-3.5 h-3.5 flex-shrink-0 ${
                        isActive ? 'text-[#38BDF8]' : 'text-[#A1A1AA]/60 group-hover:text-[#B794F4]'
                      }`}
                    />

                    {isEditing ? (
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && saveRename(conv.id)}
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 bg-[#131020] border border-[#8B5CF6] rounded-md px-1.5 py-0.5 text-xs text-[#F8FAFC] outline-none"
                      />
                    ) : (
                      <span className="truncate text-xs font-normal">{conv.title}</span>
                    )}
                  </div>

                  {/* Edit & Delete Action Buttons */}
                  <div className="flex items-center gap-0.5 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {isEditing ? (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            saveRename(conv.id);
                          }}
                          className="p-1 hover:text-[#38BDF8] cursor-pointer"
                          title="Save Title"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingId(null);
                          }}
                          className="p-1 hover:text-[#A1A1AA] cursor-pointer"
                          title="Cancel"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startRename(conv);
                          }}
                          className="p-1 hover:text-[#38BDF8] cursor-pointer transition-colors"
                          title="Rename Conversation"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteConversation(conv.id);
                          }}
                          className="p-1 hover:text-[#F43F5E] cursor-pointer transition-colors"
                          title="Delete Conversation"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pinned Bottom Panel: System Status, Settings, Profile */}
        <div className="p-3 border-t border-[#251E3E] bg-[#0E0C1B]/95 flex flex-col gap-2 flex-shrink-0">
          
          {/* Status Capsule */}
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#131020] border border-[#251E3E] text-[11px] text-[#A1A1AA]">
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  groqConnected
                    ? 'bg-[#38BDF8] shadow-[0_0_8px_#38BDF8]'
                    : serverOnline
                    ? 'bg-[#8B5CF6] shadow-[0_0_8px_#8B5CF6]'
                    : 'bg-[#A1A1AA]/40'
                }`}
              />
              <span className="font-mono text-[10px] uppercase font-semibold text-[#F8FAFC]">
                {groqConnected ? 'Groq Active' : serverOnline ? 'Online' : 'Connecting'}
              </span>
            </div>
            <span className="font-mono text-[9px] text-[#38BDF8] bg-[#38BDF8]/10 px-1.5 py-0.5 rounded">
              LPU Engine
            </span>
          </div>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#1E1638] text-[#A1A1AA] hover:text-[#F8FAFC] transition-all text-xs font-medium cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-[#8B5CF6]" />
              <span>Platform Settings</span>
            </div>
            <span className="text-[10px] text-[#A1A1AA]/60 font-mono">v2.0</span>
          </button>

          {/* User Profile Section */}
          {isAuthenticated && user ? (
            /* REGISTERED USER PROFILE */
            <div className="pt-2 border-t border-[#251E3E]/60 flex items-center justify-between px-1">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#38BDF8] p-[1px]">
                    <div className="w-full h-full rounded-full bg-[#080811] flex items-center justify-center">
                      <span className="font-bold text-xs text-[#B794F4]">
                        {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                      </span>
                    </div>
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#38BDF8] ring-2 ring-[#0B0914]" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-[#F8FAFC] leading-none truncate" title={user.full_name}>
                    {user.full_name}
                  </span>
                  <span className="text-[10px] text-[#B794F4] font-mono mt-0.5">
                    Alpha AI Member
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  type="button"
                  onClick={onLogout}
                  className="p-1.5 rounded-lg text-[#A1A1AA] hover:text-[#EC4899] hover:bg-[#EC4899]/10 transition-colors cursor-pointer"
                  title="Sign out of Alpha"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* GUEST USER PROFILE */
            <div className="pt-2 border-t border-[#251E3E]/60 flex flex-col gap-2 px-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#1E1638] border border-[#251E3E] flex items-center justify-center text-[#A1A1AA]">
                    <User className="w-4 h-4 text-[#A1A1AA]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-[#F8FAFC] leading-none">
                      Guest User
                    </span>
                    <span className="text-[10px] text-[#A1A1AA] font-mono mt-0.5">
                      Guest Mode
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenAuth('signin')}
                  className="px-2 py-1 rounded-lg bg-[#1E1638] hover:bg-[#251E3E] border border-[#8B5CF6]/40 text-[#B794F4] text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1"
                  title="Sign In"
                >
                  <LogIn className="w-3 h-3" />
                  <span>Sign In</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => onOpenAuth('register')}
                className="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-[#8B5CF6]/20 to-[#38BDF8]/15 hover:from-[#8B5CF6]/30 hover:to-[#38BDF8]/25 border border-[#8B5CF6]/40 text-[#F8FAFC] text-[11px] font-medium transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Create Free Account</span>
              </button>
            </div>
          )}

        </div>
      </aside>
    </>
  );
};
