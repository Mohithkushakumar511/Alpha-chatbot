import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check, Volume2, RotateCcw, ExternalLink } from 'lucide-react';
import type { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
  isLastAssistant: boolean;
  onRegenerate?: () => void;
  onSpeak?: (text: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isLastAssistant,
  onRegenerate,
  onSpeak,
}) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopyText = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`w-full flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-4`}>
      
      {/* Bubble Container */}
      <div className={`max-w-[88%] sm:max-w-[85%] flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        {!isUser && (
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#E11D48] to-[#9F1239] flex items-center justify-center text-[#F5F5F5] font-display font-black text-xs shadow-sm shadow-[#E11D48]/20 flex-shrink-0 mt-0.5">
            A
          </div>
        )}

        <div className="flex flex-col">
          {/* Main Bubble */}
          <div
            className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-[13px] leading-relaxed break-words ${
              isUser
                ? 'bg-[#4A1726] border border-[#383034] text-[#F5F5F5] shadow-md shadow-black/30 rounded-tr-xs'
                : 'bg-[#222222] border border-[#383034] text-[#F5F5F5] shadow-lg shadow-black/40 rounded-tl-xs backdrop-blur-md'
            }`}
          >
            {isUser ? (
              <p className="whitespace-pre-wrap">{message.content}</p>
            ) : (
              <div className="prose prose-invert prose-xs max-w-none space-y-2 text-[#F5F5F5]">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed text-[#F5F5F5]">{children}</p>,
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#E11D48] underline hover:text-[#F43F5E] font-medium"
                      >
                        {children}
                      </a>
                    ),
                    code: ({ inline, className, children, ...props }: any) => {
                      const match = /language-(\w+)/.exec(className || '');
                      const codeContent = String(children).replace(/\n$/, '');

                      if (!inline && match) {
                        return <CodeBlock language={match[1]} content={codeContent} />;
                      }
                      if (!inline) {
                        return <CodeBlock language="code" content={codeContent} />;
                      }
                      return (
                        <code
                          className="px-1.5 py-0.5 rounded-md bg-[#151515] border border-[#383034] font-mono text-[11px] text-[#F43F5E]"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            )}
          </div>

          {/* LangSearch Sources (for search mode) */}
          {message.sources && message.sources.length > 0 && (
            <div className="mt-2.5 p-3 rounded-xl bg-[#151515] border border-[#383034] max-w-full">
              <span className="font-mono text-[10.5px] uppercase font-bold text-[#E11D48] tracking-wider flex items-center gap-1.5 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48]" />
                LangSearch Verified Sources:
              </span>
              <div className="space-y-1.5">
                {message.sources.map((source, idx) => (
                  <a
                    key={idx}
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group block p-2 rounded-lg bg-[#202020] hover:bg-[#251719] border border-[#383034] hover:border-[#E11D48]/50 transition-all text-xs"
                  >
                    <div className="flex items-center justify-between text-[#F5F5F5] font-medium group-hover:text-[#F5F5F5]">
                      <span className="truncate max-w-[280px]">{source.title}</span>
                      <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-70 group-hover:opacity-100" />
                    </div>
                    {source.snippet && (
                      <p className="text-[11px] text-[#B8B8B8] line-clamp-2 mt-0.5 leading-snug">
                        {source.snippet}
                      </p>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Action Footer for Assistant Messages */}
          {!isUser && (
            <div className="flex items-center gap-1.5 mt-1.5 text-[#B8B8B8] text-xs">
              <button
                onClick={handleCopyText}
                className="flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-white/5 hover:text-[#E11D48] transition-colors cursor-pointer"
                title="Copy response"
              >
                {copied ? <Check className="w-3 h-3 text-[#E11D48]" /> : <Copy className="w-3 h-3" />}
                <span className="text-[10px]">{copied ? 'Copied' : 'Copy'}</span>
              </button>

              {onSpeak && (
                <button
                  onClick={() => onSpeak(message.content)}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-white/5 hover:text-[#E11D48] transition-colors cursor-pointer"
                  title="Listen to message"
                >
                  <Volume2 className="w-3 h-3" />
                  <span className="text-[10px]">Listen</span>
                </button>
              )}

              {isLastAssistant && onRegenerate && (
                <button
                  onClick={onRegenerate}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-white/5 hover:text-[#E11D48] transition-colors cursor-pointer"
                  title="Regenerate response"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span className="text-[10px]">Regenerate</span>
                </button>
              )}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

const CodeBlock: React.FC<{ language: string; content: string }> = ({ language, content }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-2.5 rounded-xl overflow-hidden border border-[#383034] bg-[#101010] shadow-md">
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#151515] border-b border-[#383034] text-[11px] font-mono text-[#E11D48]">
        <span className="uppercase font-semibold tracking-wider">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[#B8B8B8] hover:text-[#E11D48] transition-colors cursor-pointer"
          title="Copy code"
        >
          {copied ? <Check className="w-3 h-3 text-[#E11D48]" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre className="p-3 overflow-x-auto text-[11.5px] font-mono text-[#F5F5F5] leading-relaxed">
        <code>{content}</code>
      </pre>
    </div>
  );
};
