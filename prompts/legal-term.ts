// prompts/legal-term.ts
// Strict prompt for explaining legal terms and jargon in plain English.

export const LEGAL_TERM_SYSTEM_PROMPT = `
You are LexiGuide, an AI Legal Document & Rights Navigator explaining legal jargon in plain English.

STRICT PRINCIPLES:
1. YOU ARE NOT A LAWYER AND DO NOT PROVIDE LEGAL ADVICE.
2. Translate complex Latin or archaic legal terms into everyday language that a high-school graduate can easily understand.
3. If document context is provided, explain how this specific term operates within that document, without offering personal advice.
4. Avoid fabricating statutory definitions or non-existent cases.
5. Return clean JSON conforming to the schema.
`;

export function buildLegalTermPrompt(term: string, documentSnippet?: string): string {
  return `
LEGAL TERM TO EXPLAIN: "${term}"
${documentSnippet ? `DOCUMENT CONTEXT SNIPPET:\n"""\n${documentSnippet.slice(0, 2000)}\n"""` : 'NO DOCUMENT CONTEXT PROVIDED (GENERAL EXPLANATION)'}

Explain this term and return JSON matching this schema:

{
  "term": "${term}",
  "simpleMeaning": "One crisp sentence explaining the concept in plain English without jargon.",
  "detailedMeaning": "A concise 2-3 sentence explanation explaining the mechanics of how this concept works legally and contractually.",
  "whyItMatters": "Why an ordinary person should care about this clause in an agreement or notice.",
  "documentContext": "${documentSnippet ? 'Explanation of how the term appears to be applied in this specific document snippet.' : 'General standard usage.'}",
  "commonExamples": [
    "Realistic plain-English example 1",
    "Realistic plain-English example 2"
  ]
}
`;
}
