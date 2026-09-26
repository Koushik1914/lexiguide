'use client';

import React from 'react';
import { AlertCircle, CheckCircle2, Info, Sparkles } from 'lucide-react';
import { EvidenceConfidence } from '@/types';

interface ResponsibleAIDisclosureProps {
  confidence?: EvidenceConfidence;
  isDemoMode?: boolean;
  jurisdiction?: string;
  className?: string;
}

export const ResponsibleAIDisclosure: React.FC<ResponsibleAIDisclosureProps> = ({
  confidence = 'HIGH',
  isDemoMode = false,
  jurisdiction = 'India',
  className = '',
}) => {
  const confidenceConfig = {
    HIGH: {
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: CheckCircle2,
      label: 'High Evidence Grounding',
      text: 'Direct verbatim source clauses identified in document text.',
    },
    MEDIUM: {
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: Info,
      label: 'Moderate Evidence Grounding',
      text: 'Supported by contextual document sections and general contractual principles.',
    },
    LOW: {
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: AlertCircle,
      label: 'Limited Evidence in Document',
      text: 'Document does not explicitly cover this point in detail. Verify with other party.',
    },
  };

  const currentConf = confidenceConfig[confidence];
  const ConfIcon = currentConf.icon;

  return (
    <aside
      aria-label="AI Transparency and Grounding Disclosure"
      className={`p-4 rounded-xl border bg-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${className}`}
    >
      <div className="flex items-center gap-2.5">
        {isDemoMode ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-semibold bg-purple-100 text-purple-800 border border-purple-200">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Demo Mode — Simulated AI Response
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            GenAI Source-Grounded
          </span>
        )}

        <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-medium border ${currentConf.color}`}>
          <ConfIcon className="w-3.5 h-3.5" />
          <span>{currentConf.label}</span>
        </div>
      </div>

      <div className="text-slate-500 flex items-center gap-2">
        <span>Context: <strong className="text-slate-700 font-semibold">{jurisdiction}</strong></span>
        <span>•</span>
        <span className="text-slate-400">Informational only — Not legal advice</span>
      </div>
    </aside>
  );
};
