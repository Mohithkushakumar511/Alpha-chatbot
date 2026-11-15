import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  HelpCircle,
  ListOrdered,
  Lightbulb,
  Play,
  Copy,
  Check,
  RotateCcw,
  ArrowRight,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Message } from '../../types';

interface LearnInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  onSend: (prompt: string, mode?: 'learn') => void;
  onStop: () => void;
  onRegenerate: () => void;
}

const LEARNING_TOPICS = [
  {
    title: 'Transformers & Self-Attention',
    category: 'AI & Deep Learning',
    prompt: 'Explain the Transformer architecture and Self-Attention mechanism from first principles with intuitive real-world analogies, mathematical intuition, and a step-by-step breakdown.',
  },
  {
    title: 'Distributed Systems Consensus (Raft & Paxos)',
    category: 'Computer Science',
    prompt: 'Explain how distributed consensus works using the Raft consensus algorithm. Break down leader election, log replication, and failure handling step-by-step.',
  },
  {
    title: 'Quantum Computing Qubits & Superposition',
    category: 'Physics & Computing',
    prompt: 'Explain quantum superposition, entanglement, and how quantum computers perform parallel computations differently than classical bits, using beginner-friendly intuitions.',
  },
  {
    title: 'Database Indexing & B-Trees',
    category: 'Software Engineering',
    prompt: 'Explain how database indexing works behind the scenes. Contrast B-Tree indexes and Hash indexes, explaining why B-Trees are ideal for range queries with visual analogies.',
  },
];

const DEPTH_LEVELS = [
  { id: 'beginner', label: 'Beginner (Analogies & Intuition)', color: 'text-[#10B981]' },
  { id: 'intermediate', label: 'Intermediate (Core Mechanics)', color: 'text-[#38BDF8]' },
  { id: 'advanced', label: 'Advanced (Formal Logic & Edge Cases)', color: 'text-[#8B5CF6]' },
];

export const LearnInterface: React.FC<LearnInterfaceProps> = ({
  messages,
  isLoading,
  onSend,
  onStop,
  onRegenerate,
}) => {
  const [topicInput, setTopicInput] = useState('');
  const [selectedDepth, setSelectedDepth] = useState('beginner');
  const [learningGoal, setLearningGoal] = useState<'breakdown' | 'quiz' | 'takeaways'>('breakdown');
  const [copied, setCopied] = useState(false);

  const learnMessages = messages.filter((m) => m.mode === 'learn');
  const lastLearnMsg = [...learnMessages].reverse().find((m) => m.role === 'assistant');

  const handleLearn = (topicOverride?: string) => {
    const topic = topicOverride || topicInput;
    if (!topic.trim() || isLoading) return;

    let prompt = '';
    if (learningGoal === 'quiz') {
      prompt = `Topic: "${topic}"\nTarget Level: ${selectedDepth.toUpperCase()}\n\nPlease create an interactive 5-question comprehension quiz testing key intuitions and edge cases about this topic. Provide options (A, B, C, D) and then detailed explanations with the answer key at the end.`;
    } else if (learningGoal === 'takeaways') {
      prompt = `Topic: "${topic}"\nTarget Level: ${selectedDepth.toUpperCase()}\n\nPlease provide an executive cheat-sheet and 7 core takeaway principles about this topic with clean code snippets or formulas where relevant.`;
    } else {
      prompt = `Topic: "${topic}"\nTarget Level: ${selectedDepth.toUpperCase()}\n\nPlease provide a comprehensive step-by-step tutorial on this topic. Include:\n1. Intuitive high-level analogy\n2. Core mechanics & how it works step-by-step\n3. Practical real-world code or application example\n4. Common pitfalls and key takeaways.`;
    }

    onSend(prompt, 'learn');
    setTopicInput('');
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
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#10B981]/25 to-[#8B5CF6]/20 border border-[#251E3E] flex items-center justify-center text-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.25)]">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F8FAFC] flex items-center gap-2">
              <span>Mastery Learning Engine</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#10B981]/15 border border-[#10B981]/40 text-[#34D399] uppercase font-semibold">
                Socratic Tutor
              </span>
            </h1>
            <p className="text-xs text-[#A1A1AA]">
              Break down complex technical subjects with step-by-step intuition, code analogies, and quizzes
            </p>
          </div>
        </div>

        {/* Depth Level Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#A1A1AA]">Depth:</span>
          <select
            value={selectedDepth}
            onChange={(e) => setSelectedDepth(e.target.value)}
            className="bg-[#131020] border border-[#251E3E] text-[#F8FAFC] text-xs font-medium rounded-xl px-3 py-1.5 outline-none hover:border-[#8B5CF6] transition-all cursor-pointer"
          >
            {DEPTH_LEVELS.map((d) => (
              <option key={d.id} value={d.id} className="bg-[#080811] text-[#F8FAFC]">
                {d.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Learning Goal Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4">
        {[
          { id: 'breakdown', label: 'Step-by-Step Breakdown', icon: BookOpen, color: 'text-[#38BDF8]' },
          { id: 'quiz', label: 'Test My Knowledge (Quiz)', icon: HelpCircle, color: 'text-[#F59E0B]' },
          { id: 'takeaways', label: 'Cheat-Sheet & Takeaways', icon: ListOrdered, color: 'text-[#10B981]' },
        ].map((goal) => {
          const Icon = goal.icon;
          const isActive = learningGoal === goal.id;
          return (
            <button
              key={goal.id}
              onClick={() => setLearningGoal(goal.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-[#10B981]/20 to-[#8B5CF6]/20 border border-[#10B981] text-[#F8FAFC] shadow-[0_0_15px_rgba(16,185,129,0.3)] font-semibold'
                  : 'bg-[#131020]/70 border border-[#251E3E] text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#1E1638]/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${goal.color}`} />
              <span>{goal.label}</span>
            </button>
          );
        })}
      </div>

      {/* Learning Topic Input Card */}
      <div className="p-4 rounded-3xl bg-[#131020]/90 border border-[#251E3E] shadow-xl backdrop-blur-xl mb-6">
        <div className="flex flex-col gap-3">
          <label className="text-xs font-mono font-medium text-[#34D399] flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>What do you want to learn today?</span>
          </label>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleLearn()}
              placeholder="e.g. 'How do neural network transformers work?' or 'Explain ACID properties in databases'..."
              className="flex-1 bg-[#080811] border border-[#251E3E] focus:border-[#10B981] focus:shadow-[0_0_15px_rgba(16,185,129,0.25)] rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-[#F8FAFC] placeholder:text-[#A1A1AA]/50 outline-none transition-all"
            />

            {isLoading ? (
              <button
                onClick={onStop}
                className="px-5 py-2.5 rounded-2xl bg-[#EC4899]/20 hover:bg-[#EC4899]/30 border border-[#EC4899]/60 text-xs font-semibold text-[#F472B6] transition-all cursor-pointer"
              >
                Stop
              </button>
            ) : (
              <button
                onClick={() => handleLearn()}
                disabled={!topicInput.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#10B981] to-[#38BDF8] hover:from-[#059669] hover:to-[#0284C7] disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-bold transition-all shadow-md shadow-[#10B981]/25 cursor-pointer hover:scale-102 active:scale-98"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Learning</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Curated Pathways Grid */}
      <div className="mb-6">
        <h3 className="text-xs font-mono uppercase tracking-wider text-[#A1A1AA] mb-3">
          Popular Knowledge Pathways:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {LEARNING_TOPICS.map((topic, idx) => (
            <div
              key={idx}
              onClick={() => handleLearn(topic.prompt)}
              className="p-3.5 rounded-2xl bg-[#0E0C1B] hover:bg-[#151D29] border border-[#251E3E] hover:border-[#10B981]/50 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-start justify-between mb-1">
                <span className="text-xs font-semibold text-[#F8FAFC] group-hover:text-[#34D399] transition-colors">
                  {topic.title}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#A1A1AA] group-hover:text-[#10B981] transition-transform group-hover:translate-x-1" />
              </div>
              <span className="text-[10px] font-mono text-[#A1A1AA]/70">
                {topic.category}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Output Display */}
      {lastLearnMsg && (
        <div className="rounded-3xl bg-[#0E0C1B] border border-[#251E3E] shadow-2xl p-5 sm:p-7 mb-6">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#251E3E] text-xs font-mono">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#10B981]" />
              <span className="text-[#F8FAFC] font-semibold">Alpha Lesson Breakdown</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopyText(lastLearnMsg.content)}
                className="flex items-center gap-1 text-[11px] text-[#A1A1AA] hover:text-[#10B981] cursor-pointer"
                title="Copy lesson"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#38BDF8]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={onRegenerate}
                className="p-1 hover:text-[#34D399] cursor-pointer"
                title="Regenerate lesson"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="prose prose-invert prose-sm max-w-none text-[#F8FAFC] leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {lastLearnMsg.content}
            </ReactMarkdown>
          </div>
        </div>
      )}

    </div>
  );
};
