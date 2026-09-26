// app/api/analyze/route.ts
// Handles document upload, text extraction, RAG chunk indexing, and structured AI analysis.

import { NextRequest, NextResponse } from 'next/server';
import { parseDocument } from '@/lib/document/parser';
import { chunkDocument } from '@/lib/rag/chunker';
import { storeDocumentChunks } from '@/lib/rag/vector-store';
import { validateFileMetadata, checkPromptInjection } from '@/lib/security/sanitize';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { aiProvider } from '@/lib/ai/provider';
import { buildDocumentAnalysisPrompt, DOCUMENT_SUMMARY_SYSTEM_PROMPT } from '@/prompts/document-summary';
import { buildLegalTriagePrompt, LEGAL_TRIAGE_SYSTEM_PROMPT } from '@/prompts/legal-triage';
import { SAMPLE_EMPLOYMENT_AGREEMENT_V2 } from '@/lib/document/sample-documents';
import { DocumentAnalysisResult, UserContext } from '@/types';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // 1. Rate limiting check
    const clientIp = req.headers.get('x-forwarded-for') || req.ip || '127.0.0.1';
    const rateCheck = checkRateLimit(clientIp, 40, 60000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait a moment before analyzing another document.' },
        { status: 429 }
      );
    }

    const contentType = req.headers.get('content-type') || '';
    let rawText = '';
    let filename = 'document.txt';
    let userContext: UserContext = {
      jurisdiction: 'India',
      stateProvince: 'Tamil Nadu',
      documentType: 'Employment Agreement',
      userRole: 'Employee',
      goal: 'Understand termination and obligations',
      urgency: 'NORMAL',
    };
    let isDemoRequested = false;

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      const contextStr = formData.get('userContext') as string | null;
      const demoFlag = formData.get('isDemo') as string | null;

      if (contextStr) {
        try {
          userContext = JSON.parse(contextStr);
        } catch (e) {
          // Keep defaults
        }
      }

      if (demoFlag === 'true' || !file) {
        isDemoRequested = true;
        rawText = SAMPLE_EMPLOYMENT_AGREEMENT_V2;
        filename = 'Sample_Employment_Agreement_NovaTech.txt';
      } else {
        filename = file.name;
        const validation = validateFileMetadata(filename, file.size, file.type);
        if (!validation.isValid) {
          return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const parsedDoc = await parseDocument(buffer, filename);

        if (parsedDoc.isScannedOrEmpty) {
          return NextResponse.json(
            {
              error:
                'Unable to extract readable text from this document. If this is an image-only or scanned PDF, please try uploading a text-based PDF, DOCX, or TXT file.',
            },
            { status: 422 }
          );
        }

        rawText = parsedDoc.text;
      }
    } else {
      // JSON payload (e.g. from demo button or direct text paste)
      const body = await req.json();
      if (body.isDemo || !body.text) {
        isDemoRequested = true;
        rawText = SAMPLE_EMPLOYMENT_AGREEMENT_V2;
        filename = 'Sample_Employment_Agreement_NovaTech.txt';
      } else {
        rawText = body.text;
        filename = body.filename || 'Pasted_Legal_Document.txt';
      }
      if (body.userContext) {
        userContext = body.userContext;
      }
    }

    // 2. Untrusted text inspection & security prompt injection check
    const injectionCheck = checkPromptInjection(rawText);
    if (injectionCheck.hasInjectionAttempt) {
      console.warn(`[Security Warning]: Potential prompt injection patterns detected in document: ${filename}`);
      // Note: We do NOT execute them; our prompt architecture fences the text strictly as inert user data.
    }

    const documentId = `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    // 3. Document Chunking & In-Memory RAG Indexing
    const chunks = chunkDocument(
      {
        text: rawText,
        pages: [{ pageNumber: 1, text: rawText }],
        wordCount: rawText.split(/\s+/).filter(Boolean).length,
        pageCount: 1,
        fileType: filename.endsWith('.pdf') ? 'pdf' : filename.endsWith('.docx') ? 'docx' : 'txt',
        isScannedOrEmpty: false,
      },
      documentId
    );

    storeDocumentChunks(documentId, chunks);

    // 4. Check for critical urgency triage
    const triagePrompt = buildLegalTriagePrompt(rawText.slice(0, 4000), userContext.urgency);
    const triageRes = await aiProvider.generateStructuredOutput<any>(
      triagePrompt,
      LEGAL_TRIAGE_SYSTEM_PROMPT
    );

    // 5. GenAI Structured Analysis
    const analysisPrompt = buildDocumentAnalysisPrompt(rawText, JSON.stringify(userContext));
    const aiResult = await aiProvider.generateStructuredOutput<DocumentAnalysisResult>(
      analysisPrompt,
      DOCUMENT_SUMMARY_SYSTEM_PROMPT
    );

    const data = aiResult.data;
    data.documentId = documentId;
    data.documentName = filename;
    data.documentType = userContext.documentType || 'Contract / Legal Document';
    data.userContext = userContext;
    data.wordCount = rawText.split(/\s+/).filter(Boolean).length;
    data.analyzedAt = new Date().toISOString();
    data.isDemoMode = aiResult.isDemo || isDemoRequested;

    // Attach triage findings
    if (triageRes.data) {
      data.triageEscalation = {
        isEscalated: triageRes.data.isEscalated || false,
        urgencyCategory: triageRes.data.urgencyCategory || userContext.urgency || 'NORMAL',
        triggerReasons: triageRes.data.triggerReasons || [],
        recommendedAction:
          triageRes.data.recommendedAction ||
          'Informational analysis completed. Consider verifying specific clauses with a qualified advocate if high-stakes decisions arise.',
      };
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('[API Analyze Error]:', error);
    return NextResponse.json(
      { error: error?.message || 'An unexpected error occurred while analyzing the document.' },
      { status: 500 }
    );
  }
}
