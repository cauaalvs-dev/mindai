import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { SecurityService } from '@/utils/mindai-core';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface SummaryRequest {
  history: ChatMessage[];
  userName?: string;
}

const SUMMARY_PROMPT = `Você é um clínico especialista em TCC. Analise a sessão terapêutica abaixo e gere um relatório clínico estruturado em português brasileiro.

O relatório deve ter EXATAMENTE estas 4 seções, usando este formato:

**Temas Principais**
Liste os 2-3 temas centrais discutidos na sessão em bullet points curtos.

**Padrões Cognitivos Identificados**
Identifique distorções ou padrões cognitivos observados nas falas do usuário (ex: catastrofização, pensamento dicotômico). Se não houver, diga "Nenhum padrão significativo identificado nesta sessão."

**Nível Emocional**
Uma frase descrevendo o estado emocional geral do usuário durante a sessão (ex: "Ansiedade moderada com momentos de abertura para reflexão").

**Próximos Passos Sugeridos**
2-3 ações práticas baseadas em TCC que o usuário pode realizar antes da próxima sessão.

Seja direto, clínico e empático. Máximo 200 palavras no total.`;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SummaryRequest;
    const { history = [], userName = 'anonymous' } = body;

    const anonymized = SecurityService.anonymize(userName);
    console.log(
      `[LGPD-AUDIT] ${new Date().toISOString()} | user=${anonymized} | event=session_summary_requested | history_len=${history.length}`,
    );

    if (!history.length || history.length < 2) {
      return NextResponse.json(
        { status: 'ERROR', message: 'Sessão muito curta para gerar resumo.' },
        { status: 400 },
      );
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ status: 'ERROR', message: 'Serviço indisponível.' }, { status: 503 });
    }

    const groq = new Groq({ apiKey });

    const sessionText = history
      .map((m) => `${m.role === 'user' ? 'Paciente' : 'MindAI'}: ${m.content}`)
      .join('\n');

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SUMMARY_PROMPT },
        { role: 'user', content: `Sessão terapêutica:\n\n${sessionText}` },
      ],
      max_tokens: 500,
      temperature: 0.4,
    });

    const summary = completion.choices[0]?.message?.content;
    if (!summary) throw new Error('Resposta vazia');

    return NextResponse.json({ status: 'OK', summary });
  } catch (error) {
    console.error('[SUMMARY-API-ERROR]', error);
    return NextResponse.json({ status: 'ERROR', message: 'Erro ao gerar resumo.' }, { status: 500 });
  }
}
