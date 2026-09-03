import React from 'react';
import { Bot, Terminal, ShieldCheck, Trash2, Cpu, Sparkles, LayoutGrid, Radio, Zap } from 'lucide-react';
import { ConfigStatus, TabMode } from '../types';

interface NavbarProps {
  activeTab: TabMode;
  setActiveTab: (tab: TabMode) => void;
  onClearChat: () => void;
  onOpenIdentity: () => void;
  configStatus: ConfigStatus | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onClearChat,
  onOpenIdentity,
  configStatus,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyan-500/25 bg-[#02050e]/90 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
      {/* Top holographic laser scanner line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-90" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3">
        {/* Brand & AI Identity */}
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer" onClick={onOpenIdentity} title="Klik untuk verifikasi identitas resmi">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 opacity-40 blur group-hover:opacity-75 transition duration-500" />
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-[#030814] border border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.35)]">
              <Bot className="w-5 h-5 text-cyan-300 transition-transform group-hover:scale-110" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-orbitron font-black text-base sm:text-lg tracking-wider bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
                AZRYL AI
              </h1>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                CYBER-OS
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
              <span>CORE:</span>
              <span className="text-cyan-300 font-bold">azrylasissten</span>
              <span className="text-slate-600">•</span>
              <span>DEV: <strong className="text-pink-400 font-semibold">@AZRYL</strong></span>
            </p>
          </div>
        </div>

        {/* Navigation & Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Status telemetry pill */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#040c1a] border border-cyan-500/25 text-[11px] font-mono text-cyan-200 shadow-inner">
            <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span className="text-slate-400 text-[10px]">ENGINE:</span>
            <span className="font-bold text-cyan-300">{configStatus?.model || 'Quantum'}</span>
          </div>

          {/* Futuristic View Mode Tabs */}
          <div className="flex items-center bg-[#040a14] p-1 rounded-xl border border-cyan-500/30 shadow-inner">
            <button
              id="nav-all-btn"
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'all'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] border border-cyan-300/40'
                  : 'text-slate-400 hover:text-cyan-300'
              }`}
              title="Tampilkan semua tampilan sekaligus (All-in-One Dashboard)"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">SEMUA</span>
              <span className="sm:hidden">ALL</span>
            </button>

            <button
              id="nav-chat-btn"
              onClick={() => setActiveTab('chat')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'chat'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] border border-cyan-300/40'
                  : 'text-slate-400 hover:text-cyan-300'
              }`}
              title="Fokus ke Konsol Percakapan AI"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>CHAT</span>
            </button>

            <button
              id="nav-docs-btn"
              onClick={() => setActiveTab('docs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'docs'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] border border-cyan-300/40'
                  : 'text-slate-400 hover:text-cyan-300'
              }`}
              title="Dokumentasi & Live REST API Playground"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>API</span>
            </button>
          </div>

          {/* Identity Dossier Trigger */}
          <button
            id="nav-identity-btn"
            onClick={onOpenIdentity}
            title="Informasi Resmi Identitas azrylasissten"
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-[#040c1a] border border-cyan-500/30 text-slate-300 hover:text-cyan-300 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all text-xs font-mono flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span className="hidden md:inline font-semibold">VERIFIKASI ID</span>
          </button>

          {/* Clear Buffer Trigger */}
          <button
            id="nav-clear-chat-btn"
            onClick={onClearChat}
            title="Bersihkan buffer percakapan"
            className="p-2 rounded-xl bg-[#040c1a] border border-cyan-500/20 text-slate-400 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
