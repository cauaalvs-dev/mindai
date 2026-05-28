'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Brain, Shield, AlertOctagon, Phone, Heart, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface CrisisContact {
  label: string;
  phone: string;
  detail: string;
}

interface ChatApiResponse {
  status: 'OK' | 'CRISIS' | 'ERROR';
  message: string;
  contacts?: CrisisContact[];
  lockChat?: boolean;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Olá. Eu sou o MindAI, seu assistente terapêutico baseado em TCC. Como você está se sentindo hoje? Lembre-se: este é um espaço seguro.',
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [crisisContacts, setCrisisContacts] = useState<CrisisContact[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || isLoading || isLocked) return;

    const userMessage: Message = { role: 'user', content: trimmed, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, history: messages }),
      });
      const data = (await res.json()) as ChatApiResponse;

      if (data.status === 'CRISIS') {
        setIsLocked(true);
        setCrisisContacts(data.contacts ?? []);
        setMessages((prev) => [...prev, { role: 'assistant', content: data.message, timestamp: Date.now() }]);
        return;
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: data.message, timestamp: Date.now() }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Desculpe, tive um problema técnico. Pode tentar novamente?',
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col relative overflow-hidden">
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-[140px]" />

      <header className="relative border-b border-white/5 backdrop-blur-xl bg-black/30 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-white/40 hover:text-white transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold">MindAI Therapist</p>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Conectado · TCC v1
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs text-emerald-300">Criptografado E2E</span>
          </div>
        </div>
      </header>

      <main ref={scrollRef} className="flex-1 overflow-y-auto relative">
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shrink-0">
                  <Brain className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[75%] rounded-2xl px-5 py-3 ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white'
                    : 'bg-white/[0.04] border border-white/10 text-white/90'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <Brain className="w-4 h-4" />
              </div>
              <div className="bg-white/[0.04] border border-white/10 rounded-2xl px-5 py-3 flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 rounded-full bg-white/40 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          )}
        </div>
      </main>

      {!isLocked && (
        <footer className="relative border-t border-white/5 backdrop-blur-xl bg-black/30">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-end gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Compartilhe o que está sentindo..."
                rows={1}
                spellCheck={false}
                className="flex-1 bg-transparent resize-none px-3 py-2 text-sm focus:outline-none placeholder:text-white/30 max-h-32"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition shrink-0"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-white/30 mt-2 text-center">
              MindAI não substitui acompanhamento profissional. Dados criptografados em conformidade com LGPD.
            </p>
          </div>
        </footer>
      )}

      {isLocked && (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-red-950/95 via-red-900/95 to-black/95 backdrop-blur-xl flex items-center justify-center p-6 animate-fade-in">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.15),transparent_70%)] pointer-events-none" />
          <div className="relative max-w-2xl w-full">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center animate-pulse">
                <AlertOctagon className="w-10 h-10 text-red-400" />
              </div>
            </div>
            <div className="text-center mb-8">
              <p className="text-xs uppercase tracking-[0.3em] text-red-400 mb-3">Protocolo de Crise Ativado</p>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Você não está sozinho(a).</h1>
              <p className="text-red-100/80 leading-relaxed max-w-md mx-auto">
                Detectamos que você pode estar passando por um momento muito difícil. Por favor, fale com alguém agora —
                ajuda profissional está a um telefonema de distância.
              </p>
            </div>
            <div className="space-y-3 mb-6">
              {crisisContacts.map((contact) => (
                <a
                  key={contact.label}
                  href={contact.phone.startsWith('1') ? `tel:${contact.phone}` : '#'}
                  className="flex items-center gap-4 rounded-2xl border-2 border-red-500/40 bg-red-950/40 hover:bg-red-900/60 hover:border-red-400 p-5 transition group"
                >
                  <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center group-hover:bg-red-500/40 transition">
                    <Phone className="w-5 h-5 text-red-300" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-white">{contact.label}</p>
                    <p className="text-sm text-red-200/70">{contact.detail}</p>
                  </div>
                  <p className="text-2xl font-bold text-red-300 tracking-wider">{contact.phone}</p>
                </a>
              ))}
            </div>
            <div className="flex items-center justify-center gap-2 text-red-200/60 text-sm">
              <Heart className="w-4 h-4" /> Sua vida importa. Procure ajuda agora.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
