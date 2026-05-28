'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Brain, Shield, ArrowRight, Heart, Activity, Lock } from 'lucide-react';

export default function LoginPage() {
  const [name, setName] = useState('');
  const [step, setStep] = useState<'name' | 'terms'>('name');
  const [agreed, setAgreed] = useState(false);
  const router = useRouter();

  function handleContinue() {
    if (!name.trim()) return;
    if (step === 'name') {
      setStep('terms');
      return;
    }
    if (!agreed) return;
    localStorage.setItem('mindai_user', JSON.stringify({ name: name.trim(), joinedAt: Date.now() }));
    router.push('/dashboard');
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleContinue();
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden flex items-center justify-center">
      {/* Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[140px] animate-orb-float" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-fuchsia-600/15 rounded-full blur-[140px] animate-orb-float-reverse" />

      <div className="relative w-full max-w-md mx-auto px-6">

        {/* Logo */}
        <div className="flex flex-col items-center mb-10 animate-fade-up">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center mb-4 shadow-[0_0_40px_rgba(139,92,246,0.4)]">
            <Brain className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold">MindAI</h1>
          <p className="text-white/50 text-sm mt-1">Assistente terapêutico baseado em TCC</p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 animate-fade-up [animation-delay:150ms]">

          {step === 'name' && (
            <>
              <h2 className="text-xl font-semibold mb-2">Bem-vindo(a)</h2>
              <p className="text-white/50 text-sm mb-6">Como posso te chamar?</p>
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Seu primeiro nome"
                    spellCheck={false}
                    autoFocus
                    maxLength={32}
                    className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500/60 focus:bg-white/[0.08] placeholder:text-white/30 transition-all duration-200"
                  />
                </div>
                <button
                  onClick={handleContinue}
                  disabled={!name.trim()}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-30 disabled:cursor-not-allowed font-medium transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(139,92,246,0.4)] group"
                >
                  Continuar
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </div>
            </>
          )}

          {step === 'terms' && (
            <>
              <h2 className="text-xl font-semibold mb-2">Antes de começar, {name}</h2>
              <p className="text-white/50 text-sm mb-6">Leia com atenção:</p>

              <div className="space-y-3 mb-6">
                {[
                  {
                    icon: Heart,
                    color: 'text-rose-400',
                    bg: 'bg-rose-500/10',
                    title: 'Suporte complementar',
                    desc: 'O MindAI não substitui psicólogos ou psiquiatras. Em caso de crise, procure ajuda profissional.',
                  },
                  {
                    icon: Activity,
                    color: 'text-violet-400',
                    bg: 'bg-violet-500/10',
                    title: 'Triagem clínica',
                    desc: 'As escalas PHQ-9 e GAD-7 são instrumentos de triagem, não diagnóstico clínico.',
                  },
                  {
                    icon: Lock,
                    color: 'text-emerald-400',
                    bg: 'bg-emerald-500/10',
                    title: 'Seus dados são protegidos',
                    desc: 'Informações criptografadas com AES-256-GCM em conformidade com a LGPD.',
                  },
                  {
                    icon: Shield,
                    color: 'text-fuchsia-400',
                    bg: 'bg-fuchsia-500/10',
                    title: 'Protocolo de crise',
                    desc: 'Sinais de risco ativam encaminhamento imediato para o CVV (188) e SAMU (192).',
                  },
                ].map((item, i) => (
                  <div
                    key={item.title}
                    style={{ animationDelay: `${i * 80}ms` }}
                    className="animate-slide-right flex gap-3 p-3 rounded-xl border border-white/5 bg-white/[0.02]"
                  >
                    <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center shrink-0`}>
                      <item.icon className={`w-4 h-4 ${item.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-white/50 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <label className="flex items-start gap-3 cursor-pointer mb-5 group">
                <div
                  onClick={() => setAgreed(!agreed)}
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200 ${
                    agreed
                      ? 'bg-violet-500 border-violet-500'
                      : 'border-white/30 group-hover:border-violet-400'
                  }`}
                >
                  {agreed && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-white/70 leading-relaxed">
                  Entendo que o MindAI é um suporte complementar e não substitui atendimento profissional de saúde mental.
                </span>
              </label>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('name')}
                  className="px-4 py-3 rounded-xl border border-white/10 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all duration-200"
                >
                  Voltar
                </button>
                <button
                  onClick={handleContinue}
                  disabled={!agreed}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-30 disabled:cursor-not-allowed font-medium transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(139,92,246,0.4)] group"
                >
                  Entrar no MindAI
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-2 mt-6 animate-fade-up [animation-delay:300ms]">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs text-white/40">Conforme LGPD · Criptografia AES-256-GCM</span>
        </div>
      </div>
    </div>
  );
}
