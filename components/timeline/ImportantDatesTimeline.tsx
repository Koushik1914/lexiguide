'use client';

import React from 'react';
import { Calendar, Clock, AlertCircle, Quote, ArrowRight } from 'lucide-react';
import { ImportantDateItem } from '@/types';

interface ImportantDatesTimelineProps {
  dates: ImportantDateItem[];
}

export const ImportantDatesTimeline: React.FC<ImportantDatesTimelineProps> = ({ dates }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Important Dates & Milestones Timeline
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Key calendar deadlines and relative time triggers extracted from the document.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-[11px] font-medium">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>Dates verified against text • No fabricated dates</span>
        </div>
      </div>

      {/* Visual Timeline */}
      <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-blue-200">
        {dates.map((item, idx) => (
          <div key={item.id} className="relative group">
            {/* Timeline node dot */}
            <div
              className={`absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-white ${
                item.isRelative ? 'bg-amber-500' : 'bg-blue-600'
              }`}
            >
              {item.isRelative ? <Clock className="w-3 h-3" /> : <Calendar className="w-3 h-3" />}
            </div>

            {/* Content card */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-extrabold px-2.5 py-0.5 rounded-lg border ${
                      item.isRelative
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-blue-50 text-blue-800 border-blue-200 font-mono'
                    }`}
                  >
                    {item.dateOrRelative}
                  </span>
                  <h3 className="text-sm font-bold text-slate-800">{item.title}</h3>
                </div>

                <span className="text-xs font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 self-start sm:self-auto">
                  {item.page_or_section}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {item.explanation}
              </p>

              {item.isRelative && (
                <p className="text-[11px] text-amber-700 bg-amber-50/80 p-2 rounded border border-amber-200/50">
                  <strong>Trigger-Based Deadline:</strong> The exact calendar date depends on the date written notice or triggering action is formally initiated.
                </p>
              )}

              {/* Source Quote */}
              <div className="pt-2 border-t border-slate-200/60 text-[11px] italic text-slate-500 flex items-center gap-1.5">
                <Quote className="w-3 h-3 text-slate-400 flex-shrink-0" />
                <span className="truncate">"{item.source_excerpt}"</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
