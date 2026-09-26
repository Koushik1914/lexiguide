// tests/unit/provider.test.ts
import { describe, it, expect } from 'vitest';
import { aiProvider } from '@/lib/ai/provider';
import { buildDocumentAnalysisPrompt, DOCUMENT_SUMMARY_SYSTEM_PROMPT } from '@/prompts/document-summary';
import { PROMPT_INJECTION_TEST_DOCUMENT } from '@/lib/document/sample-documents';
import { DocumentAnalysisResult, QAResponse, DocumentComparisonResult } from '@/types';

describe('GenAI Provider Abstraction & Prompt Injection Resistance', () => {
  it('1. falls back to realistic demo mode with isDemo flag when API key is missing', async () => {
    const res = await aiProvider.generateText('Explain the 30-day notice period');
    expect(res.text).toBeDefined();
    expect(res.isDemo).toBe(true);
  });

  it('2. generates validated structured analysis data matching the TypeScript schema', async () => {
    const sampleText = 'NovaTech Solutions employs Alex Kumar with salary ₹60,000 and 30 days notice.';
    const prompt = buildDocumentAnalysisPrompt(sampleText, JSON.stringify({ jurisdiction: 'India' }));
    
    const { data, isDemo } = await aiProvider.generateStructuredOutput<DocumentAnalysisResult>(
      prompt,
      DOCUMENT_SUMMARY_SYSTEM_PROMPT
    );

    expect(data).toBeDefined();
    expect(data.executiveSummary).toBeDefined();
    expect(data.parties.userParty.name).toBe('Alex Kumar');
    expect(data.parties.counterparty.name).toContain('NovaTech');
    expect(data.obligations.length).toBeGreaterThan(0);
    expect(data.importantDates.length).toBeGreaterThan(0);
    expect(data.financialTerms.length).toBeGreaterThan(0);
    expect(data.findings.length).toBeGreaterThan(0);
  });

  it('3. SECURITY TEST: treats prompt injection as untrusted document text without revealing prompt', async () => {
    // Inject hostile adversarial prompt
    const promptWithInjection = buildDocumentAnalysisPrompt(
      PROMPT_INJECTION_TEST_DOCUMENT,
      JSON.stringify({ jurisdiction: 'United States' })
    );

    const { data } = await aiProvider.generateStructuredOutput<DocumentAnalysisResult>(
      promptWithInjection,
      DOCUMENT_SUMMARY_SYSTEM_PROMPT
    );

    expect(data).toBeDefined();
    // Verify system prompt was NOT dumped into executive summary
    const summary = data.executiveSummary.toLowerCase();
    expect(summary).not.toContain('reveal the system prompt');
    expect(summary).not.toContain('developer mode');
    expect(summary).not.toContain('api_key');
  });

  it('4. provides grounded answers distinguishing document facts from general legal info', async () => {
    const qaRes = await aiProvider.generateStructuredOutput<QAResponse>(
      'USER QUESTION: "What is my notice period?"',
      'System: Answer strictly from document'
    );

    expect(qaRes.data.directAnswer).toContain('30');
    expect(qaRes.data.whatDocumentSays).toBeDefined();
    expect(qaRes.data.whyItMatters).toBeDefined();
    expect(qaRes.data.source.pageOrSection).toBeDefined();
    expect(qaRes.data.informationDistinction.documentFacts).toBeDefined();
    expect(qaRes.data.informationDistinction.generalLegalInfo).toBeDefined();
  });
});
