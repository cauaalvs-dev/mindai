import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MindAI — Suporte Terapêutico Baseado em TCC',
  description: 'Assistente conversacional clínico com triagem PHQ-9, GAD-7 e protocolo de crise.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
