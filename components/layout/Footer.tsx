'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Scale, Lock, EyeOff, AlertTriangle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Important Privacy & Legal Disclaimer Box */}
        <div className="mb-10 p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs leading-relaxed text-slate-300 space-y-1.5">
              <p className="font-semibold text-amber-300">
                Mandatory Responsible AI Disclosure & Privacy Notice
              </p>
              <p>
                <strong>LexiGuide is an AI-powered legal information assistant, NOT a law firm or a lawyer.</strong>{' '}
                The analysis, summaries, timeline dates, and answers provided are for educational and informational purposes only.
                They do NOT constitute formal legal advice, legal opinions, or guarantees of legal outcomes.
              </p>
              <p className="text-slate-400">
                <strong>Privacy First:</strong> Your document may contain sensitive personal data. Avoid uploading documents you are not authorized to share. Documents are processed ephemerally in-session for extraction and RAG analysis and are NOT permanently stored as confidential legal records.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-sm">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Scale className="w-4 h-4" />
              </div>
              <span className="font-bold text-white tracking-tight">LexiGuide</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI Legal Document & Rights Navigator built for the GenAI Hackathon. Empowering everyday citizens with plain-English legal clarity and source-grounded RAG verification.
            </p>
          </div>

          {/* Core Modules */}
          <div>
            <h3 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">Core Modules</h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/documents" className="hover:text-white transition-colors">Document Analysis</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Rights & Obligations Matrix</Link></li>
              <li><Link href="/compare" className="hover:text-white transition-colors">Version Comparison</Link></li>
              <li><Link href="/glossary" className="hover:text-white transition-colors">Plain-English Glossary</Link></li>
              <li><Link href="/ask" className="hover:text-white transition-colors">General Legal Questions</Link></li>
            </ul>
          </div>

          {/* Privacy & Security */}
          <div>
            <h3 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">Security & Trust</h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero Permanent Storage</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>Prompt Injection Defense</span>
              </li>
              <li className="flex items-center gap-1.5">
                <EyeOff className="w-3.5 h-3.5 text-purple-400" />
                <span>No Training on User Docs</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-amber-400" />
                <span>Strict Evidence Grounding</span>
              </li>
            </ul>
          </div>

          {/* Jurisdiction Caveat */}
          <div>
            <h3 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">Jurisdiction Rules</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Legal statutes and precedents differ fundamentally across countries (India, US, UK, Canada, Australia) and states. Always verify state-specific statutes before acting on contract matters.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2027 LexiGuide Navigator. Built for GenAI Legal Access Challenge.</p>
          <div className="flex items-center gap-4">
            <span>Powered by Google Gemini</span>
            <span>•</span>
            <span>WCAG 2.1 AA Accessible</span>
            <span>•</span>
            <Link href="/about" className="text-blue-400 hover:underline">Architecture & Safety</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
