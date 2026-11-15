import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Cpu,
  Server,
  Globe,
  Volume2,
  Code2,
  Shield,
  Sliders,
} from 'lucide-react';
import type { SystemStatus } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  systemStatus: SystemStatus | null;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  systemStatus,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'status' | 'ai' | 'voice' | 'embed'>('status');

  if (!isOpen) return null;

  const embedScript = `<!-- ALPHA AI Chatbot Embed -->
<script
  src="https://cdn.jsdelivr.net/npm/@alpha-ai/embed@latest/dist/alpha.min.js"
  data-theme="futuristic-universe"
  data-accent="#8B5CF6"
  data-position="bottom-right"
  defer
></script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const serverOnline = systemStatus?.server?.online ?? false;
  const groqConnected = systemStatus?.groq?.connected ?? false;
  const langSearchConnected = systemStatus?.langSearch?.connected ?? false;
  const voiceLabel = systemStatus?.voice?.label ?? 'Browser Audio';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-[#0D0A1A]/95 border border-[#251E3E] rounded-3xl p-5 sm:p-7 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl text-[#F8FAFC] flex flex-col max-h-[90vh] overflow-hidden"
      >
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#251E3E] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#8B5CF6]/30 to-[#38BDF8]/20 border border-[#8B5CF6]/40 flex items-center justify-center text-[#8B5CF6] shadow-sm shadow-[#8B5CF6]/20">
              <Sliders className="w-5 h-5 text-[#B794F4]" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-[#F8FAFC] flex items-center gap-2">
                <span>Alpha Platform Settings</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#8B5CF6]/20 text-[#B794F4] border border-[#8B5CF6]/40 font-semibold">
                  Universe v2.0
                </span>
              </h2>
              <p className="text-xs text-[#A1A1AA] font-normal">
                Manage AI engines, system connectivity, voice options, and web embeds
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#1E1638] transition-colors cursor-pointer"
            title="Close Settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 py-3 border-b border-[#251E3E]/60 overflow-x-auto flex-shrink-0">
          <button
            onClick={() => setActiveTab('status')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'status'
                ? 'bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/30 font-semibold'
                : 'text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#1E1638]'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Engines & Status</span>
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'ai'
                ? 'bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/30 font-semibold'
                : 'text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#1E1638]'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>AI Reasoning</span>
          </button>

          <button
            onClick={() => setActiveTab('voice')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'voice'
                ? 'bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/30 font-semibold'
                : 'text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#1E1638]'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Voice & Audio</span>
          </button>

          <button
            onClick={() => setActiveTab('embed')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'embed'
                ? 'bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/30 font-semibold'
                : 'text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#1E1638]'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Embed Widget</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          
          {/* TAB 1: SYSTEM & ENGINES STATUS */}
          {activeTab === 'status' && (
            <div className="space-y-3">
              
              {/* Card 1: FastAPI Backend */}
              <div className="p-4 rounded-2xl bg-[#131020] border border-[#251E3E] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#1E1638] flex items-center justify-center text-[#8B5CF6]">
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#F8FAFC]">FastAPI Backend</h4>
                    <p className="text-xs text-[#A1A1AA]">Asynchronous Python ASGI Server</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      serverOnline ? 'bg-[#38BDF8] shadow-[0_0_8px_#38BDF8]' : 'bg-[#A1A1AA]'
                    }`}
                  />
                  <span className="text-xs font-mono font-semibold text-[#F8FAFC]">
                    {serverOnline ? 'Online' : 'Connecting'}
                  </span>
                </div>
              </div>

              {/* Card 2: Groq LPU Engine */}
              <div className="p-4 rounded-2xl bg-[#131020] border border-[#251E3E] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#1E1638] flex items-center justify-center text-[#38BDF8]">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#F8FAFC]">Groq LPU Engine</h4>
                    <p className="text-xs text-[#A1A1AA]">Ultra-fast inference (GPT-OSS-120B / Llama 3)</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      groqConnected ? 'bg-[#38BDF8] shadow-[0_0_8px_#38BDF8]' : 'bg-[#A1A1AA]'
                    }`}
                  />
                  <span className="text-xs font-mono font-semibold text-[#F8FAFC]">
                    {groqConnected ? 'Connected' : 'Available'}
                  </span>
                </div>
              </div>

              {/* Card 3: LangSearch Engine */}
              <div className="p-4 rounded-2xl bg-[#131020] border border-[#251E3E] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#1E1638] flex items-center justify-center text-[#B794F4]">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#F8FAFC]">LangSearch Web Engine</h4>
                    <p className="text-xs text-[#A1A1AA]">Real-time grounding & factual research</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      langSearchConnected ? 'bg-[#38BDF8] shadow-[0_0_8px_#38BDF8]' : 'bg-[#A1A1AA]'
                    }`}
                  />
                  <span className="text-xs font-mono font-semibold text-[#F8FAFC]">
                    {langSearchConnected ? 'Connected' : 'Available'}
                  </span>
                </div>
              </div>

              {/* Card 4: Voice Synthesis Engine */}
              <div className="p-4 rounded-2xl bg-[#131020] border border-[#251E3E] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#1E1638] flex items-center justify-center text-[#EC4899]">
                    <Volume2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#F8FAFC]">Voice Engine</h4>
                    <p className="text-xs text-[#A1A1AA]">{voiceLabel}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#38BDF8] shadow-[0_0_8px_#38BDF8]" />
                  <span className="text-xs font-mono font-semibold text-[#F8FAFC]">Active</span>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: AI REASONING PREFERENCES */}
          {activeTab === 'ai' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-[#131020] border border-[#251E3E]">
                <h4 className="text-sm font-semibold text-[#F8FAFC] mb-1">Primary Neural Model</h4>
                <p className="text-xs text-[#A1A1AA] mb-3">
                  Configured on the FastAPI server environment.
                </p>
                <div className="p-3 rounded-xl bg-[#080811] border border-[#251E3E] font-mono text-xs text-[#38BDF8] flex items-center justify-between">
                  <span>openai/gpt-oss-120b</span>
                  <span className="text-[10px] text-[#A1A1AA] bg-[#1E1638] px-2 py-0.5 rounded">High Throughput</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#131020] border border-[#251E3E]">
                <h4 className="text-sm font-semibold text-[#F8FAFC] mb-1">Operational Modes</h4>
                <p className="text-xs text-[#A1A1AA] mb-3">
                  ALPHA automatically adjusts temperature, system prompt and persona based on active mode:
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#080811] border border-[#251E3E]">
                    <strong className="text-[#B794F4]">💬 Chat</strong>: Natural conversation (temp 0.4)
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#080811] border border-[#251E3E]">
                    <strong className="text-[#38BDF8]">💻 Code</strong>: Clean modular code (temp 0.4)
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#080811] border border-[#251E3E]">
                    <strong className="text-[#F472B6]">🎨 Create</strong>: High imagination (temp 0.8)
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#080811] border border-[#251E3E]">
                    <strong className="text-[#34D399]">🔍 Search</strong>: Real-time synthesis
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: VOICE & AUDIO */}
          {activeTab === 'voice' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-[#131020] border border-[#251E3E] flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-[#F8FAFC]">Speech Synthesis Engine</h4>
                  <p className="text-xs text-[#A1A1AA]">
                    Current active TTS engine: {voiceLabel}
                  </p>
                </div>
                <div className="px-3 py-1 rounded-xl bg-[#1E1638] border border-[#8B5CF6]/40 text-xs font-mono text-[#B794F4]">
                  Automated Fallback
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#131020] border border-[#251E3E] flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-[#F8FAFC]">Microphone Speech Recognition</h4>
                  <p className="text-xs text-[#A1A1AA]">
                    Browser Web Speech API (English US / International)
                  </p>
                </div>
                <span className="text-xs font-mono text-[#38BDF8]">Supported</span>
              </div>
            </div>
          )}

          {/* TAB 4: EMBED WIDGET */}
          {activeTab === 'embed' && (
            <div className="space-y-3">
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                Paste this script tag into any HTML webpage before the closing <code className="text-[#B794F4] bg-[#080811] px-1 rounded">&lt;/body&gt;</code> tag to embed the floating Alpha companion widget on your site.
              </p>

              <div className="relative rounded-2xl overflow-hidden border border-[#251E3E] bg-[#080811]">
                <div className="flex items-center justify-between px-3 py-2 bg-[#131020] border-b border-[#251E3E] text-xs font-mono text-[#A1A1AA]">
                  <span>HTML Embed Snippet</span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs text-[#38BDF8] hover:text-white transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-4 text-xs font-mono text-[#B794F4] overflow-x-auto leading-relaxed">
                  <code>{embedScript}</code>
                </pre>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-[#251E3E] flex items-center justify-between text-xs text-[#A1A1AA] flex-shrink-0">
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-[#38BDF8]" />
            <span>All API keys remain securely handled on the backend</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-medium transition-all shadow-md shadow-[#8B5CF6]/30 cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
