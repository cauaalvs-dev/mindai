[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)](https://mindai-j7v1.vercel.app/)
[![License](https://img.shields.io/github/license/cauaalvs-dev/mindai?style=for-the-badge&color=8b5cf6)](LICENSE)

# MindAI 🧠

Conversational AI platform for complementary psychological support based on Cognitive Behavioral Therapy (CBT). Implements validated clinical screening scales (PHQ-9, GAD-7), a deterministic crisis protocol, and data governance in compliance with Brazil's LGPD.

> **Academic project** — Desafios ao Ciberespaço · Universidade de Fortaleza (Unifor) · 2026.1

---

## ✨ Features

- **Adaptive CBT Chat** — context-aware responses grounded in cognitive-behavioral techniques
- **Clinical Screening** — PHQ-9 (depression) and GAD-7 (anxiety) validated scales with severity reports
- **Hard-coded Crisis Protocol** — deterministic risk detection, independent of AI, with immediate emergency routing (CVV 188, SAMU 192, CAPS)
- **AES-256-GCM Encryption** — sensitive data encrypted at rest (LGPD compliance)
- **Differential Anonymization** — PII masked in all audit logs
- **Immutable Audit Log** — every data access event is recorded

---

## 🛡️ Security Architecture

| Layer | Implementation |
|---|---|
| Encryption | AES-256-GCM via Node.js `crypto` (built-in) |
| Anonymization | Differential — PII masked before logging |
| Audit trail | Structured logs with timestamp, user hash, event type |
| Crisis detection | Hard-coded keyword + scale threshold — zero AI involvement |
| HTTP headers | HSTS, X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy |

---

## 🛠️ Tech Stack

| Technology | Version | Role |
|---|---|---|
| Next.js | 15 | Full-stack framework (App Router) |
| TypeScript | 5 | Type safety across the entire codebase |
| Tailwind CSS | 3.4 | Utility-first styling |
| lucide-react | 0.460 | Icon system |
| Node.js crypto | built-in | AES-256-GCM encryption |

---

## 🚀 Running Locally

```bash
# 1. Clone the repository
git clone https://github.com/cauaalvs-dev/mindai.git
cd mindai

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.local.example .env.local
# Generate a key: openssl rand -hex 32
# Paste it as MINDAI_ENCRYPTION_KEY in .env.local

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 📂 Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts       # API: chat engine + crisis protocol
│   ├── chat/
│   │   └── page.tsx           # Conversational interface
│   ├── dashboard/
│   │   └── page.tsx           # Clinical dashboard + PHQ-9 assessment
│   ├── layout.tsx
│   ├── globals.css
│   └── page.tsx               # Landing page
└── utils/
    └── mindai-core.ts         # Core: encryption, clinical scales, crisis detector
```

---

## 🌐 Deploy

Hosted on [Vercel](https://vercel.com). Every push to `main` triggers an automatic production deployment.

**Required environment variable:**

| Variable | Description |
|---|---|
| `MINDAI_ENCRYPTION_KEY` | 32-byte hex key for AES-256-GCM — generate with `openssl rand -hex 32` |

---

## ⚠️ Disclaimer

MindAI is an academic prototype and does **not** replace professional psychological or psychiatric care. In case of emotional crisis, contact:

- **CVV** (Centro de Valorização da Vida): **188** — free, 24/7
- **SAMU**: **192**
- **CAPS** (Centro de Atenção Psicossocial): seek the nearest unit

---

## 📜 License

[MIT](LICENSE) © 2026 Cauã Alves
