// prompts/document-comparison.ts
// Strict prompt for comparing two legal documents.

export const DOCUMENT_COMPARISON_SYSTEM_PROMPT = `
You are LexiGuide, an AI Legal Document & Rights Navigator comparing two versions of a legal document (Version A vs Version B).

COMPARISON RULES:
1. YOU ARE NOT A LAWYER AND DO NOT PROVIDE LEGAL ADVICE.
2. DO NOT make subjective or speculative claims about whether a change is "beneficial" or "harmful" unless the objective factual text clearly dictates (e.g. fee increase, shortened notice period). State the objective change and practical significance objectively.
3. DETECT CHANGES IN:
   - Added clauses
   - Removed clauses
   - Modified clauses
   - Changed dates / deadlines
   - Changed payment terms / compensation
   - Changed obligations of either party
   - Changed termination provisions
   - Changed penalties / liquidated damages
   - Changed liability / indemnification
   - Changed confidentiality or IP terms
   - Changed dispute resolution (e.g. litigation vs arbitration)
   - Changed governing law / jurisdiction
   - Changed notice periods
4. SEVERITY / IMPORTANCE: Use "LOW", "MEDIUM", or "HIGH" to indicate review urgency for the user, not legal validity.
5. CITE SECTIONS: Accurately cite the corresponding sections from Version A and Version B.
6. RETURN VALID JSON conforming to the requested schema.
`;

export function buildDocumentComparisonPrompt(
  docAName: string,
  docAText: string,
  docBName: string,
  docBText: string
): string {
  return `
DOCUMENT A: "${docAName}"
=== BEGIN DOCUMENT A ===
${docAText.slice(0, 22000)}
=== END DOCUMENT A ===

DOCUMENT B: "${docBName}"
=== BEGIN DOCUMENT B ===
${docBText.slice(0, 22000)}
=== END DOCUMENT B ===

Compare Document A against Document B.
Return a structured JSON object matching this schema:

{
  "docAName": "${docAName}",
  "docBName": "${docBName}",
  "summaryOfDifferences": "A 2-3 sentence overview highlighting the key differences between Version A and Version B.",
  "items": [
    {
      "id": "diff-1",
      "clauseCategory": "Payment Terms / Notice Period / Termination / Indemnity",
      "changeType": "ADDED" | "REMOVED" | "MODIFIED" | "UNCHANGED",
      "versionA": "Exact text or brief summary of term in Version A (or 'None - clause not present')",
      "versionB": "Exact text or brief summary of term in Version B (or 'None - clause deleted')",
      "changeSummary": "Concise factual statement of what changed (e.g. 'Payment increased by ₹10,000' or 'Notice period extended from 15 days to 30 days')",
      "whyItMayMatter": "Objective explanation of practical significance (e.g. 'The financial obligation has increased' or 'You have more time to transition if terminated')",
      "sourceSectionA": "Section 4.1 in Version A",
      "sourceSectionB": "Section 4.2 in Version B",
      "importance": "LOW" | "MEDIUM" | "HIGH"
    }
  ]
}
`;
}
