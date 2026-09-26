'use client';

import React from 'react';
import { 
  Building2, 
  User, 
  Calendar, 
  ShieldCheck, 
  FileText, 
  Scale, 
  HelpCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { DocumentAnalysisResult } from '@/types';

interface ExecutiveSummaryCardProps {
  analysis: DocumentAnalysisResult;
}

export const ExecutiveSummaryCard: React.FC<ExecutiveSummaryCardProps> = ({ analysis }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Top Banner / Document Details */}
      <div className="bg-slate-900 text-white p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2.5 py-0.5 rounded-full">
                {analysis.documentType}
              </span>
              {analysis.isDemoMode && (
                <span className="text-[11px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-400/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Demo Mode
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-400" />
              {analysis.documentName}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Context: {analysis.userContext.jurisdiction} {analysis.userContext.stateProvince ? `(${analysis.userContext.stateProvince})` : ''} • Analyzed on {new Date(analysis.analyzedAt).toLocaleDateString()} • ~{analysis.wordCount} words
            </p>
          </div>

          <div className="flex sm:flex-col items-end gap-1">
            <span className="text-xs text-slate-400">Your Assumed Role:</span>
            <span className="text-xs font-bold text-white bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
              {analysis.userContext.userRole}
            </span>
          </div>
        </div>

        {/* Executive Summary Narrative */}
        <div className="mt-6 p-4 rounded-xl bg-slate-800/80 border border-slate-700">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-300 mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Plain-English Executive Summary
          </h2>
          <p className="text-sm text-slate-200 leading-relaxed font-normal">
            {analysis.executiveSummary}
          </p>
        </div>
      </div>

      {/* Parties Involved Cards */}
      <div className="p-6 bg-slate-50/60 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* User Party */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-start gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
              {analysis.parties.userParty.role || 'First Party'} (You)
            </span>
            <h3 className="text-sm font-bold text-slate-900 mt-0.5">
              {analysis.parties.userParty.name || 'Not explicitly named'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Primary subject of user obligations and notice covenants.
            </p>
          </div>
        </div>

        {/* Counterparty */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-start gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">
              {analysis.parties.counterparty.role || 'Second Party'} (Counterparty)
            </span>
            <h3 className="text-sm font-bold text-slate-900 mt-0.5">
              {analysis.parties.counterparty.name || 'Not explicitly named'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Primary counterparty responsible for payment and governance terms.
            </p>
          </div>
        </div>
      </div>

      {/* Core Contract Provisions Grid */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
        <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center gap-1.5 text-slate-500 mb-1 font-semibold">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>Contract Duration</span>
          </div>
          <p className="text-slate-800 font-medium">{analysis.contractDuration}</p>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center gap-1.5 text-slate-500 mb-1 font-semibold">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Notice Period</span>
          </div>
          <p className="text-slate-800 font-medium">{analysis.noticePeriods}</p>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center gap-1.5 text-slate-500 mb-1 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
            <span>Termination Conditions</span>
          </div>
          <p className="text-slate-800 font-medium">{analysis.terminationConditions}</p>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center gap-1.5 text-slate-500 mb-1 font-semibold">
            <Scale className="w-3.5 h-3.5 text-purple-600" />
            <span>Dispute Resolution</span>
          </div>
          <p className="text-slate-800 font-medium">{analysis.disputeResolution}</p>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center gap-1.5 text-slate-500 mb-1 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Confidentiality & IP</span>
          </div>
          <p className="text-slate-800 font-medium">{analysis.confidentialityClauses}</p>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center gap-1.5 text-slate-500 mb-1 font-semibold">
            <HelpCircle className="w-3.5 h-3.5 text-slate-600" />
            <span>Governing Law & Forum</span>
          </div>
          <p className="text-slate-800 font-medium">{analysis.governingLaw} ({analysis.jurisdictionClause})</p>
        </div>
      </div>
    </div>
  );
};
