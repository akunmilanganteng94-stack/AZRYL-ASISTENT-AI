/**
 * AZRYL AI
 * AI Assistant: azrylasissten
 * Developer: AZRYL (TikTok: @AZRYL)
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ChatView } from './components/ChatView';
import { ApiDocsView } from './components/ApiDocsView';
import { AllInOneView } from './components/AllInOneView';
import { IdentityModal } from './components/IdentityModal';
import { FuturisticCanvasBackground } from './components/FuturisticCanvasBackground';
import { Message, ConfigStatus, TabMode } from './types';

const INITIAL_MESSAGE: Message = {
  id: 'welcome-1',
  role: 'assistant',
  content: `Halo! Saya adalah **azrylasissten**, asisten AI yang ramah, profesional, dan berpengetahuan luas. Pencipta atau developer saya adalah **AZRYL** (@AZRYL di TikTok).

Saya siap membantu Anda dengan:
- 💻 **Bantuan Coding & Debugging Error**
- 🌐 **Perancangan Ide & Konsep Website Modern**
- ✍️ **Penulisan, Perbaikan & Analisis Teks**
- 🧠 **Penalaran & Pemecahan Masalah Komputasi**

Silakan ajukan pertanyaan Anda atau klik salah satu rekomendasi di bawah ini!`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

export default function App() {
  const [activeTab, setActiveTab] = useState<TabMode>('all');
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isIdentityModalOpen, setIsIdentityModalOpen] = useState<boolean>(false);
  const [configStatus, setConfigStatus] = useState<ConfigStatus | null>(null);
  const [sessionId, setSessionId] = useState<string>(() => {
    return 'session_' + Math.random().toString(36).substring(2, 9);
  });

  // Fetch API config status on mount
  useEffect(() => {
    fetch('/api/config-status')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setConfigStatus(data);
        }
      })
      .catch((err) => console.log('Config status notice:', err));
  }, []);

  // Send message handler
  const handleSendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: trimmed,
          sessionId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage: Message = {
          id: `msg-${Date.now()}-ai`,
          role: 'assistant',
          content: data.message,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        if (data.sessionId) {
          setSessionId(data.sessionId);
        }
      } else {
        const errorMessage: Message = {
          id: `msg-${Date.now()}-err`,
          role: 'assistant',
          content: data.error || 'Terjadi kesalahan saat berkomunikasi dengan server.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true,
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (err: any) {
      const errorMessage: Message = {
        id: `msg-${Date.now()}-err`,
        role: 'assistant',
        content:
          'Gagal menghubungi backend AZRYL AI. Pastikan server aktif dan koneksi internet stabil.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear chat handler
  const handleClearChat = async () => {
    try {
      await fetch('/api/chat/clear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });
    } catch (e) {
      // Non-blocking
    }
    const newSession = 'session_' + Math.random().toString(36).substring(2, 9);
    setSessionId(newSession);
    setMessages([
      {
        ...INITIAL_MESSAGE,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-[#02050e] text-slate-100 flex flex-col relative overflow-hidden selection:bg-cyan-500/25 selection:text-cyan-200">
      {/* Interactive Quantum Particle Canvas */}
      <FuturisticCanvasBackground />

      {/* Cyber Grid & Atmospheric Orbital Glows */}
      <div className="fixed inset-0 cyber-grid opacity-70 pointer-events-none" />
      <div className="fixed top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[600px] h-[500px] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="fixed top-[40%] left-[-10%] w-[500px] h-[400px] bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="fixed inset-0 scanline-overlay pointer-events-none opacity-30" />

      {/* Futuristic Cyber-HUD Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onClearChat={handleClearChat}
        onOpenIdentity={() => setIsIdentityModalOpen(true)}
        configStatus={configStatus}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative z-10">
        {activeTab === 'all' && (
          <AllInOneView
            messages={messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            onClearChat={handleClearChat}
            configStatus={configStatus}
            onOpenIdentity={() => setIsIdentityModalOpen(true)}
          />
        )}

        {activeTab === 'chat' && (
          <ChatView
            messages={messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            onClearChat={handleClearChat}
            configStatus={configStatus}
          />
        )}

        {activeTab === 'docs' && <ApiDocsView />}
      </main>

      {/* Identity Verification Modal */}
      <IdentityModal
        isOpen={isIdentityModalOpen}
        onClose={() => setIsIdentityModalOpen(false)}
        onAskIdentity={() => {
          setIsIdentityModalOpen(false);
          handleSendMessage('kamu siapa?');
        }}
      />
    </div>
  );
}
