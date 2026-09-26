'use client';

import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Lightbulb, 
  Quote,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { LegalTermExplanation } from '@/types';

export const LegalGlossaryView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExplanation, setSelectedExplanation] = useState<LegalTermExplanation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const curatedTerms = [
    'Indemnification',
    'Arbitration',
    'Liquidated Damages',
    'Severability',
    'Force Majeure',
    'Non-Compete',
    'Governing Law',
    'Joint and Several Liability',
  ];

  const handleQueryTerm = async (termToLookup: string) => {
    const term = termToLookup.trim();
    if (!term || isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/glossary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ term }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to explain term.');
      }

      setSelectedExplanation(json.data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error looking up term.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Curated Terms Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Plain-English Legal Term Explainer
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Translate confusing legal jargon and Latin contract terms into simple, understandable everyday language.
          </p>
        </div>

        {/* Search input form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleQueryTerm(searchTerm);
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search or enter any legal term (e.g. 'Indemnification', 'Liquidated Damages')..."
              className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !searchTerm.trim()}
            className={`px-5 py-2.5 rounded-xl text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 shadow-sm ${
              isLoading || !searchTerm.trim()
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
            }`}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Explain</span>
          </button>
        </form>

        {/* Quick select pills */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Common Legal Jargon Terms:
          </p>
          <div className="flex flex-wrap gap-2">
            {curatedTerms.map((term) => (
              <button
                key={term}
                onClick={() => {
                  setSearchTerm(term);
                  handleQueryTerm(term);
                }}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                  selectedExplanation?.term.toLowerCase() === term.toLowerCase()
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50/50'
                }`}
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Term Explanation Card */}
      {selectedExplanation && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                LEGAL TERM DECODER
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                {selectedExplanation.term}
              </h3>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-slate-400">Plain English Translation</span>
            </div>
          </div>

          {/* Simple Meaning Highlight Box */}
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-800 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-blue-600" />
              Simple Meaning
            </h4>
            <p className="text-sm font-semibold text-slate-900 leading-snug">
              "{selectedExplanation.simpleMeaning}"
            </p>
          </div>

          {/* Detailed Meaning */}
          <div className="space-y-1 text-xs">
            <h4 className="font-bold text-slate-800">How It Works in Contracts:</h4>
            <p className="text-slate-600 leading-relaxed font-normal">
              {selectedExplanation.detailedMeaning}
            </p>
          </div>

          {/* Why It Matters */}
          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 text-xs space-y-1">
            <h4 className="font-bold text-amber-900">Why this matters to you:</h4>
            <p className="text-amber-800 leading-relaxed font-normal">
              {selectedExplanation.whyItMatters}
            </p>
          </div>

          {/* Practical Examples */}
          {selectedExplanation.commonExamples && selectedExplanation.commonExamples.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-800">Everyday Examples:</h4>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {selectedExplanation.commonExamples.map((ex, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                    <span>{ex}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-100 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>General informational explanation. Contract interpretation depends on the exact wording of your agreement.</span>
          </div>
        </div>
      )}
    </div>
  );
};
