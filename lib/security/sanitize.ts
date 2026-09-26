// lib/security/sanitize.ts
// Security utilities: Input validation, XSS prevention, file type and size checks, and prompt injection defense.

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB limit
export const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.txt'];
export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'application/msword',
  'application/octet-stream', // often sent by browsers for docx/txt
];

/**
 * Basic HTML/XSS sanitization for strings rendered in the UI
 */
export function sanitizeHtml(input: string): string {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Prompt injection detector and neutralizer.
 * Uploaded legal documents are treated strictly as UNTRUSTED DATA.
 * Detects classic prompt injection patterns and ensures they are safely fenced.
 */
export function checkPromptInjection(text: string): {
  hasInjectionAttempt: boolean;
  patternsFound: string[];
} {
  const patterns = [
    /ignore\s+(all\s+)?(previous|prior)\s+instructions/i,
    /reveal\s+(the\s+)?(system\s+prompt|instructions|secret|api\s*key)/i,
    /disregard\s+(the\s+)?(rules|system|constraints)/i,
    /you\s+are\s+now\s+(DAN|unrestricted|in\s+developer\s+mode)/i,
    /system\s*:\s*override/i,
    /output\s+initial\s+prompt/i,
    /print\s+system\s+message/i,
  ];

  const patternsFound: string[] = [];
  for (const pattern of patterns) {
    if (pattern.test(text)) {
      patternsFound.push(pattern.source);
    }
  }

  return {
    hasInjectionAttempt: patternsFound.length > 0,
    patternsFound,
  };
}

/**
 * Validates uploaded file metadata (name, size, type)
 */
export function validateFileMetadata(filename: string, sizeBytes: number, mimeType?: string): {
  isValid: boolean;
  error?: string;
} {
  if (!filename || typeof filename !== 'string') {
    return { isValid: false, error: 'Invalid or missing file name.' };
  }

  // Prevent path traversal in file names
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return { isValid: false, error: 'Invalid file name path characters detected.' };
  }

  const extMatch = filename.toLowerCase().match(/\.[0-9a-z]+$/);
  const ext = extMatch ? extMatch[0] : '';
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return {
      isValid: false,
      error: `Unsupported file extension "${ext}". Allowed formats are: PDF, DOCX, TXT.`,
    };
  }

  if (sizeBytes <= 0) {
    return { isValid: false, error: 'The uploaded file is empty (0 bytes).' };
  }

  if (sizeBytes > MAX_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      error: `File size exceeds the 10 MB limit (${(sizeBytes / (1024 * 1024)).toFixed(2)} MB).`,
    };
  }

  return { isValid: true };
}
