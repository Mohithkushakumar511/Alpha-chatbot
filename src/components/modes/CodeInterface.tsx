import React, { useState } from 'react';
import {
  Code2,
  Play,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Bug,
  Zap,
  TestTube,
  FileCode,
  Terminal,
  ChevronDown,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Message } from '../../types';

interface CodeInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  onSend: (prompt: string, mode?: 'code') => void;
  onStop: () => void;
  onRegenerate: () => void;
}

const POPULAR_LANGUAGES = [
  'TypeScript',
  'Python',
  'JavaScript',
  'Rust',
  'Go',
  'C++',
  'Java',
  'SQL',
  'HTML/CSS',
  'Bash',
];

const CODE_TEMPLATES = [
  {
    label: 'React Cache Hook',
    lang: 'TypeScript',
    code: `// Build a reusable React hook for fetching with caching & abort\nfunction useCachedFetch(url: string) {\n  // Implementation here\n}`,
    action: 'Implement this full custom hook with TypeScript generics and error handling.',
  },
  {
    label: 'FastAPI JWT Auth',
    lang: 'Python',
    code: `# FastAPI endpoint with OAuth2 & JWT bearer token validation\nfrom fastapi import FastAPI, Depends, HTTPException\n\n# Implement secure auth dependency`,
    action: 'Complete this FastAPI JWT token authentication handler with expiration and password hashing.',
  },
  {
    label: 'Binary Search Tree',
    lang: 'Python',
    code: `class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef is_valid_bst(root: TreeNode) -> bool:\n    pass`,
    action: 'Implement and explain an optimal O(N) iterative or recursive solution with edge-case tests.',
  },
  {
    label: 'Async Worker Queue',
    lang: 'Go',
    code: `package main\n\n// Create a worker pool processing jobs concurrently using channels`,
    action: 'Write a production-ready concurrent worker pool pattern using Go channels and sync.WaitGroup.',
  },
];

export const CodeInterface: React.FC<CodeInterfaceProps> = ({
  messages,
  isLoading,
  onSend,
  onStop,
  onRegenerate,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState('TypeScript');
  const [codeInput, setCodeInput] = useState('');
  const [taskPrompt, setTaskPrompt] = useState('');
  const [activeAction, setActiveAction] = useState<'explain' | 'debug' | 'optimize' | 'test' | 'generate'>('generate');
  const [copiedCode, setCopiedCode] = useState(false);

  // Filter messages that belong to the code mode or general coding questions
  const codeMessages = messages.filter((m) => m.mode === 'code' || m.content.includes('```'));
  const lastCodeAssistantMsg = [...codeMessages].reverse().find((m) => m.role === 'assistant');

  const handleExecute = (actionType?: 'explain' | 'debug' | 'optimize' | 'test' | 'generate') => {
    const action = actionType || activeAction;
    let fullPrompt = '';

    if (action === 'debug') {
      fullPrompt = `Please debug and fix this ${selectedLanguage} code:\n\n\`\`\`${selectedLanguage.toLowerCase()}\n${codeInput}\n\`\`\`\n\nIssue/Requirement: ${taskPrompt || 'Identify syntax errors, logical bugs, and edge cases. Provide the corrected code with explanations.'}`;
    } else if (action === 'explain') {
      fullPrompt = `Please provide a detailed line-by-line explanation and algorithmic complexity (Time & Space) for this ${selectedLanguage} code:\n\n\`\`\`${selectedLanguage.toLowerCase()}\n${codeInput}\n\`\`\`\n\nFocus: ${taskPrompt || 'Explain how it works, potential bottlenecks, and best practices.'}`;
    } else if (action === 'optimize') {
      fullPrompt = `Please optimize this ${selectedLanguage} code for performance and memory efficiency:\n\n\`\`\`${selectedLanguage.toLowerCase()}\n${codeInput}\n\`\`\`\n\nGoal: ${taskPrompt || 'Refactor into clean, modern, modular code with improved algorithmic complexity.'}`;
    } else if (action === 'test') {
      fullPrompt = `Please write comprehensive unit tests with edge cases for this ${selectedLanguage} code:\n\n\`\`\`${selectedLanguage.toLowerCase()}\n${codeInput}\n\`\`\`\n\nFramework: ${taskPrompt || 'Standard testing framework for ' + selectedLanguage}`;
    } else {
      fullPrompt = taskPrompt.trim()
        ? `Task: ${taskPrompt}\nLanguage: ${selectedLanguage}\n${codeInput ? `Reference code:\n\`\`\`${selectedLanguage.toLowerCase()}\n${codeInput}\n\`\`\`` : ''}`
        : `Write clean, modern, production-grade ${selectedLanguage} code based on the following snippet:\n\n\`\`\`${selectedLanguage.toLowerCase()}\n${codeInput}\n\`\`\``;
    }

    if (fullPrompt.trim()) {
      onSend(fullPrompt, 'code');
    }
  };

  const handleCopyLastOutput = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="w-full flex-1 flex flex-col max-w-6xl mx-auto px-4 py-4 sm:py-6 overflow-y-auto">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-[#251E3E]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#38BDF8]/25 to-[#8B5CF6]/20 border border-[#383034] flex items-center justify-center text-[#38BDF8] shadow-[0_0_15px_rgba(56,189,248,0.25)]">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F8FAFC] flex items-center gap-2">
              <span>Code Assistant Engine</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#38BDF8]/15 border border-[#38BDF8]/40 text-[#38BDF8] uppercase font-semibold">
                LPU Accelerated
              </span>
            </h1>
            <p className="text-xs text-[#A1A1AA]">
              Generate, debug, optimize and inspect algorithms with Groq high-throughput reasoning
            </p>
          </div>
        </div>

        {/* Language Selector Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#A1A1AA]">Language:</span>
          <div className="relative">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="appearance-none bg-[#131020] border border-[#251E3E] text-[#F8FAFC] text-xs font-mono rounded-xl px-3 py-1.5 pr-8 outline-none hover:border-[#8B5CF6] focus:border-[#38BDF8] transition-all cursor-pointer shadow-sm"
            >
              {POPULAR_LANGUAGES.map((lang) => (
                <option key={lang} value={lang} className="bg-[#080811] text-[#F8FAFC]">
                  {lang}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#A1A1AA] absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Action Mode Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4">
        {[
          { id: 'generate', label: 'Write Code', icon: Sparkles, color: 'text-[#8B5CF6]' },
          { id: 'debug', label: 'Debug & Fix', icon: Bug, color: 'text-[#EC4899]' },
          { id: 'optimize', label: 'Optimize & Refactor', icon: Zap, color: 'text-[#F59E0B]' },
          { id: 'test', label: 'Generate Tests', icon: TestTube, color: 'text-[#10B981]' },
          { id: 'explain', label: 'Explain Code', icon: FileCode, color: 'text-[#38BDF8]' },
        ].map((act) => {
          const Icon = act.icon;
          const isActive = activeAction === act.id;
          return (
            <button
              key={act.id}
              onClick={() => setActiveAction(act.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-[#1E1638] border border-[#8B5CF6] text-[#F8FAFC] shadow-[0_0_12px_rgba(139,92,246,0.3)] font-semibold'
                  : 'bg-[#131020]/70 border border-[#251E3E] text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#1E1638]/50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${act.color}`} />
              <span>{act.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Coding Workspace: 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 mb-4">
        
        {/* Left Column: Code Input & Task Instructions */}
        <div className="flex flex-col gap-3">
          
          {/* Code Input Box */}
          <div className="flex-1 flex flex-col rounded-2xl bg-[#0B0914] border border-[#251E3E] shadow-xl overflow-hidden min-h-[220px]">
            <div className="flex items-center justify-between px-3.5 py-2 bg-[#131020] border-b border-[#251E3E] text-xs font-mono text-[#A1A1AA]">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span className="text-[#F8FAFC] font-semibold">{selectedLanguage} Input / Snippet</span>
              </div>
              <button
                onClick={() => setCodeInput('')}
                className="text-[11px] text-[#A1A1AA] hover:text-[#EC4899] cursor-pointer"
              >
                Clear
              </button>
            </div>

            <textarea
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              placeholder={`// Paste or write ${selectedLanguage} code here...`}
              className="flex-1 p-3.5 bg-transparent border-0 outline-none text-xs font-mono text-[#F8FAFC] placeholder:text-[#A1A1AA]/40 resize-none leading-relaxed min-h-[160px]"
              spellCheck={false}
            />
          </div>

          {/* Prompt / Instructions Input */}
          <div className="p-3 rounded-2xl bg-[#131020] border border-[#251E3E] flex flex-col gap-2">
            <span className="text-xs font-mono font-medium text-[#B794F4]">
              Instructions / Requirements:
            </span>
            <input
              type="text"
              value={taskPrompt}
              onChange={(e) => setTaskPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleExecute()}
              placeholder="e.g. Add caching, handle edge cases, or write tests..."
              className="w-full bg-[#080811] border border-[#251E3E] focus:border-[#8B5CF6] rounded-xl px-3 py-2 text-xs text-[#F8FAFC] placeholder:text-[#A1A1AA]/50 outline-none transition-colors"
            />
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex items-center gap-2">
            {isLoading ? (
              <button
                onClick={onStop}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#EC4899]/20 hover:bg-[#EC4899]/30 border border-[#EC4899]/50 text-xs font-semibold text-[#F472B6] transition-all cursor-pointer shadow-md"
              >
                <span>Stop Generating</span>
              </button>
            ) : (
              <button
                onClick={() => handleExecute()}
                disabled={!codeInput.trim() && !taskPrompt.trim()}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#38BDF8] hover:from-[#7C3AED] hover:to-[#0284C7] disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-bold transition-all shadow-md shadow-[#8B5CF6]/30 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Execute with Alpha</span>
              </button>
            )}
          </div>

          {/* Pre-made Template Chips */}
          <div className="flex flex-col gap-1.5 pt-1">
            <span className="text-[11px] font-mono text-[#A1A1AA]">Quick Snippets:</span>
            <div className="flex flex-wrap gap-1.5">
              {CODE_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.label}
                  onClick={() => {
                    setSelectedLanguage(tmpl.lang);
                    setCodeInput(tmpl.code);
                    setTaskPrompt(tmpl.action);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#131020] hover:bg-[#1E1638] border border-[#251E3E] hover:border-[#8B5CF6]/50 text-[11px] text-[#A1A1AA] hover:text-[#F8FAFC] transition-all cursor-pointer font-mono"
                >
                  + {tmpl.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Code AI Output Terminal */}
        <div className="flex flex-col rounded-2xl bg-[#0B0914] border border-[#251E3E] shadow-xl overflow-hidden min-h-[360px]">
          <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#131020] border-b border-[#251E3E] text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse" />
              <span className="text-[#F8FAFC] font-semibold">Alpha Code Analysis & Output</span>
            </div>

            {lastCodeAssistantMsg && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyLastOutput(lastCodeAssistantMsg.content)}
                  className="flex items-center gap-1 text-[11px] text-[#A1A1AA] hover:text-[#38BDF8] cursor-pointer"
                  title="Copy output"
                >
                  {copiedCode ? <Check className="w-3 h-3 text-[#38BDF8]" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={onRegenerate}
                  className="p-1 hover:text-[#B794F4] cursor-pointer"
                  title="Regenerate"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 p-4 overflow-y-auto text-xs font-mono leading-relaxed">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-center text-[#A1A1AA]">
                <div className="w-8 h-8 rounded-full border-2 border-[#8B5CF6] border-t-transparent animate-spin mb-3" />
                <span className="text-xs font-semibold text-[#F8FAFC]">Generating optimized code...</span>
                <span className="text-[11px] text-[#A1A1AA]/70 mt-1">Analyzing syntax, complexity, and security</span>
              </div>
            ) : lastCodeAssistantMsg ? (
              <div className="prose prose-invert prose-xs max-w-none text-[#F8FAFC]">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {lastCodeAssistantMsg.content}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center text-[#A1A1AA]/50 space-y-2">
                <Code2 className="w-8 h-8 text-[#251E3E]" />
                <p className="text-xs">No code generated yet in this session.</p>
                <p className="text-[11px] text-[#A1A1AA]/40 max-w-xs">
                  Select an action on the left and click "Execute with Alpha" to analyze or generate code.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
