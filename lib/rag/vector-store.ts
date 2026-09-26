// lib/rag/vector-store.ts
// In-memory vector store with hybrid vector retrieval (cosine similarity + keyword relevance) and citation tracking.

import { DocumentChunk, Citation } from '@/types';

// In-memory document chunks cache indexed by documentId
const documentStore = new Map<string, DocumentChunk[]>();

export function storeDocumentChunks(documentId: string, chunks: DocumentChunk[]): void {
  documentStore.set(documentId, chunks);
}

export function getDocumentChunks(documentId: string): DocumentChunk[] {
  return documentStore.get(documentId) || [];
}

export function clearDocument(documentId: string): void {
  documentStore.delete(documentId);
}

/**
 * Computes cosine similarity between two float vectors.
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0 || vecA.length !== vecB.length) {
    return 0;
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Deterministic local dense feature vector generator for fast, zero-dependency hybrid retrieval.
 * Maps n-grams, key terms, and word stems into a 128-dimensional normalized unit vector.
 */
export function generateLocalEmbedding(text: string): number[] {
  const DIM = 128;
  const vector = new Array(DIM).fill(0);
  const clean = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  const tokens = clean.split(/\s+/).filter((t) => t.length > 1);

  if (tokens.length === 0) return vector;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    // Hash token to index
    let h = 0;
    for (let c = 0; c < token.length; c++) {
      h = (h * 31 + token.charCodeAt(c)) & 0x7fffffff;
    }
    const idx = h % DIM;
    vector[idx] += 1;

    // Bigram
    if (i < tokens.length - 1) {
      const bigram = token + '_' + tokens[i + 1];
      let bh = 0;
      for (let c = 0; c < bigram.length; c++) {
        bh = (bh * 37 + bigram.charCodeAt(c)) & 0x7fffffff;
      }
      vector[bh % DIM] += 1.5;
    }
  }

  // Normalize to unit length
  let norm = 0;
  for (let i = 0; i < DIM; i++) {
    norm += vector[i] * vector[i];
  }
  norm = Math.sqrt(norm);
  if (norm > 0) {
    for (let i = 0; i < DIM; i++) {
      vector[i] /= norm;
    }
  }

  return vector;
}

/**
 * Computes keyword overlap bonus (BM25-style term matching).
 */
function computeKeywordScore(query: string, text: string): number {
  const queryTokens = query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);
  const textLower = text.toLowerCase();

  let matches = 0;
  for (const token of queryTokens) {
    if (textLower.includes(token)) {
      matches += 1;
    }
  }

  return queryTokens.length > 0 ? matches / queryTokens.length : 0;
}

export interface ScoredChunk {
  chunk: DocumentChunk;
  score: number;
}

/**
 * Retrieves top-k most relevant chunks using hybrid scoring (vector similarity + keyword boost).
 */
export function retrieveRelevantChunks(
  chunks: DocumentChunk[],
  query: string,
  topK: number = 6,
  minThreshold: number = 0.05
): ScoredChunk[] {
  if (!chunks || chunks.length === 0 || !query.trim()) {
    return [];
  }

  const queryEmbedding = generateLocalEmbedding(query);

  const scored: ScoredChunk[] = chunks.map((chunk) => {
    // If chunk does not have embedding, compute one
    const chunkVector = chunk.embedding || generateLocalEmbedding(chunk.chunkText);
    const vectorSim = cosineSimilarity(queryEmbedding, chunkVector);
    const keywordSim = computeKeywordScore(query, chunk.chunkText);

    // Hybrid score: 60% keyword match + 40% dense vector similarity
    const combinedScore = keywordSim * 0.65 + vectorSim * 0.35;

    return {
      chunk,
      score: combinedScore,
    };
  });

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  // Filter by threshold and take topK
  const filtered = scored.filter((item) => item.score >= minThreshold);
  return filtered.slice(0, topK);
}

/**
 * Converts retrieved chunks to citation objects.
 */
export function chunksToCitations(scoredChunks: ScoredChunk[]): Citation[] {
  return scoredChunks.map(({ chunk }) => {
    // Take first 180 characters as snippet
    const snippet = chunk.chunkText.length > 180 ? chunk.chunkText.slice(0, 180) + '...' : chunk.chunkText;
    return {
      chunkId: chunk.id,
      pageNumber: chunk.pageNumber,
      sectionHeading: chunk.sectionHeading,
      excerptSnippet: snippet,
    };
  });
}
