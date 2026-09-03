import React, { useState } from 'react';
import { Terminal, Play, Copy, Check, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { ApiDocEndpoint } from '../types';

const ENDPOINTS: ApiDocEndpoint[] = [
  {
    id: 'status',
    method: 'GET',
    path: '/',
    title: 'Status API AZRYL AI',
    description: 'Mengembalikan status operasional API AZRYL AI, nama asisten, dan developer.',
    curlSnippet: `curl -X GET http://localhost:3000/ -H "Accept: application/json"`,
    responseExample: `{
  "success": true,
  "name": "AZRYL AI",
  "assistant": "azrylasissten",
  "developer": "AZRYL",
  "status": "online"
}`
  },
  {
    id: 'identity',
    method: 'GET',
    path: '/api/identity',
    title: 'Informasi Identitas azrylasissten',
    description: 'Mengembalikan data identitas lengkap azrylasissten, akun TikTok developer @AZRYL, dan respons identitas wajib.',
    curlSnippet: `curl -X GET http://localhost:3000/api/identity`,
    responseExample: `{
  "success": true,
  "name": "azrylasissten",
  "developer": "AZRYL",
  "tiktok": "@AZRYL",
  "role": "Asisten AI yang ramah, profesional, dan berpengetahuan luas",
  "exact_response": "Halo! Senang sekali bisa bertemu denganmu. Saya adalah azrylasissten, asisten Al yang ramah, profesional, dan berpengetahuan luas. Pencipta atau developer saya adalah AZRYL, seorang web developer yang juga aktif sebagai content creator di TikTok dengan akun @AZRYL. Tugas saya di sini adalah membantumu dengan memberikan informasi yang jelas, ringkas, dan mudah dipahami. Jangan ragu untuk bertanya, ya!",
  "description": "Asisten AI resmi yang dikembangkan oleh AZRYL (@AZRYL)."
}`
  },
  {
    id: 'chat-identity',
    method: 'POST',
    path: '/api/chat',
    title: 'Chat AI - Tanya Identitas',
    description: 'Mengirim pesan pertanyaan identitas. Backend otomatis memprioritaskan dan mengembalikan jawaban identitas persis tanpa perlu API key eksternal.',
    requestBodyExample: `{
  "message": "Halo, kamu siapa?"
}`,
    curlSnippet: `curl -X POST http://localhost:3000/api/chat \\
  -H "Content-Type: application/json" \\
  -d '{"message": "Halo, kamu siapa?"}'`,
    responseExample: `{
  "success": true,
  "message": "Halo! Senang sekali bisa bertemu denganmu. Saya adalah azrylasissten, asisten Al yang ramah, profesional, dan berpengetahuan luas. Pencipta atau developer saya adalah AZRYL, seorang web developer yang juga aktif sebagai content creator di TikTok dengan akun @AZRYL. Tugas saya di sini adalah membantumu dengan memberikan informasi yang jelas, ringkas, dan mudah dipahami. Jangan ragu untuk bertanya, ya!",
  "sessionId": "session_123456"
}`
  },
  {
    id: 'chat-general',
    method: 'POST',
    path: '/api/chat',
    title: 'Chat AI - Percakapan Cerdas (Grok/xAI)',
    description: 'Mengirim pesan umum atau coding ke azrylasissten dengan dukungan memori percakapan multi-turn.',
    requestBodyExample: `{
  "message": "Bantu buatkan ide fitur website modern untuk developer portfolio",
  "sessionId": "session_optional_123"
}`,
    curlSnippet: `curl -X POST http://localhost:3000/api/chat \\
  -H "Content-Type: application/json" \\
  -d '{"message": "Bantu buatkan ide fitur website modern untuk developer portfolio"}'`,
    responseExample: `{
  "success": true,
  "message": "Tentu! Berikut beberapa ide fitur inovatif untuk portfolio developer...",
  "sessionId": "session_123"
}`
  }
];

export const ApiDocsView: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiDocEndpoint>(ENDPOINTS[0]);
  const [testPayload, setTestPayload] = useState<string>(selectedEndpoint.requestBodyExample || '');
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSelect = (endpoint: ApiDocEndpoint) => {
    setSelectedEndpoint(endpoint);
    setTestPayload(endpoint.requestBodyExample || '');
    setTestResult(null);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const executeLiveTest = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      const startTime = performance.now();
      let res: Response;

      if (selectedEndpoint.method === 'GET') {
        res = await fetch(selectedEndpoint.path, {
          headers: { Accept: 'application/json' },
        });
      } else {
        let bodyObj = {};
        try {
          bodyObj = JSON.parse(testPayload);
        } catch {
          setTestResult(JSON.stringify({ error: 'Format JSON pada Request Body tidak valid' }, null, 2));
          setIsLoading(false);
          return;
        }

        res = await fetch(selectedEndpoint.path, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyObj),
        });
      }

      const duration = Math.round(performance.now() - startTime);
      const data = await res.json();

      setTestResult(
        JSON.stringify(
          {
            _meta: {
              status: `${res.status} ${res.statusText}`,
              latency: `${duration}ms`,
            },
            ...data,
          },
          null,
          2
        )
      );
    } catch (err: any) {
      setTestResult(
        JSON.stringify(
          {
            error: 'Gagal mengeksekusi request ke server.',
            details: err?.message || String(err),
          },
          null,
          2
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header Info */}
      <div className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-950 border border-cyan-500/20 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                REST API Specs
              </span>
              <span className="text-xs text-slate-400">Node.js Express + Grok (xAI)</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Dokumentasi API AZRYL AI</h2>
            <p className="text-sm text-slate-300 mt-1">
              Panduan integrasi endpoint lengkap untuk berkomunikasi dengan asisten AI{' '}
              <strong className="text-cyan-300">azrylasissten</strong>.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Base URL: http://localhost:3000
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Endpoint List Sidebar */}
        <div className="lg:col-span-4 space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1 mb-2">
            Daftar Endpoint
          </h3>
          {ENDPOINTS.map((ep) => {
            const isSelected = selectedEndpoint.id === ep.id;
            return (
              <button
                key={ep.id}
                onClick={() => handleSelect(ep)}
                className={`w-full text-left p-3.5 rounded-xl transition-all border flex items-start justify-between gap-2 ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-500/40 shadow-lg shadow-cyan-950/30'
                    : 'bg-slate-900/40 border-slate-800/60 hover:bg-slate-800/50 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                        ep.method === 'GET'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}
                    >
                      {ep.method}
                    </span>
                    <span className="font-mono text-xs text-white font-medium">{ep.path}</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{ep.title}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Endpoint Detail & Live Tester */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-white/10 shadow-xl space-y-5">
            {/* Title & Badge */}
            <div className="flex items-center justify-between flex-wrap gap-2 pb-4 border-b border-white/5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded font-mono ${
                      selectedEndpoint.method === 'GET'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}
                  >
                    {selectedEndpoint.method}
                  </span>
                  <span className="font-mono text-base font-semibold text-white">
                    {selectedEndpoint.path}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-white">{selectedEndpoint.title}</h4>
                <p className="text-xs text-slate-300 mt-1">{selectedEndpoint.description}</p>
              </div>

              <button
                onClick={executeLiveTest}
                disabled={isLoading}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium text-xs hover:from-cyan-400 hover:to-blue-500 transition-all flex items-center gap-1.5 shadow-md shadow-cyan-500/20 disabled:opacity-50"
              >
                {isLoading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-white" />
                )}
                <span>{isLoading ? 'Mengirim...' : 'Tes Langsung'}</span>
              </button>
            </div>

            {/* Request Body (If POST) */}
            {selectedEndpoint.method === 'POST' && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Request Payload (JSON):
                </label>
                <textarea
                  rows={4}
                  value={testPayload}
                  onChange={(e) => setTestPayload(e.target.value)}
                  className="w-full font-mono text-xs p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-cyan-300 focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            )}

            {/* cURL Snippet */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  cURL Command
                </span>
                <button
                  onClick={() => handleCopy(selectedEndpoint.curlSnippet, 'curl')}
                  className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white"
                >
                  {copiedId === 'curl' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedId === 'curl' ? 'Tersalin' : 'Salin cURL'}</span>
                </button>
              </div>
              <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto">
                {selectedEndpoint.curlSnippet}
              </pre>
            </div>

            {/* Live Response Result or Example */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  {testResult ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-cyan-400" />
                  )}
                  {testResult ? 'Hasil Response Live Server' : 'Contoh Response'}
                </span>
                {testResult && (
                  <button
                    onClick={() => handleCopy(testResult, 'res')}
                    className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white"
                  >
                    {copiedId === 'res' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedId === 'res' ? 'Tersalin' : 'Salin Response'}</span>
                  </button>
                )}
              </div>
              <pre className="p-4 rounded-xl bg-[#07090e] border border-cyan-500/20 font-mono text-xs text-cyan-200 overflow-x-auto max-h-80 selection:bg-cyan-500/30">
                {testResult || selectedEndpoint.responseExample}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
