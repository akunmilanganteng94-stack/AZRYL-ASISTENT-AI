import React, { useState } from 'react';
import { Cpu, ShieldCheck, Zap, Activity, Sparkles, Terminal, ChevronDown, ChevronUp, Radio } from 'lucide-react';
import { ConfigStatus } from '../types';

interface HolographicCoreProps {
  configStatus: ConfigStatus | null;
  onOpenIdentity: () => void;
}

export const HolographicCore: React.FC<HolographicCoreProps> = ({
  configStatus,
  onOpenIdentity,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative mb-4 sm:mb-5 rounded-2xl bg-[#040814]/85 border border-cyan-500/30 backdrop-blur-2xl shadow-[0_0_35px_rgba(6,182,212,0.15)] overflow-hidden transition-all">
      {/* Sci-Fi glowing corners */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400 pointer-events-none" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400 pointer-events-none" />

      {/* Holographic scanner laser line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />

      {/* Main HUD Bar */}
      <div className="p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-3">
        {/* Holographic AI Avatar & Title */}
        <div className="flex items-center gap-3.5">
          {/* Animated 3D-like Gyroscope Hologram Icon */}
          <div className="relative w-11 h-11 rounded-xl bg-[#020610] border border-cyan-500/50 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.35)] group cursor-pointer" onClick={onOpenIdentity} title="Klik untuk verifikasi identitas resmi">
            {/* Spinning orbital rings */}
            <div className="absolute inset-0 rounded-xl border border-cyan-400/40 animate-[spin_8s_linear_infinite]" />
            <div className="absolute inset-1 rounded-lg border border-blue-500/30 animate-[spin_6s_linear_infinite_reverse]" />
            <Cpu className="w-5 h-5 text-cyan-300 relative z-10 transition-transform group-hover:scale-110" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-orbitron text-sm sm:text-base font-extrabold tracking-wider bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
                AZRYL // QUANTUM NEURAL CORE
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                v4.8-PRO
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
              <span className="text-cyan-400 font-semibold flex items-center gap-1">
                <Radio className="w-3 h-3 animate-pulse" />
                azrylasissten
              </span>
              <span className="text-slate-600">•</span>
              <span>ARCHITECT: <strong className="text-cyan-300">AZRYL (@AZRYL)</strong></span>
            </div>
          </div>
        </div>

        {/* Telemetry chips & toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#030814] border border-cyan-500/25 text-[11px] font-mono text-slate-300">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>NEURAL STREAM:</span>
            <span className="text-emerald-400 font-bold">STABLE</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#030814] border border-cyan-500/25 text-[11px] font-mono text-cyan-300">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>MODEL: {configStatus?.model || 'Quantum Flash'}</span>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#061224] hover:bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300 transition-all hover:border-cyan-400"
          >
            <span>{isExpanded ? 'MINIMIZE HUD' : 'SYSTEM TELEMETRY'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded Sci-Fi Telemetry Panel */}
      {isExpanded && (
        <div className="p-3.5 sm:p-4 border-t border-cyan-950/80 bg-[#02050e]/90 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono animate-in fade-in duration-200">
          <div className="p-2.5 rounded-xl bg-[#050c18] border border-cyan-500/20">
            <span className="text-[10px] text-cyan-400 block mb-0.5">AGENT PROTOCOL</span>
            <span className="text-white font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              azrylasissten
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#050c18] border border-cyan-500/20">
            <span className="text-[10px] text-cyan-400 block mb-0.5">CHIEF ARCHITECT</span>
            <span className="text-white font-semibold flex items-center gap-1">
              <Terminal className="w-3 h-3 text-cyan-400" />
              AZRYL (@AZRYL)
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#050c18] border border-cyan-500/20">
            <span className="text-[10px] text-cyan-400 block mb-0.5">SECURITY CIPHER</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              QUANTUM TLS-v1.3
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#050c18] border border-cyan-500/20">
            <span className="text-[10px] text-cyan-400 block mb-0.5">ACTIVE MATRIX</span>
            <span className="text-cyan-300 font-semibold truncate block">
              {configStatus?.provider || 'Google Gemini / xAI'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
