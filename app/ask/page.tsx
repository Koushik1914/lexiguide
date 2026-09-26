'use client';

import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  Sparkles, 
  Scale, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  MapPin, 
  UserCheck,
  ArrowRight
} from 'lucide-react';
import { GeneralLegalInfoResponse, JurisdictionCountry } from '@/types';
import { ResponsibleAIDisclosure } from '@/components/legal/ResponsibleAIDisclosure';

export default function AskLegalInfoPage() {
  const [query, setQuery] = useState('');
  const [jurisdiction, setJurisdiction] = useState<JurisdictionCountry>('India');
  const [stateProvince, setStateProvince] = useState('Tamil Nadu');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<GeneralLegalInfoResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const sampleQuestions = [
    'What is a lease agreement?',
    'What does arbitration mean?',
    'What is a notice period?',
    'What is the difference between civil and criminal cases?',
    'What is a power of attorney?',
    'What is an NDA?',
  ];

  const handleAsk = async (questionText: string) => {
    const q = questionText.trim();
    if (!q || isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/general-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          jurisdiction,
          stateProvince,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to retrieve legal information.');
      }

      setResponse(json.data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error occurred while processing legal inquiry.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4">
      {/* Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Module 9: General Legal Information Mode</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Ask a Legal Information Question
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          No document required. Get plain-English explanations of contractual rights, legal principles, and jurisdictional nuances with zero fabricated statutes.
        </p>
      </div>

      {/* Query Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        {/* Jurisdiction Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-slate-100 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Select Jurisdiction Country:
            </label>
            <select
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value as any)}
              className="w-full rounded-lg border border-slate-300 p-2 text-xs font-medium focus:ring-2 focus:ring-blue-500"
            >
              <option value="India">India</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              State / Province (Optional):
            </label>
            <input
              type="text"
              value={stateProvince}
              onChange={(e) => setStateProvince(e.target.value)}
              placeholder="e.g. Tamil Nadu, California"
              className="w-full rounded-lg border border-slate-300 p-2 text-xs focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk(query);
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. What is the difference between civil and criminal cases?"
              className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className={`px-5 py-2.5 rounded-xl text-white font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 shadow-sm ${
              isLoading || !query.trim()
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
            }`}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Ask</span>
          </button>
        </form>

        {/* Suggested Questions */}
        <div className="pt-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Common Legal Queries:
          </p>
          <div className="flex flex-wrap gap-2">
            {sampleQuestions.map((sq, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setQuery(sq);
                  handleAsk(sq);
                }}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-700 transition-all font-medium text-left"
              >
                "{sq}"
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

      {/* Response Card */}
      {response && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                GENERAL LEGAL INFORMATION
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-1">
                {response.query}
              </h2>
            </div>

            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
              Jurisdiction: {jurisdiction}
            </span>
          </div>

          {/* Plain English Explanation */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
            {response.plainEnglishExplanation}
          </div>

          {/* Jurisdictional Nuance */}
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs space-y-1">
            <h3 className="font-bold text-amber-900 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-700" />
              Jurisdictional Limitations & Variations:
            </h3>
            <p className="text-amber-800 leading-relaxed font-normal">
              {response.jurisdictionalLimitations}
            </p>
          </div>

          {/* Key Concepts */}
          {response.keyConcepts && response.keyConcepts.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Key Legal Concepts to Know:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {response.keyConcepts.map((kc, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg border border-slate-200 bg-white text-xs text-slate-700 flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>{kc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* When to Seek an Attorney */}
          <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 text-xs space-y-1.5">
            <h3 className="font-bold text-rose-900 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-rose-700" />
              When This Requires a Qualified Legal Professional:
            </h3>
            <p className="text-rose-800 leading-relaxed font-normal">
              {response.whenToSeekLawyer}
            </p>
          </div>

          {/* Responsible AI Disclaimer */}
          <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-100 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>AI-generated legal information. This is not legal advice and may not reflect specific case law applicable to your situation.</span>
          </div>
        </div>
      )}

      <ResponsibleAIDisclosure
        confidence="HIGH"
        jurisdiction={jurisdiction}
      />
    </div>
  );
}
