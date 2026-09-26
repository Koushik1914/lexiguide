'use client';

import React from 'react';
import { DocumentComparisonView } from '@/components/comparison/DocumentComparisonView';
import { ResponsibleAIDisclosure } from '@/components/legal/ResponsibleAIDisclosure';
import { GitCompare } from 'lucide-react';

export default function ComparePage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto py-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
          <GitCompare className="w-3.5 h-3.5" />
          <span>Module C: Document Diff Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Legal Document Version Comparison
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          Compare offer drafts, revised agreements, or modified lease versions. Automatically detects added indemnity, changed notice windows, and altered fees.
        </p>
      </div>

      <DocumentComparisonView />

      <ResponsibleAIDisclosure
        confidence="HIGH"
        jurisdiction="General Contract Comparison"
      />
    </div>
  );
}
