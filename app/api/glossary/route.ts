// app/api/glossary/route.ts
// Handles legal term explanations and plain-English breakdown.

import { NextRequest, NextResponse } from 'next/server';
import { aiProvider } from '@/lib/ai/provider';
import { buildLegalTermPrompt, LEGAL_TERM_SYSTEM_PROMPT } from '@/prompts/legal-term';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { LegalTermExplanation } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const clientIp = req.headers.get('x-forwarded-for') || req.ip || '127.0.0.1';
    const rateCheck = checkRateLimit(clientIp, 60, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait a moment before querying another term.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { term, documentSnippet } = body;

    if (!term || typeof term !== 'string' || !term.trim()) {
      return NextResponse.json({ error: 'A valid legal term is required.' }, { status: 400 });
    }

    const prompt = buildLegalTermPrompt(term.trim(), documentSnippet);
    const aiRes = await aiProvider.generateStructuredOutput<LegalTermExplanation>(
      prompt,
      LEGAL_TERM_SYSTEM_PROMPT
    );

    const data = aiRes.data;
    data.term = term.trim();
    data.isDemoMode = aiRes.isDemo;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('[API Glossary Error]:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to explain legal term.' },
      { status: 500 }
    );
  }
}
