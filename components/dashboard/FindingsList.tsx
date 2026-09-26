'use client';

import React, { useState } from 'react';
import { 
  AlertCircle, 
  HelpCircle, 
  CheckCircle2, 
  Quote, 
  Filter, 
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { Finding, FindingCategory, ReviewImportance } from '@/types';

interface FindingsListProps {
  findings: Finding[];
}

export const FindingsList: React.FC<FindingsListProps> = ({ findings }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = [
    'ALL',
    'Important',
    'Requires Attention',
    'Potential Risk',
    'Ambiguous',
    'User Obligation',
  ];

  const filtered = findings.filter((f) => {
    if (selectedCategory === 'ALL') return true;
    return f.category === selectedCategory;
  });

  const getCategoryColor = (category: FindingCategory) => {
    switch (category) {
      case 'Potential Risk':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Requires Attention':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Ambiguous':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Important':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'User Obligation':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getSeverityBadge = (severity: ReviewImportance) => {
    switch (severity) {
      case 'HIGH':
        return (
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200" title="Importance for user review (not legal validity)">
            High Review Urgency
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            Moderate Attention
          </span>
        );
      case 'LOW':
        return (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            Standard Clause
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-bold text-slate-900">
              Potential Issues & Important Clauses
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Key areas to review before signing or acting. Severity indicates <em>review importance</em>, not legal invalidity.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Findings List */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${getCategoryColor(item.category)}`}>
                  {item.category}
                </span>
                <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
              </div>

              <div className="flex items-center gap-2">
                {getSeverityBadge(item.severity)}
                <span className="text-[10px] text-slate-400 font-mono">
                  Grounding: {item.confidence}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-normal">
              {item.explanation}
            </p>

            {/* Source Box */}
            <div className="pt-2 border-t border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
              <div className="flex items-center gap-1.5 italic bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 flex-1">
                <Quote className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="truncate text-slate-600">"{item.source_excerpt}"</span>
              </div>
              <span className="font-mono text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100 flex-shrink-0">
                {item.page_or_section}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
