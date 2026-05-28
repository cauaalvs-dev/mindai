import Link from 'next/link';
import { Brain, Shield, MessageSquare, Activity, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden flex items-center justify-center">
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[140px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-fuchsia-600/15 rounded-full blur-[140px]" />
      <main className="relative max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs text-white/70">Conforme LGPD · Criptografia AES-256-GCM</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-br from-white via-violet-200 to-fuchsia-300 bg-clip-text text-transparent">
          MindAI
        </h1>
        <p className="text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
          Assistente terapêutico baseado em Terapia Cognitivo-Comportamental. Triagem clínica, monitoramento de humor e
          suporte conversacional 24/7.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 font-medium transition"
          >
            <Activity className="w-4 h-4" /> Acessar Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/chat"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/20 hover:bg-white/5 font-medium transition"
          >
            <MessageSquare className="w-4 h-4" /> Iniciar Conversa
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Brain, label: 'TCC Adaptativa', desc: 'Respostas baseadas em técnicas validadas' },
            { icon: Activity, label: 'PHQ-9 & GAD-7', desc: 'Escalas clínicas padrão-ouro' },
            { icon: Shield, label: 'Protocolo de Crise', desc: 'Detecção determinística de risco' },
          ].map((f) => (
            <div key={f.label} className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur p-5">
              <f.icon className="w-5 h-5 text-violet-400 mb-3" />
              <p className="font-semibold mb-1">{f.label}</p>
              <p className="text-sm text-white/50">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
