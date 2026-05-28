import { NextRequest, NextResponse } from 'next/server';
import { detectCrisisRisk, TCC_RESPONSES, SecurityService } from '@/utils/mindai-core';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  message: string;
  history: ChatMessage[];
  userName?: string;
}

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

    if (detectCrisisRisk(message)) {
      console.log(`[LGPD-AUDIT] ${new Date().toISOString()} | user=${anonymized} | event=CRISIS_PROTOCOL_TRIGGERED`);
      return NextResponse.json({
        status: 'CRISIS',
        message:
          'Protocolo de segurança ativado. Você não está sozinho(a) — ajuda profissional está disponível agora.',
        contacts: [
          { label: 'CVV — Centro de Valorização da Vida', phone: '188', detail: '24h, ligação gratuita' },
          { label: 'SAMU', phone: '192', detail: 'Emergências médicas' },
          {
            label: 'CAPS — Centro de Atenção Psicossocial',
            phone: 'Procure o mais próximo',
            detail: 'Atendimento público em saúde mental',
          },
        ],
        lockChat: true,
      });
    }

    const responseIndex = history.length % TCC_RESPONSES.length;
    const reply = TCC_RESPONSES[responseIndex];

    return NextResponse.json({
      status: 'OK',
      message: reply,
      lockChat: false,
    });
  } catch (error) {
    console.error('[CHAT-API-ERROR]', error);
    return NextResponse.json({ status: 'ERROR', message: 'Erro interno.' }, { status: 500 });
  }
}
