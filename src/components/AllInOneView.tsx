import React, { useState } from 'react';
import { Bot, Terminal, Code2, ShieldCheck, Sparkles, Send, Copy, Check, Video, ExternalLink, Activity, Radio, Cpu, CheckCircle2, ChevronRight } from 'lucide-react';
import { Message, ConfigStatus } from '../types';
import { ChatView } from './ChatView';

interface AllInOneViewProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  onClearChat: () => void;
  configStatus: ConfigStatus | null;
  onOpenIdentity: () => void;
}

export const AllInOneView: React.FC<AllInOneViewProps> = ({
  messages,
  isLoading,
  onSendMessage,
  onClearChat,
  configStatus,
  onOpenIdentity,
}) => {
  const [testInput, setTestInput] = useState('halo azrylasissten, siapa developer kamu?');
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTestApi = async () => {
    if (!testInput.trim() || isTesting) return;
    setIsTesting(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: testInput.trim() }),
      });
      const data = await res.json();
      setTestOutput(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setTestOutput(JSON.stringify({ error: err.message }, null, 2));
    } finally {
      setIsTesting(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 max-w-[1600px] w-full mx-auto px-2 sm:px-4 lg:px-6 py-4 space-y-4">
      {/* Top Holographic Banner */}
      <div className="rounded-2xl bg-[#030814]/90 border border-cyan-500/30 p-4 shadow-[0_0_30px_rgba(6,182,212,0.12)] backdrop-blur-xl relative overflow-hidden flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative w-11 h-11 rounded-xl bg-[#051124] border border-cyan-400/60 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.35)]">
            <Cpu className="w-6 h-6 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-orbitron font-extrabold text-base sm:text-lg text-white tracking-wider">
                CYBER COMMAND CENTER // SEMUA MODUL
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                OMNI-VIEW
              </span>
            </div>
            <p className="text-xs font-mono text-cyan-300/80">
              KONSOL UTAMA AZRYL AI • CHAT INTERAKTIF • REST GATEWAY • DOSSIER ARSITEK
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenIdentity}
            className="px-3 py-1.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-xs font-mono text-cyan-300 hover:text-white flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)]"
          >
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>IDENTITAS VERIFIKASI</span>
          </button>
        </div>
      </div>

      {/* Grid: Left Column (Chat Terminal) & Right Column (API Playground + Dossier) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left: Chat Terminal (7 Columns on large screens) */}
        <div className="lg:col-span-7 flex flex-col h-[650px] sm:h-[700px] lg:h-[750px] xl:h-[780px] max-h-[85vh] rounded-2xl bg-[#030712]/90 border border-cyan-500/35 backdrop-blur-xl shadow-[0_0_35px_rgba(6,182,212,0.18)] relative overflow-hidden">
          {/* Header inside chat container */}
          <div className="p-3 border-b border-cyan-950 bg-[#040a17]/95 flex items-center justify-between text-xs font-mono shrink-0">
            <div className="flex items-center gap-2 text-cyan-300">
              <Bot className="w-4 h-4 text-cyan-400" />
              <span className="font-bold font-orbitron">TERMINAL INTERAKTIF AZRYL</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              ONLINE & SIAP
            </span>
          </div>

          <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden">
            <ChatView
              messages={messages}
              isLoading={isLoading}
              onSendMessage={onSendMessage}
              onClearChat={onClearChat}
              configStatus={configStatus}
              isEmbedded={true}
            />
          </div>
        </div>

        {/* Right: Telemetry, API Tester & Developer Card (5 Columns) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Developer Dossier Card */}
          <div className="rounded-2xl bg-[#040a16]/90 border border-cyan-500/30 p-4 shadow-[0_0_25px_rgba(6,182,212,0.1)] backdrop-blur-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-3 border-b border-cyan-950 pb-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <h3 className="font-orbitron text-xs sm:text-sm font-bold text-white tracking-wider">
                  ARSITEK & DEVELOPER // PROFIL RESMI
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/25">
                VERIFIED
              </span>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-[#02050e] border border-cyan-500/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-cyan-400 block">PENCIPTA / DEVELOPER</span>
                  <span className="text-white font-bold text-sm">AZRYL</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 text-[11px] border border-cyan-500/30">
                  Web Developer
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#02050e] border border-cyan-500/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-pink-400 block">MEDIA SOSIAL RESMI</span>
                  <span className="text-white font-bold flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-pink-400" />
                    TikTok: @AZRYL
                  </span>
                </div>
                <a
                  href="https://www.tiktok.com/@azryl"
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 text-[11px] border border-pink-500/40 flex items-center gap-1 transition-all"
                >
                  <span>Buka Profil</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="p-2.5 rounded-xl bg-[#02050e] border border-cyan-500/20">
                <span className="text-[10px] text-cyan-400 block mb-1">ATRIBUT AI ASSISTANT</span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Nama Resmi: <strong className="text-cyan-300">azrylasissten</strong>. Diciptakan dengan kepribadian sopan, ramah, dan berpengetahuan luas seputar pemrograman, web development, dan sains komputasi.
                </p>
              </div>
            </div>
          </div>

          {/* Live REST API Playground Mini Console */}
          <div className="rounded-2xl bg-[#040a16]/90 border border-cyan-500/30 p-4 shadow-[0_0_25px_rgba(6,182,212,0.1)] backdrop-blur-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-3 border-b border-cyan-950 pb-2">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <h3 className="font-orbitron text-xs sm:text-sm font-bold text-white tracking-wider">
                  LIVE REST API GATEWAY // TESTER
                </h3>
              </div>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                POST /api/chat
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                  Uji Kirim Pesan (JSON Body)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                    placeholder="Ketik pesan..."
                    className="flex-1 bg-[#02050e] border border-cyan-500/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    onClick={handleTestApi}
                    disabled={isTesting || !testInput.trim()}
                    className="px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold disabled:opacity-40 flex items-center gap-1 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                  >
                    {isTesting ? '...' : <Send className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Response output */}
              <div>
                <div className="flex items-center justify-between mb-1 text-[10px] text-slate-400">
                  <span>RESPONS LANGSUNG:</span>
                  {testOutput && (
                    <button
                      onClick={() => handleCopy(testOutput)}
                      className="text-cyan-400 hover:text-cyan-200 flex items-center gap-1"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Tersalin' : 'Salin JSON'}</span>
                    </button>
                  )}
                </div>
                <div className="p-2.5 rounded-lg bg-[#02050e] border border-cyan-500/20 max-h-48 overflow-y-auto">
                  {testOutput ? (
                    <pre className="text-[11px] text-emerald-400 whitespace-pre-wrap">
                      {testOutput}
                    </pre>
                  ) : (
                    <p className="text-[11px] text-slate-500 italic">
                      Klik tombol kirim di atas untuk menguji respons REST API secara instan...
                    </p>
                  )}
                </div>
              </div>

              {/* cURL Snippet */}
              <div className="p-2.5 rounded-lg bg-[#02050e] border border-slate-800">
                <span className="text-[10px] text-cyan-400 block mb-1">CONTOH cURL TERMINAL:</span>
                <code className="text-[10px] text-slate-300 block select-all overflow-x-auto whitespace-pre">
                  {`curl -X POST /api/chat -H "Content-Type: application/json" -d '{"message":"kamu siapa?"}'`}
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
