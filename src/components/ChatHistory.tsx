import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X, MessageSquare } from 'lucide-react';
import type { Conversation } from '../types';

interface ChatHistoryProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  onDeleteConversation: (id: string) => void;
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({
  conversations,
  activeId,
  onSelectConversation,
  onNewChat,
  onRenameConversation,
  onDeleteConversation,
}) => {
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

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#181818]/95 p-3">
      
      {/* Header with New Chat Button */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#383034]">
        <span className="font-display font-bold text-xs uppercase tracking-wider text-[#E11D48]">
          Chat History
        </span>
        <button
          onClick={onNewChat}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E11D48]/20 hover:bg-[#E11D48]/30 border border-[#E11D48]/50 text-[#F5F5F5] text-xs font-semibold transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
        {conversations.length === 0 ? (
          <div className="text-center py-8 text-[#B8B8B8]/60 text-xs">
            No previous conversations.
          </div>
        ) : (
          conversations.map((conv) => {
            const isActive = conv.id === activeId;
            const isEditing = conv.id === editingId;

            return (
              <div
                key={conv.id}
                onClick={() => !isEditing && onSelectConversation(conv.id)}
                className={`group flex items-center justify-between p-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#251719] border border-[#E11D48]/60 text-[#F5F5F5]'
                    : 'hover:bg-[#202020]/60 border border-transparent text-[#B8B8B8] hover:text-[#F5F5F5]'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <MessageSquare className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-[#E11D48]' : 'text-[#B8B8B8]/60'}`} />
                  {isEditing ? (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && saveRename(conv.id)}
                      autoFocus
                      className="flex-1 bg-[#151515] border border-[#E11D48]/60 rounded px-1.5 py-0.5 text-xs text-[#F5F5F5] outline-none"
                    />
                  ) : (
                    <span className="truncate">{conv.title}</span>
                  )}
                </div>

                {/* Edit / Delete actions */}
                <div className="flex items-center gap-1 ml-2 opacity-80 group-hover:opacity-100">
                  {isEditing ? (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          saveRename(conv.id);
                        }}
                        className="p-1 hover:text-[#F5F5F5]"
                        title="Save title"
                      >
                        <Check className="w-3 h-3 text-[#E11D48]" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingId(null);
                        }}
                        className="p-1 hover:text-[#F5F5F5]"
                        title="Cancel"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startRename(conv);
                        }}
                        className="p-1 text-[#B8B8B8]/60 hover:text-[#E11D48] transition-colors"
                        title="Rename conversation"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteConversation(conv.id);
                        }}
                        className="p-1 text-[#B8B8B8]/60 hover:text-[#F43F5E] transition-colors"
                        title="Delete conversation"
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

    </div>
  );
};
