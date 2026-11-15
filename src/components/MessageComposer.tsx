import React, { useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Square, Sparkles } from 'lucide-react';

interface MessageComposerProps {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  onStop: () => void;
  isListening: boolean;
  onToggleVoice: () => void;
  activeModeLabel?: string;
}

export const MessageComposer: React.FC<MessageComposerProps> = ({
  input,
  setInput,
  onSend,
  isLoading,
  onStop,
  isListening,
  onToggleVoice,
  activeModeLabel = 'Chat',
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
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
    <div className="w-full max-w-4xl mx-auto px-4 pb-4 sm:pb-6 pt-2 flex flex-col items-center">
      
      {/* 1. Voice Interaction Waveform Banner (Active when listening) */}
      {isListening && (
        <div className="w-full mb-3 flex items-center justify-between px-4 py-2 rounded-2xl bg-[#1A1433]/90 border border-[#8B5CF6]/60 backdrop-blur-xl shadow-[0_0_20px_rgba(139,92,246,0.3)] animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center gap-3">
            {/* Animated Waveform Visualizer */}
            <div className="flex items-center gap-1 h-5 px-1">
              <span className="w-1 bg-[#38BDF8] rounded-full animate-waveform-1" />
              <span className="w-1 bg-[#8B5CF6] rounded-full animate-waveform-2" />
              <span className="w-1 bg-[#B794F4] rounded-full animate-waveform-3" />
              <span className="w-1 bg-[#38BDF8] rounded-full animate-waveform-4" />
              <span className="w-1 bg-[#8B5CF6] rounded-full animate-waveform-5" />
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-semibold text-[#F8FAFC]">
                Listening to your voice...
              </span>
              <span className="text-[10px] text-[#A1A1AA] font-mono">
                Speak now. Press stop or enter when finished.
              </span>
            </div>
          </div>

          <button
            onClick={onToggleVoice}
            className="px-3 py-1 rounded-xl bg-[#8B5CF6]/20 hover:bg-[#8B5CF6]/30 border border-[#8B5CF6]/50 text-xs font-semibold text-[#B794F4] transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      )}

      {/* 2. Floating Glass Input Container */}
      <div className="relative w-full group">
        
        {/* Ambient Purple & Cyan Glow on Focus */}
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#8B5CF6]/30 via-[#6D28D9]/20 to-[#38BDF8]/20 blur-xl opacity-50 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none -z-10" />

        <div className="relative flex items-end gap-2 p-2 sm:p-2.5 rounded-2xl sm:rounded-3xl bg-[#131020]/90 border border-[#251E3E] group-focus-within:border-[#8B5CF6] group-focus-within:shadow-[0_0_30px_rgba(139,92,246,0.3)] backdrop-blur-2xl transition-all duration-300">
          
          {/* Glowing Voice Microphone Button */}
          <button
            type="button"
            onClick={onToggleVoice}
            className={`p-2.5 rounded-xl sm:rounded-2xl transition-all cursor-pointer flex-shrink-0 relative group/mic ${
              isListening
                ? 'bg-gradient-to-r from-[#8B5CF6] to-[#38BDF8] text-white shadow-[0_0_18px_rgba(56,189,248,0.5)] scale-105'
                : 'text-[#A1A1AA] hover:text-[#B794F4] hover:bg-[#1E1638]'
            }`}
            title={isListening ? 'Stop listening' : 'Start voice input'}
          >
            {isListening ? (
              <MicOff className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Mic className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover/mic:scale-110" />
            )}
          </button>

          {/* Autosizing Textarea */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Alpha anything..."
            className="flex-1 bg-transparent border-0 outline-none text-xs sm:text-sm text-[#F8FAFC] placeholder:text-[#A1A1AA]/50 resize-none max-h-40 py-2 px-1 leading-relaxed"
          />

          {/* Send or Stop Action Button */}
          {isLoading ? (
            <button
              type="button"
              onClick={onStop}
              className="p-2.5 rounded-xl sm:rounded-2xl bg-[#EC4899]/20 hover:bg-[#EC4899]/30 border border-[#EC4899]/60 text-[#F472B6] transition-all cursor-pointer flex-shrink-0 shadow-[0_0_12px_rgba(236,72,153,0.3)]"
              title="Stop generating"
            >
              <Square className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onSend}
              disabled={!input.trim()}
              className="p-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9] hover:from-[#9061F9] hover:to-[#7E3AF2] text-white font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-md shadow-[#8B5CF6]/30 hover:shadow-[0_0_20px_rgba(139,92,246,0.6)] cursor-pointer flex-shrink-0 hover:scale-105 active:scale-95"
              title="Send message (Enter)"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
            </button>
          )}

        </div>
      </div>

      {/* Helper Footer text */}
      <div className="w-full flex items-center justify-between text-[10px] sm:text-[11px] text-[#A1A1AA]/60 px-3 mt-2 font-mono">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-[#8B5CF6]" />
          <span>Operating in <strong>{activeModeLabel}</strong> mode</span>
        </span>
        <span className="hidden sm:inline">
          Enter to send • Shift + Enter for new line
        </span>
      </div>

    </div>
  );
};
