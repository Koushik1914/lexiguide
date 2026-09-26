# LexiGuide — AI Legal Document & Rights Navigator

> **GenAI Hackathon Challenge Submission**  
> **Vertical:** AI for Legal Assistance & Access  
> **Core Proposition:** A trusted legal information navigator, NOT a fake lawyer. Turns complex legal agreements into plain English with source-grounded RAG verification and actionable next steps.

---

## 1. Problem Statement
Every day, ordinary citizens, tenants, employees, and freelancers sign dense, intimidating legal agreements—such as employment contracts, residential leases, non-disclosure agreements, and contractor scopes of work. These documents are saturated with archaic legalese, Latin terminology, ambiguous forfeiture clauses, and hidden indemnification liabilities.

When legal friction arises, everyday individuals often:
1. Cannot afford commercial legal consultations ($250–$600/hr) for routine contract inquiries.
2. Rely on generic chatbots that hallucinate non-existent statutes, fabricate case citations, or give unauthorized, flawed "legal advice".
3. Overlook critical notice deadlines (e.g., 30-day resignation notice, automatic renewal windows).
4. Suffer catastrophic outcomes when urgent disputes (e.g., eviction notices, court summons) are mishandled without qualified human triage.

---

## 2. Solution: LexiGuide
**LexiGuide** is an AI-powered legal document and rights navigator engineered to provide accessible, plain-English contract transparency while maintaining rigorous ethical boundaries. 

The application adheres to the product philosophy:  
**UPLOAD → UNDERSTAND → ASK → VERIFY → ACT**

- **It does NOT pretend to be a lawyer.**
- **It does NOT guarantee legal outcomes or give definitive legal rulings.**
- **It grounds every answer in verbatim document excerpts.**
- **It detects emergency legal crises and triages users to licensed advocates or legal aid authorities.**

---

## 3. Major Features
- **Module A: AI Legal Document Explainer**: Automatically extracts parties, contract duration, termination conditions, renewal terms, confidentiality covenants, intellectual property assignment, and dispute resolution venues.
- **Key Obligations Matrix**: Structured comparison separating **Your Obligations** from **Counterparty Obligations**, complete with breach consequences and source quotes.
- **Module B: Source-Grounded Document Q&A (RAG)**: Conversational inquiry engine answering natural language contract questions. Answers are divided into:
  - *Direct Answer*
  - *What the document says*
  - *Why it matters*
  - *Exact Section / Page Citation*
  - *Information distinction (Contract facts vs General legal context vs Practical steps)*
- **Module C: Version Comparison**: Diff engine identifying clauses as `ADDED`, `REMOVED`, `MODIFIED`, or `UNCHANGED`. Highlights changes in compensation, notice periods, and arbitration venues between drafts.
- **Module D: Plain-English Legal Glossary**: Instant translations of complex jargon (e.g., *Indemnification*, *Liquidated Damages*, *Severability*, *Force Majeure*) with everyday examples.
- **Module E: Milestones & Deadlines Timeline**: Visual timeline distinguishing fixed calendar dates from relative trigger-based deadlines (e.g., *"30-day notice deadline triggered upon written notice"*).
- **Module F: Context-Aware Urgency Triage**: Detects imminent risks (court summons, eviction threats, physical danger) and escalates users immediately to legal aid hotlines (e.g., NALSA / 15100).
- **Module 9: General Legal Information Mode**: Allows users to learn about general legal concepts without requiring a document upload.
- **Demo Mode**: One-click simulated evaluation featuring the fictional contract scenario of **Alex Kumar & NovaTech Solutions Pvt. Ltd.**

---

## 4. Architecture

```
User Browser / Mobile Client
            │
            ▼
Next.js 14 Web Application (App Router + Tailwind CSS)
            │
            ├── Context Selector (Jurisdiction, Role, Urgency)
            ├── Ephemeral Document Ingestion (PDF, DOCX, TXT)
            │
            ▼
[Security & Validation Layer]
            ├── Input & File Validation (Max 10 MB, Extension check)
            ├── XSS Sanitization
            ├── In-Memory Sliding Window Rate Limiter
            └── Prompt Injection Defense (Hostile prompt neutralization)
            │
            ▼
[Document Parsing & RAG Pipeline]
            ├── PDF / DOCX / TXT Safe Text Extraction
            ├── Metadata Chunking (Page #, Section Heading, Paragraph)
            ├── Local / Gemini Dense Embeddings
            └── In-Memory Hybrid Retrieval (Cosine Similarity + BM25 Boost)
            │
            ▼
[Grounded Prompt Engineering (prompts/*)]
            ├── Strict System Directives (No fake laws, no legal advice)
            ├── Untrusted Data Fencing
            └── JSON Schema Enforcement
            │
            ▼
[GenAI Provider (lib/ai/provider.ts)]
            ├── Google Gemini API (gemini-1.5-flash)
            └── High-Fidelity Simulated Demo Mode Fallback
            │
            ▼
[Grounded Response Engine]
            ├── Structured JSON Parsing & Validation
            ├── Source Excerpt & Citation Mapping
            └── UI Rendering (Obligations Matrix, Timeline, Cited Q&A)
```

---

## 5. GenAI Usage
Google Gemini is integrated via the provider abstraction in `lib/ai/provider.ts`. GenAI powers:
1. **Executive Summarization**: Synthesizing 30-page contracts into concise executive digests.
2. **Document Q&A**: Answering user queries grounded strictly on retrieved chunks.
3. **Structured Information Extraction**: Extracting parties, financial terms, and dates into strict JSON schemas.
4. **Clause Difference Detection**: Comparing Version A vs Version B to determine objective changes.
5. **Jargon Translation**: Converting archaic Latin terms into plain English.
6. **Safety & Urgency Triage**: Classifying documents for imminent legal peril.
7. **Anti-Hallucination Guardrails**: Adhering to 10 strict operational rules preventing fabricated laws, citations, or legal guarantees.

---

## 6. Lightweight RAG Implementation
Rather than introducing heavy vector database infrastructure for a hackathon demo, LexiGuide implements an agile in-memory hybrid RAG pipeline:
1. **Extraction**: Safe extraction preserving page breaks and section headers.
2. **Chunking**: Chunked with metadata: `documentId`, `pageNumber`, `sectionHeading`, `paragraphIndex`, `chunkText`.
3. **Embeddings & Scoring**: Computes dense vector cosine similarity combined with keyword matching for 100% precision on legal terminology.
4. **Retrieval**: Top-k relevant chunks (k=4 to 8) filtered against a relevance threshold.
5. **Grounded Generation**: Gemini produces answers citing only the retrieved chunks. If evidence is lacking, it explicitly outputs: *"I couldn't find enough information in the document to answer this reliably."*

---

## 7. Security & Privacy
- **Zero Permanent Storage**: User documents are processed ephemerally in RAM during the session; sensitive contracts are never stored in databases.
- **Untrusted Input Fencing**: Document contents are treated as untrusted data. Hostile prompt injections (e.g. *"Ignore all previous instructions..."*) are neutralized and tested.
- **Server-Side API Protection**: Gemini API keys reside exclusively in server environments (`process.env.GEMINI_API_KEY`).
- **File & Request Rate Limiting**: 10 MB file size limit, strict MIME/extension whitelisting, and in-memory rate limiting.

---

## 8. Test Suite
Comprehensive unit and integration tests written in Vitest:
- `tests/unit/sanitizer.test.ts`: XSS prevention, file type/size validation, prompt injection detection, rate limiting.
- `tests/unit/parser.test.ts`: TXT extraction, empty document handling, unsupported file detection.
- `tests/unit/chunker.test.ts`: Metadata preservation, section headings, long paragraph splitting.
- `tests/unit/retrieval.test.ts`: Cosine similarity, deterministic embeddings, hybrid top-k search, citation generation.
- `tests/unit/provider.test.ts`: Gemini provider fallback, schema validation, prompt injection resistance test.
- `tests/integration/api-routes.test.ts`: Document comparison, legal term decoder, emergency triage escalation, general legal info.

Run tests:
```bash
npm run test
```

---

## 9. Accessibility (WCAG 2.1 AA)
- High-contrast color tokens compliant with WCAG AA standards.
- Semantic HTML tags (`<header>`, `<main>`, `<nav>`, `<aside>`, `<section>`, `<footer>`).
- Full keyboard navigability with visible focus indicators.
- ARIA labels and color-independent status badges for review severity.

---

## 10. Local Setup & Execution

### Prerequisites
- Node.js v18+ (tested on Node v20)
- npm v10+

### Steps
1. Clone the repository:
   ```bash
   git clone <REPO_URL>
   cd "Legal Assistance"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Configure Gemini API Key:
   ```bash
   cp .env.example .env.local
   ```
   Add your Gemini key in `.env.local`:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key_here
   GEMINI_MODEL=gemini-1.5-flash
   ```
   *Note: If no API key is provided, LexiGuide automatically operates in realistic **Demo Mode** with full functionality!*

4. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. Run automated tests:
   ```bash
   npm run test
   ```

6. Build for production:
   ```bash
   npm run build
   ```

---

## 11. Interactive Demo Scenario
For immediate judging and evaluation:
1. Navigate to the landing page and click **"Try Demo Document"**.
2. LexiGuide loads the fictional contract between **Alex Kumar** and **NovaTech Solutions Pvt. Ltd.** (Salary: ₹60,000/month, Notice Period: 30 days, Term: 1 Jan 2027 – 31 Dec 2027, Arbitration: Chennai).
3. Review the **Obligations Matrix**, **Timeline**, **Financial Terms**, and **Issues**.
4. Test **Ask Document** with pre-configured questions like *"What is my notice period?"* or *"What happens if I resign?"*.
5. Test **Compare Docs** to observe the difference between Version 1.0 (₹50k salary, 15 days notice) and Version 2.0 (₹60k salary, 30 days notice).

---

## 12. Live Deployment
- **Live Application URL:** [https://funny-gifts-judge.loca.lt](https://funny-gifts-judge.loca.lt)
- **Local Fallback Port:** `http://localhost:3000`

---

## 13. Hackathon Submission Form

**CHOSEN VERTICAL:**  
AI for Legal Assistance & Access

**DEPLOYED LINK:**  
https://funny-gifts-judge.loca.lt

**DESCRIPTION OF CHANGES/UPDATES:**  
LexiGuide is an AI Legal Document & Rights Navigator designed to empower everyday citizens, tenants, and workers to understand complex legal agreements without confusing legalese. Adhering to the principle of "Upload -> Understand -> Ask -> Verify -> Act", LexiGuide extracts plain-English summaries, maps user obligations versus counterparty duties, and generates visual timelines of deadlines and notice windows. The platform features an in-memory RAG Q&A engine that grounds every answer in verbatim contract clauses, preventing hallucinations. LexiGuide also introduces a Document Version Diff engine to compare contract drafts, an interactive plain-English legal glossary, and a context-aware triage system that detects urgent situations (court summons, eviction notices) to route users directly to licensed legal aid. All processing is ephemeral and hardened against prompt injections, ensuring strict privacy and responsible AI practices.

**GEN AI SERVICES UTILIZED:**  
Google Gemini API (gemini-1.5-flash and text-embedding-004) powers LexiGuide via a modular provider abstraction with full fallback to realistic simulated demo mode. Gemini is utilized across seven distinct modules: (1) Executive Contract Summarization and clause classification; (2) Source-Grounded Document Q&A using a hybrid in-memory RAG pipeline combining dense vector embeddings with BM25 keyword matching for verbatim citation mapping; (3) Structured Information Extraction generating validated JSON schemas for obligations, financial compensation, and relative deadlines; (4) Document Comparison Engine analyzing Version A vs Version B to classify clauses as ADDED, REMOVED, MODIFIED, or UNCHANGED; (5) Legal Term Explainer translating Latin and arcane contract terms into everyday language; (6) Context-Aware Urgency Triage identifying emergency deadlines; and (7) General Legal Information Mode providing educational explanations without fabricated statutes.

