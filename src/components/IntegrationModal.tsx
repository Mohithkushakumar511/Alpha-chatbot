import React, { useState } from 'react';
import { X, Copy, Check, Terminal } from 'lucide-react';

interface IntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IntegrationModal: React.FC<IntegrationModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const embedScript = `<!-- ALPHA AI Chatbot Embed -->
<script
  src="https://cdn.jsdelivr.net/npm/@alpha-ai/embed@latest/dist/alpha.min.js"
  data-theme="futuristic-dark"
  data-position="bottom-right"
  data-model="alpha-neural"
  defer
></script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#181818] border border-[#383034] rounded-3xl p-6 shadow-2xl shadow-black/80 text-[#F5F5F5] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#383034] mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#251719] border border-[#E11D48]/40 flex items-center justify-center text-[#E11D48]">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-[#F5F5F5]">
                Integrate ALPHA
              </h3>
              <p className="text-[11px] text-[#B8B8B8] font-normal">
                Embed the floating companion into any website
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#B8B8B8] hover:text-[#F5F5F5] hover:bg-[#202020] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Instructions */}
        <p className="text-xs text-[#B8B8B8] leading-relaxed mb-3">
          Paste this snippet right before the closing <code className="px-1.5 py-0.5 rounded bg-[#151515] border border-[#383034] font-mono text-[#E11D48] text-[11px]">&lt;/body&gt;</code> tag on your webpage. The floating 3D companion and chat modal will automatically initialize.
        </p>

        {/* Code Snippet Box */}
        <div className="relative rounded-2xl bg-[#101010] border border-[#383034] p-4 font-mono text-xs text-[#E11D48] overflow-x-auto mb-5 leading-relaxed">
          <pre>{embedScript}</pre>
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#202020] hover:bg-[#251719] border border-[#383034] hover:border-[#E11D48] text-[#F5F5F5] text-xs font-semibold transition-all cursor-pointer shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#E11D48]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </button>
        </div>

        {/* Footer */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#E11D48] hover:bg-[#9F1239] text-[#F5F5F5] font-display font-bold text-xs transition-all cursor-pointer shadow-md shadow-[#E11D48]/30"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
