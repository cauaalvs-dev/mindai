import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { detectCrisisRisk, SecurityService } from '@/utils/mindai-core';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  message: string;
  history: ChatMessage[];
  userName?: string;
}

const SYSTEM_PROMPT = `Você é o MindAI, um assistente terapêutico digital especializado em Terapia Cognitivo-Comportamental (TCC). Seu papel é oferecer suporte psicológico complementar, nunca substituir um profissional de saúde mental.

IDENTIDADE E TOM:
- Fale sempre em português brasileiro, com tom acolhedor, empático e profissional
- Nunca seja robótico ou genérico — responda ao que o usuário realmente disse
- Use linguagem acessível, evite jargões clínicos excessivos
- Seja direto mas gentil. Máximo 3-4 parágrafos por resposta

TÉCNICAS DE TCC QUE VOCÊ APLICA:
1. Identificação de pensamentos automáticos negativos
2. Reestruturação cognitiva — questione distorções como catastrofização, leitura mental, generalização
3. Registro de pensamentos (situação → pensamento → emoção → comportamento)
4. Técnicas de respiração e grounding quando há ansiedade aguda
5. Psicoeducação sobre o ciclo pensamento-emoção-comportamento
6. Questionamento socrático — perguntas que levam o usuário à reflexão
7. Experimentos comportamentais — sugestões práticas e pequenas ações

COMO CONDUZIR A CONVERSA:
- Na primeira mensagem, acolha e faça UMA pergunta para entender melhor a situação
- Nunca faça mais de uma pergunta por vez
- Valide as emoções antes de propor qualquer técnica
- Quando identificar uma distorção cognitiva, nomeie-a gentilmente
- Se o usuário compartilhar algo grave mas não de crise, sugira buscar acompanhamento profissional
- Lembre ao usuário que você é um suporte complementar, não um substituto para terapia

LIMITES ABSOLUTOS:
- NUNCA diagnostique condições clínicas
- NUNCA prescreva ou sugira medicamentos
- NUNCA minimize sofrimento com frases como "poderia ser pior" ou "pensa positivo"
- Não responda perguntas que fujam completamente do contexto de saúde mental e bem-estar`;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatRequest;
    const { message, history = [], userName = 'anonymous' } = body;

    const anonymized = SecurityService.anonymize(userName);
    console.log(
      `[LGPD-AUDIT] ${new Date().toISOString()} | user=${anonymized} | event=chat_access | history_len=${history.length} | msg_len=${message?.length ?? 0}`,
    );

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ status: 'ERROR', message: 'Mensagem inválida.' }, { status: 400 });
    }

    // PROTOCOLO DE CRISE — hard-coded, executa ANTES da IA, sem exceções
    if (detectCrisisRisk(message)) {
      console.log(
        `[LGPD-AUDIT] ${new Date().toISOString()} | user=${anonymized} | event=CRISIS_PROTOCOL_TRIGGERED`,
      );
      return NextResponse.json({
        status: 'CRISIS',
        message:
          'Percebi que você pode estar passando por um momento muito difícil. Você não está sozinho(a) — existe ajuda disponível agora. Por favor, entre em contato com um dos serviços abaixo.',
        contacts: [
          { label: 'CVV — Centro de Valorização da Vida', phone: '188', detail: 'Gratuito, 24 horas por dia' },
          { label: 'SAMU', phone: '192', detail: 'Emergências médicas' },
          { label: 'CAPS — Centro de Atenção Psicossocial', phone: 'Procure o mais próximo', detail: 'Atendimento público em saúde mental' },
        ],
        lockChat: true,
      });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error('[CHAT-API-ERROR] GROQ_API_KEY não configurada');
      return NextResponse.json({ status: 'ERROR', message: 'Serviço temporariamente indisponível.' }, { status: 503 });
    }

    const groq = new Groq({ apiKey });

    // Monta histórico no formato do Groq
    const groqHistory = history.map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }));

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...groqHistory,
        { role: 'user', content: message },
      ],
      max_tokens: 600,
      temperature: 0.75,
    });

    const reply = completion.choices[0]?.message?.content;

    if (!reply) {
      throw new Error('Resposta vazia do modelo');
    }

    return NextResponse.json({
      status: 'OK',
      message: reply,
      lockChat: false,
    });

  } catch (error) {
    console.error('[CHAT-API-ERROR]', error);
    return NextResponse.json(
      { status: 'ERROR', message: 'Desculpe, tive um problema técnico. Pode tentar novamente?' },
      { status: 500 },
    );
  }
}
