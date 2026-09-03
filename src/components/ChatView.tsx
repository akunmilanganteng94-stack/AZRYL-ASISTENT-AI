import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Send,
  Bot,
  User,
  Copy,
  Check,
  Sparkles,
  AlertTriangle,
  Code,
  ShieldCheck,
  KeyRound,
  Trash2,
  Terminal,
  Radio,
  Zap,
  Globe
} from 'lucide-react';
import { Message, ConfigStatus } from '../types';
import { GalaxyPlanetCanvas } from './GalaxyPlanetCanvas';

interface ChatViewProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  onClearChat: () => void;
  configStatus: ConfigStatus | null;
  isEmbedded?: boolean;
}

const QUICK_PROMPTS = [
  { label: 'Kamu siapa?', text: 'kamu siapa?', icon: '🪐' },
  { label: 'Siapa developer kamu?', text: 'siapa developer atau pencipta kamu?', icon: '👨‍💻' },
  { label: 'Ide Website Masa Depan', text: 'Berikan 3 konsep website masa depan ultra-modern dengan UI sci-fi interaktif.', icon: '💡' },
  { label: 'Clean Code & Architecture', text: 'Bagaimana prinsip clean code dan arsitektur modern untuk web development saat ini?', icon: '⚡' },
  { label: 'Debug & Analisis Solusi', text: 'Jelaskan cara efektif menangani asynchronous state dan race condition di JavaScript/TypeScript.', icon: '🛠️' },
];

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  isLoading,
  onSendMessage,
  onClearChat,
  configStatus,
  isEmbedded = false,
}) => {
  const [inputText, setInputText] = useState('');
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Adjust textarea height safely
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 130)}px`;
    }
  }, [inputText]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const msg = inputText.trim();
    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    onSendMessage(msg);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedMessageId(id);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  return (
    <div
      className={`flex-1 flex flex-col w-full relative overflow-hidden ${
        isEmbedded
          ? 'h-full'
          : 'h-[calc(100dvh-72px)] max-w-5xl mx-auto px-2 sm:px-4 py-2 sm:py-3'
      }`}
    >
      {/* Moving Cosmic Galaxy & Rotating Planet Canvas Background */}
      <GalaxyPlanetCanvas />

      {/* Cyber Grid & Cosmic Deep Tint Veil for Maximum Legibility */}
      <div className="absolute inset-0 bg-[#02050f]/75 backdrop-blur-[1px] pointer-events-none z-0" />
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none z-0" />

      {/* Top Holographic Status Banner (Only if standalone, or if key not configured) */}
      {!isEmbedded && (
        <div className="relative z-10 shrink-0 mb-2 px-3.5 py-2 rounded-xl bg-[#040a17]/85 border border-cyan-500/30 backdrop-blur-md flex items-center justify-between text-xs font-mono shadow-[0_0_20px_rgba(6,182,212,0.12)]">
          <div className="flex items-center gap-2 text-cyan-300">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="font-orbitron font-bold">AZRYL NEURAL TERMINAL</span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              AGENT: <strong className="text-cyan-300">azrylasissten</strong>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-400 hidden md:inline">
              DEV: <strong className="text-pink-400">AZRYL (@AZRYL)</strong>
            </span>
            <button
              onClick={onClearChat}
              className="inline-flex items-center gap-1 text-slate-400 hover:text-red-400 text-[11px] px-2 py-0.5 rounded hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
              title="Reset sesi percakapan"
            >
              <Trash2 className="w-3 h-3" />
              <span>CLEAR BUFFER</span>
            </button>
          </div>
        </div>
      )}

      {/* Banner if API Key is not configured in .env */}
      {configStatus && !configStatus.isKeyConfigured && (
        <div className="relative z-10 shrink-0 mb-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-200 text-xs flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Mode Offline / Siaga:</strong> Pertanyaan identitas dijawab otomatis. Untuk AI penuh, sediakan API Key di <code className="bg-amber-950/60 px-1 py-0.5 rounded font-mono text-amber-300">.env</code>.
          </span>
        </div>
      )}

      {/* Messages Scroll Area (Never cut off: flex-1 + min-h-0 + overflow-y-auto) */}
      <div className="relative z-10 flex-1 min-h-0 overflow-y-auto px-2 sm:px-4 py-3 space-y-4 pr-1 sm:pr-2">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const isCopied = copiedMessageId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 sm:gap-3.5 ${
                isUser ? 'flex-row-reverse justify-start' : 'justify-start'
              }`}
            >
              {/* Futuristic Avatar */}
              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 border relative ${
                  isUser
                    ? 'bg-[#0a1224] text-cyan-200 border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                    : 'bg-[#030917] text-cyan-300 border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.35)]'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                {!isUser && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                )}
              </div>

              {/* Message Bubble Container */}
              <div
                className={`flex flex-col ${
                  isUser ? 'items-end' : 'items-start'
                } max-w-[90%] sm:max-w-[82%] min-w-0`}
              >
                {/* Sender Tag & Timestamp */}
                <div className="flex items-center gap-2 mb-1 px-1 text-[11px] font-mono text-slate-400">
                  <span className={`font-semibold ${isUser ? 'text-cyan-300' : 'text-cyan-200'}`}>
                    {isUser ? 'USER' : 'azrylasissten'}
                  </span>
                  <span>•</span>
                  <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                  {!isUser && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                      AZRYL AI
                    </span>
                  )}
                </div>

                {/* Bubble Body */}
                <div
                  className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed break-words relative overflow-hidden backdrop-blur-xl ${
                    isUser
                      ? 'bg-[#07132a]/85 border border-cyan-500/40 text-slate-100 rounded-tr-sm shadow-[0_4px_20px_rgba(6,182,212,0.15)]'
                      : msg.isError
                      ? 'bg-rose-950/60 border border-rose-500/40 text-rose-200 rounded-tl-sm'
                      : 'bg-[#040a19]/90 border border-cyan-500/30 text-slate-100 rounded-tl-sm shadow-[0_4px_25px_rgba(0,0,0,0.6)]'
                  }`}
                >
                  {/* Subtle Corner Brackets on AI messages */}
                  {!isUser && !msg.isError && (
                    <>
                      <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-cyan-400/50 pointer-events-none" />
                      <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-cyan-400/50 pointer-events-none" />
                    </>
                  )}

                  {msg.isError ? (
                    <div className="flex items-start gap-2 text-rose-300 font-mono text-xs">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                      <div>{msg.content}</div>
                    </div>
                  ) : (
                    <div className="prose prose-invert max-w-none text-xs sm:text-sm space-y-2 [&_p]:leading-relaxed [&_code]:bg-[#02050e] [&_code]:text-cyan-300 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:border [&_code]:border-cyan-900/60 [&_code]:font-mono [&_pre]:bg-[#02040b] [&_pre]:border [&_pre]:border-cyan-500/30 [&_pre]:p-3 [&_pre]:rounded-xl [&_pre]:overflow-x-auto [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  )}

                  {/* Message Action Footer */}
                  {!msg.isError && (
                    <div className="mt-3 pt-2 border-t border-cyan-950/60 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-400/70">
                        {!isUser && (
                          <span className="flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-cyan-400" />
                            <span>azrylasissten AI Core</span>
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleCopy(msg.content, msg.id)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/20 transition-all"
                        title="Salin pesan"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Tersalin</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Salin</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing Neural Equalizer Indicator */}
        {isLoading && (
          <div className="flex items-start gap-2.5 sm:gap-3.5 justify-start animate-fade-in">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#030917] text-cyan-300 border border-cyan-400/50 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.35)]">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3 sm:p-3.5 rounded-2xl rounded-tl-sm bg-[#040a19]/90 border border-cyan-500/30 text-cyan-200 text-xs font-mono flex items-center gap-3 shadow-lg">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
              </div>
              <span className="tracking-wide">
                azrylasissten sedang memproses respons neural...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips (Never cut off: horizontal scroll with shrink-0) */}
      <div className="relative z-10 shrink-0 px-2 sm:px-4 py-1.5">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {QUICK_PROMPTS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => onSendMessage(item.text)}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono bg-[#030716]/85 hover:bg-cyan-950/60 border border-cyan-500/25 hover:border-cyan-400 text-slate-300 hover:text-cyan-200 transition-all whitespace-nowrap shrink-0 disabled:opacity-40 backdrop-blur-md shadow-sm hover:shadow-[0_0_12px_rgba(6,182,212,0.25)]"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Pinned Input Form Console (Anchored, flexible height, never cut off) */}
      <div className="relative z-10 shrink-0 px-2 sm:px-4 pb-2 pt-1">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative rounded-2xl bg-[#030816]/90 border border-cyan-500/35 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-500/25 transition-all shadow-[0_0_25px_rgba(0,0,0,0.8)] backdrop-blur-xl">
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tanyakan sesuatu ke azrylasissten... (Enter kirim, Shift+Enter baris baru)"
              className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-xs sm:text-sm px-3.5 sm:px-4 pt-3 pb-3 pr-12 focus:outline-none resize-none leading-relaxed max-h-32"
            />

            {/* Futuristic Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="absolute right-2 bottom-2 w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(6,182,212,0.35)] hover:scale-105 active:scale-95"
              title="Kirim pesan"
            >
              <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>

          {/* Footnote developer attribution */}
          <div className="mt-1.5 px-2 flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-slate-500">
            <span>
              azrylasissten • Arsitek Developer: <strong className="text-cyan-300">AZRYL</strong>
            </span>
            <span className="text-pink-400 font-semibold">
              TikTok: @AZRYL
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

