import React, { useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Square } from 'lucide-react';

interface MessageComposerProps {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  onStop: () => void;
  isListening: boolean;
  onToggleVoice: () => void;
}

export const MessageComposer: React.FC<MessageComposerProps> = ({
  input,
  setInput,
  onSend,
  isLoading,
  onStop,
  isListening,
  onToggleVoice,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        onSend();
      }
    }
  };

  return (
    <div className="p-3 border-t border-[#383034] bg-[#0A0A0A]/95 backdrop-blur-md flex-shrink-0">
      
      {/* Listening pill indicator */}
      {isListening && (
        <div className="flex items-center justify-between px-3 py-1.5 mb-2 rounded-xl bg-[#251719] border border-[#E11D48]/40 text-xs text-[#F43F5E] animate-pulse">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E11D48] animate-ping" />
            <span>Listening to your voice... Speak clearly</span>
          </div>
          <button
            onClick={onToggleVoice}
            className="text-[#B8B8B8] hover:text-[#F5F5F5] text-[11px] underline cursor-pointer"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="flex items-end gap-2 bg-[#151515] border border-[#383034] focus-within:border-[#E11D48] focus-within:shadow-[0_0_15px_rgba(225,29,72,0.25)] rounded-2xl p-2 transition-all">
        
        {/* Voice Input Button */}
        <button
          onClick={onToggleVoice}
          className={`p-2 rounded-xl transition-all cursor-pointer flex-shrink-0 ${
            isListening
              ? 'bg-[#E11D48]/25 text-[#F43F5E] border border-[#E11D48]/60 shadow-[0_0_10px_rgba(225,29,72,0.35)]'
              : 'text-[#B8B8B8] hover:text-[#E11D48] hover:bg-[#202020]'
          }`}
          title={isListening ? 'Stop listening' : 'Voice input'}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        {/* Text Input Area */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Alpha anything... (Shift+Enter for newline)"
          className="flex-1 bg-transparent border-0 outline-none text-xs sm:text-sm text-[#F5F5F5] placeholder:text-[#B8B8B8]/60 resize-none max-h-32 py-1.5 px-1 leading-relaxed"
        />

        {/* Action Button: Send or Stop */}
        {isLoading ? (
          <button
            onClick={onStop}
            className="p-2 rounded-xl bg-[#E11D48]/20 hover:bg-[#E11D48]/30 border border-[#E11D48]/50 text-[#F43F5E] transition-all cursor-pointer flex-shrink-0"
            title="Stop generating"
          >
            <Square className="w-4 h-4 fill-[#F43F5E]" />
          </button>
        ) : (
          <button
            onClick={onSend}
            disabled={!input.trim()}
            className="p-2 rounded-xl bg-[#E11D48] hover:bg-[#9F1239] text-[#F5F5F5] font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-md shadow-[#E11D48]/20 hover:shadow-[#9F1239]/40 cursor-pointer flex-shrink-0"
            title="Send message (Enter)"
          >
            <Send className="w-4 h-4 stroke-[2.5]" />
          </button>
        )}

      </div>
    </div>
  );
};
