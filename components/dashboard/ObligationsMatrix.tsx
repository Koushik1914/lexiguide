'use client';

import React, { useState } from 'react';
import { CheckSquare, User, Building2, AlertTriangle, Quote, Filter } from 'lucide-react';
import { ObligationItem, ReviewImportance } from '@/types';

interface ObligationsMatrixProps {
  obligations: ObligationItem[];
}

export const ObligationsMatrix: React.FC<ObligationsMatrixProps> = ({ obligations }) => {
  const [filterParty, setFilterParty] = useState<'ALL' | 'USER' | 'COUNTERPARTY'>('ALL');

  const filtered = obligations.filter((ob) => {
    if (filterParty === 'ALL') return true;
    return ob.party === filterParty;
  });

  const getImportanceBadge = (importance: ReviewImportance) => {
    switch (importance) {
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            High Priority Review
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Medium Priority
          </span>
        );
      case 'LOW':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            Standard Term
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
      {/* Header and Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-blue-600" />
            Key Obligations Matrix
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Explicit duties, covenants, and performance requirements extracted directly from document text.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setFilterParty('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterParty === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({obligations.length})
          </button>
          <button
            onClick={() => setFilterParty('USER')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
              filterParty === 'USER' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Your Obligations
          </button>
          <button
            onClick={() => setFilterParty('COUNTERPARTY')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${
              filterParty === 'COUNTERPARTY' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Counterparty Obligations
          </button>
        </div>
      </div>

      {/* Obligations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-slate-50 transition-colors flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1 ${
                    item.party === 'USER'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-indigo-100 text-indigo-800'
                  }`}
                >
                  {item.party === 'USER' ? <User className="w-3 h-3" /> : <Building2 className="w-3 h-3" />}
                  {item.partyName || (item.party === 'USER' ? 'Your Obligation' : 'Counterparty')}
                </span>

                {getImportanceBadge(item.importance)}
              </div>

              <p className="text-sm font-semibold text-slate-800 leading-snug">
                {item.description}
              </p>

              {item.consequenceIfBreached && (
                <div className="mt-2.5 flex items-start gap-1.5 text-xs text-amber-800 bg-amber-50/80 border border-amber-200/70 p-2 rounded-lg">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span><strong>If breached:</strong> {item.consequenceIfBreached}</span>
                </div>
              )}
            </div>

            {/* Source quote */}
            <div className="pt-2 border-t border-slate-200/60 text-xs text-slate-500">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-1">
                <span className="flex items-center gap-1">
                  <Quote className="w-3 h-3 text-slate-400" />
                  Source Excerpt:
                </span>
                <span className="text-blue-600 font-mono">{item.page_or_section}</span>
              </div>
              <p className="italic text-slate-600 bg-white p-2 rounded border border-slate-200 text-[11px]">
                "{item.source_excerpt}"
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
