'use client';

import React, { useState } from 'react';
import { 
  GitCompare, 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  FileText, 
  AlertCircle, 
  Loader2,
  PlusCircle,
  MinusCircle,
  Edit3
} from 'lucide-react';
import { DocumentComparisonResult, ClauseChangeType } from '@/types';
import { SAMPLE_EMPLOYMENT_AGREEMENT_V1, SAMPLE_EMPLOYMENT_AGREEMENT_V2 } from '@/lib/document/sample-documents';

export const DocumentComparisonView: React.FC = () => {
  const [comparison, setComparison] = useState<DocumentComparisonResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [textA, setTextA] = useState(SAMPLE_EMPLOYMENT_AGREEMENT_V1.trim());
  const [textB, setTextB] = useState(SAMPLE_EMPLOYMENT_AGREEMENT_V2.trim());

  const handleRunComparison = async (isDemo = false) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isDemo,
          docAText: textA,
          docBText: textB,
          docAName: 'NovaTech_Agreement_v1.0.txt',
          docBName: 'NovaTech_Agreement_v2.0.txt',
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to compare document versions.');
      }

      setComparison(json.data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Comparison failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const getChangeBadge = (type: ClauseChangeType) => {
    switch (type) {
      case 'ADDED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
            <PlusCircle className="w-3 h-3" />
            ADDED CLAUSE
          </span>
        );
      case 'MODIFIED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
            <Edit3 className="w-3 h-3" />
            MODIFIED
          </span>
        );
      case 'REMOVED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">
            <MinusCircle className="w-3 h-3" />
            REMOVED
          </span>
        );
      case 'UNCHANGED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
            UNCHANGED
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuration & Action Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-blue-600" />
              Compare Legal Document Versions
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Analyze changes across two versions: added obligations, modified compensation, shifted deadlines, and altered dispute venues.
            </p>
          </div>

          <button
            onClick={() => handleRunComparison(true)}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm hover:from-blue-700 hover:to-indigo-700 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Load Sample Comparison (v1.0 vs v2.0)
          </button>
        </div>

        {/* Side by side input boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              Version A (Initial Offer / Draft 1)
            </label>
            <textarea
              rows={6}
              value={textA}
              onChange={(e) => setTextA(e.target.value)}
              className="w-full text-xs font-mono p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              Version B (Revised Contract / Final Draft)
            </label>
            <textarea
              rows={6}
              value={textB}
              onChange={(e) => setTextB(e.target.value)}
              className="w-full text-xs font-mono p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
            />
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            onClick={() => handleRunComparison(false)}
            disabled={isLoading || !textA.trim() || !textB.trim()}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-sm transition-all flex items-center gap-2 ${
              isLoading || !textA.trim() || !textB.trim()
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Comparing Clauses with GenAI...
              </>
            ) : (
              <>
                <GitCompare className="w-4 h-4" />
                Run AI Comparison
              </>
            )}
          </button>
        </div>
      </div>

      {/* Comparison Results */}
      {comparison && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-800 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Comparison Executive Summary
            </h3>
            <p className="text-xs text-slate-800 leading-relaxed font-medium">
              {comparison.summaryOfDifferences}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Clause-by-Clause Differences ({comparison.items.length})
            </h3>

            {comparison.items.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {getChangeBadge(item.changeType)}
                    <h4 className="text-sm font-bold text-slate-800">{item.clauseCategory}</h4>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500">
                    Review Priority: {item.importance}
                  </span>
                </div>

                {/* Side by side clause texts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                  <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Version A {item.sourceSectionA ? `(${item.sourceSectionA})` : ''}
                    </span>
                    <p className="text-slate-700 font-mono text-[11px]">{item.versionA}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 block">
                      Version B {item.sourceSectionB ? `(${item.sourceSectionB})` : ''}
                    </span>
                    <p className="text-slate-800 font-mono text-[11px] font-semibold">{item.versionB}</p>
                  </div>
                </div>

                {/* What changed & why it matters */}
                <div className="pt-2 border-t border-slate-200/60 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-100/70">
                    <strong className="text-slate-800 block mb-0.5">What Changed:</strong>
                    <span className="text-slate-600">{item.changeSummary}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-blue-50/50 border border-blue-100">
                    <strong className="text-blue-900 block mb-0.5">Why It May Matter:</strong>
                    <span className="text-blue-800">{item.whyItMayMatter}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
