// DocumentInspector.tsx - Re-written to work with the new architecture
import React from 'react';
import { useResumeContext } from './ResumeProvider';
import { AlertTriangle, CheckCircle, FileText } from 'lucide-react';

export const DocumentInspector: React.FC = () => {
  const { state } = useResumeContext();

  const totalItems =
    state.experience.length +
    state.education.length +
    state.projects.length +
    state.skills.length +
    state.courses.length +
    state.languages.length;

  const hasEmptySummary = !state.hero.summary || state.hero.summary.trim().length === 0;
  const isSummaryTooLong = (state.hero.summary?.length ?? 0) > 600;
  const hasNoName = !state.hero.name || state.hero.name.trim().length === 0;

  const warnings = [
    hasNoName && 'Name is empty',
    hasEmptySummary && 'Professional summary is empty',
    isSummaryTooLong && 'Summary is too long (>600 chars)',
  ].filter(Boolean) as string[];

  return (
    <div className="bg-slate-900 text-white p-4 rounded-lg space-y-3 mb-4">
      <h3 className="font-bold text-xs uppercase tracking-wider flex items-center gap-2 text-slate-300">
        <FileText className="w-3.5 h-3.5" /> Document Inspector
      </h3>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-slate-800 rounded p-2">
          <p className="text-[10px] text-slate-400">Total Items</p>
          <p className="text-lg font-bold text-white">{totalItems}</p>
        </div>
        <div className="bg-slate-800 rounded p-2">
          <p className="text-[10px] text-slate-400">Summary</p>
          <p className={`text-lg font-bold ${isSummaryTooLong ? 'text-red-400' : 'text-white'}`}>
            {state.hero.summary?.length ?? 0}
          </p>
        </div>
      </div>

      <div className="space-y-1.5">
        {warnings.length === 0 ? (
          <div className="flex items-center gap-2 text-green-400 text-xs">
            <CheckCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Resume looks complete!</span>
          </div>
        ) : (
          warnings.map((w, i) => (
            <div key={i} className="flex items-start gap-2 text-yellow-400 text-xs">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{w}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
