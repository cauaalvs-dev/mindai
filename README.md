# MindAI 🧠

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)](https://vercel.com)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

Plataforma de IA conversacional para suporte psicológico complementar baseado em Terapia Cognitivo-Comportamental (TCC). Implementa escalas clínicas validadas (PHQ-9, GAD-7), protocolo de crise determinístico e governança de dados em conformidade com a LGPD.

## ✨ Funcionalidades

- **Chat TCC adaptativo** com respostas contextualizadas em técnicas terapêuticas
- **Triagem clínica** com escalas PHQ-9 (depressão) e GAD-7 (ansiedade)
- **Protocolo de Crise hard-coded** com detecção determinística e rotas de emergência
- **Criptografia AES-256-GCM** para dados sensíveis (LGPD)
- **Log de auditoria** para acessos a dados pessoais

## 🛠️ Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS · lucide-react

## 🚀 Executando localmente

```bash
npm install
cp .env.local.example .env.local
# Gere uma chave: openssl rand -hex 32
# Cole em MINDAI_ENCRYPTION_KEY no .env.local
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## 📂 Estrutura

```
src/
├── app/
│   ├── api/chat/route.ts    # Backend: chat + protocolo de crise
│   ├── chat/page.tsx        # Interface conversacional
│   ├── dashboard/page.tsx   # Dashboard clínico
│   └── page.tsx             # Landing
└── utils/
    └── mindai-core.ts       # Cérebro: criptografia, escalas, detector
```

## 🔒 Segurança

- Headers HTTP: HSTS, X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy
- Anonimização de PII em logs de auditoria
- Detecção determinística de risco (não delegada à IA)

## 🚢 Deploy na Vercel

1. Faça push do repositório no GitHub
2. Importe em [vercel.com/new](https://vercel.com/new)
3. Adicione a variável de ambiente `MINDAI_ENCRYPTION_KEY` (gere com `openssl rand -hex 32`)
4. Deploy

## 📜 Licença

MIT
