import crypto from 'node:crypto';

// ============================================================
// SECURITY SERVICE — Criptografia AES-256-GCM (LGPD compliance)
// ============================================================

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

function getKey(): Buffer {
  const envKey = process.env.MINDAI_ENCRYPTION_KEY;
  if (!envKey || envKey.length !== 64) {
    return crypto.createHash('sha256').update('mindai-mvp-dev-key-2025').digest();
  }
  return Buffer.from(envKey, 'hex');
}

export class SecurityService {
  static encrypt(plaintext: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
    const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return Buffer.concat([iv, authTag, encrypted]).toString('base64');
  }

  static decrypt(payload: string): string {
    const buffer = Buffer.from(payload, 'base64');
    const iv = buffer.subarray(0, IV_LENGTH);
    const authTag = buffer.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
    const encrypted = buffer.subarray(IV_LENGTH + AUTH_TAG_LENGTH);
    const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
    decipher.setAuthTag(authTag);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString('utf8');
  }

  static anonymize(name: string): string {
    if (!name || name.length < 2) return '***';
    return `${name[0]}${'*'.repeat(Math.max(name.length - 2, 1))}${name[name.length - 1]}`;
  }
}

// ============================================================
// TRIAGEM CLÍNICA — Escalas PHQ-9 e GAD-7
// ============================================================

export type ClinicalScale = 'PHQ9' | 'GAD7';
export type Severity = 'minimal' | 'mild' | 'moderate' | 'moderately-severe' | 'severe';

export interface ScaleResult {
  scale: ClinicalScale;
  score: number;
  severity: Severity;
  label: string;
  color: 'green' | 'yellow' | 'orange' | 'red' | 'crimson';
  recommendation: string;
}

export const PHQ9_QUESTIONS: readonly string[] = [
  'Pouco interesse ou prazer em fazer as coisas',
  'Sentir-se desanimado(a), deprimido(a) ou sem esperança',
  'Dificuldade para pegar no sono, permanecer dormindo ou dormir demais',
  'Sentir-se cansado(a) ou com pouca energia',
  'Falta de apetite ou comer demais',
  'Sentir-se mal consigo mesmo(a) — ou achar que é um fracasso',
  'Dificuldade de concentração em tarefas como ler o jornal ou assistir TV',
  'Lentidão para se movimentar ou falar, ou o oposto: estar muito agitado(a)',
  'Pensar em se ferir de alguma forma ou que seria melhor estar morto(a)',
] as const;

export const GAD7_QUESTIONS: readonly string[] = [
  'Sentir-se nervoso(a), ansioso(a) ou no limite',
  'Não conseguir parar ou controlar as preocupações',
  'Preocupar-se demais com diversas coisas',
  'Dificuldade para relaxar',
  'Ficar tão inquieto(a) que se torna difícil permanecer parado(a)',
  'Ficar facilmente aborrecido(a) ou irritado(a)',
  'Sentir medo como se algo terrível fosse acontecer',
] as const;

export const ANSWER_OPTIONS: readonly { value: number; label: string }[] = [
  { value: 0, label: 'Nenhuma vez' },
  { value: 1, label: 'Vários dias' },
  { value: 2, label: 'Mais da metade dos dias' },
  { value: 3, label: 'Quase todos os dias' },
] as const;

export function calculateSeverity(score: number, scale: ClinicalScale): ScaleResult {
  if (scale === 'PHQ9') {
    if (score <= 4)
      return buildResult(scale, score, 'minimal', 'Mínimo', 'green', 'Continue cuidando do seu bem-estar com check-ins regulares.');
    if (score <= 9)
      return buildResult(scale, score, 'mild', 'Leve', 'yellow', 'Pratique técnicas de TCC e mantenha rotina de sono e exercícios.');
    if (score <= 14)
      return buildResult(scale, score, 'moderate', 'Moderado', 'orange', 'Recomendamos acompanhamento com um profissional de saúde mental.');
    if (score <= 19)
      return buildResult(scale, score, 'moderately-severe', 'Moderadamente Grave', 'red', 'É importante buscar avaliação clínica com psicólogo ou psiquiatra.');
    return buildResult(scale, score, 'severe', 'Grave', 'crimson', 'Procure atendimento profissional imediato. CVV: 188.');
  }
  if (score <= 4)
    return buildResult(scale, score, 'minimal', 'Mínimo', 'green', 'Seus níveis de ansiedade estão dentro do esperado.');
  if (score <= 9)
    return buildResult(scale, score, 'mild', 'Leve', 'yellow', 'Técnicas de respiração e mindfulness podem ajudar.');
  if (score <= 14)
    return buildResult(scale, score, 'moderate', 'Moderado', 'orange', 'Considere conversar com um profissional sobre suas preocupações.');
  return buildResult(scale, score, 'severe', 'Grave', 'red', 'Recomendamos avaliação clínica para manejo da ansiedade.');
}

function buildResult(
  scale: ClinicalScale,
  score: number,
  severity: Severity,
  label: string,
  color: ScaleResult['color'],
  recommendation: string,
): ScaleResult {
  return { scale, score, severity, label, color, recommendation };
}

// ============================================================
// CRISIS DETECTOR — Determinístico, sem IA
// ============================================================

const CRISIS_KEYWORDS: readonly string[] = [
  'suicidio',
  'suicídio',
  'me matar',
  'me suicidar',
  'tirar minha vida',
  'acabar com tudo',
  'nao quero mais viver',
  'não quero mais viver',
  'desisto de tudo',
  'desisto da vida',
  'sem saida',
  'sem saída',
  'me machucar',
  'me ferir',
  'autolesao',
  'autolesão',
  'cortar os pulsos',
  'pular da ponte',
  'overdose',
  'enforcar',
  'melhor morto',
  'melhor morta',
  'nao aguento mais viver',
  'não aguento mais viver',
];

export function detectCrisisRisk(text: string): boolean {
  if (!text || typeof text !== 'string') return false;
  const normalized = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  return CRISIS_KEYWORDS.some((keyword) => {
    const normalizedKeyword = keyword.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return normalized.includes(normalizedKeyword);
  });
}

// ============================================================
// SIMULATED TCC RESPONSES
// ============================================================

export const TCC_RESPONSES: readonly string[] = [
  'Entendo o que você está sentindo. Vamos analisar esse pensamento juntos — quais evidências o sustentam, e quais o contradizem?',
  'Esse é um padrão comum chamado "catastrofização". Que tal tentarmos reformular a situação considerando outras possibilidades?',
  'Reconhecer o que sente já é um passo importante. Em uma escala de 0 a 10, qual é a intensidade desse sentimento agora?',
  'Vamos praticar uma técnica de TCC chamada "registro de pensamentos": qual situação disparou esse sentimento?',
  'Suas emoções são válidas. Lembre-se que pensamentos não são fatos — eles são interpretações que podemos examinar.',
  'Que tal experimentarmos uma respiração diafragmática? Inspire por 4 segundos, segure por 4, expire por 6. Tente comigo.',
  'Você está identificando seus gatilhos, e isso é parte fundamental do autoconhecimento terapêutico. Continue.',
  'Esse pensamento parece ser uma "leitura mental" — assumir o que outros pensam. Quais evidências concretas temos?',
];
