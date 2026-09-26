// tests/unit/chunker.test.ts
import { describe, it, expect } from 'vitest';
import { chunkDocument } from '@/lib/rag/chunker';
import { ExtractedDocument } from '@/lib/document/parser';

describe('RAG Pipeline: Chunking with Rich Metadata', () => {
  it('1. chunks document and extracts section headings and page metadata', () => {
    const mockDoc: ExtractedDocument = {
      text: '',
      pages: [
        {
          pageNumber: 1,
          text: `Section 1: Position and Duties\nThe Employee is appointed Senior Software Associate.\n\nSection 2: Compensation\nSalary shall be ₹60,000 per month payable monthly.`,
        },
        {
          pageNumber: 2,
          text: `Section 7: Termination\nEither party may terminate with thirty (30) days notice.`,
        },
      ],
      wordCount: 30,
      pageCount: 2,
      fileType: 'txt',
      isScannedOrEmpty: false,
    };

    const chunks = chunkDocument(mockDoc, 'doc-test-123');

    expect(chunks.length).toBeGreaterThanOrEqual(3);
    expect(chunks[0].documentId).toBe('doc-test-123');
    expect(chunks[0].pageNumber).toBe(1);
    expect(chunks[0].sectionHeading).toContain('Section 1');
    expect(chunks[0].chunkText).toContain('Employee is appointed');

    const lastChunk = chunks[chunks.length - 1];
    expect(lastChunk.pageNumber).toBe(2);
    expect(lastChunk.sectionHeading).toContain('Section 7');
    expect(lastChunk.chunkText).toContain('thirty (30) days notice');
  });

  it('2. handles single-line documents without losing content', () => {
    const singleDoc: ExtractedDocument = {
      text: 'Short mutual agreement between Alpha and Beta.',
      pages: [{ pageNumber: 1, text: 'Short mutual agreement between Alpha and Beta.' }],
      wordCount: 7,
      pageCount: 1,
      fileType: 'txt',
      isScannedOrEmpty: false,
    };

    const chunks = chunkDocument(singleDoc, 'doc-single');
    expect(chunks.length).toBe(1);
    expect(chunks[0].chunkText).toContain('Short mutual agreement');
  });
});
