import React, { useState } from 'react';
import {
  Sparkles,
  Lightbulb,
  PenTool,
  Megaphone,
  Palette,
  Copy,
  Check,
  RotateCcw,
  Sliders,
  ArrowRight,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Message } from '../../types';

interface CreateInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  onSend: (prompt: string, mode?: 'create') => void;
  onStop: () => void;
  onRegenerate: () => void;
}

const CREATIVE_CATEGORIES = [
  { id: 'brainstorm', label: 'Brainstorm & Ideate', icon: Lightbulb, color: 'text-[#F59E0B]' },
  { id: 'writing', label: 'Creative Writing', icon: PenTool, color: 'text-[#EC4899]' },
  { id: 'marketing', label: 'Copywriting & Hooks', icon: Megaphone, color: 'text-[#38BDF8]' },
  { id: 'concept', label: 'Concept & System Design', icon: Palette, color: 'text-[#8B5CF6]' },
];

const TONE_PRESETS = [
  'Visionary & Futuristic',
  'Minimalist & Punchy',
  'Compelling & Emotional',
  'Bold & Provocative',
  'Playful & Witty',
];

const INSPIRATION_CARDS = [
  {
    category: 'brainstorm',
    title: '5 AI Startups in 2026',
    prompt: 'Brainstorm 5 disruptive AI startup concepts for 2026 that solve critical real-world bottlenecks in healthcare, climate, or developer tooling. Include problem, solution, and monetization.',
  },
  {
    category: 'writing',
    title: 'Cyberpunk Short Story Hook',
    prompt: 'Write an atmospheric cyberpunk sci-fi opening scene set in a rainy neon megalopolis where a memory archivist discovers an impossible encrypted thought.',
  },
  {
    category: 'marketing',
    title: 'Viral Launch Headlines',
    prompt: 'Craft 7 high-conversion launch hooks and punchy taglines for an ultra-fast developer AI companion called Alpha.',
  },
  {
    category: 'concept',
    title: 'Holographic OS Architecture',
    prompt: 'Design the conceptual interface architecture for a spatial holographic operating system, including gesture navigation, privacy safeguards, and widget dock.',
  },
];

export const CreateInterface: React.FC<CreateInterfaceProps> = ({
  messages,
  isLoading,
  onSend,
  onStop,
  onRegenerate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('brainstorm');
  const [selectedTone, setSelectedTone] = useState('Visionary & Futuristic');
  const [customPrompt, setCustomPrompt] = useState('');
  const [copied, setCopied] = useState(false);

  const createMessages = messages.filter((m) => m.mode === 'create');
  const lastCreateMsg = [...createMessages].reverse().find((m) => m.role === 'assistant');

  const handleCreate = (promptText?: string) => {
    const text = promptText || customPrompt;
    if (!text.trim() || isLoading) return;

    const fullPrompt = `Category: ${selectedCategory.toUpperCase()}\nTone/Style: ${selectedTone}\n\nCreative Brief:\n${text}`;
    onSend(fullPrompt, 'create');
    setCustomPrompt('');
  };

  const handleCopyText = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full flex-1 flex flex-col max-w-5xl mx-auto px-4 py-4 sm:py-6 overflow-y-auto">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-[#251E3E]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#EC4899]/25 to-[#8B5CF6]/20 border border-[#251E3E] flex items-center justify-center text-[#EC4899] shadow-[0_0_15px_rgba(236,72,153,0.25)]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F8FAFC] flex items-center gap-2">
              <span>Creative Studio Engine</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#EC4899]/15 border border-[#EC4899]/40 text-[#F472B6] uppercase font-semibold">
                High Imagination
              </span>
            </h1>
            <p className="text-xs text-[#A1A1AA]">
              Brainstorm breakthrough ideas, craft prose, design architectural concepts, and write compelling copy
            </p>
          </div>
        </div>

        {/* Tone Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#A1A1AA]">Tone:</span>
          <select
            value={selectedTone}
            onChange={(e) => setSelectedTone(e.target.value)}
            className="bg-[#131020] border border-[#251E3E] text-[#F8FAFC] text-xs font-medium rounded-xl px-3 py-1.5 outline-none hover:border-[#8B5CF6] transition-all cursor-pointer"
          >
            {TONE_PRESETS.map((t) => (
              <option key={t} value={t} className="bg-[#080811] text-[#F8FAFC]">
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4">
        {CREATIVE_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-[#EC4899]/20 to-[#8B5CF6]/20 border border-[#EC4899] text-[#F8FAFC] shadow-[0_0_15px_rgba(236,72,153,0.3)] font-semibold'
                  : 'bg-[#131020]/70 border border-[#251E3E] text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#1E1638]/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${cat.color}`} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Creation Composer */}
      <div className="p-4 rounded-3xl bg-[#131020]/90 border border-[#251E3E] shadow-xl backdrop-blur-xl mb-6">
        <div className="flex flex-col gap-3">
          <label className="text-xs font-mono font-medium text-[#B794F4] flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5" />
            <span>Creative Brief & Ideas:</span>
          </label>

          <textarea
            rows={3}
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleCreate();
              }
            }}
            placeholder="Describe what you want to create (e.g. 'Brainstorm 5 names and positioning angles for a next-gen developer IDE')..."
            className="w-full bg-[#080811] border border-[#251E3E] focus:border-[#8B5CF6] focus:shadow-[0_0_15px_rgba(139,92,246,0.25)] rounded-2xl p-3 text-xs sm:text-sm text-[#F8FAFC] placeholder:text-[#A1A1AA]/50 outline-none resize-none leading-relaxed"
          />

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#A1A1AA]/60 font-mono hidden sm:inline">
              Temperature: 0.8 (Maximum exploration) • Shift+Enter for new line
            </span>

            {isLoading ? (
              <button
                onClick={onStop}
                className="px-5 py-2 rounded-xl bg-[#EC4899]/20 hover:bg-[#EC4899]/30 border border-[#EC4899]/60 text-xs font-semibold text-[#F472B6] transition-all cursor-pointer"
              >
                Stop Creating
              </button>
            ) : (
              <button
                onClick={() => handleCreate()}
                disabled={!customPrompt.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#EC4899] via-[#8B5CF6] to-[#6D28D9] hover:from-[#F472B6] hover:to-[#7C3AED] disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-bold transition-all shadow-md shadow-[#EC4899]/25 cursor-pointer hover:scale-102 active:scale-98"
              >
                <Sparkles className="w-4 h-4" />
                <span>Ignite Creativity</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Suggested Inspiration Grid */}
      <div className="mb-6">
        <h3 className="text-xs font-mono uppercase tracking-wider text-[#A1A1AA] mb-3">
          Creative Sparks:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {INSPIRATION_CARDS.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleCreate(item.prompt)}
              className="p-3.5 rounded-2xl bg-[#0E0C1B] hover:bg-[#1A1433] border border-[#251E3E] hover:border-[#8B5CF6]/50 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-start justify-between mb-1.5">
                <span className="text-xs font-semibold text-[#F8FAFC] group-hover:text-[#B794F4] transition-colors">
                  {item.title}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#A1A1AA] group-hover:text-[#38BDF8] transition-transform group-hover:translate-x-1" />
              </div>
              <p className="text-[11px] text-[#A1A1AA] line-clamp-2 leading-relaxed">
                {item.prompt}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Creative Output Canvas */}
      {lastCreateMsg && (
        <div className="rounded-3xl bg-[#0E0C1B] border border-[#251E3E] shadow-2xl p-5 sm:p-7 relative mb-6">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#251E3E] text-xs font-mono">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#EC4899]" />
              <span className="text-[#F8FAFC] font-semibold">Alpha Creative Output</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopyText(lastCreateMsg.content)}
                className="flex items-center gap-1 text-[11px] text-[#A1A1AA] hover:text-[#EC4899] cursor-pointer"
                title="Copy creative output"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#38BDF8]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={onRegenerate}
                className="p-1 hover:text-[#B794F4] cursor-pointer"
                title="Regenerate with new creative seeds"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="prose prose-invert prose-sm max-w-none text-[#F8FAFC] leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {lastCreateMsg.content}
            </ReactMarkdown>
          </div>
        </div>
      )}

    </div>
  );
};
