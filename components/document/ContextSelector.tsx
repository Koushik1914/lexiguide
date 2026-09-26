'use client';

import React from 'react';
import { Globe, MapPin, FileQuestion, User, Target, Clock, AlertCircle } from 'lucide-react';
import { UserContext, JurisdictionCountry } from '@/types';

interface ContextSelectorProps {
  context: UserContext;
  onChange: (updated: UserContext) => void;
  compact?: boolean;
}

export const ContextSelector: React.FC<ContextSelectorProps> = ({
  context,
  onChange,
  compact = false,
}) => {
  const updateField = <K extends keyof UserContext>(key: K, value: UserContext[K]) => {
    onChange({
      ...context,
      [key]: value,
    });
  };

  const jurisdictions: JurisdictionCountry[] = [
    'India',
    'United States',
    'United Kingdom',
    'Canada',
    'Australia',
    'Other',
  ];

  const documentTypes = [
    'Employment Agreement',
    'Residential Lease / Rental',
    'NDA / Confidentiality Agreement',
    'Freelance / Contractor Services',
    'Commercial Supply / Service',
    'Terms of Service / Privacy Policy',
    'Legal Notice / Demand Letter',
    'Court Summons / Dispute Notice',
  ];

  const userRoles = [
    'Employee',
    'Tenant',
    'Freelancer / Contractor',
    'Consumer / Client',
    'Employer / Business Owner',
    'Landlord / Property Owner',
  ];

  const goals = [
    'Understand general obligations & rights',
    'Review termination and notice period',
    'Check payment terms and penalties',
    'Identify hidden liability or indemnity',
    'Verify dispute resolution / arbitration',
  ];

  const urgencies: Array<'NORMAL' | 'IMPORTANT' | 'TIME-SENSITIVE' | 'URGENT'> = [
    'NORMAL',
    'IMPORTANT',
    'TIME-SENSITIVE',
    'URGENT',
  ];

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm ${compact ? 'p-4' : 'p-6'}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-600" />
            Legal Jurisdiction & User Context
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tailor document analysis and plain-English explanations to your jurisdiction and role.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-md text-[11px] text-blue-800">
          <AlertCircle className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
          <span>Legal rules vary by jurisdiction.</span>
        </div>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${compact ? 'mt-3' : 'mt-5'}`}>
        {/* Jurisdiction Country */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            Jurisdiction Country
          </label>
          <select
            value={context.jurisdiction}
            onChange={(e) => updateField('jurisdiction', e.target.value as JurisdictionCountry)}
            className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            {jurisdictions.map((j) => (
              <option key={j} value={j}>
                {j}
              </option>
            ))}
          </select>
        </div>

        {/* State or Province */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            State / Province
          </label>
          <input
            type="text"
            value={context.stateProvince || ''}
            placeholder="e.g. Tamil Nadu, California, Ontario"
            onChange={(e) => updateField('stateProvince', e.target.value)}
            className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Document Type */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <FileQuestion className="w-3.5 h-3.5 text-slate-400" />
            Document Type
          </label>
          <select
            value={context.documentType}
            onChange={(e) => updateField('documentType', e.target.value)}
            className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            {documentTypes.map((dt) => (
              <option key={dt} value={dt}>
                {dt}
              </option>
            ))}
          </select>
        </div>

        {/* User Role */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-400" />
            Your Role in this Agreement
          </label>
          <select
            value={context.userRole}
            onChange={(e) => updateField('userRole', e.target.value)}
            className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            {userRoles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        {/* Primary Goal */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-slate-400" />
            Primary Review Goal
          </label>
          <select
            value={context.goal}
            onChange={(e) => updateField('goal', e.target.value)}
            className="w-full text-xs rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            {goals.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        {/* Urgency */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            Urgency Level
          </label>
          <select
            value={context.urgency}
            onChange={(e) => updateField('urgency', e.target.value as any)}
            className={`w-full text-xs rounded-lg border px-3 py-2 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              context.urgency === 'URGENT'
                ? 'bg-rose-50 border-rose-300 text-rose-800'
                : context.urgency === 'TIME-SENSITIVE'
                ? 'bg-amber-50 border-amber-300 text-amber-800'
                : 'bg-white border-slate-300 text-slate-800'
            }`}
          >
            {urgencies.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
