import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check, Volume2, RotateCcw, ExternalLink, Bot } from 'lucide-react';
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
    <div
      className={`w-full flex flex-col ${
        isUser ? 'items-end' : 'items-start'
      } mb-5 animate-in fade-in duration-300`}
    >
      {/* Bubble Container */}
      <div
        className={`max-w-[92%] sm:max-w-[85%] md:max-w-[80%] flex gap-3 ${
          isUser ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        {/* Assistant Avatar */}
        {!isUser && (
          <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-[#8B5CF6] via-[#6D28D9] to-[#38BDF8] p-[1px] shadow-[0_0_12px_rgba(139,92,246,0.35)] flex-shrink-0 mt-0.5">
            <div className="w-full h-full rounded-xl bg-[#080811] flex items-center justify-center">
              <Bot className="w-4 h-4 text-[#B794F4]" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#38BDF8] ring-1 ring-[#080811]" />
          </div>
        )}

        <div className="flex flex-col min-w-0">
          
          {/* Sender Label & Timestamp */}
          <div
            className={`flex items-center gap-2 mb-1 text-[11px] font-mono text-[#A1A1AA] ${
              isUser ? 'justify-end' : 'justify-start'
            }`}
          >
            <span className="font-semibold text-[#F8FAFC]">
              {isUser ? 'You' : 'Alpha AI'}
            </span>
            {message.mode && (
              <span className="text-[10px] uppercase px-1.5 py-0.2 rounded bg-[#131020] border border-[#251E3E] text-[#B794F4]">
                {message.mode}
              </span>
            )}
            {!isUser && message.responseLength && (
              <span className={`text-[9px] uppercase px-1.5 py-0.2 rounded bg-[#131020] border border-[#251E3E] ${
                message.responseLength === 'quick'
                  ? 'text-[#38BDF8]'
                  : message.responseLength === 'detailed'
                  ? 'text-[#F472B6]'
                  : 'text-[#A1A1AA]'
              }`}>
                {message.responseLength}
              </span>
            )}
            <span className="text-[10px] text-[#A1A1AA]/50">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {/* Main Bubble Content */}
          <div
            className={`p-4 rounded-2xl text-xs sm:text-[13.5px] leading-relaxed break-words transition-all ${
              isUser
                ? 'bg-gradient-to-r from-[#2E1F4F]/90 to-[#1F1638]/90 border border-[#8B5CF6]/50 text-[#F8FAFC] shadow-lg shadow-black/40 rounded-tr-xs'
                : 'bg-[#131020]/90 border border-[#251E3E] text-[#F8FAFC] shadow-xl shadow-black/50 rounded-tl-xs backdrop-blur-xl'
            }`}
          >
            {isUser ? (
              <p className="whitespace-pre-wrap">{message.content}</p>
            ) : (
              <div className="prose prose-invert prose-xs max-w-none space-y-2 text-[#F8FAFC]">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children }) => (
                      <p className="mb-2.5 last:mb-0 leading-relaxed text-[#F8FAFC]">
                        {children}
                      </p>
                    ),
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#38BDF8] underline hover:text-[#B794F4] font-medium transition-colors"
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
                          className="px-1.5 py-0.5 rounded-md bg-[#080811] border border-[#251E3E] font-mono text-[11px] text-[#B794F4]"
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

          {/* LangSearch Sources Card (if in Search Mode) */}
          {message.sources && message.sources.length > 0 && (
            <div className="mt-3 p-3.5 rounded-2xl bg-[#0E0C1B] border border-[#251E3E] max-w-full">
              <span className="font-mono text-[11px] uppercase font-bold text-[#38BDF8] tracking-wider flex items-center gap-1.5 mb-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-ping" />
                Verified Research Sources:
              </span>
              <div className="space-y-2">
                {message.sources.map((source, idx) => (
                  <a
                    key={idx}
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group block p-2.5 rounded-xl bg-[#131020] hover:bg-[#1E1638] border border-[#251E3E] hover:border-[#8B5CF6]/50 transition-all text-xs"
                  >
                    <div className="flex items-center justify-between text-[#F8FAFC] font-medium">
                      <span className="truncate max-w-[280px] sm:max-w-md group-hover:text-[#38BDF8] transition-colors">
                        {source.title}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 flex-shrink-0 text-[#A1A1AA] group-hover:text-[#38BDF8] transition-colors ml-2" />
                    </div>
                    {source.snippet && (
                      <p className="text-[11px] text-[#A1A1AA] line-clamp-2 mt-1 leading-snug">
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
            <div className="flex items-center gap-2 mt-2 text-[#A1A1AA] text-xs">
              <button
                onClick={handleCopyText}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-[#1E1638] hover:text-[#F8FAFC] transition-colors cursor-pointer"
                title="Copy response"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-[#38BDF8]" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span className="text-[11px] font-mono">{copied ? 'Copied' : 'Copy'}</span>
              </button>

              {onSpeak && (
                <button
                  onClick={() => onSpeak(message.content)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-[#1E1638] hover:text-[#38BDF8] transition-colors cursor-pointer"
                  title="Listen to message aloud"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-mono">Speak</span>
                </button>
              )}

              {isLastAssistant && onRegenerate && (
                <button
                  onClick={onRegenerate}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-[#1E1638] hover:text-[#B794F4] transition-colors cursor-pointer"
                  title="Regenerate response"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-mono">Regenerate</span>
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
    <div className="my-3 rounded-2xl overflow-hidden border border-[#251E3E] bg-[#080811] shadow-xl">
      <div className="flex items-center justify-between px-3.5 py-2 bg-[#0E0C1B] border-b border-[#251E3E] text-[11px] font-mono text-[#B794F4]">
        <span className="uppercase font-semibold tracking-wider flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[#A1A1AA] hover:text-[#F8FAFC] transition-colors cursor-pointer"
          title="Copy code"
        >
          {copied ? <Check className="w-3 h-3 text-[#38BDF8]" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre className="p-3.5 overflow-x-auto text-[11.5px] font-mono text-[#F8FAFC] leading-relaxed">
        <code>{content}</code>
      </pre>
    </div>
  );
};
