'use client';

import React from 'react';
import { DollarSign, CreditCard, AlertCircle, Quote } from 'lucide-react';
import { FinancialTermItem } from '@/types';

interface FinancialTermsCardProps {
  financialTerms: FinancialTermItem[];
}

export const FinancialTermsCard: React.FC<FinancialTermsCardProps> = ({ financialTerms }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
      <div className="pb-4 border-b border-slate-100">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-emerald-600" />
          Financial Terms & Payment Obligations
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Explicit amounts, salaries, fees, penalties, and payment cadences extracted from the document.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {financialTerms.map((term) => (
          <div
            key={term.id}
            className="p-4 rounded-xl border border-slate-200 bg-emerald-50/20 hover:bg-emerald-50/40 transition-colors space-y-2.5"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs font-semibold text-slate-600">{term.title}</span>
              <span className="text-xs font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                {term.page_or_section}
              </span>
            </div>

            <div className="text-lg font-extrabold text-emerald-700">
              {term.amountOrFormula}
            </div>

            <div className="text-xs text-slate-600 space-y-1">
              <p>
                <strong>Responsible Party:</strong> {term.responsibleParty}
              </p>
              {term.notes && <p className="text-slate-500">{term.notes}</p>}
            </div>

            <div className="pt-2 border-t border-slate-200/60 text-[11px] italic text-slate-500 flex items-center gap-1">
              <Quote className="w-3 h-3 text-slate-400 flex-shrink-0" />
              <span className="truncate">"{term.source_excerpt}"</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
