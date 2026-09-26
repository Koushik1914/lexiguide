'use client';

import React from 'react';
import { CheckCircle2, ShieldCheck, UserCheck, ArrowRight, AlertCircle } from 'lucide-react';

interface NextStepItem {
  title: string;
  description: string;
  category: 'VERIFICATION' | 'ACTION' | 'PROFESSIONAL_ASSISTANCE';
}

interface SuggestedNextStepsProps {
  steps: NextStepItem[];
}

export const SuggestedNextSteps: React.FC<SuggestedNextStepsProps> = ({ steps }) => {
  const getCategoryConfig = (category: string) => {
    switch (category) {
      case 'ACTION':
        return {
          icon: CheckCircle2,
          badge: 'Practical Action',
          color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        };
      case 'VERIFICATION':
        return {
          icon: ShieldCheck,
          badge: 'Verification Step',
          color: 'bg-blue-50 text-blue-800 border-blue-200',
        };
      case 'PROFESSIONAL_ASSISTANCE':
        return {
          icon: UserCheck,
          badge: 'Consult Professional',
          color: 'bg-purple-50 text-purple-800 border-purple-200',
        };
      default:
        return {
          icon: CheckCircle2,
          badge: 'General Guidance',
          color: 'bg-slate-50 text-slate-800 border-slate-200',
        };
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
      <div className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-blue-600" />
            Suggested Next Steps
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Recommended practical actions before signing or taking contractual decisions.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-md text-[11px] font-semibold text-amber-800">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
          <span>Clearly labeled as informational guidance</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {steps.map((step, idx) => {
          const config = getCategoryConfig(step.category);
          const Icon = config.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-2 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${config.color}`}>
                  <Icon className="w-3 h-3" />
                  {config.badge}
                </span>
                <h3 className="text-sm font-bold text-slate-900">{step.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {step.description}
                </p>
              </div>

              <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                <span>Informational checklist item #{idx + 1}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
