'use client';

import React from 'react';
import { LegalGlossaryView } from '@/components/glossary/LegalGlossaryView';
import { ResponsibleAIDisclosure } from '@/components/legal/ResponsibleAIDisclosure';
import { BookOpen } from 'lucide-react';

export default function GlossaryPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Module D: Legal Jargon Decoder</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Plain-English Legal Glossary
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          Understand obscure legal terms, indemnities, liquidated damages, and Latin clauses before signing any contract.
        </p>
      </div>

      <LegalGlossaryView />

      <ResponsibleAIDisclosure
        confidence="HIGH"
        jurisdiction="General Legal Definitions"
      />
    </div>
  );
}
