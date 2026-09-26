// lib/ai/provider.ts
// Configurable GenAI provider abstraction with Google Gemini support and transparent demo mode fallback.

import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateLocalEmbedding } from '../rag/vector-store';

export interface AIProvider {
  name: string;
  isAvailable(): boolean;
  generateText(prompt: string, systemPrompt?: string): Promise<{ text: string; isDemo: boolean }>;
  generateStructuredOutput<T>(prompt: string, systemPrompt?: string): Promise<{ data: T; isDemo: boolean }>;
  generateEmbedding(text: string): Promise<number[]>;
}

class GeminiProvider implements AIProvider {
  name = 'Google Gemini';
  private client: GoogleGenerativeAI | null = null;
  private modelName: string;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    this.modelName = process.env.GEMINI_MODEL?.trim() || 'gemini-1.5-flash';
    if (apiKey) {
      this.client = new GoogleGenerativeAI(apiKey);
    }
  }

  isAvailable(): boolean {
    return !!this.client;
  }

  async generateText(prompt: string, systemPrompt?: string): Promise<{ text: string; isDemo: boolean }> {
    if (!this.client) {
      return {
        text: this.getSimulatedTextResponse(prompt),
        isDemo: true,
      };
    }

    try {
      const model = this.client.getGenerativeModel({
        model: this.modelName,
        systemInstruction: systemPrompt,
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return {
        text: response.text(),
        isDemo: false,
      };
    } catch (error: any) {
      console.warn(`[Gemini API Error, falling back to simulated output]:`, error?.message);
      return {
        text: this.getSimulatedTextResponse(prompt),
        isDemo: true,
      };
    }
  }

  async generateStructuredOutput<T>(prompt: string, systemPrompt?: string): Promise<{ data: T; isDemo: boolean }> {
    if (!this.client) {
      return {
        data: this.getSimulatedStructuredData<T>(prompt),
        isDemo: true,
      };
    }

    try {
      const model = this.client.getGenerativeModel({
        model: this.modelName,
        systemInstruction: systemPrompt,
        generationConfig: {
          responseMimeType: 'application/json',
        },
      });

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      const cleaned = responseText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
      const parsed = JSON.parse(cleaned) as T;
      return {
        data: parsed,
        isDemo: false,
      };
    } catch (error: any) {
      console.warn(`[Gemini API JSON Error, falling back to simulated output]:`, error?.message);
      return {
        data: this.getSimulatedStructuredData<T>(prompt),
        isDemo: true,
      };
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    if (this.client) {
      try {
        const embeddingModel = this.client.getGenerativeModel({ model: 'text-embedding-004' });
        const res = await embeddingModel.embedContent(text);
        if (res.embedding?.values) {
          return res.embedding.values;
        }
      } catch (err) {
        // Fall back to dense local embedding
      }
    }
    return generateLocalEmbedding(text);
  }

  // Realistic simulated responses for Demo Mode (Hackathon Evaluation)
  private getSimulatedTextResponse(prompt: string): string {
    return `[Demo Mode — simulated AI response]\n\nBased on the document text provided, the agreement outlines standard contractual obligations, including a 30-day notice period and dispute resolution through arbitration.`;
  }

  private getSimulatedStructuredData<T>(prompt: string): T {
    const promptLower = prompt.toLowerCase();

    // Check if this is a Legal Triage prompt
    if (promptLower.includes('evaluate the urgency') || promptLower.includes('urgency and safety')) {
      const isUrgent = promptLower.includes('urgent') || promptLower.includes('vacate') || promptLower.includes('court') || promptLower.includes('48 hours');
      return {
        isEscalated: isUrgent,
        urgencyCategory: isUrgent ? 'URGENT' : 'NORMAL',
        triggerReasons: isUrgent ? ['Immediate response deadline detected in notice', 'Potential threat of eviction or court proceedings'] : [],
        recommendedAction: isUrgent ? 'Prompt assistance from a qualified legal professional or local legal aid clinic is strongly advised.' : 'Standard matter. No immediate emergency triage needed.',
        safetyAdvisory: isUrgent ? 'Ensure your physical safety and seek official legal assistance before the deadline expires.' : undefined,
      } as unknown as T;
    }

    // Check if this is a Document Comparison prompt
    if (promptLower.includes('compare document a') || promptLower.includes('document a:')) {
      return {
        docAName: 'Version 1.0 (Initial Offer)',
        docBName: 'Version 2.0 (Revised Agreement)',
        summaryOfDifferences: 'Version 2.0 increases the monthly compensation from ₹50,000 to ₹60,000, extends the required termination notice period from 15 days to 30 days, adds a specific confidentiality retention period, and clarifies the arbitration seat in Chennai.',
        items: [
          {
            id: 'cmp-1',
            clauseCategory: 'Compensation / Financial Terms',
            changeType: 'MODIFIED',
            versionA: 'Salary: ₹50,000 per month payable on the last working day.',
            versionB: 'Salary: ₹60,000 per month payable on the last working day.',
            changeSummary: 'Monthly compensation increased by ₹10,000 (20% increase).',
            whyItMayMatter: 'Higher direct compensation for employee services rendered.',
            sourceSectionA: 'Section 3.1',
            sourceSectionB: 'Section 3.1',
            importance: 'HIGH',
          },
          {
            id: 'cmp-2',
            clauseCategory: 'Termination Notice Period',
            changeType: 'MODIFIED',
            versionA: 'Either party may terminate this agreement by giving 15 days written notice.',
            versionB: 'Either party may terminate this agreement by giving 30 days written notice.',
            changeSummary: 'Notice period increased from 15 days to 30 days.',
            whyItMayMatter: 'Provides greater transition time for both parties, but delays quick separation.',
            sourceSectionA: 'Section 7.2',
            sourceSectionB: 'Section 7.2',
            importance: 'MEDIUM',
          },
          {
            id: 'cmp-3',
            clauseCategory: 'Non-Disclosure Duration',
            changeType: 'ADDED',
            versionA: 'Standard general non-disclosure without stated post-termination duration.',
            versionB: 'Confidentiality obligations survive for 2 years following termination.',
            changeSummary: 'Explicit 2-year post-termination confidentiality obligation added.',
            whyItMayMatter: 'Employee remains legally bound to protect company confidential data for 24 months after leaving.',
            sourceSectionA: 'Section 5',
            sourceSectionB: 'Section 5.3',
            importance: 'MEDIUM',
          },
          {
            id: 'cmp-4',
            clauseCategory: 'Dispute Resolution Venue',
            changeType: 'MODIFIED',
            versionA: 'Courts of competent jurisdiction in India.',
            versionB: 'Sole arbitrator appointed under Arbitration and Conciliation Act, seat in Chennai.',
            changeSummary: 'Dispute forum changed from general courts to binding arbitration in Chennai.',
            whyItMayMatter: 'Disputes will be handled through private arbitration rather than public courtroom litigation.',
            sourceSectionA: 'Section 9.1',
            sourceSectionB: 'Section 9.1',
            importance: 'MEDIUM',
          },
        ],
      } as unknown as T;
    }

    // Check if this is a Document QA prompt
    if (promptLower.includes('user question:') || promptLower.includes('directanswer')) {
      // Determine question subject
      if (promptLower.includes('notice') || promptLower.includes('resign')) {
        return {
          directAnswer: 'You must provide 30 calendar days of written notice prior to terminating or resigning from the agreement.',
          whatDocumentSays: 'Section 7.2 specifies that either party may terminate the employment relationship by tendering thirty (30) days written notice to the other party, or by paying salary in lieu thereof if mutually agreed in writing.',
          whyItMatters: 'If you leave without serving the 30-day notice period, the employer may claim salary deductions or delay handing over relieving documentation.',
          source: {
            pageOrSection: 'Section 7.2 (Termination & Notice)',
            excerpts: ['Either party may terminate this agreement by giving thirty (30) days prior written notice to the other party.'],
          },
          informationDistinction: {
            documentFacts: 'The contract text explicitly fixes the notice duration at thirty (30) calendar days.',
            generalLegalInfo: 'In Indian employment contracts, notice periods typically range between 30 and 90 days. State Shops & Establishments Acts often mandate at least 30 days notice for regular employees.',
            practicalImplications: 'Provide resignation via formal tracked email and obtain written confirmation of your last working day.',
          },
          confidence: 'HIGH',
          disclaimer: 'This is general legal information based on the document provided, not legal advice.',
          citations: [
            {
              chunkId: 'demo-chunk-7',
              pageNumber: 2,
              sectionHeading: 'Section 7: Termination',
              excerptSnippet: 'Either party may terminate this agreement by giving thirty (30) days prior written notice...',
            },
          ],
        } as unknown as T;
      }

      if (promptLower.includes('salary') || promptLower.includes('payment') || promptLower.includes('earn')) {
        return {
          directAnswer: 'Your monthly compensation is ₹60,000 per month, payable on or before the last working day of each calendar month.',
          whatDocumentSays: 'Section 3.1 provides for a gross monthly salary of ₹60,000 (Rupees Sixty Thousand), subject to statutory tax deductions (TDS and provident fund where applicable).',
          whyItMatters: 'This establishes your fixed gross salary baseline and payment frequency.',
          source: {
            pageOrSection: 'Section 3.1 (Compensation & Benefits)',
            excerpts: ['The Company agrees to pay the Employee a monthly gross salary of ₹60,000/- payable on the last business day of each month.'],
          },
          informationDistinction: {
            documentFacts: 'Monthly gross compensation is ₹60,000 with monthly payment frequency.',
            generalLegalInfo: 'Employers are required under the Payment of Wages Act and Indian tax laws to deduct applicable TDS and remit wages within statutory timelines.',
            practicalImplications: 'Verify that monthly salary slips reflect correct gross amounts and statutory deductions.',
          },
          confidence: 'HIGH',
          disclaimer: 'This is general legal information based on the document provided, not legal advice.',
          citations: [
            {
              chunkId: 'demo-chunk-3',
              pageNumber: 1,
              sectionHeading: 'Section 3: Compensation',
              excerptSnippet: 'The Company agrees to pay the Employee a monthly gross salary of ₹60,000/-...',
            },
          ],
        } as unknown as T;
      }

      if (promptLower.includes('arbitrat') || promptLower.includes('dispute')) {
        return {
          directAnswer: 'Yes, disputes must be settled through binding arbitration conducted by a sole arbitrator with the seat in Chennai.',
          whatDocumentSays: 'Section 9 stipulates that any dispute arising out of or in connection with this agreement shall be referred to arbitration under the Arbitration and Conciliation Act, 1996.',
          whyItMatters: 'You cannot immediately file a regular civil court lawsuit; any claims must first be submitted to arbitration in Chennai.',
          source: {
            pageOrSection: 'Section 9.1 (Dispute Resolution)',
            excerpts: ['Any dispute or difference arising out of this Agreement shall be referred to arbitration in accordance with the Arbitration and Conciliation Act, 1996. The seat of arbitration shall be Chennai, India.'],
          },
          informationDistinction: {
            documentFacts: 'Binding arbitration under the 1996 Act with seat in Chennai.',
            generalLegalInfo: 'Arbitration clauses are common in modern employment and commercial contracts in India to expedite resolution outside backlogged civil courts.',
            practicalImplications: 'Arbitration fees can be significant; ensure informal discussions or mediation are attempted before invoking arbitration.',
          },
          confidence: 'HIGH',
          disclaimer: 'This is general legal information based on the document provided, not legal advice.',
          citations: [
            {
              chunkId: 'demo-chunk-9',
              pageNumber: 3,
              sectionHeading: 'Section 9: Dispute Resolution',
              excerptSnippet: 'Any dispute or difference arising out of this Agreement shall be referred to arbitration...',
            },
          ],
        } as unknown as T;
      }

      // Default question fallback
      return {
        directAnswer: 'The document covers the specified topic in its operational terms and mutual obligations clauses.',
        whatDocumentSays: 'According to the agreement provisions, the parties have defined reciprocal obligations, clear termination triggers, and confidentiality terms.',
        whyItMatters: 'Understanding these requirements protects your professional standing and clarifies rights upon separation.',
        source: {
          pageOrSection: 'Sections 4, 7, and 9',
          excerpts: ['Parties agree to fulfill covenants in good faith and adhere to notice and non-disclosure standards.'],
        },
        informationDistinction: {
          documentFacts: 'The agreement establishes terms governing employment duration, compensation, and duties.',
          generalLegalInfo: 'Contracts are interpreted by their objective written wording under applicable governing law.',
          practicalImplications: 'Retain an executed duplicate copy and review milestones before taking any unilateral steps.',
        },
        confidence: 'MEDIUM',
        disclaimer: 'This is general legal information based on the document provided, not legal advice.',
        citations: [],
      } as unknown as T;
    }

    // Check if this is a Legal Term Explainer prompt
    if (promptLower.includes('legal term to explain:')) {
      const match = prompt.match(/LEGAL TERM TO EXPLAIN:\s*"([^"]+)"/i);
      const term = match ? match[1] : 'Indemnification';

      const glossary: Record<string, any> = {
        indemnification: {
          term: 'Indemnification',
          simpleMeaning: 'An agreement where one party promises to compensate the other for certain financial losses, lawsuits, or damages.',
          detailedMeaning: 'An indemnity clause shifts financial liability. If a third party sues the protected party due to the actions or breach of the indemnifying party, the indemnifying party must cover the legal costs, judgments, and settlements.',
          whyItMatters: 'If you sign a broad indemnity, you could be personally on the hook for substantial legal fees or damages even if you did not act intentionally.',
          documentContext: 'In this agreement, the clause requires mutual protection against unauthorized disclosures or gross negligence.',
          commonExamples: [
            'A freelance software engineer agrees to indemnify a client if their code accidentally infringes a third-party copyright.',
            'A tenant agrees to indemnify a landlord for damages caused by the tenant’s visiting guests.',
          ],
        },
        arbitration: {
          term: 'Arbitration',
          simpleMeaning: 'A private way of resolving legal disputes outside of public government courts, led by a neutral private judge called an arbitrator.',
          detailedMeaning: 'Both parties agree that instead of going to public civil court with a judge and jury, a designated neutral specialist will hear the evidence and deliver a legally binding decision.',
          whyItMatters: 'Arbitration is often faster and confidential, but it usually eliminates the right to appeal to higher courts, and costs for the arbitrator can be high.',
          documentContext: 'This agreement specifies arbitration in Chennai under the Indian Arbitration and Conciliation Act, 1996.',
          commonExamples: [
            'Two companies resolve a supply contract breach through an arbitrator rather than waiting years in court.',
            'An employment contract mandating arbitration before either party can file a claim.',
          ],
        },
        'liquidated damages': {
          term: 'Liquidated Damages',
          simpleMeaning: 'A pre-agreed sum of money specified in the contract that must be paid if one party breaks a specific rule.',
          detailedMeaning: 'Instead of having a court spend time calculating the exact financial loss from a breach, both parties estimate and agree in advance on the dollar or rupee figure owed upon default.',
          whyItMatters: 'Under Indian and common law, liquidated damages must be a genuine pre-estimate of loss, not an arbitrary punishment or penalty.',
          documentContext: 'Seen frequently in service delivery and construction contracts for each day of delay beyond deadlines.',
          commonExamples: [
            'Paying ₹1,000 for every day a project delivery is delayed beyond the agreed milestone.',
            'A fixed penalty fee for early breach of lease terms.',
          ],
        },
      };

      const key = term.toLowerCase().trim();
      return (glossary[key] || {
        term: term,
        simpleMeaning: `A legal provision that establishes specific rights, duties, or liability limits between contracting parties.`,
        detailedMeaning: `The term '${term}' refers to a recognized contractual mechanism designed to allocate risk, establish formal procedures, or clarify legal obligations.`,
        whyItMatters: `Understanding '${term}' ensures you do not inadvertently assume liabilities or waive rights you intended to preserve.`,
        documentContext: `Used in the operative provisions of the agreement to bind the signatories.`,
        commonExamples: [
          `Standard contract term applied in commercial and employment agreements.`,
          `Procedural mechanism defining how parties must interact during contract execution.`,
        ],
      }) as unknown as T;
    }

    // Check if this is General Legal Info prompt
    if (promptLower.includes('user general legal question:')) {
      return {
        query: 'General Legal Information',
        plainEnglishExplanation: 'In contract law, an agreement is formed when an offer is accepted with lawful consideration and the mutual intention to create legal relations. Written agreements provide clarity on each party’s expectations, compensation, deliverables, and termination triggers.',
        jurisdictionalLimitations: 'Contractual enforceability, statutory employee protections, tenant rights, and limitation periods vary significantly between countries (e.g., India, US, UK) and local states or provinces.',
        keyConcepts: [
          'Mutual Consent: Both parties must genuinely agree to the terms without coercion or fraud.',
          'Consideration: Something of value (salary, goods, services, rent) must be exchanged.',
          'Notice Requirements: Rules governing how and when parties may withdraw or end the relationship.',
        ],
        practicalNextSteps: [
          'Always keep signed copies and written records of emails and notices.',
          'Review the exact wording of termination and dispute resolution clauses.',
          'Check local state laws or consult a legal clinic if facing imminent deadlines.',
        ],
        whenToSeekLawyer: 'Consult a qualified lawyer if you are served with formal court notices, face substantial financial penalties, or suspect unlawful discrimination or breach.',
      } as unknown as T;
    }

    // Default: Full Document Analysis Structured Data (Alex Kumar & NovaTech Solutions scenario)
    return {
      executiveSummary: 'This is a standard 1-year full-time Employment Agreement between NovaTech Solutions Pvt. Ltd. (Employer) and Alex Kumar (Employee). It specifies a gross compensation of ₹60,000 per month, standard 30-day notice for termination, confidentiality covenants, company IP assignment, and dispute resolution via arbitration in Chennai.',
      parties: {
        userParty: { name: 'Alex Kumar', role: 'Employee' },
        counterparty: { name: 'NovaTech Solutions Pvt. Ltd.', role: 'Employer' },
        otherParties: [],
      },
      purposeOfAgreement: 'To define the terms, conditions, duties, compensation, and separation rules governing the employment of Alex Kumar as a Senior Software Associate at NovaTech Solutions Pvt. Ltd.',
      contractDuration: '1 January 2027 to 31 December 2027 (12-month fixed initial term, renewable upon mutual written agreement).',
      terminationConditions: 'Either party may terminate the agreement at any time by serving 30 days prior written notice. Immediate termination is permitted for willful misconduct, fraud, or material breach.',
      renewalConditions: 'Subject to annual performance review and mutual written consent 30 days prior to contract expiration.',
      noticePeriods: '30 calendar days written notice for standard termination or resignation.',
      penalties: 'Salary deduction in lieu of notice if employee leaves without serving the mandatory 30 days; damages for breach of confidentiality.',
      liabilityClauses: 'Employee indemnifies company against claims arising from gross negligence or intentional violation of company security policies.',
      confidentialityClauses: 'Strict non-disclosure of proprietary software, customer lists, and financial records during and for 2 years following employment.',
      intellectualPropertyClauses: 'All code, designs, and inventions created during employment are the sole intellectual property of NovaTech Solutions Pvt. Ltd.',
      disputeResolution: 'Sole arbitrator appointed under the Indian Arbitration and Conciliation Act, 1996. Seat of arbitration is Chennai, Tamil Nadu.',
      governingLaw: 'Laws of India and the jurisdiction of Tamil Nadu courts.',
      jurisdictionClause: 'Chennai, Tamil Nadu, India.',
      obligations: [
        {
          id: 'ob-1',
          party: 'USER',
          partyName: 'Alex Kumar',
          description: 'Serve 30 days written notice prior to resignation or departure.',
          consequenceIfBreached: 'Employer may withhold salary or relieve documentation for unserved notice days.',
          source_excerpt: 'Section 7.2: Either party may terminate by providing thirty (30) days prior written notice.',
          page_or_section: 'Section 7.2',
          importance: 'HIGH',
        },
        {
          id: 'ob-2',
          party: 'USER',
          partyName: 'Alex Kumar',
          description: 'Assign all intellectual property, software code, and inventions developed during employment to NovaTech Solutions.',
          consequenceIfBreached: 'Legal action for breach of copyright and intellectual property assignment covenants.',
          source_excerpt: 'Section 6.1: All intellectual property, inventions, and works created shall be the exclusive property of the Employer.',
          page_or_section: 'Section 6.1',
          importance: 'HIGH',
        },
        {
          id: 'ob-3',
          party: 'USER',
          partyName: 'Alex Kumar',
          description: 'Maintain strict confidentiality of proprietary company data for 2 years post-employment.',
          consequenceIfBreached: 'Company may seek injunctions and compensatory damages.',
          source_excerpt: 'Section 5.3: Confidentiality obligations shall survive termination for a period of two (2) years.',
          page_or_section: 'Section 5.3',
          importance: 'MEDIUM',
        },
        {
          id: 'ob-4',
          party: 'COUNTERPARTY',
          partyName: 'NovaTech Solutions Pvt. Ltd.',
          description: 'Pay gross monthly remuneration of ₹60,000 on or before the last working day of each calendar month.',
          consequenceIfBreached: 'Employee may initiate dispute resolution or file wage recovery complaints.',
          source_excerpt: 'Section 3.1: The Employer shall pay a monthly salary of ₹60,000/- on the last business day.',
          page_or_section: 'Section 3.1',
          importance: 'HIGH',
        },
        {
          id: 'ob-5',
          party: 'COUNTERPARTY',
          partyName: 'NovaTech Solutions Pvt. Ltd.',
          description: 'Provide statutory benefits including Provident Fund and healthcare enrollment as per applicable company policy.',
          consequenceIfBreached: 'Statutory non-compliance under Indian labor laws.',
          source_excerpt: 'Section 3.4: Employee shall be entitled to standard statutory benefits and leave policies.',
          page_or_section: 'Section 3.4',
          importance: 'MEDIUM',
        },
      ],
      importantDates: [
        {
          id: 'dt-1',
          title: 'Contract Start Date',
          dateOrRelative: '01 Jan 2027',
          isRelative: false,
          explanation: 'Official commencement of employment and salary accrual.',
          source_excerpt: 'Section 2.1: This Agreement shall commence on January 1, 2027.',
          page_or_section: 'Section 2.1',
        },
        {
          id: 'dt-2',
          title: 'Renewal Notice Window',
          dateOrRelative: '01 Dec 2027',
          isRelative: false,
          explanation: 'Window to initiate discussions regarding term extension or contract renewal.',
          source_excerpt: 'Section 2.3: Renewal negotiations shall commence at least 30 days prior to expiry.',
          page_or_section: 'Section 2.3',
        },
        {
          id: 'dt-3',
          title: 'Contract End Date',
          dateOrRelative: '31 Dec 2027',
          isRelative: false,
          explanation: 'Expiration of the initial 12-month fixed-term contract unless renewed.',
          source_excerpt: 'Section 2.2: The initial term shall conclude on December 31, 2027.',
          page_or_section: 'Section 2.2',
        },
        {
          id: 'dt-4',
          title: 'Termination Notice Period',
          dateOrRelative: '30-day deadline',
          isRelative: true,
          explanation: 'Exact calendar date depends on the date written notice is formally submitted by either party.',
          source_excerpt: 'Section 7.2: ...giving thirty (30) days prior written notice to the other party.',
          page_or_section: 'Section 7.2',
        },
      ],
      financialTerms: [
        {
          id: 'fn-1',
          title: 'Monthly Fixed Compensation',
          amountOrFormula: '₹60,000 / month',
          frequency: 'Monthly',
          responsibleParty: 'NovaTech Solutions Pvt. Ltd.',
          notes: 'Gross salary subject to applicable tax deductions at source (TDS).',
          source_excerpt: 'Section 3.1: Gross monthly salary of ₹60,000/-',
          page_or_section: 'Section 3.1',
        },
        {
          id: 'fn-2',
          title: 'Notice Period Buyout (If Applicable)',
          amountOrFormula: 'Pro-rata monthly salary for unserved days',
          frequency: 'One-time on exit',
          responsibleParty: 'Departing Party',
          notes: 'Allowed only upon mutual written agreement in lieu of serving notice.',
          source_excerpt: 'Section 7.3: Payment in lieu of notice may be accepted upon mutual written consent.',
          page_or_section: 'Section 7.3',
        },
      ],
      findings: [
        {
          id: 'fd-1',
          title: '30-Day Notice Period Requirement',
          category: 'Important',
          explanation: 'Both parties must give at least 30 days written notice to end the agreement. Ensure you plan transitions carefully before tendering notice.',
          source_excerpt: 'Section 7.2: Either party may terminate this agreement by giving thirty (30) days prior written notice.',
          page_or_section: 'Section 7.2',
          severity: 'HIGH',
          confidence: 'HIGH',
        },
        {
          id: 'fd-2',
          title: 'Two-Year Post-Termination Confidentiality',
          category: 'Requires Attention',
          explanation: 'Your obligation to keep company technical and client data confidential persists for two full years after your employment ends.',
          source_excerpt: 'Section 5.3: Confidentiality obligations shall survive termination for a period of two (2) years.',
          page_or_section: 'Section 5.3',
          severity: 'MEDIUM',
          confidence: 'HIGH',
        },
        {
          id: 'fd-3',
          title: 'Dispute Resolution via Private Arbitration in Chennai',
          category: 'Potential Risk',
          explanation: 'Disputes cannot be filed in regular court initially; they must be resolved through binding arbitration in Chennai, which can involve arbitrator fees.',
          source_excerpt: 'Section 9.1: Disputes shall be referred to arbitration in Chennai under the Arbitration and Conciliation Act, 1996.',
          page_or_section: 'Section 9.1',
          severity: 'MEDIUM',
          confidence: 'HIGH',
        },
        {
          id: 'fd-4',
          title: 'Broad Intellectual Property Assignment',
          category: 'User Obligation',
          explanation: 'All inventions and software written during working hours or using company equipment belong 100% to the employer.',
          source_excerpt: 'Section 6.1: All intellectual property shall be the exclusive property of the Employer.',
          page_or_section: 'Section 6.1',
          severity: 'HIGH',
          confidence: 'HIGH',
        },
        {
          id: 'fd-5',
          title: 'Ambiguity on Performance Bonus Criteria',
          category: 'Ambiguous',
          explanation: 'The contract mentions discretionary bonuses but does not specify quantifiable metrics or payment timelines.',
          source_excerpt: 'Section 3.3: Annual discretionary performance incentive may be awarded at company discretion.',
          page_or_section: 'Section 3.3',
          severity: 'LOW',
          confidence: 'MEDIUM',
        },
      ],
      suggestedNextSteps: [
        {
          title: 'Verify Bank Account and Tax PAN Details',
          description: 'Ensure payroll has your active PAN and bank details for accurate TDS certificate (Form 16) generation.',
          category: 'ACTION',
        },
        {
          title: 'Clarify Bonus Metrics in Writing',
          description: 'Request written clarification from HR regarding the performance benchmarks required for discretionary bonuses.',
          category: 'VERIFICATION',
        },
        {
          title: 'Retain Fully Signed Duplicate Copy',
          description: 'Keep a counter-signed copy stamped by NovaTech Solutions Pvt. Ltd. for your personal records.',
          category: 'ACTION',
        },
        {
          title: 'Consult Qualified Advocate for Unclear Terms',
          description: 'If you have questions about the scope of the 2-year confidentiality clause or arbitration costs, consider consulting a legal specialist.',
          category: 'PROFESSIONAL_ASSISTANCE',
        },
      ],
      triageEscalation: {
        isEscalated: false,
        urgencyCategory: 'NORMAL',
        triggerReasons: [],
        recommendedAction: 'Standard employment agreement. No immediate emergency or court escalation required.',
      },
    } as unknown as T;
  }
}

// Singleton provider instance
export const aiProvider: AIProvider = new GeminiProvider();
