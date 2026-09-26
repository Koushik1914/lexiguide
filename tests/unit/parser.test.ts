// tests/unit/parser.test.ts
import { describe, it, expect } from 'vitest';
import { extractFromTxt, parseDocument } from '@/lib/document/parser';

describe('Document Processing & Text Extraction', () => {
  it('1. extracts text safely from TXT buffer', () => {
    const rawContent = `EMPLOYMENT AGREEMENT\n\n1. SALARY: ₹60,000 per month.\n\n2. NOTICE: 30 days notice.`;
    const buffer = Buffer.from(rawContent, 'utf-8');
    const result = extractFromTxt(buffer);

    expect(result.fileType).toBe('txt');
    expect(result.text).toContain('EMPLOYMENT AGREEMENT');
    expect(result.wordCount).toBeGreaterThan(5);
    expect(result.pages.length).toBeGreaterThanOrEqual(1);
    expect(result.isScannedOrEmpty).toBe(false);
  });

  it('2. detects empty document content properly', () => {
    const emptyBuffer = Buffer.from('', 'utf-8');
    const result = extractFromTxt(emptyBuffer);

    expect(result.isScannedOrEmpty).toBe(true);
    expect(result.wordCount).toBe(0);
  });

  it('3. rejects unsupported file extensions in parseDocument', async () => {
    const buffer = Buffer.from('console.log("hello")', 'utf-8');
    await expect(parseDocument(buffer, 'test.py')).rejects.toThrow('Unsupported document extension');
  });
});
