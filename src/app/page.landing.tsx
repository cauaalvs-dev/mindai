import Link from 'next/link';
import { Brain, Shield, MessageSquare, Activity, ArrowRight, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden flex items-center justify-center">
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-violet-600/25 rounded-full blur-[140px] animate-orb-float" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-fuchsia-600/20 rounded-full blur-[140px] animate-orb-float-reverse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-violet-500/10 rounded-full blur-[100px] animate-orb-float-slow" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(139,92,246,0.8) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(139,92,246,0.8) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
      <main className="relative max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-up [animation-delay:100ms]">
          <div className="relative">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <div className="absolute inset-0 animate-pulse-ring rounded-full bg-emerald-400/30" />
          </div>
          <span className="text-xs text-white/70">Conforme LGPD · Criptografia AES-256-GCM</span>
        </div>
        <h1
          className="text-5xl md:text-7xl font-bold mb-6 animate-fade-up [animation-delay:200ms]"
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #c4b5fd 40%, #e879f9 70%, #ffffff 100%)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'fade-up 0.6s ease-out 200ms both, shimmer 4s linear 800ms infinite',
          }}
        >
          MindAI
        </h1>
        <p className="text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up [animation-delay:350ms]">
          Assistente terapêutico baseado em Terapia Cognitivo-Comportamental.
          Triagem clínica, monitoramento de humor e suporte conversacional 24/7.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-up [animation-delay:500ms]">
          <Link
            href="/login"
            className="group relative flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 font-medium overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Activity className="w-4 h-4 relative z-10" />
            <span className="relative z-10">Começar agora</span>
            <ArrowRight className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            href="/login"
            className="group flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/20 font-medium transition-all duration-300 hover:bg-white/5 hover:border-violet-500/50 hover:scale-[1.03]"
          >
            <MessageSquare className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
            Iniciar Conversa
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Brain, label: 'TCC Adaptativa', desc: 'Respostas baseadas em técnicas validadas', delay: '600ms', glow: 'group-hover:shadow-[0_0_20px_rgba(139,92,246,0.2)]' },
            { icon: Activity, label: 'PHQ-9 & GAD-7', desc: 'Escalas clínicas padrão-ouro', delay: '700ms', glow: 'group-hover:shadow-[0_0_20px_rgba(232,121,249,0.2)]' },
            { icon: Shield, label: 'Protocolo de Crise', desc: 'Detecção determinística de risco', delay: '800ms', glow: 'group-hover:shadow-[0_0_20px_rgba(52,211,153,0.2)]' },
          ].map((f) => (
            <div
              key={f.label}
              style={{ animationDelay: f.delay }}
              className={`group animate-fade-up rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur p-5 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06] hover:-translate-y-1 ${f.glow}`}
            >
              <f.icon className="w-5 h-5 text-violet-400 mb-3 transition-all duration-300" />
              <p className="font-semibold mb-1">{f.label}</p>
              <p className="text-sm text-white/50">{f.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-col items-center gap-2 animate-fade-up [animation-delay:1000ms]">
          <Zap className="w-3.5 h-3.5 text-white/20 animate-glow-pulse" />
        </div>
      </main>
    </div>
  );
}
