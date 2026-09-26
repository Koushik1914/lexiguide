// app/api/general-info/route.ts
// Handles general legal information questions (no document required).

import { NextRequest, NextResponse } from 'next/server';
import { aiProvider } from '@/lib/ai/provider';
import { buildGeneralLegalInfoPrompt, GENERAL_LEGAL_INFO_SYSTEM_PROMPT } from '@/prompts/general-legal-info';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { GeneralLegalInfoResponse } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const clientIp = req.headers.get('x-forwarded-for') || req.ip || '127.0.0.1';
    const rateCheck = checkRateLimit(clientIp, 60, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait a moment before asking another question.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { query, jurisdiction, stateProvince } = body;

    if (!query || typeof query !== 'string' || !query.trim()) {
      return NextResponse.json({ error: 'A valid legal question is required.' }, { status: 400 });
    }

    const prompt = buildGeneralLegalInfoPrompt(query.trim(), jurisdiction, stateProvince);
    const aiRes = await aiProvider.generateStructuredOutput<GeneralLegalInfoResponse>(
      prompt,
      GENERAL_LEGAL_INFO_SYSTEM_PROMPT
    );

    const data = aiRes.data;
    data.query = query.trim();
    data.isDemoMode = aiRes.isDemo;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('[API General Info Error]:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to generate legal information.' },
      { status: 500 }
    );
  }
}
