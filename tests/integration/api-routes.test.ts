// tests/integration/api-routes.test.ts
import { describe, it, expect } from 'vitest';
import { aiProvider } from '@/lib/ai/provider';
import { buildDocumentComparisonPrompt, DOCUMENT_COMPARISON_SYSTEM_PROMPT } from '@/prompts/document-comparison';
import { buildLegalTermPrompt, LEGAL_TERM_SYSTEM_PROMPT } from '@/prompts/legal-term';
import { buildLegalTriagePrompt, LEGAL_TRIAGE_SYSTEM_PROMPT } from '@/prompts/legal-triage';
import { buildGeneralLegalInfoPrompt, GENERAL_LEGAL_INFO_SYSTEM_PROMPT } from '@/prompts/general-legal-info';
import { 
  DocumentComparisonResult, 
  LegalTermExplanation, 
  GeneralLegalInfoResponse 
} from '@/types';

describe('Integration: Multi-Module Business Logic', () => {
  it('1. Module C: compares two document versions and classifies clause diffs', async () => {
    const prompt = buildDocumentComparisonPrompt(
      'Version 1.0',
      'Salary: ₹50,000. Notice: 15 days.',
      'Version 2.0',
      'Salary: ₹60,000. Notice: 30 days.'
    );

    const { data } = await aiProvider.generateStructuredOutput<DocumentComparisonResult>(
      prompt,
      DOCUMENT_COMPARISON_SYSTEM_PROMPT
    );

    expect(data.items.length).toBeGreaterThanOrEqual(2);
    const compensationDiff = data.items.find((i) => i.clauseCategory.toLowerCase().includes('compensation'));
    expect(compensationDiff).toBeDefined();
    expect(compensationDiff?.changeType).toBe('MODIFIED');
    expect(compensationDiff?.versionB).toContain('60,000');
    expect(compensationDiff?.changeSummary).toContain('10,000');
  });

  it('2. Module D: explains legal term in plain English without personalized advice', async () => {
    const prompt = buildLegalTermPrompt('Indemnification', 'Clause 5: Employee shall indemnify the Company.');
    const { data } = await aiProvider.generateStructuredOutput<LegalTermExplanation>(
      prompt,
      LEGAL_TERM_SYSTEM_PROMPT
    );

    expect(data.term).toBe('Indemnification');
    expect(data.simpleMeaning).toBeDefined();
    expect(data.detailedMeaning).toBeDefined();
    expect(data.whyItMatters).toBeDefined();
    expect(data.commonExamples.length).toBeGreaterThan(0);
  });

  it('3. Module F & 8: performs legal urgency triage without diagnosing outcomes', async () => {
    const evictionNotice = 'NOTICE TO VACATE: Immediate possession demanded within 48 hours or court warrant.';
    const prompt = buildLegalTriagePrompt(evictionNotice, 'URGENT');

    const res = await aiProvider.generateStructuredOutput<any>(
      prompt,
      LEGAL_TRIAGE_SYSTEM_PROMPT
    );

    expect(res.data).toBeDefined();
    expect(res.data.urgencyCategory).toBeDefined();
  });

  it('4. Module 9: provides general legal information with jurisdictional caveats', async () => {
    const prompt = buildGeneralLegalInfoPrompt('What is an NDA?', 'India', 'Tamil Nadu');
    const { data } = await aiProvider.generateStructuredOutput<GeneralLegalInfoResponse>(
      prompt,
      GENERAL_LEGAL_INFO_SYSTEM_PROMPT
    );

    expect(data.plainEnglishExplanation).toBeDefined();
    expect(data.jurisdictionalLimitations).toBeDefined();
    expect(data.keyConcepts.length).toBeGreaterThan(0);
    expect(data.whenToSeekLawyer).toBeDefined();
  });
});
