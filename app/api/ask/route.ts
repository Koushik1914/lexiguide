// app/api/ask/route.ts
// Handles conversational document Q&A with RAG retrieval, citations, and hallucination defense.

import { NextRequest, NextResponse } from 'next/server';
import { getDocumentChunks, retrieveRelevantChunks, chunksToCitations } from '@/lib/rag/vector-store';
import { aiProvider } from '@/lib/ai/provider';
import { buildDocumentQAPrompt, DOCUMENT_QA_SYSTEM_PROMPT } from '@/prompts/document-qa';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { QAResponse } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const clientIp = req.headers.get('x-forwarded-for') || req.ip || '127.0.0.1';
    const rateCheck = checkRateLimit(clientIp, 60, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait a moment before sending another query.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { documentId, question, userContext } = body;

    if (!question || typeof question !== 'string' || !question.trim()) {
      return NextResponse.json({ error: 'A valid question is required.' }, { status: 400 });
    }

    const trimmedQuestion = question.trim();

    // 1. Retrieve cached chunks for this document
    let chunks = getDocumentChunks(documentId);

    // If chunks are not in memory (e.g. fresh session or direct demo Q&A), create fallback chunks
    if (chunks.length === 0) {
      const { SAMPLE_EMPLOYMENT_AGREEMENT_V2 } = await import('@/lib/document/sample-documents');
      const { chunkDocument } = await import('@/lib/rag/chunker');
      const { storeDocumentChunks } = await import('@/lib/rag/vector-store');

      chunks = chunkDocument(
        {
          text: SAMPLE_EMPLOYMENT_AGREEMENT_V2,
          pages: [{ pageNumber: 1, text: SAMPLE_EMPLOYMENT_AGREEMENT_V2 }],
          wordCount: 800,
          pageCount: 1,
          fileType: 'txt',
          isScannedOrEmpty: false,
        },
        documentId || 'demo-doc'
      );
      storeDocumentChunks(documentId || 'demo-doc', chunks);
    }

    // 2. Perform hybrid retrieval (cosine similarity + keyword boost)
    const scoredChunks = retrieveRelevantChunks(chunks, trimmedQuestion, 6, 0.02);

    if (scoredChunks.length === 0) {
      const fallbackResponse: QAResponse = {
        directAnswer: "I couldn't find enough information in the document to answer this reliably.",
        whatDocumentSays: 'The document text provided does not appear to contain provisions addressing this specific query.',
        whyItMatters: 'If this topic is critical to your agreement, it may represent missing terms or an unaddressed legal risk.',
        source: {
          pageOrSection: 'Not found in document',
          excerpts: [],
        },
        informationDistinction: {
          documentFacts: 'No explicit clause found in the analyzed document.',
          generalLegalInfo: 'When contracts remain silent on a topic, local statutory law or common law default rules usually apply.',
          practicalImplications: 'Consider requesting written clarification or an addendum from the other party.',
        },
        confidence: 'LOW',
        disclaimer: 'This is general legal information based on the document provided, not legal advice.',
        citations: [],
        isDemoMode: true,
      };
      return NextResponse.json({ success: true, data: fallbackResponse });
    }

    // 3. Format retrieved excerpts
    const retrievedPayload = scoredChunks.map((sc) => ({
      chunkId: sc.chunk.id,
      pageNumber: sc.chunk.pageNumber,
      sectionHeading: sc.chunk.sectionHeading,
      chunkText: sc.chunk.chunkText,
    }));

    const citations = chunksToCitations(scoredChunks);

    // 4. Grounded AI Answer Generation
    const prompt = buildDocumentQAPrompt(
      trimmedQuestion,
      retrievedPayload,
      JSON.stringify(userContext || {})
    );

    const aiRes = await aiProvider.generateStructuredOutput<QAResponse>(
      prompt,
      DOCUMENT_QA_SYSTEM_PROMPT
    );

    const data = aiRes.data;
    data.citations = citations;
    data.isDemoMode = aiRes.isDemo;

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('[API Ask Error]:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to answer document question.' },
      { status: 500 }
    );
  }
}
