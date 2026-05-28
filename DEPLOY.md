# 🚀 Guia de Deploy — MindAI

Tempo total estimado: **~15 minutos**.

---

## ✅ Pré-requisitos

- Node.js 18.18+ ou 20+ instalado ([nodejs.org](https://nodejs.org/))
- Conta no [GitHub](https://github.com)
- Conta na [Vercel](https://vercel.com) (entre com a conta do GitHub)
- Git instalado

---

## PASSO 1 — Setup Local (3 min)

Extraia o ZIP/RAR e entre na pasta:

```bash
cd mindai
npm install
```

Crie o `.env.local` a partir do exemplo:

```bash
# Linux/Mac
cp .env.local.example .env.local
openssl rand -hex 32
# Copie o resultado e cole no MINDAI_ENCRYPTION_KEY do .env.local

# Windows (PowerShell)
Copy-Item .env.local.example .env.local
# Para gerar a chave, use: https://www.random.org/strings/ (64 caracteres hex)
```

Teste local:

```bash
npm run dev
```

Acesse `http://localhost:3000`. Confira:
- Landing carrega
- `/dashboard` mostra o PHQ-9 funcionando
- `/chat` responde mensagens normais
- Digite "eu desisto de tudo" → tela vermelha de crise aparece

---

## PASSO 2 — GitHub (5 min)

### 2.1. Crie o repositório

Acesse [github.com/new](https://github.com/new):
- **Repository name:** `mindai`
- **Description:** `CBT-based conversational AI for psychological support — clinical screening (PHQ-9, GAD-7) and deterministic crisis protocol`
- **Public**
- **NÃO** marque "Add a README", "Add .gitignore", nem "Add a license" (já existem)
- Clique em **Create repository**

### 2.2. Push do código

```bash
cd mindai
git init
git branch -M main
git add .
git commit -m "feat: initial MindAI MVP with TCC chat, clinical scales and crisis protocol"
git remote add origin https://github.com/SEU_USUARIO/mindai.git
git push -u origin main

# Cria branch dev (Diamond standard)
git checkout -b dev
git push -u origin dev
git checkout main
```

### 2.3. Configure o About do repo (web)

No GitHub → engrenagem ⚙️ ao lado de "About":
- **Description:** `CBT-based conversational AI for psychological support — clinical screening (PHQ-9, GAD-7) and deterministic crisis protocol`
- **Website:** (deixe vazio por enquanto, vai voltar aqui depois do deploy)
- **Topics:** `nextjs`, `typescript`, `tailwindcss`, `mental-health`, `cbt`, `lgpd`, `healthcare`, `ai`, `clinical-screening`

---

## PASSO 3 — Vercel (5 min)

### 3.1. Import do projeto

1. Acesse [vercel.com/new](https://vercel.com/new)
2. **Import Git Repository** → encontre `mindai` → **Import**
3. **Framework Preset:** Next.js (auto-detectado)
4. **Root Directory:** `./`
5. **Build Command:** `npm run build` (padrão)
6. **Output Directory:** `.next` (padrão)

### 3.2. Variável de ambiente

Antes de clicar em "Deploy", expanda **Environment Variables**:

- **Name:** `MINDAI_ENCRYPTION_KEY`
- **Value:** gere uma nova chave com `openssl rand -hex 32` (NÃO use a mesma do local)
- Marque **Production**, **Preview** e **Development**

Clique em **Deploy**.

### 3.3. Aguarde o build (~1-2 min)

Após sucesso, você terá uma URL tipo: `https://mindai-xyz.vercel.app`

### 3.4. Volte ao GitHub

Edite o About do repo → cole a URL do Vercel no campo **Website**.

---

## PASSO 4 — Release v1.0.0 (2 min)

```bash
git tag -a v1.0.0 -m "release: MVP MindAI — clinical screening, TCC chat, crisis protocol"
git push origin v1.0.0
```

No GitHub:
1. Releases → **Draft a new release**
2. **Choose a tag:** `v1.0.0`
3. **Release title:** `MindAI v1.0.0 — MVP`
4. **Description:**
   ```
   First public release of MindAI.

   - Chat conversacional baseado em TCC
   - Triagem clínica PHQ-9 e GAD-7
   - Protocolo de crise determinístico com encaminhamento (CVV 188, SAMU 192, CAPS)
   - Criptografia AES-256-GCM para dados sensíveis
   - Headers de segurança e log de auditoria LGPD
   ```
5. **Publish release**

---

## ✅ Checklist Final

Antes de apresentar, confirme:

- [ ] Site no ar e acessível na URL da Vercel
- [ ] Landing → Dashboard → Chat navega normalmente
- [ ] Mood check-in funciona (botões de emoji)
- [ ] PHQ-9 abre, completa as 9 perguntas e mostra laudo colorido
- [ ] Chat responde com mensagens TCC variadas
- [ ] Frase de risco ("eu desisto de tudo", "quero me matar") trava o chat com overlay vermelho e mostra CVV/SAMU/CAPS
- [ ] README com badges aparece no GitHub
- [ ] About do repo tem descrição, link do deploy e topics
- [ ] Release v1.0.0 publicada
- [ ] Branch `dev` criada
- [ ] Logs `[LGPD-AUDIT]` aparecem no terminal da Vercel (Functions → Logs)

---

## 🐛 Troubleshooting

**Build falha na Vercel com erro de tipos:**
Confira que o `tsconfig.json` foi enviado e que o `package.json` tem todas as dependências.

**`/api/chat` retorna 500:**
Provavelmente faltou a env var `MINDAI_ENCRYPTION_KEY`. Vá em Settings → Environment Variables na Vercel.

**Tela branca no `/chat`:**
Abra o DevTools (F12) → Console. Geralmente é um erro de import. Confira se o arquivo `src/utils/mindai-core.ts` está presente.

**Frase de crise não trava o chat:**
Verifique se a frase contém alguma palavra-chave da lista em `CRISIS_KEYWORDS` (`mindai-core.ts`).

---

Boa apresentação! 🚀
