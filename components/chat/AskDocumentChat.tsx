'use client';

import React, { useState } from 'react';
import { 
  Send, 
  Sparkles, 
  MessageSquare, 
  Quote, 
  CheckCircle2, 
  HelpCircle, 
  FileText, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { QAResponse, UserContext } from '@/types';

interface AskDocumentChatProps {
  documentId: string;
  userContext: UserContext;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  question?: string;
  response?: QAResponse;
}

export const AskDocumentChat: React.FC<AskDocumentChatProps> = ({
  documentId,
  userContext,
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const suggestedQuestions = [
    'What is my notice period?',
    'What happens if I resign?',
    'What are my main obligations?',
    'When does the agreement end?',
    'Is there an arbitration clause?',
    'What payments am I responsible for or entitled to?',
    'Which clauses should I read carefully?',
  ];

  const handleSend = async (queryText: string) => {
    const q = queryText.trim();
    if (!q || isLoading) return;

    const userMsgId = `msg-${Date.now()}`;
    const newMessages: ChatMessage[] = [
      ...messages,
      { id: userMsgId, sender: 'user', question: q },
    ];
    setMessages(newMessages);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId,
          question: q,
          userContext,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to get answer from document.');
      }

      setMessages([
        ...newMessages,
        {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          response: json.data,
        },
      ]);
    } catch (err: any) {
      setMessages([
        ...newMessages,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'assistant',
          response: {
            directAnswer: 'An error occurred while analyzing the document.',
            whatDocumentSays: err.message || 'Please check your connection or try again.',
            whyItMatters: 'Document retrieval encountered an issue.',
            source: { pageOrSection: 'System Error', excerpts: [] },
            informationDistinction: {
              documentFacts: 'N/A',
              generalLegalInfo: 'N/A',
              practicalImplications: 'Try asking a different question or reloading the document.',
            },
            confidence: 'LOW',
            disclaimer: 'Informational only.',
            citations: [],
          },
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              Ask Your Document (Source-Grounded RAG)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Ask natural questions. Every answer is grounded directly in document excerpts with strict anti-hallucination guardrails.
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Zero Hallucination Policy</span>
          </div>
        </div>

        {/* Suggested Questions Pill Carousel */}
        <div className="mt-4 pt-3 border-t border-slate-200/60">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Suggested Inquiries:
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((sq, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(sq)}
                disabled={isLoading}
                className="text-xs px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-700 transition-all font-medium text-left"
              >
                "{sq}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="p-6 space-y-6 max-h-[600px] overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center py-10 text-slate-400 space-y-2">
            <MessageSquare className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">No questions asked yet</p>
            <p className="text-xs max-w-md mx-auto">
              Select one of the suggested questions above or type your own question to inspect specific clauses, notice periods, or payment terms.
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="space-y-4">
              {msg.sender === 'user' ? (
                /* User Question Bubble */
                <div className="flex justify-end">
                  <div className="bg-blue-600 text-white px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-xl text-sm font-medium shadow-sm">
                    {msg.question}
                  </div>
                </div>
              ) : (
                /* AI Grounded Structured Answer */
                msg.response && (
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 shadow-xs">
                    {/* Direct Answer */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                          DIRECT ANSWER
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500">
                          Confidence: {msg.response.confidence}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-slate-900 leading-snug">
                        {msg.response.directAnswer}
                      </p>
                    </div>

                    {/* What the Document Says */}
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs space-y-1">
                      <p className="font-semibold text-slate-800">What the document says:</p>
                      <p className="text-slate-600 leading-relaxed font-normal">
                        {msg.response.whatDocumentSays}
                      </p>
                    </div>

                    {/* Why it Matters */}
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs space-y-1">
                      <p className="font-semibold text-slate-800">Why it matters for you:</p>
                      <p className="text-slate-600 leading-relaxed font-normal">
                        {msg.response.whyItMatters}
                      </p>
                    </div>

                    {/* Grounded Source Excerpt */}
                    {msg.response.source.excerpts && msg.response.source.excerpts.length > 0 && (
                      <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 text-xs space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-blue-800">
                          <span className="flex items-center gap-1">
                            <Quote className="w-3.5 h-3.5 text-blue-600" />
                            Source Section / Page:
                          </span>
                          <span className="font-mono">{msg.response.source.pageOrSection}</span>
                        </div>
                        {msg.response.source.excerpts.map((quote, qIdx) => (
                          <p key={qIdx} className="italic text-slate-700 font-mono text-[11px] pl-2 border-l-2 border-blue-400">
                            "{quote}"
                          </p>
                        ))}
                      </div>
                    )}

                    {/* Distinction breakdown */}
                    <div className="pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                      <div className="p-2 rounded bg-white border border-slate-200">
                        <strong className="text-slate-700 block mb-0.5">Document Facts:</strong>
                        <span className="text-slate-500">{msg.response.informationDistinction.documentFacts}</span>
                      </div>
                      <div className="p-2 rounded bg-white border border-slate-200">
                        <strong className="text-slate-700 block mb-0.5">General Legal Info:</strong>
                        <span className="text-slate-500">{msg.response.informationDistinction.generalLegalInfo}</span>
                      </div>
                      <div className="p-2 rounded bg-white border border-slate-200">
                        <strong className="text-slate-700 block mb-0.5">Practical Steps:</strong>
                        <span className="text-slate-500">{msg.response.informationDistinction.practicalImplications}</span>
                      </div>
                    </div>

                    {/* Disclaimer footnote */}
                    <div className="pt-1 text-[11px] text-slate-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-slate-400" />
                      <span>{msg.response.disclaimer}</span>
                    </div>
                  </div>
                )
              )}
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex items-center gap-2.5 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            <span>Retrieving relevant chunks and verifying citations with Gemini...</span>
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="p-4 border-t border-slate-200 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputQuery);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask anything about this document (e.g. 'Can they fire me without notice?')..."
            disabled={isLoading}
            className="flex-1 text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          />
          <button
            type="submit"
            disabled={isLoading || !inputQuery.trim()}
            className={`px-4 py-2.5 rounded-xl text-white font-semibold text-xs sm:text-sm transition-all flex items-center gap-1.5 shadow-sm ${
              isLoading || !inputQuery.trim()
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
            }`}
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Ask</span>
          </button>
        </form>
      </div>
    </div>
  );
};
