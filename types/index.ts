// Core TypeScript Definitions for LexiGuide — AI Legal Document & Rights Navigator

export type JurisdictionCountry = 'India' | 'United States' | 'United Kingdom' | 'Canada' | 'Australia' | 'Other';

export interface UserContext {
  jurisdiction: JurisdictionCountry;
  stateProvince?: string;
  documentType: string;
  userRole: string; // e.g. "Employee", "Tenant", "Contractor", "Consumer"
  goal: string;     // e.g. "Understand termination terms", "Review payment obligations"
  urgency: 'NORMAL' | 'IMPORTANT' | 'TIME-SENSITIVE' | 'URGENT';
}

export type ReviewImportance = 'LOW' | 'MEDIUM' | 'HIGH';
export type EvidenceConfidence = 'LOW' | 'MEDIUM' | 'HIGH';

export type FindingCategory =
  | 'Important'
  | 'Requires Attention'
  | 'Potential Risk'
  | 'Ambiguous'
  | 'Missing Information'
  | 'User Obligation'
  | 'Counterparty Obligation';

export interface Finding {
  id: string;
  title: string;
  category: FindingCategory;
  explanation: string;
  source_excerpt: string;
  page_or_section: string;
  severity: ReviewImportance; // Importance for user review, NOT legal validity
  confidence: EvidenceConfidence;
}

export interface ObligationItem {
  id: string;
  party: 'USER' | 'COUNTERPARTY' | 'MUTUAL';
  partyName: string;
  description: string;
  consequenceIfBreached?: string;
  source_excerpt: string;
  page_or_section: string;
  importance: ReviewImportance;
}

export interface ImportantDateItem {
  id: string;
  title: string;
  dateOrRelative: string; // e.g. "01 Jan 2027" or "30 days from written notice"
  isRelative: boolean;
  explanation: string;
  source_excerpt: string;
  page_or_section: string;
}

export interface FinancialTermItem {
  id: string;
  title: string;
  amountOrFormula: string; // e.g. "₹60,000 / month" or "5% late fee after 10 days"
  frequency?: string;
  responsibleParty: string;
  notes: string;
  source_excerpt: string;
  page_or_section: string;
}

export interface DocumentAnalysisResult {
  documentId: string;
  documentName: string;
  documentType: string;
  pageCount?: number;
  wordCount: number;
  analyzedAt: string;
  userContext: UserContext;
  isDemoMode: boolean;

  // Executive & Parties
  executiveSummary: string;
  parties: {
    userParty: { name: string; role: string };
    counterparty: { name: string; role: string };
    otherParties?: Array<{ name: string; role: string }>;
  };
  purposeOfAgreement: string;

  // Core Clauses
  contractDuration: string;
  terminationConditions: string;
  renewalConditions: string;
  noticePeriods: string;
  penalties: string;
  liabilityClauses: string;
  confidentialityClauses: string;
  intellectualPropertyClauses: string;
  disputeResolution: string;
  governingLaw: string;
  jurisdictionClause: string;

  // Structured Lists
  obligations: ObligationItem[];
  importantDates: ImportantDateItem[];
  financialTerms: FinancialTermItem[];
  findings: Finding[]; // Potentially important, ambiguous, or attention-needed items
  suggestedNextSteps: Array<{
    title: string;
    description: string;
    category: 'VERIFICATION' | 'ACTION' | 'PROFESSIONAL_ASSISTANCE';
  }>;

  // Triage Escalation Flag
  triageEscalation?: {
    isEscalated: boolean;
    urgencyCategory: 'NORMAL' | 'IMPORTANT' | 'TIME-SENSITIVE' | 'URGENT';
    triggerReasons: string[];
    recommendedAction: string;
  };
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  pageNumber: number;
  sectionHeading: string;
  paragraphIndex: number;
  chunkText: string;
  embedding?: number[];
}

export interface Citation {
  chunkId: string;
  pageNumber: number;
  sectionHeading: string;
  excerptSnippet: string;
}

export interface QAResponse {
  directAnswer: string;
  whatDocumentSays: string;
  whyItMatters: string;
  source: {
    pageOrSection: string;
    excerpts: string[];
  };
  informationDistinction: {
    documentFacts: string;
    generalLegalInfo: string;
    practicalImplications: string;
  };
  confidence: EvidenceConfidence;
  disclaimer: string;
  citations: Citation[];
  isDemoMode?: boolean;
}

export type ClauseChangeType = 'ADDED' | 'REMOVED' | 'MODIFIED' | 'UNCHANGED';

export interface ComparisonItem {
  id: string;
  clauseCategory: string; // e.g. "Payment", "Notice Period", "Termination"
  changeType: ClauseChangeType;
  versionA: string;
  versionB: string;
  changeSummary: string;
  whyItMayMatter: string;
  sourceSectionA?: string;
  sourceSectionB?: string;
  importance: ReviewImportance;
}

export interface DocumentComparisonResult {
  docAName: string;
  docBName: string;
  summaryOfDifferences: string;
  items: ComparisonItem[];
  isDemoMode?: boolean;
}

export interface LegalTermExplanation {
  term: string;
  simpleMeaning: string;
  detailedMeaning: string;
  whyItMatters: string;
  documentContext?: string;
  commonExamples: string[];
  isDemoMode?: boolean;
}

export interface GeneralLegalInfoResponse {
  query: string;
  plainEnglishExplanation: string;
  jurisdictionalLimitations: string;
  keyConcepts: string[];
  practicalNextSteps: string[];
  whenToSeekLawyer: string;
  isDemoMode?: boolean;
}
