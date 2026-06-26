import React, { useState } from 'react';
import { ChevronDown, ChevronRight, GripVertical, Plus, Trash2, Briefcase } from 'lucide-react';
import { useResumeContext } from '../ResumeProvider';
import { ExperienceBlock, UUID } from '../types';

const uuid = (): UUID => crypto.randomUUID?.() ?? (Date.now().toString(36) + Math.random().toString(36).slice(2));

export const ExperiencePlugin: React.FC = () => {
  const { state, executeCommand } = useResumeContext();
  const [isOpen, setIsOpen] = useState(true);
  const [expandedId, setExpandedId] = useState<UUID | null>(null);

  const handleAdd = () => {
    const b: ExperienceBlock = { id: uuid(), keepTogether: true, title: 'New Position', company: 'Company Name', location: '', startDate: 'MM/YYYY', endDate: 'Present', description: [''] };
    executeCommand({ type: 'INSERT_BLOCK', section: 'experience', payload: b, undoPayload: b });
    setExpandedId(b.id);
  };
  const handleUpdate = (block: ExperienceBlock, patch: Partial<ExperienceBlock>) => {
    executeCommand({ type: 'UPDATE_BLOCK', section: 'experience', blockId: block.id, payload: { ...block, ...patch }, undoPayload: block });
  };
  const handleDelete = (block: ExperienceBlock) => {
    executeCommand({ type: 'DELETE_BLOCK', section: 'experience', blockId: block.id, payload: null, undoPayload: block });
  };

  return (
    <div className="border border-slate-200 rounded-lg bg-white mb-3 overflow-hidden">
      <button className="w-full p-3 bg-slate-50 flex items-center justify-between hover:bg-slate-100 transition-colors" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-slate-500" />
          <span className="font-semibold text-slate-700 text-sm">Experience</span>
          <span className="bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5 rounded-full font-medium">{state.experience.length}</span>
        </div>
        {isOpen ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
      </button>
      {isOpen && (
        <div className="p-3 space-y-2">
          {state.experience.map(block => (
            <div key={block.id} className="border border-slate-100 rounded-md bg-slate-50">
              <div className="p-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-100 rounded-t-md" onClick={() => setExpandedId(expandedId === block.id ? null : block.id)}>
                <div className="flex items-center gap-2 min-w-0">
                  <GripVertical className="w-4 h-4 text-slate-300 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-slate-800 truncate">{block.title}</p>
                    <p className="text-xs text-slate-500 truncate">{block.company} · {block.startDate}–{block.endDate}</p>
                  </div>
                </div>
                <button onClick={e => { e.stopPropagation(); handleDelete(block); }} className="p-1 text-red-400 hover:text-red-600 rounded shrink-0">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              {expandedId === block.id && (
                <div className="p-3 border-t border-slate-100 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'title', label: 'Job Title' }, { key: 'company', label: 'Company' },
                      { key: 'location', label: 'Location' },
                    ].map(f => (
                      <div key={f.key} className={f.key === 'title' ? 'col-span-2' : ''}>
                        <label className="text-xs text-slate-500 mb-1 block">{f.label}</label>
                        <input type="text" value={(block as any)[f.key] ?? ''} onChange={e => handleUpdate(block, { [f.key]: e.target.value })}
                          className="w-full border border-slate-200 rounded p-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
                      </div>
                    ))}
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Start Date</label>
                      <input type="text" value={block.startDate} onChange={e => handleUpdate(block, { startDate: e.target.value })}
                        placeholder="MM/YYYY" className="w-full border border-slate-200 rounded p-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">End Date</label>
                      <input type="text" value={block.endDate} onChange={e => handleUpdate(block, { endDate: e.target.value })}
                        placeholder="Present" className="w-full border border-slate-200 rounded p-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Bullet Points</label>
                    <div className="space-y-1.5">
                      {block.description.map((d, i) => (
                        <div key={i} className="flex gap-2">
                          <textarea value={d} rows={2} onChange={e => {
                            const arr = [...block.description]; arr[i] = e.target.value;
                            handleUpdate(block, { description: arr });
                          }} className="flex-1 border border-slate-200 rounded p-1.5 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-blue-400" />
                          <button onClick={() => {
                            const arr = [...block.description]; arr.splice(i, 1);
                            handleUpdate(block, { description: arr });
                          }} className="text-red-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => handleUpdate(block, { description: [...block.description, ''] })}
                      className="mt-2 text-xs text-blue-600 flex items-center gap-1 hover:underline">
                      <Plus className="w-3 h-3" /> Add bullet
                    </button>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Achievement Link (optional)</label>
                    <input type="text" value={block.achievement_link ?? ''} onChange={e => handleUpdate(block, { achievement_link: e.target.value })}
                      placeholder="https://..." className="w-full border border-slate-200 rounded p-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
                  </div>
                </div>
              )}
            </div>
          ))}
          <button onClick={handleAdd} className="w-full py-2 border border-dashed border-blue-300 text-blue-600 rounded-md text-sm hover:bg-blue-50 flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Add Experience
          </button>
        </div>
      )}
    </div>
  );
};
