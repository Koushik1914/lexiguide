'use client';

import React from 'react';
import { AlertOctagon, PhoneCall, ShieldAlert, ArrowRight, UserCheck } from 'lucide-react';

interface UrgentTriageBannerProps {
  urgencyCategory?: 'NORMAL' | 'IMPORTANT' | 'TIME-SENSITIVE' | 'URGENT';
  triggerReasons?: string[];
  recommendedAction?: string;
  className?: string;
}

export const UrgentTriageBanner: React.FC<UrgentTriageBannerProps> = ({
  urgencyCategory = 'NORMAL',
  triggerReasons = [],
  recommendedAction,
  className = '',
}) => {
  if (urgencyCategory === 'NORMAL') {
    return null;
  }

  const isUrgent = urgencyCategory === 'URGENT' || urgencyCategory === 'TIME-SENSITIVE';

  return (
    <section
      aria-label="Legal Escalation and Safety Triage"
      className={`p-5 rounded-2xl border-2 transition-all ${
        isUrgent
          ? 'bg-rose-50 border-rose-300 text-rose-900 shadow-md shadow-rose-100'
          : 'bg-amber-50 border-amber-300 text-amber-900 shadow-sm'
      } ${className}`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
            isUrgent ? 'bg-rose-600 text-white' : 'bg-amber-600 text-white'
          }`}
        >
          {isUrgent ? <AlertOctagon className="w-6 h-6 animate-pulse" /> : <ShieldAlert className="w-6 h-6" />}
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                isUrgent ? 'bg-rose-200 text-rose-800' : 'bg-amber-200 text-amber-800'
              }`}
            >
              {urgencyCategory} LEGAL TRIAGE ADVISORY
            </span>
          </div>

          <h2 className="text-base font-bold tracking-tight">
            This matter may require prompt assistance from a qualified legal professional or appropriate emergency/support service.
          </h2>

          <p className="text-xs leading-relaxed opacity-95">
            {recommendedAction ||
              'Our triage analysis detected time-sensitive deadlines or rights implications that cannot be adequately resolved by an AI tool alone. Immediate human advice from a licensed advocate, legal aid clinic, or relevant authority is strongly recommended.'}
          </p>

          {triggerReasons && triggerReasons.length > 0 && (
            <div className="pt-2">
              <p className="text-xs font-semibold mb-1">Triggering factors identified in context:</p>
              <ul className="list-disc list-inside text-xs space-y-1 opacity-90 pl-1">
                {triggerReasons.map((reason, idx) => (
                  <li key={idx}>{reason}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-3 flex flex-wrap items-center gap-3 text-xs">
            <a
              href="https://nalsa.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              Find Free Legal Aid / Legal Services Authority
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </a>

            <div className="flex items-center gap-1.5 text-slate-700 bg-white/70 px-2.5 py-1 rounded-md border border-slate-200">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
              <span>National Legal Aid Helpline (India): <strong>15100</strong></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
