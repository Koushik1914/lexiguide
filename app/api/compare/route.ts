// app/api/compare/route.ts
// Handles comparison of two legal document versions.

import { NextRequest, NextResponse } from 'next/server';
import { parseDocument } from '@/lib/document/parser';
import { validateFileMetadata } from '@/lib/security/sanitize';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { aiProvider } from '@/lib/ai/provider';
import { buildDocumentComparisonPrompt, DOCUMENT_COMPARISON_SYSTEM_PROMPT } from '@/prompts/document-comparison';
import {
  SAMPLE_EMPLOYMENT_AGREEMENT_V1,
  SAMPLE_EMPLOYMENT_AGREEMENT_V2,
} from '@/lib/document/sample-documents';
import { DocumentComparisonResult } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const clientIp = req.headers.get('x-forwarded-for') || req.ip || '127.0.0.1';
    const rateCheck = checkRateLimit(clientIp, 30, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait a moment before running another comparison.' },
        { status: 429 }
      );
    }

    const contentType = req.headers.get('content-type') || '';
    let docAText = '';
    let docBText = '';
    let docAName = 'Document Version A';
    let docBName = 'Document Version B';
    let isDemo = false;

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const fileA = formData.get('fileA') as File | null;
      const fileB = formData.get('fileB') as File | null;
      const demoFlag = formData.get('isDemo') as string | null;

      if (demoFlag === 'true' || (!fileA && !fileB)) {
        isDemo = true;
        docAText = SAMPLE_EMPLOYMENT_AGREEMENT_V1;
        docBText = SAMPLE_EMPLOYMENT_AGREEMENT_V2;
        docAName = 'NovaTech_Agreement_v1.0.txt';
        docBName = 'NovaTech_Agreement_v2.0.txt';
      } else {
        if (!fileA || !fileB) {
          return NextResponse.json(
            { error: 'Please upload both Document A and Document B to compare.' },
            { status: 400 }
          );
        }

        const validA = validateFileMetadata(fileA.name, fileA.size);
        const validB = validateFileMetadata(fileB.name, fileB.size);
        if (!validA.isValid) return NextResponse.json({ error: `Document A: ${validA.error}` }, { status: 400 });
        if (!validB.isValid) return NextResponse.json({ error: `Document B: ${validB.error}` }, { status: 400 });

        docAName = fileA.name;
        docBName = fileB.name;

        const bufA = Buffer.from(await fileA.arrayBuffer());
        const bufB = Buffer.from(await fileB.arrayBuffer());

        const parsedA = await parseDocument(bufA, docAName);
        const parsedB = await parseDocument(bufB, docBName);

        docAText = parsedA.text;
        docBText = parsedB.text;
      }
    } else {
      const body = await req.json();
      if (body.isDemo || !body.docAText || !body.docBText) {
        isDemo = true;
        docAText = SAMPLE_EMPLOYMENT_AGREEMENT_V1;
        docBText = SAMPLE_EMPLOYMENT_AGREEMENT_V2;
        docAName = 'NovaTech_Agreement_v1.0.txt';
        docBName = 'NovaTech_Agreement_v2.0.txt';
      } else {
        docAText = body.docAText;
        docBText = body.docBText;
        docAName = body.docAName || 'Document Version A';
        docBName = body.docBName || 'Document Version B';
      }
    }

    const prompt = buildDocumentComparisonPrompt(docAName, docAText, docBName, docBText);
    const aiRes = await aiProvider.generateStructuredOutput<DocumentComparisonResult>(
      prompt,
      DOCUMENT_COMPARISON_SYSTEM_PROMPT
    );

    const data = aiRes.data;
    data.docAName = docAName;
    data.docBName = docBName;
    data.isDemoMode = aiRes.isDemo || isDemo;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('[API Compare Error]:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to compare documents.' },
      { status: 500 }
    );
  }
}
