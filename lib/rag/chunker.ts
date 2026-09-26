// lib/rag/chunker.ts
// Document chunking with metadata (page, section heading, paragraph index).

import { DocumentChunk } from '@/types';
import { ExtractedDocument } from '../document/parser';

const SECTION_HEADING_REGEX = /^(?:clause|section|article|\d+[\.\)])\s*([^\n\r]+)/i;

/**
 * Splits extracted document pages into structured chunks with rich metadata.
 */
export function chunkDocument(
  doc: ExtractedDocument,
  documentId: string
): DocumentChunk[] {
  const chunks: DocumentChunk[] = [];
  let chunkCounter = 1;

  for (const page of doc.pages) {
    const rawParagraphs = page.text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
    let currentSectionHeading = `Page ${page.pageNumber}`;

    rawParagraphs.forEach((para, pIdx) => {
      const trimmed = para.trim();

      // Check if paragraph starts with a section heading
      const headingMatch = trimmed.match(SECTION_HEADING_REGEX);
      if (headingMatch) {
        currentSectionHeading = headingMatch[0].slice(0, 60);
      } else if (trimmed.length < 70 && !trimmed.endsWith('.') && /^[A-Z0-9\s\-_:]{3,}$/.test(trimmed)) {
        // Uppercase line like "TERMINATION CLAUSE"
        currentSectionHeading = trimmed.slice(0, 60);
      }

      // If paragraph is very long (> 700 chars), split into smaller sentence chunks
      if (trimmed.length > 700) {
        const sentences = trimmed.match(/[^.!?]+[.!?]+(\s+|$)/g) || [trimmed];
        let currentSubChunk = '';

        for (const sentence of sentences) {
          if (currentSubChunk.length + sentence.length > 600 && currentSubChunk.length > 0) {
            chunks.push({
              id: `${documentId}-chunk-${chunkCounter++}`,
              documentId,
              pageNumber: page.pageNumber,
              sectionHeading: currentSectionHeading,
              paragraphIndex: pIdx,
              chunkText: currentSubChunk.trim(),
            });
            currentSubChunk = sentence;
          } else {
            currentSubChunk += sentence;
          }
        }

        if (currentSubChunk.trim().length > 0) {
          chunks.push({
            id: `${documentId}-chunk-${chunkCounter++}`,
            documentId,
            pageNumber: page.pageNumber,
            sectionHeading: currentSectionHeading,
            paragraphIndex: pIdx,
            chunkText: currentSubChunk.trim(),
          });
        }
      } else if (trimmed.length > 20) {
        // Normal paragraph chunk
        chunks.push({
          id: `${documentId}-chunk-${chunkCounter++}`,
          documentId,
          pageNumber: page.pageNumber,
          sectionHeading: currentSectionHeading,
          paragraphIndex: pIdx,
          chunkText: trimmed,
        });
      }
    });
  }

  // Fallback if no chunks were created
  if (chunks.length === 0 && doc.text.trim()) {
    chunks.push({
      id: `${documentId}-chunk-1`,
      documentId,
      pageNumber: 1,
      sectionHeading: 'General Text',
      paragraphIndex: 0,
      chunkText: doc.text.slice(0, 1000),
    });
  }

  return chunks;
}
