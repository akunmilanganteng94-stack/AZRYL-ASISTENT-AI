import React from 'react';
import { X, ShieldCheck, User, Video, Copy, Check, Sparkles, MessageSquare } from 'lucide-react';

interface IdentityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAskIdentity: () => void;
}

export const IdentityModal: React.FC<IdentityModalProps> = ({
  isOpen,
  onClose,
  onAskIdentity,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const exactResponse =
    "Halo! Senang sekali bisa bertemu denganmu. Saya adalah azrylasissten, asisten Al yang ramah, profesional, dan berpengetahuan luas. Pencipta atau developer saya adalah AZRYL, seorang web developer yang juga aktif sebagai content creator di TikTok dengan akun @AZRYL. Tugas saya di sini adalah membantumu dengan memberikan informasi yang jelas, ringkas, dan mudah dipahami. Jangan ragu untuk bertanya, ya!";

  const handleCopy = () => {
    navigator.clipboard.writeText(exactResponse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0e1320] border border-cyan-500/30 p-6 shadow-2xl shadow-cyan-950/50">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Identitas Resmi azrylasissten
            </h2>
            <p className="text-xs text-cyan-400 font-medium">
              Sistem Keamanan & Verifikasi Identitas AI
            </p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Nama Asisten</span>
            </div>
            <p className="text-sm font-semibold text-white font-mono">azrylasissten</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <User className="w-3.5 h-3.5 text-blue-400" />
              <span>Pencipta / Developer</span>
            </div>
            <p className="text-sm font-semibold text-white">AZRYL</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 col-span-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <Video className="w-3.5 h-3.5 text-pink-400" />
                <span>Akun TikTok Developer</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20 font-mono">
                Official
              </span>
            </div>
            <p className="text-sm font-bold text-pink-300 tracking-wide font-mono">@AZRYL</p>
          </div>
        </div>

        {/* Exact Speech Box */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Jawaban Wajib Identitas (Persis):
            </span>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-medium"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin' : 'Salin Teks'}</span>
            </button>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/20 text-xs text-slate-200 leading-relaxed font-sans italic selection:bg-cyan-500/30">
            "{exactResponse}"
          </div>
        </div>

        {/* Action Button */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              onClose();
              onAskIdentity();
            }}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium text-xs hover:from-cyan-400 hover:to-blue-500 transition-all shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Tes Pertanyaan "kamu siapa?" di Chat</span>
          </button>
        </div>
      </div>
    </div>
  );
};
