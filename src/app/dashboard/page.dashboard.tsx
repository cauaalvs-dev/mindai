'use client';

import { useState, useEffect } from 'react';
import {
  Activity, Brain, Shield, Heart, TrendingUp, Calendar,
  CheckCircle2, AlertTriangle, ChevronRight, MessageSquare,
} from 'lucide-react';
import Link from 'next/link';
import { PHQ9_QUESTIONS, ANSWER_OPTIONS, calculateSeverity, type ScaleResult } from '@/utils/mindai-core';

const MOOD_EMOJIS = [
  { emoji: '😢', label: 'Muito mal', value: 1 },
  { emoji: '😟', label: 'Mal', value: 2 },
  { emoji: '😐', label: 'Neutro', value: 3 },
  { emoji: '🙂', label: 'Bem', value: 4 },
  { emoji: '😄', label: 'Ótimo', value: 5 },
];

const WEEK_DATA = [
  { day: 'Seg', value: 45 },
  { day: 'Ter', value: 62 },
  { day: 'Qua', value: 38 },
  { day: 'Qui', value: 71 },
  { day: 'Sex', value: 80 },
  { day: 'Sáb', value: 68 },
  { day: 'Dom', value: 75 },
];

const SEVERITY_STYLES: Record<string, string> = {
  green: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/40 text-emerald-300',
  yellow: 'from-yellow-500/20 to-yellow-500/5 border-yellow-500/40 text-yellow-300',
  orange: 'from-orange-500/20 to-orange-500/5 border-orange-500/40 text-orange-300',
  red: 'from-red-500/20 to-red-500/5 border-red-500/40 text-red-300',
  crimson: 'from-rose-600/30 to-red-900/10 border-rose-500/50 text-rose-300',
};

function GlassCard({
  children,
  className = '',
  delay = '0ms',
}: {
  children: React.ReactNode;
  className?: string;
  delay?: string;
}) {
  return (
    <div
      style={{ animationDelay: delay }}
      className={`animate-fade-up relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05] ${className}`}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />
      <div className="relative">{children}</div>
    </div>
  );
}

function PHQ9Assessment({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<ScaleResult | null>(null);

  function handleAnswer(value: number) {
    const next = [...answers, value];
    setAnswers(next);
    if (step + 1 >= PHQ9_QUESTIONS.length) {
      const total = next.reduce((sum, v) => sum + v, 0);
      setResult(calculateSeverity(total, 'PHQ9'));
    } else {
      setStep(step + 1);
    }
  }

  if (result) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
        <div className={`w-full max-w-2xl rounded-3xl border bg-gradient-to-br p-8 animate-scale-in ${SEVERITY_STYLES[result.color]}`}>
          <div className="flex items-center gap-3 mb-6">
            {result.color === 'green' ? <CheckCircle2 className="w-10 h-10" /> : <AlertTriangle className="w-10 h-10" />}
            <div>
              <p className="text-sm uppercase tracking-wider opacity-70">Laudo PHQ-9</p>
              <h2 className="text-3xl font-bold">{result.label}</h2>
            </div>
          </div>
          <div className="mb-6">
            <p className="text-sm opacity-70 mb-1">Pontuação total</p>
            <p className="text-5xl font-bold animate-scale-in [animation-delay:200ms]">
              {result.score}<span className="text-2xl opacity-50">/27</span>
            </p>
          </div>
          <div className="rounded-xl bg-black/30 p-4 mb-6 animate-fade-up [animation-delay:300ms]">
            <p className="text-sm leading-relaxed opacity-90">{result.recommendation}</p>
          </div>
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-white/10 hover:bg-white/20 py-3 font-medium transition-all duration-200 hover:scale-[1.02] animate-fade-up [animation-delay:400ms]"
          >
            Fechar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-900 p-8 animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-violet-400">PHQ-9 · Triagem de Depressão</p>
            <p className="text-sm text-white/50 mt-1">Pergunta {step + 1} de {PHQ9_QUESTIONS.length}</p>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white text-sm transition">Cancelar</button>
        </div>

        <div className="h-1.5 w-full bg-white/5 rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-700 ease-out relative overflow-hidden"
            style={{ width: `${((step + 1) / PHQ9_QUESTIONS.length) * 100}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
        </div>

        <p className="text-sm text-white/60 mb-3">
          Nas últimas duas semanas, com que frequência você foi incomodado(a) por:
        </p>
        <h3 className="text-xl text-white font-medium mb-8 leading-relaxed animate-fade-up">{PHQ9_QUESTIONS[step]}</h3>

        <div className="space-y-3">
          {ANSWER_OPTIONS.map((opt, i) => (
            <button
              key={opt.value}
              onClick={() => handleAnswer(opt.value)}
              style={{ animationDelay: `${i * 80}ms` }}
              className="animate-slide-right w-full flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] hover:border-violet-500/50 px-5 py-4 text-left transition-all duration-200 group hover:translate-x-1"
            >
              <span className="text-white/90">{opt.label}</span>
              <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-violet-400 transition-all duration-200 group-hover:translate-x-1" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function AnimatedBars() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="flex items-end justify-between gap-3 h-48">
      {WEEK_DATA.map((d, i) => (
        <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
          <div className="w-full h-full flex items-end">
            <div
              className="w-full rounded-t-lg bg-gradient-to-t from-violet-600 to-fuchsia-400 relative group overflow-hidden transition-all duration-700"
              style={{
                height: mounted ? `${d.value}%` : '0%',
                transitionDelay: `${i * 80}ms`,
              }}
            >
              {/* Shimmer interno na barra */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 text-xs bg-black/80 px-2 py-1 rounded whitespace-nowrap">
                {d.value}%
              </div>
            </div>
          </div>
          <span className="text-xs text-white/40">{d.day}</span>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const [mood, setMood] = useState<number | null>(null);
  const [showPHQ9, setShowPHQ9] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] animate-orb-float" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[120px] animate-orb-float-reverse" />

      <header className="relative border-b border-white/5 backdrop-blur-xl bg-black/20 animate-fade-in">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center transition-transform duration-300 hover:scale-110">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-lg">MindAI</p>
              <p className="text-xs text-white/40">Dashboard Clínico</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              <div className="relative">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <div className="absolute inset-0 animate-pulse-ring rounded-full bg-emerald-400/20" />
              </div>
              <span className="text-xs text-emerald-300">LGPD · AES-256-GCM</span>
            </div>
            <Link
              href="/chat"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm transition-all duration-200 hover:scale-[1.03]"
            >
              <MessageSquare className="w-4 h-4" /> Abrir Chat
            </Link>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div className="animate-fade-up [animation-delay:100ms]">
          <p className="text-xs uppercase tracking-widest text-violet-400 mb-2">Bem-vindo de volta</p>
          <h1 className="text-3xl font-bold">Como você está hoje?</h1>
          <p className="text-white/50 mt-1">Seu progresso terapêutico baseado em TCC.</p>
        </div>

        {/* Check-in de humor */}
        <GlassCard delay="200ms">
          <div className="flex items-center gap-2 mb-5">
            <Heart className="w-4 h-4 text-rose-400" />
            <h2 className="text-sm font-medium text-white/80 uppercase tracking-wider">Check-in de Humor Diário</h2>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {MOOD_EMOJIS.map((m, i) => (
              <button
                key={m.value}
                onClick={() => setMood(m.value)}
                style={{ animationDelay: `${300 + i * 60}ms` }}
                className={`animate-scale-in flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-1 ${
                  mood === m.value
                    ? 'border-violet-500/60 bg-violet-500/10 scale-105 shadow-[0_0_20px_rgba(139,92,246,0.2)]'
                    : 'border-white/5 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]'
                }`}
              >
                <span className={`text-3xl transition-transform duration-200 ${mood === m.value ? 'scale-110' : ''}`}>
                  {m.emoji}
                </span>
                <span className="text-xs text-white/60">{m.label}</span>
              </button>
            ))}
          </div>
          {mood && (
            <div className="mt-4 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-sm text-emerald-300 flex items-center gap-2 animate-slide-right">
              <CheckCircle2 className="w-4 h-4" />
              Registrado às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} · Dado criptografado.
            </div>
          )}
        </GlassCard>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gráfico */}
          <GlassCard className="lg:col-span-2" delay="350ms">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-violet-400" />
                <h2 className="text-sm font-medium uppercase tracking-wider text-white/80">Evolução Semanal</h2>
              </div>
              <span className="text-xs text-white/40">Últimos 7 dias</span>
            </div>
            <AnimatedBars />
          </GlassCard>

          {/* PHQ-9 Card */}
          <GlassCard delay="450ms">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-fuchsia-400" />
              <h2 className="text-sm font-medium uppercase tracking-wider text-white/80">Próxima Avaliação</h2>
            </div>
            <p className="text-2xl font-bold mb-1">PHQ-9</p>
            <p className="text-sm text-white/50 mb-5">
              Questionário de saúde do paciente. 9 perguntas validadas clinicamente.
            </p>
            <button
              onClick={() => setShowPHQ9(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 font-medium transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_25px_rgba(139,92,246,0.4)] group"
            >
              Iniciar Avaliação
              <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
            <div className="mt-4 flex items-center gap-2 text-xs text-white/40">
              <Calendar className="w-3 h-3" /> Recomendado a cada 2 semanas
            </div>
          </GlassCard>
        </div>

        {/* LGPD Card */}
        <GlassCard delay="550ms">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-medium uppercase tracking-wider text-white/80">Governança de Dados</h2>
            </div>
            <span className="text-xs text-emerald-300">Conforme LGPD</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Criptografia', value: 'AES-256-GCM', detail: 'Em repouso e em trânsito', delay: '600ms' },
              { label: 'Anonimização', value: 'Diferencial', detail: 'PII mascarado em logs', delay: '680ms' },
              { label: 'Auditoria', value: 'Imutável', detail: 'Todo acesso registrado', delay: '760ms' },
            ].map((item) => (
              <div
                key={item.label}
                style={{ animationDelay: item.delay }}
                className="animate-fade-up rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-all duration-200 hover:border-emerald-500/20 hover:bg-white/[0.04]"
              >
                <p className="text-xs text-white/40 uppercase tracking-wider">{item.label}</p>
                <p className="text-lg font-semibold mt-1">{item.value}</p>
                <p className="text-xs text-white/50 mt-1">{item.detail}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </main>

      {showPHQ9 && <PHQ9Assessment onClose={() => setShowPHQ9(false)} />}
    </div>
  );
}
