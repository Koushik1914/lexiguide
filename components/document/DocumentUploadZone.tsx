'use client';

import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  Sparkles, 
  AlertCircle, 
  CheckCircle, 
  Loader2, 
  ShieldCheck,
  FileType
} from 'lucide-react';
import { UserContext, DocumentAnalysisResult } from '@/types';
import { SAMPLE_EMPLOYMENT_AGREEMENT_V2 } from '@/lib/document/sample-documents';

interface DocumentUploadZoneProps {
  userContext: UserContext;
  onAnalysisComplete: (result: DocumentAnalysisResult) => void;
}

export const DocumentUploadZone: React.FC<DocumentUploadZoneProps> = ({
  userContext,
  onAnalysisComplete,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [pasteText, setPasteText] = useState('');
  const [usePasteMode, setUsePasteMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelected = (selectedFile: File) => {
    setErrorMessage(null);
    const validExts = ['.pdf', '.docx', '.txt'];
    const lowerName = selectedFile.name.toLowerCase();
    const hasValidExt = validExts.some((ext) => lowerName.endsWith(ext));

    if (!hasValidExt) {
      setErrorMessage('Unsupported file format. Please upload a PDF, DOCX, or TXT document.');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setErrorMessage(`File exceeds 10 MB limit (${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB).`);
      return;
    }

    setFile(selectedFile);
  };

  const handleAnalyze = async (overrideDemo = false) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (overrideDemo) {
        // Run demo scenario directly
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            isDemo: true,
            userContext,
          }),
        });

        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error || 'Failed to process demo document.');
        }
        onAnalysisComplete(json.data);
        return;
      }

      if (usePasteMode) {
        if (!pasteText.trim()) {
          setErrorMessage('Please paste or type contract text into the box.');
          setIsLoading(false);
          return;
        }

        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: pasteText,
            filename: 'Pasted_Agreement.txt',
            userContext,
          }),
        });

        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error || 'Failed to analyze pasted text.');
        }
        onAnalysisComplete(json.data);
      } else {
        if (!file) {
          setErrorMessage('Please select a PDF, DOCX, or TXT file to analyze.');
          setIsLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('userContext', JSON.stringify(userContext));

        const res = await fetch('/api/analyze', {
          method: 'POST',
          body: formData,
        });

        const json = await res.json();
        if (!res.ok || !json.success) {
          throw new Error(json.error || 'Failed to analyze uploaded document.');
        }
        onAnalysisComplete(json.data);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSampleText = () => {
    setUsePasteMode(true);
    setPasteText(SAMPLE_EMPLOYMENT_AGREEMENT_V2.trim());
    setErrorMessage(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-blue-600" />
            Upload Legal Document
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Accepts standard PDF, DOCX, and TXT agreements up to 10 MB.
          </p>
        </div>

        {/* Demo Shortcut Button */}
        <button
          onClick={() => handleAnalyze(true)}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm transition-all"
        >
          <Sparkles className="w-4 h-4" />
          Try Demo Document (NovaTech vs Alex Kumar)
        </button>
      </div>

      {/* Switch between Upload File and Paste Text */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl w-fit text-xs font-medium">
        <button
          type="button"
          onClick={() => setUsePasteMode(false)}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            !usePasteMode ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Upload File (PDF / DOCX / TXT)
        </button>
        <button
          type="button"
          onClick={() => setUsePasteMode(true)}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            usePasteMode ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Paste Contract Text
        </button>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold">Analysis Notice</p>
            <p className="mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {!usePasteMode ? (
        /* Drag & Drop Upload Zone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-50/50'
              : file
              ? 'border-emerald-400 bg-emerald-50/30'
              : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50/60'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={(e) => e.target.files?.[0] && handleFileSelected(e.target.files[0])}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-3">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                file ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-50 text-blue-600'
              }`}
            >
              {file ? <CheckCircle className="w-7 h-7" /> : <UploadCloud className="w-7 h-7" />}
            </div>

            {file ? (
              <div>
                <p className="text-sm font-bold text-slate-800 flex items-center justify-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  {file.name}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {(file.size / 1024).toFixed(1)} KB • Click or drop another file to replace
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Drag and drop your legal contract here, or{' '}
                  <span className="text-blue-600 underline">browse files</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Supports PDF (text-based), DOCX, and TXT • Max 10 MB
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Direct Paste Mode */
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <label className="font-semibold flex items-center gap-1">
              <FileType className="w-3.5 h-3.5" />
              Paste Legal Agreement Text:
            </label>
            <button
              type="button"
              onClick={loadSampleText}
              className="text-blue-600 hover:underline font-semibold"
            >
              Fill with Sample NovaTech Agreement
            </button>
          </div>
          <textarea
            rows={8}
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            placeholder="Paste your legal document, lease, or employment agreement clauses here..."
            className="w-full text-xs font-mono p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
          />
        </div>
      )}

      {/* Security and Privacy Assurance */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-500 gap-3 pt-2">
        <div className="flex items-center gap-1.5 text-slate-600">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>In-memory temporary analysis. Sensitive files are not stored permanently.</span>
        </div>

        <button
          type="button"
          onClick={() => handleAnalyze(false)}
          disabled={isLoading || (!file && !pasteText.trim())}
          className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-sm text-white shadow-md transition-all flex items-center justify-center gap-2 ${
            isLoading || (!file && !pasteText.trim())
              ? 'bg-slate-300 cursor-not-allowed shadow-none'
              : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing with GenAI...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Analyze Document
            </>
          )}
        </button>
      </div>
    </div>
  );
};
