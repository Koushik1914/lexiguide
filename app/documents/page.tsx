'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ContextSelector } from '@/components/document/ContextSelector';
import { DocumentUploadZone } from '@/components/document/DocumentUploadZone';
import { ResponsibleAIDisclosure } from '@/components/legal/ResponsibleAIDisclosure';
import { UserContext, DocumentAnalysisResult } from '@/types';
import { Sparkles, FileText, Loader2 } from 'lucide-react';

function DocumentsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDemoParam = searchParams.get('demo') === 'true';

  const [userContext, setUserContext] = useState<UserContext>({
    jurisdiction: 'India',
    stateProvince: 'Tamil Nadu',
    documentType: 'Employment Agreement',
    userRole: 'Employee',
    goal: 'Understand termination and obligations',
    urgency: 'NORMAL',
  });

  const handleAnalysisComplete = (result: DocumentAnalysisResult) => {
    // Save analysis to session storage so dashboard can read it immediately
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('lexiguide_active_analysis', JSON.stringify(result));
    }
    router.push('/dashboard');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-4">
      {/* Top Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
          <FileText className="w-3.5 h-3.5" />
          <span>Step 1: Context & Ingestion</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Analyze Your Legal Document
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          Set your legal jurisdiction and upload your agreement to generate plain-English summaries, obligations, timeline dates, and conversational Q&A.
        </p>
      </div>

      {/* Context Selector */}
      <ContextSelector context={userContext} onChange={setUserContext} />

      {/* Document Upload Zone */}
      <DocumentUploadZone
        userContext={userContext}
        onAnalysisComplete={handleAnalysisComplete}
      />

      {/* Trust & Transparency */}
      <ResponsibleAIDisclosure
        confidence="HIGH"
        isDemoMode={isDemoParam}
        jurisdiction={`${userContext.jurisdiction} ${userContext.stateProvince ? `(${userContext.stateProvince})` : ''}`}
      />
    </div>
  );
}

export default function DocumentsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[50vh] text-xs text-slate-500 gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
          <span>Loading document analyzer...</span>
        </div>
      }
    >
      <DocumentsContent />
    </Suspense>
  );
}
