'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Cpu, 
  Database, 
  Lock, 
  AlertTriangle, 
  CheckCircle2, 
  Scale, 
  FileCode,
  ArrowRight
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-10 max-w-4xl mx-auto py-6 text-slate-800">
      {/* Title */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
          System Overview & Trust
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          About LexiGuide Architecture & Security
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          Engineered for the GenAI Hackathon Challenge (Vertical: AI for Legal Assistance & Access).
          LexiGuide operates as an educational rights navigator, combining lightweight in-memory RAG, Google Gemini, and strict hallucination prevention.
        </p>
      </div>

      {/* ASCII Architecture Section */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-blue-600" />
          Technical Architecture Pipeline
        </h2>

        <pre className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed">
{`User Upload (PDF / DOCX / TXT) or Context Selection
           │
           ▼
[Security Validation & Prompt Injection Defense]
           │
           ▼
[Document Parser & Page Boundary Extraction]
           │
           ▼
[Metadata Chunking (Section, Page, Paragraph)]
           │
           ▼
[In-Memory Hybrid Vector Store (Cosine Sim + BM25)]
           │
           ├─── Top-K Relevant Chunks
           │
           ▼
[Prompt Engineering & Strict Fencing (prompts/*)]
           │
           ▼
[Google Gemini API (gemini-1.5-flash / text-embedding-004)]
   (Automatic fallback to realistic simulated demo mode if no API key)
           │
           ▼
[JSON Schema Validation & Source Excerpt Matching]
           │
           ▼
[Responsive UI: Plain English, Timeline, Obligations, Cited Q&A]`}
        </pre>
      </section>

      {/* Where GenAI is Utilized */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Database className="w-5 h-5 text-indigo-600" />
          GenAI Capabilities Implemented
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <strong className="text-slate-900 block font-semibold">1. Executive Summarization</strong>
            <p className="text-slate-600">Extracts parties, agreement purpose, duration, and governance in plain English.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <strong className="text-slate-900 block font-semibold">2. Source-Grounded Document Q&A</strong>
            <p className="text-slate-600">Lightweight RAG retrieval citing verbatim clause excerpts without hallucination.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <strong className="text-slate-900 block font-semibold">3. Obligations Matrix</strong>
            <p className="text-slate-600">Separates user obligations from counterparty duties with breach consequences.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <strong className="text-slate-900 block font-semibold">4. Document Version Diff</strong>
            <p className="text-slate-600">Classifies clauses as ADDED, REMOVED, MODIFIED, or UNCHANGED with objective impact summaries.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <strong className="text-slate-900 block font-semibold">5. Legal Term Explainer</strong>
            <p className="text-slate-600">Decodes jargon (Indemnification, Arbitration, Force Majeure) with real-world examples.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <strong className="text-slate-900 block font-semibold">6. Urgent Safety Triage</strong>
            <p className="text-slate-600">Detects emergency deadlines, court summons, or eviction and routes users to legal aid.</p>
          </div>
        </div>
      </section>

      {/* Security & Privacy */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          Security, Privacy & Responsible AI
        </h2>

        <ul className="space-y-2.5 text-xs text-slate-600">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
            <span><strong>Untrusted Data Isolation:</strong> Document texts and user queries are treated as untrusted inputs. Prompt injection phrases ("Ignore previous instructions") are fenced inertly and tested against automated suites.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
            <span><strong>Zero Permanent Storage:</strong> Uploaded documents are parsed ephemerally in server memory during the active session. No user contracts are logged or stored to persistent disks.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
            <span><strong>No Fabricated Legal Authorities:</strong> The system strictly prohibits hallucinating statute sections, court precedents, or case law names.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
            <span><strong>Accessible Design:</strong> High contrast color tokens, semantic HTML, visible keyboard focus rings, and screen-reader compliant ARIA labels (WCAG 2.1 AA).</span>
          </li>
        </ul>
      </section>

      {/* Assumptions & Limitations */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          Assumptions & Known Limitations
        </h2>

        <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
          <p>
            • <strong>Informational Assistance Only:</strong> LexiGuide is not a substitute for a licensed advocate, solicitor, or attorney. Legal interpretation varies by local court jurisdiction and facts outside the document.
          </p>
          <p>
            • <strong>Scanned Documents:</strong> LexiGuide supports text-based PDF, DOCX, and TXT. Scanned image-only PDFs without OCR text layers require pre-conversion.
          </p>
          <p>
            • <strong>Complex Cross-Referencing:</strong> Agreements referencing dozens of external unprovided exhibits or Master Services Agreements (MSAs) cannot be fully analyzed if those schedules are omitted.
          </p>
        </div>
      </section>

      <div className="text-center pt-4">
        <Link
          href="/documents?demo=true"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all"
        >
          Launch Live Interactive Demo
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
