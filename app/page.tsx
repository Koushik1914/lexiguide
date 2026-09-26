'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FileText, 
  HelpCircle, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  GitCompare, 
  BookOpen, 
  Calendar, 
  Lock, 
  Scale, 
  AlertTriangle,
  Building2,
  UserCheck
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="space-y-16 py-6 sm:py-10">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>GenAI Legal Access Challenge • Source-Grounded RAG</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
          Understand Legal Documents. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
            Make Informed Next Steps.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          AI-powered legal information that turns complex documents into clear, understandable information.
          Never replaces a lawyer — empowers everyday citizens with verified facts, obligations, and deadlines.
        </p>

        {/* Primary and Secondary CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
          <Link
            href="/documents"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Analyze a Document
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/ask"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <HelpCircle className="w-4 h-4 text-slate-500" />
            Ask a Legal Question
          </Link>

          <Link
            href="/documents?demo=true"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            Try Demo Document
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
          <span className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Zero Hallucination Retrieval
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <Lock className="w-4 h-4 text-blue-600" />
            Ephemeral In-Memory Privacy
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            Prompt Injection Hardened
          </span>
        </div>
      </section>

      {/* Value Proposition: Upload -> Understand -> Ask -> Verify -> Act */}
      <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
            Core Philosophy
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            A Legal Navigator, Not a Fake Lawyer
          </h2>
          <p className="text-xs text-slate-500">
            UPLOAD → UNDERSTAND → ASK → VERIFY → ACT
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
              1
            </div>
            <h3 className="text-sm font-bold text-slate-900">Upload Safely</h3>
            <p className="text-xs text-slate-500">
              PDF, DOCX, or TXT. Ephemeral parsing with zero permanent storage.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
              2
            </div>
            <h3 className="text-sm font-bold text-slate-900">Plain English</h3>
            <p className="text-xs text-slate-500">
              Executive summaries and party duties stripped of legal jargon.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
              3
            </div>
            <h3 className="text-sm font-bold text-slate-900">Ask Document</h3>
            <p className="text-xs text-slate-500">
              Conversational RAG Q&A backed by exact contract section quotes.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
              4
            </div>
            <h3 className="text-sm font-bold text-slate-900">Verify Grounding</h3>
            <p className="text-xs text-slate-500">
              Every answer highlights exact verbatim clauses and confidence levels.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
              5
            </div>
            <h3 className="text-sm font-bold text-slate-900">Act In Confidence</h3>
            <p className="text-xs text-slate-500">
              Visual timelines, safety triage, and clear guidance on when to seek an attorney.
            </p>
          </div>
        </div>
      </section>

      {/* Major Features Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">
            Engineered for Real-World Legal Clarity
          </h2>
          <p className="text-xs text-slate-500">
            Comprehensive tools built specifically to protect users from overlooked contractual pitfalls.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Obligations Matrix */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Obligations Matrix</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Clear breakdown of your obligations versus counterparty obligations. Identifies non-competes, deliverables, and consequences of breach with direct source citations.
            </p>
            <Link href="/documents" className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline pt-2">
              Explore Analysis <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2: Grounded Document RAG */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Source-Grounded RAG Q&A</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Ask questions naturally. The system indexes document chunks, retrieves verified snippets, and prevents hallucinations by strictly citing clause numbers and excerpts.
            </p>
            <Link href="/dashboard" className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline pt-2">
              Test Q&A Engine <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3: Important Dates Timeline */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Milestones & Deadlines Timeline</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Automatically captures contract effective dates, renewal notice windows, and relative deadlines (such as 30-day notice periods), clarifying triggering conditions.
            </p>
            <Link href="/dashboard" className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline pt-2">
              View Timeline View <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 4: Document Comparison */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <GitCompare className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Version Comparison</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Compare an initial offer draft against a revised contract. Pinpoints added indemnity clauses, modified salaries, altered notice windows, and venue switches.
            </p>
            <Link href="/compare" className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline pt-2">
              Compare Two Drafts <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 5: Legal Term Explainer */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Plain-English Term Decoder</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Demystifies terms like Indemnification, Force Majeure, Liquidated Damages, and Severability with real-world examples and practical impact summaries.
            </p>
            <Link href="/glossary" className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline pt-2">
              Open Legal Glossary <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 6: Safety Triage */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Context-Aware Triage</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Detects emergency scenarios (court summons, eviction threats, physical danger) and immediately directs users to qualified human legal aid rather than relying solely on AI.
            </p>
            <Link href="/about" className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline pt-2">
              Learn About Triage <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Demo Scenario Highlight */}
      <section className="bg-gradient-to-br from-slate-900 to-navy-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-6">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            Pre-Configured Demo Scenario
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Fictional Scenario: Alex Kumar & NovaTech Solutions Pvt. Ltd.
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed font-normal">
            Test the full power of LexiGuide without uploading a personal contract. Review a simulated employment contract featuring a ₹60,000 monthly salary, 30-day notice period, 2-year non-disclosure covenant, and arbitration in Chennai.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="text-slate-400 block mb-0.5">Employee:</span>
            <strong className="text-white text-sm">Alex Kumar</strong>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="text-slate-400 block mb-0.5">Employer:</span>
            <strong className="text-white text-sm">NovaTech Solutions</strong>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="text-slate-400 block mb-0.5">Compensation:</span>
            <strong className="text-emerald-400 text-sm">₹60,000 / month</strong>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
            <span className="text-slate-400 block mb-0.5">Notice Period:</span>
            <strong className="text-amber-400 text-sm">30 Calendar Days</strong>
          </div>
        </div>

        <div className="pt-2">
          <Link
            href="/documents?demo=true"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-md transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Launch Interactive Demo Analysis
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
