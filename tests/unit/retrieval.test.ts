// tests/unit/retrieval.test.ts
import { describe, it, expect } from 'vitest';
import { 
  cosineSimilarity, 
  generateLocalEmbedding, 
  retrieveRelevantChunks, 
  chunksToCitations 
} from '@/lib/rag/vector-store';
import { DocumentChunk } from '@/types';

describe('RAG Pipeline: Hybrid Vector Retrieval & Grounded Citations', () => {
  it('1. correctly computes vector cosine similarity', () => {
    const vecA = [1, 0, 0];
    const vecB = [1, 0, 0];
    const vecC = [0, 1, 0];

    expect(cosineSimilarity(vecA, vecB)).toBeCloseTo(1.0);
    expect(cosineSimilarity(vecA, vecC)).toBeCloseTo(0.0);
  });

  it('2. generates deterministic unit embeddings for queries and clauses', () => {
    const emb1 = generateLocalEmbedding('termination clause thirty days notice');
    const emb2 = generateLocalEmbedding('termination clause thirty days notice');
    expect(emb1).toEqual(emb2);
    expect(emb1.length).toBe(128);
  });

  it('3. retrieves top relevant chunks for legal questions and maps citations', () => {
    const mockChunks: DocumentChunk[] = [
      {
        id: 'c-1',
        documentId: 'doc-1',
        pageNumber: 1,
        sectionHeading: 'Section 1: Duties',
        paragraphIndex: 0,
        chunkText: 'The Employee is engaged as a Senior Software Associate in Chennai.',
      },
      {
        id: 'c-2',
        documentId: 'doc-1',
        pageNumber: 1,
        sectionHeading: 'Section 3: Compensation',
        paragraphIndex: 1,
        chunkText: 'Gross monthly salary is ₹60,000 payable on the last business day of each month.',
      },
      {
        id: 'c-3',
        documentId: 'doc-1',
        pageNumber: 2,
        sectionHeading: 'Section 7: Termination',
        paragraphIndex: 2,
        chunkText: 'Either party may terminate this agreement by tendering thirty (30) days prior written notice.',
      },
      {
        id: 'c-4',
        documentId: 'doc-1',
        pageNumber: 3,
        sectionHeading: 'Section 9: Arbitration',
        paragraphIndex: 3,
        chunkText: 'Disputes shall be settled by arbitration in Chennai under the 1996 Act.',
      },
    ];

    // Query specifically about notice period
    const noticeResults = retrieveRelevantChunks(mockChunks, 'What is my notice period if I resign?', 3);
    expect(noticeResults.length).toBeGreaterThan(0);
    expect(noticeResults[0].chunk.sectionHeading).toContain('Section 7');
    expect(noticeResults[0].chunk.chunkText).toContain('thirty (30) days');

    // Query specifically about salary
    const salaryResults = retrieveRelevantChunks(mockChunks, 'How much is the salary payment?', 3);
    expect(salaryResults.length).toBeGreaterThan(0);
    expect(salaryResults[0].chunk.sectionHeading).toContain('Section 3');
    expect(salaryResults[0].chunk.chunkText).toContain('₹60,000');

    // Citations generation
    const citations = chunksToCitations(salaryResults);
    expect(citations.length).toBeGreaterThan(0);
    expect(citations[0].pageNumber).toBe(1);
    expect(citations[0].sectionHeading).toContain('Section 3');
    expect(citations[0].excerptSnippet).toContain('₹60,000');
  });

  it('4. filters out irrelevant queries below relevance threshold', () => {
    const mockChunks: DocumentChunk[] = [
      {
        id: 'c-1',
        documentId: 'doc-1',
        pageNumber: 1,
        sectionHeading: 'Section 1',
        paragraphIndex: 0,
        chunkText: 'Standard corporate software engineering covenants.',
      },
    ];

    const results = retrieveRelevantChunks(mockChunks, 'astronaut rocket launch trajectory to mars', 3, 0.4);
    expect(results.length).toBe(0);
  });
});
