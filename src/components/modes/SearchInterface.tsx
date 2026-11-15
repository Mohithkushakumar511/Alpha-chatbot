import React, { useState } from 'react';
import {
  Search,
  Globe,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Copy,
  Check,
  RotateCcw,
  ArrowRight,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Message, SystemStatus } from '../../types';

interface SearchInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  onSend: (prompt: string, mode?: 'search') => void;
  onStop: () => void;
  onRegenerate: () => void;
  systemStatus: SystemStatus | null;
}

const SEARCH_SUGGESTIONS = [
  'Latest breakthroughs in AI reasoning models 2026',
  'FastAPI vs Go Gin ASGI latency and performance benchmark',
  'Quantum computing fault tolerance developments',
  'Three.js WebGPU support and shaders comparison',
];

export const SearchInterface: React.FC<SearchInterfaceProps> = ({
  messages,
  isLoading,
  onSend,
  onStop,
  onRegenerate,
  systemStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const isWebSearchActive = Boolean(systemStatus?.langSearch?.connected);

  const searchMessages = messages.filter((m) => m.mode === 'search');
  const lastSearchMsg = [...searchMessages].reverse().find((m) => m.role === 'assistant');

  const handleSearch = (queryOverride?: string) => {
    const q = queryOverride || searchQuery;
    if (!q.trim() || isLoading) return;

    onSend(q.trim(), 'search');
    setSearchQuery('');
  };

  const handleCopyText = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full flex-1 flex flex-col max-w-4xl mx-auto px-4 py-4 sm:py-6 overflow-y-auto">
      
      {/* Search Engine Header Banner */}
      <div className="flex flex-col items-center text-center pb-6 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#38BDF8]/20 to-[#8B5CF6]/20 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8] shadow-[0_0_20px_rgba(56,189,248,0.25)] mb-3">
          <Globe className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F8FAFC]">
          Alpha Research & Search Engine
        </h1>
        <p className="text-xs sm:text-sm text-[#A1A1AA] max-w-lg mt-1">
          Synthesize deep, multi-source answers with neural comprehension
        </p>

        {/* Live Engine Status Badge */}
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#131020] border border-[#251E3E] text-xs font-mono">
          {isWebSearchActive ? (
            <>
              <span className="w-2 h-2 rounded-full bg-[#38BDF8] shadow-[0_0_6px_#38BDF8] animate-pulse" />
              <span className="text-[#38BDF8] font-semibold">LangSearch Live Web Grounding Active</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-[#B794F4]" />
              <span className="text-[#A1A1AA]">
                Neural Knowledge Mode (No Fake Sources • Factual Groq Inference)
              </span>
            </>
          )}
        </div>
      </div>

      {/* Large Futuristic Search Bar */}
      <div className="w-full max-w-2xl mx-auto mb-6">
        <div className="relative group">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#38BDF8]/30 via-[#8B5CF6]/25 to-[#6D28D9]/20 blur-xl opacity-60 group-focus-within:opacity-100 transition-opacity duration-500 -z-10" />

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex items-center bg-[#131020]/95 border border-[#251E3E] group-focus-within:border-[#38BDF8] group-focus-within:shadow-[0_0_25px_rgba(56,189,248,0.3)] rounded-2xl sm:rounded-3xl p-2 sm:p-2.5 transition-all shadow-2xl"
          >
            <div className="pl-3 pr-2 text-[#38BDF8]">
              <Search className="w-5 h-5" />
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search or ask Alpha for real-time synthesis..."
              className="w-full bg-transparent px-2 text-xs sm:text-sm text-[#F8FAFC] placeholder:text-[#A1A1AA]/50 outline-none"
              autoFocus
            />

            {isLoading ? (
              <button
                type="button"
                onClick={onStop}
                className="px-4 py-2 rounded-xl bg-[#EC4899]/20 hover:bg-[#EC4899]/30 border border-[#EC4899]/50 text-xs font-semibold text-[#F472B6] transition-all cursor-pointer"
              >
                Stop
              </button>
            ) : (
              <button
                type="submit"
                disabled={!searchQuery.trim()}
                className="px-4 py-2 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#38BDF8] to-[#8B5CF6] hover:from-[#0284C7] hover:to-[#7C3AED] disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-bold transition-all shadow-md shadow-[#38BDF8]/20 cursor-pointer hover:scale-105 active:scale-95"
              >
                Search
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Suggested Search Prompts */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
        {SEARCH_SUGGESTIONS.map((topic, idx) => (
          <button
            key={idx}
            onClick={() => handleSearch(topic)}
            className="px-3.5 py-1.5 rounded-full bg-[#131020]/80 hover:bg-[#1E1638] border border-[#251E3E] hover:border-[#38BDF8]/60 text-xs text-[#A1A1AA] hover:text-[#F8FAFC] transition-all cursor-pointer font-medium flex items-center gap-1.5 shadow-sm"
          >
            <span>{topic}</span>
            <ArrowRight className="w-3 h-3 text-[#38BDF8]" />
          </button>
        ))}
      </div>

      {/* Search Synthesis Output */}
      {lastSearchMsg ? (
        <div className="rounded-3xl bg-[#0E0C1B] border border-[#251E3E] shadow-2xl p-5 sm:p-7 mb-6">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#251E3E] text-xs font-mono">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#38BDF8]" />
              <span className="text-[#F8FAFC] font-semibold">Alpha Search Synthesis</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopyText(lastSearchMsg.content)}
                className="flex items-center gap-1 text-[11px] text-[#A1A1AA] hover:text-[#38BDF8] cursor-pointer"
                title="Copy synthesis"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#38BDF8]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={onRegenerate}
                className="p-1 hover:text-[#B794F4] cursor-pointer"
                title="Re-run search"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Markdown Content */}
          <div className="prose prose-invert prose-sm max-w-none text-[#F8FAFC] leading-relaxed mb-4">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {lastSearchMsg.content}
            </ReactMarkdown>
          </div>

          {/* Genuine Verified Sources (Only rendered when real sources exist from backend) */}
          {lastSearchMsg.sources && lastSearchMsg.sources.length > 0 ? (
            <div className="mt-4 pt-4 border-t border-[#251E3E]">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#38BDF8] uppercase tracking-wider mb-3">
                <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-ping" />
                <span>Verified External Web Sources ({lastSearchMsg.sources.length}):</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {lastSearchMsg.sources.map((src, i) => (
                  <a
                    key={i}
                    href={src.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-xl bg-[#131020] hover:bg-[#1E1638] border border-[#251E3E] hover:border-[#38BDF8]/60 transition-all block group"
                  >
                    <div className="flex items-center justify-between text-xs font-semibold text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors">
                      <span className="truncate">{src.title}</span>
                      <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 ml-1.5 opacity-60 group-hover:opacity-100" />
                    </div>
                    {src.snippet && (
                      <p className="text-[11px] text-[#A1A1AA] line-clamp-2 mt-1 leading-snug">
                        {src.snippet}
                      </p>
                    )}
                  </a>
                ))}
              </div>
            </div>
          ) : (
            /* Explicit transparency notice when no web sources were grounded */
            <div className="mt-4 p-3 rounded-xl bg-[#131020] border border-[#251E3E] flex items-center gap-2.5 text-xs text-[#A1A1AA]">
              <AlertCircle className="w-4 h-4 text-[#B794F4] flex-shrink-0" />
              <span>
                Answer synthesized via Alpha LLM neural intelligence. Zero artificial or simulated search sources are displayed.
              </span>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 text-center text-[#A1A1AA]/50 space-y-2">
          <Search className="w-10 h-10 text-[#251E3E]" />
          <p className="text-xs">No active search queries yet.</p>
          <p className="text-[11px] text-[#A1A1AA]/40 max-w-sm">
            Enter a query above or choose a suggested research topic to begin searching.
          </p>
        </div>
      )}

    </div>
  );
};
