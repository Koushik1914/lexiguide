'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  CheckSquare, 
  Calendar, 
  CreditCard, 
  AlertTriangle, 
  MessageSquare, 
  ArrowLeft,
  Sparkles,
  RefreshCw,
  Share2,
  Download
} from 'lucide-react';
import { DocumentAnalysisResult } from '@/types';
import { ExecutiveSummaryCard } from '@/components/dashboard/ExecutiveSummaryCard';
import { ObligationsMatrix } from '@/components/dashboard/ObligationsMatrix';
import { FindingsList } from '@/components/dashboard/FindingsList';
import { FinancialTermsCard } from '@/components/dashboard/FinancialTermsCard';
import { ImportantDatesTimeline } from '@/components/timeline/ImportantDatesTimeline';
import { AskDocumentChat } from '@/components/chat/AskDocumentChat';
import { SuggestedNextSteps } from '@/components/legal/SuggestedNextSteps';
import { UrgentTriageBanner } from '@/components/legal/UrgentTriageBanner';
import { ResponsibleAIDisclosure } from '@/components/legal/ResponsibleAIDisclosure';

export default function DashboardPage() {
  const [analysis, setAnalysis] = useState<DocumentAnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'OBLIGATIONS' | 'DATES' | 'FINANCES' | 'ISSUES' | 'CHAT'>('OVERVIEW');

  useEffect(() => {
    // 1. Try to read active analysis from sessionStorage
    const stored = typeof window !== 'undefined' ? sessionStorage.getItem('lexiguide_active_analysis') : null;
    if (stored) {
      try {
        setAnalysis(JSON.parse(stored));
        return;
      } catch (e) {
        // Fall back to fetching demo
      }
    }

    // 2. Default: fetch simulated demo analysis so dashboard is immediately rich & functional
    fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isDemo: true }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setAnalysis(json.data);
          sessionStorage.setItem('lexiguide_active_analysis', JSON.stringify(json.data));
        }
      })
      .catch((err) => console.error('Failed to load demo analysis:', err));
  }, []);

  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center animate-pulse">
          <Sparkles className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold text-slate-700">Loading document analysis dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link
          href="/documents"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Upload Another Document
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/compare"
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            Compare with Another Version
          </Link>
          <Link
            href="/glossary"
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            Legal Glossary
          </Link>
        </div>
      </div>

      {/* Safety Triage Banner (if escalated) */}
      {analysis.triageEscalation?.isEscalated && (
        <UrgentTriageBanner
          urgencyCategory={analysis.triageEscalation.urgencyCategory}
          triggerReasons={analysis.triageEscalation.triggerReasons}
          recommendedAction={analysis.triageEscalation.recommendedAction}
        />
      )}

      {/* Executive Summary Card */}
      <ExecutiveSummaryCard analysis={analysis} />

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'OVERVIEW'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          Full Overview
        </button>

        <button
          onClick={() => setActiveTab('OBLIGATIONS')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'OBLIGATIONS'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          Obligations ({analysis.obligations.length})
        </button>

        <button
          onClick={() => setActiveTab('DATES')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'DATES'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Timeline & Dates ({analysis.importantDates.length})
        </button>

        <button
          onClick={() => setActiveTab('FINANCES')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'FINANCES'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Financial Terms ({analysis.financialTerms.length})
        </button>

        <button
          onClick={() => setActiveTab('ISSUES')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'ISSUES'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          Potential Issues ({analysis.findings.length})
        </button>

        <button
          onClick={() => setActiveTab('CHAT')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'CHAT'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Ask Document (RAG)
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-8">
          <ObligationsMatrix obligations={analysis.obligations} />
          <ImportantDatesTimeline dates={analysis.importantDates} />
          <FinancialTermsCard financialTerms={analysis.financialTerms} />
          <FindingsList findings={analysis.findings} />
          <AskDocumentChat
            documentId={analysis.documentId}
            userContext={analysis.userContext}
          />
          <SuggestedNextSteps steps={analysis.suggestedNextSteps} />
        </div>
      )}

      {activeTab === 'OBLIGATIONS' && (
        <ObligationsMatrix obligations={analysis.obligations} />
      )}

      {activeTab === 'DATES' && (
        <ImportantDatesTimeline dates={analysis.importantDates} />
      )}

      {activeTab === 'FINANCES' && (
        <FinancialTermsCard financialTerms={analysis.financialTerms} />
      )}

      {activeTab === 'ISSUES' && (
        <FindingsList findings={analysis.findings} />
      )}

      {activeTab === 'CHAT' && (
        <AskDocumentChat
          documentId={analysis.documentId}
          userContext={analysis.userContext}
        />
      )}

      {/* Responsible AI Transparency Footer */}
      <ResponsibleAIDisclosure
        confidence="HIGH"
        isDemoMode={analysis.isDemoMode}
        jurisdiction={analysis.userContext.jurisdiction}
      />
    </div>
  );
}
