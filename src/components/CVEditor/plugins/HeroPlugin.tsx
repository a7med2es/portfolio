import React, { useState } from 'react';
import { useResumeContext } from '../ResumeProvider';
import { Command, HeroData } from '../types';
import { ChevronDown, ChevronRight, User } from 'lucide-react';

export const HeroPlugin: React.FC = () => {
  const { state, executeCommand } = useResumeContext();
  const [isOpen, setIsOpen] = useState(true);
  const hero = state.hero;

  const handleUpdate = (field: keyof HeroData, value: string) => {
    const updatedHero: HeroData = { ...hero, [field]: value };
    executeCommand({ type: 'UPDATE_HERO', payload: updatedHero, undoPayload: hero });
  };

  const fields: { key: keyof HeroData; label: string; placeholder?: string; multiline?: boolean }[] = [
    { key: 'name', label: 'Full Name', placeholder: 'John Doe' },
    { key: 'title', label: 'Job Title', placeholder: 'Software Engineer' },
    { key: 'email', label: 'Email', placeholder: 'email@example.com' },
    { key: 'phone', label: 'Phone', placeholder: '+1 234 567 8900' },
    { key: 'location', label: 'Location', placeholder: 'City, Country' },
    { key: 'website', label: 'Website / Portfolio', placeholder: 'https://yoursite.com' },
    { key: 'linkedin', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/in/...' },
    { key: 'github', label: 'GitHub URL', placeholder: 'https://github.com/...' },
    { key: 'nationality', label: 'Nationality (optional)', placeholder: 'Iraqi' },
    { key: 'summary', label: 'Professional Summary', multiline: true },
  ];

  return (
    <div className="border border-slate-200 rounded-lg bg-white mb-3 overflow-hidden">
      <button
        className="w-full p-3 bg-slate-50 flex items-center justify-between hover:bg-slate-100 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-slate-500" />
          <span className="font-semibold text-slate-700 text-sm">Personal Info</span>
        </div>
        {isOpen ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
      </button>
      {isOpen && (
        <div className="p-4 space-y-3">
          {fields.map(f => (
            <div key={f.key}>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">{f.label}</label>
                {f.key === 'summary' && (
                  <span className={`text-[10px] font-mono ${(hero.summary?.length ?? 0) > 600 ? 'text-red-500' : 'text-slate-400'}`}>
                    {hero.summary?.length ?? 0}/600
                  </span>
                )}
              </div>
              {f.multiline ? (
                <textarea
                  value={(hero as any)[f.key] ?? ''}
                  onChange={e => handleUpdate(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  rows={4}
                  className={`w-full border rounded-md p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 ${(hero.summary?.length ?? 0) > 600 ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
                />
              ) : (
                <input
                  type="text"
                  value={(hero as any)[f.key] ?? ''}
                  onChange={e => handleUpdate(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className="w-full border border-slate-200 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
