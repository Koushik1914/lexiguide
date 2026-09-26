// lib/document/parser.ts
// Robust document text extractor for PDF, DOCX, and TXT formats.

export interface ExtractedPage {
  pageNumber: number;
  text: string;
}

export interface ExtractedDocument {
  text: string;
  pages: ExtractedPage[];
  wordCount: number;
  pageCount: number;
  fileType: 'pdf' | 'docx' | 'txt';
  isScannedOrEmpty: boolean;
}

/**
 * Extracts plain text and page/section boundaries from PDF buffer.
 */
export async function extractFromPdf(buffer: Buffer): Promise<ExtractedDocument> {
  try {
    // Dynamic import to avoid bundling issues
    const pdfParse = (await import('pdf-parse')).default;

    const pages: ExtractedPage[] = [];

    // Custom pagerender to capture page-by-page text
    const options = {
      pagerender: function (pageData: any) {
        return pageData.getTextContent().then(function (textContent: any) {
          let lastY: number | null = null;
          let text = '';
          for (const item of textContent.items) {
            if (lastY === item.transform[5] || lastY === null) {
              text += item.str;
            } else {
              text += '\n' + item.str;
            }
            lastY = item.transform[5];
          }
          pages.push({
            pageNumber: pageData.pageIndex + 1,
            text: text.trim(),
          });
          return text;
        });
      },
    };

    const data = await pdfParse(buffer, options);
    const cleanText = data.text ? data.text.trim() : '';
    const words = cleanText.split(/\s+/).filter(Boolean).length;

    // Check for scanned PDF with no extractable text
    const isScannedOrEmpty = cleanText.length < 20 || words < 5;

    // If custom pagerender didn't populate pages, split by form feeds or use whole text
    let finalPages = pages;
    if (finalPages.length === 0 && cleanText) {
      const pageSplits = cleanText.split('\f');
      finalPages = pageSplits.map((p, idx) => ({
        pageNumber: idx + 1,
        text: p.trim(),
      }));
    }

    return {
      text: cleanText,
      pages: finalPages.length > 0 ? finalPages : [{ pageNumber: 1, text: cleanText }],
      wordCount: words,
      pageCount: data.numpages || (finalPages.length > 0 ? finalPages.length : 1),
      fileType: 'pdf',
      isScannedOrEmpty,
    };
  } catch (error: any) {
    throw new Error(`Failed to parse PDF document: ${error.message || 'Corrupt or unreadable file'}`);
  }
}

/**
 * Extracts text and paragraph structure from DOCX buffer.
 */
export async function extractFromDocx(buffer: Buffer): Promise<ExtractedDocument> {
  try {
    const mammoth = (await import('mammoth')).default;
    const result = await mammoth.extractRawText({ buffer });
    const cleanText = (result.value || '').trim();
    const words = cleanText.split(/\s+/).filter(Boolean).length;
    const isScannedOrEmpty = cleanText.length < 10 || words < 3;

    // Approximate pages for DOCX (roughly 400 words per page)
    const paragraphs = cleanText.split(/\n\s*\n/);
    const pages: ExtractedPage[] = [];
    let currentPageWords = 0;
    let currentPageText: string[] = [];
    let pageNum = 1;

    for (const para of paragraphs) {
      const pWords = para.split(/\s+/).filter(Boolean).length;
      if (currentPageWords + pWords > 450 && currentPageText.length > 0) {
        pages.push({
          pageNumber: pageNum++,
          text: currentPageText.join('\n\n'),
        });
        currentPageText = [para];
        currentPageWords = pWords;
      } else {
        currentPageText.push(para);
        currentPageWords += pWords;
      }
    }

    if (currentPageText.length > 0) {
      pages.push({
        pageNumber: pageNum,
        text: currentPageText.join('\n\n'),
      });
    }

    return {
      text: cleanText,
      pages: pages.length > 0 ? pages : [{ pageNumber: 1, text: cleanText }],
      wordCount: words,
      pageCount: pages.length || 1,
      fileType: 'docx',
      isScannedOrEmpty,
    };
  } catch (error: any) {
    throw new Error(`Failed to parse DOCX document: ${error.message || 'Corrupt or unreadable file'}`);
  }
}

/**
 * Extracts text from plain TXT buffer.
 */
export function extractFromTxt(buffer: Buffer): ExtractedDocument {
  try {
    const cleanText = buffer.toString('utf-8').trim();
    const words = cleanText.split(/\s+/).filter(Boolean).length;
    const isScannedOrEmpty = cleanText.length < 5 || words < 1;

    // Split into simulated pages (~400 words per page)
    const paragraphs = cleanText.split(/\n\s*\n/);
    const pages: ExtractedPage[] = [];
    let currentPageWords = 0;
    let currentPageText: string[] = [];
    let pageNum = 1;

    for (const para of paragraphs) {
      const pWords = para.split(/\s+/).filter(Boolean).length;
      if (currentPageWords + pWords > 450 && currentPageText.length > 0) {
        pages.push({
          pageNumber: pageNum++,
          text: currentPageText.join('\n\n'),
        });
        currentPageText = [para];
        currentPageWords = pWords;
      } else {
        currentPageText.push(para);
        currentPageWords += pWords;
      }
    }

    if (currentPageText.length > 0) {
      pages.push({
        pageNumber: pageNum,
        text: currentPageText.join('\n\n'),
      });
    }

    return {
      text: cleanText,
      pages: pages.length > 0 ? pages : [{ pageNumber: 1, text: cleanText }],
      wordCount: words,
      pageCount: pages.length || 1,
      fileType: 'txt',
      isScannedOrEmpty,
    };
  } catch (error: any) {
    throw new Error(`Failed to parse TXT document: ${error.message}`);
  }
}

/**
 * Unified document parser detecting format by extension.
 */
export async function parseDocument(
  buffer: Buffer,
  filename: string
): Promise<ExtractedDocument> {
  const ext = filename.toLowerCase().split('.').pop();

  if (ext === 'pdf') {
    return extractFromPdf(buffer);
  } else if (ext === 'docx') {
    return extractFromDocx(buffer);
  } else if (ext === 'txt') {
    return extractFromTxt(buffer);
  } else {
    throw new Error(`Unsupported document extension .${ext}. Only PDF, DOCX, and TXT are supported.`);
  }
}
