import React, { useState } from 'react';
import { ChevronDown, ChevronRight, GripVertical, Plus, Trash2, GraduationCap, FolderOpen, Wrench, BookOpen, Languages, Settings } from 'lucide-react';
import { useResumeContext } from '../ResumeProvider';
import { EducationBlock, ProjectBlock, SkillCategoryBlock, CourseBlock, LanguageBlock, UUID } from '../types';

const uuid = (): UUID => crypto.randomUUID?.() ?? (Date.now().toString(36) + Math.random().toString(36).slice(2));

// ─── Generic Plugin Shell ──────────────────────────────────────────────────────
const PluginShell: React.FC<{ icon: React.ReactNode; title: string; count: number; children: React.ReactNode }> = ({ icon, title, count, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-lg bg-white mb-3 overflow-hidden">
      <button className="w-full p-3 bg-slate-50 flex items-center justify-between hover:bg-slate-100 transition-colors" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-semibold text-slate-700 text-sm">{title}</span>
          <span className="bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5 rounded-full font-medium">{count}</span>
        </div>
        {isOpen ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
      </button>
      {isOpen && <div className="p-3 space-y-2">{children}</div>}
    </div>
  );
};

// ─── Education ─────────────────────────────────────────────────────────────────
export const EducationPlugin: React.FC = () => {
  const { state, executeCommand } = useResumeContext();
  const [expandedId, setExpandedId] = useState<UUID | null>(null);

  const handleAdd = () => {
    const b: EducationBlock = { id: uuid(), keepTogether: true, degree: 'New Degree', institution: 'University', location: '', startDate: '2020', endDate: '2024', honors: '' };
    executeCommand({ type: 'INSERT_BLOCK', section: 'education', payload: b, undoPayload: b });
    setExpandedId(b.id);
  };
  const handleUpdate = (block: EducationBlock, patch: Partial<EducationBlock>) => {
    executeCommand({ type: 'UPDATE_BLOCK', section: 'education', blockId: block.id, payload: { ...block, ...patch }, undoPayload: block });
  };
  const handleDelete = (block: EducationBlock) => {
    executeCommand({ type: 'DELETE_BLOCK', section: 'education', blockId: block.id, payload: null, undoPayload: block });
  };

  return (
    <PluginShell icon={<GraduationCap className="w-4 h-4 text-slate-500" />} title="Education" count={state.education.length}>
      {state.education.map(block => (
        <div key={block.id} className="border border-slate-100 rounded-md bg-slate-50">
          <div className="p-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-100 rounded-t-md" onClick={() => setExpandedId(expandedId === block.id ? null : block.id)}>
            <div className="flex items-center gap-2 min-w-0">
              <GripVertical className="w-4 h-4 text-slate-300 shrink-0" />
              <div className="min-w-0">
                <p className="font-semibold text-sm text-slate-800 truncate">{block.degree}</p>
                <p className="text-xs text-slate-500 truncate">{block.institution}</p>
              </div>
            </div>
            <button onClick={e => { e.stopPropagation(); handleDelete(block); }} className="p-1 text-red-400 hover:text-red-600 rounded shrink-0"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
          {expandedId === block.id && (
            <div className="p-3 border-t border-slate-100 space-y-2">
              {[
                { key: 'degree', label: 'Degree', full: true }, { key: 'institution', label: 'Institution' },
                { key: 'location', label: 'Location' }, { key: 'startDate', label: 'Start Year' },
                { key: 'endDate', label: 'End Year' }, { key: 'honors', label: 'Honors / GPA', full: true },
              ].map((f: any) => (
                <div key={f.key} className={f.full ? 'col-span-2' : ''}>
                  <label className="text-xs text-slate-500 mb-1 block">{f.label}</label>
                  <input type="text" value={(block as any)[f.key] ?? ''} onChange={e => handleUpdate(block, { [f.key]: e.target.value })}
                    className="w-full border border-slate-200 rounded p-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      <button onClick={handleAdd} className="w-full py-2 border border-dashed border-blue-300 text-blue-600 rounded-md text-sm hover:bg-blue-50 flex items-center justify-center gap-2">
        <Plus className="w-4 h-4" /> Add Education
      </button>
    </PluginShell>
  );
};

// ─── Projects ──────────────────────────────────────────────────────────────────
export const ProjectsPlugin: React.FC = () => {
  const { state, executeCommand } = useResumeContext();
  const [expandedId, setExpandedId] = useState<UUID | null>(null);

  const handleAdd = () => {
    const b: ProjectBlock = { id: uuid(), keepTogether: true, title: 'New Project', subtitle: '', date: '2024', url: '', descriptions: [''] };
    executeCommand({ type: 'INSERT_BLOCK', section: 'projects', payload: b, undoPayload: b });
    setExpandedId(b.id);
  };
  const handleUpdate = (block: ProjectBlock, patch: Partial<ProjectBlock>) => {
    executeCommand({ type: 'UPDATE_BLOCK', section: 'projects', blockId: block.id, payload: { ...block, ...patch }, undoPayload: block });
  };
  const handleDelete = (block: ProjectBlock) => {
    executeCommand({ type: 'DELETE_BLOCK', section: 'projects', blockId: block.id, payload: null, undoPayload: block });
  };

  return (
    <PluginShell icon={<FolderOpen className="w-4 h-4 text-slate-500" />} title="Projects" count={state.projects.length}>
      {state.projects.map(block => (
        <div key={block.id} className="border border-slate-100 rounded-md bg-slate-50">
          <div className="p-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-100 rounded-t-md" onClick={() => setExpandedId(expandedId === block.id ? null : block.id)}>
            <div className="flex items-center gap-2 min-w-0">
              <GripVertical className="w-4 h-4 text-slate-300 shrink-0" />
              <p className="font-semibold text-sm text-slate-800 truncate">{block.title}</p>
            </div>
            <button onClick={e => { e.stopPropagation(); handleDelete(block); }} className="p-1 text-red-400 hover:text-red-600 rounded shrink-0"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
          {expandedId === block.id && (
            <div className="p-3 border-t border-slate-100 space-y-2">
              {[{ key: 'title', label: 'Project Name' }, { key: 'subtitle', label: 'Subtitle / Stack' }, { key: 'date', label: 'Date' }, { key: 'url', label: 'URL' }].map(f => (
                <div key={f.key}>
                  <label className="text-xs text-slate-500 mb-1 block">{f.label}</label>
                  <input type="text" value={(block as any)[f.key] ?? ''} onChange={e => handleUpdate(block, { [f.key]: e.target.value })}
                    className="w-full border border-slate-200 rounded p-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
                </div>
              ))}
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Description</label>
                {block.descriptions.map((d, i) => (
                  <div key={i} className="flex gap-2 mb-1.5">
                    <textarea value={d} rows={2} onChange={e => { const a = [...block.descriptions]; a[i] = e.target.value; handleUpdate(block, { descriptions: a }); }}
                      className="flex-1 border border-slate-200 rounded p-1.5 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-blue-400" />
                    <button onClick={() => { const a = [...block.descriptions]; a.splice(i, 1); handleUpdate(block, { descriptions: a }); }} className="text-red-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
                <button onClick={() => handleUpdate(block, { descriptions: [...block.descriptions, ''] })} className="text-xs text-blue-600 flex items-center gap-1 hover:underline"><Plus className="w-3 h-3" /> Add</button>
              </div>
            </div>
          )}
        </div>
      ))}
      <button onClick={handleAdd} className="w-full py-2 border border-dashed border-blue-300 text-blue-600 rounded-md text-sm hover:bg-blue-50 flex items-center justify-center gap-2">
        <Plus className="w-4 h-4" /> Add Project
      </button>
    </PluginShell>
  );
};

// ─── Skills ────────────────────────────────────────────────────────────────────
export const SkillsPlugin: React.FC = () => {
  const { state, executeCommand } = useResumeContext();
  const [expandedId, setExpandedId] = useState<UUID | null>(null);

  const handleAdd = () => {
    const b: SkillCategoryBlock = { id: uuid(), keepTogether: true, category: 'New Category', skills_list: ['Skill 1'] };
    executeCommand({ type: 'INSERT_BLOCK', section: 'skills', payload: b, undoPayload: b });
    setExpandedId(b.id);
  };
  const handleUpdate = (block: SkillCategoryBlock, patch: Partial<SkillCategoryBlock>) => {
    executeCommand({ type: 'UPDATE_BLOCK', section: 'skills', blockId: block.id, payload: { ...block, ...patch }, undoPayload: block });
  };
  const handleDelete = (block: SkillCategoryBlock) => {
    executeCommand({ type: 'DELETE_BLOCK', section: 'skills', blockId: block.id, payload: null, undoPayload: block });
  };

  return (
    <PluginShell icon={<Wrench className="w-4 h-4 text-slate-500" />} title="Skills" count={state.skills.length}>
      {state.skills.map(block => (
        <div key={block.id} className="border border-slate-100 rounded-md bg-slate-50">
          <div className="p-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-100 rounded-t-md" onClick={() => setExpandedId(expandedId === block.id ? null : block.id)}>
            <div className="flex items-center gap-2 min-w-0">
              <GripVertical className="w-4 h-4 text-slate-300 shrink-0" />
              <p className="font-semibold text-sm text-slate-800 truncate">{block.category}</p>
            </div>
            <button onClick={e => { e.stopPropagation(); handleDelete(block); }} className="p-1 text-red-400 hover:text-red-600 rounded shrink-0"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
          {expandedId === block.id && (
            <div className="p-3 border-t border-slate-100 space-y-2">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Category Name</label>
                <input type="text" value={block.category} onChange={e => handleUpdate(block, { category: e.target.value })}
                  className="w-full border border-slate-200 rounded p-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Skills (one per line)</label>
                {block.skills_list.map((s, i) => (
                  <div key={i} className="flex gap-2 mb-1.5">
                    <input type="text" value={s} onChange={e => { const a = [...block.skills_list]; a[i] = e.target.value; handleUpdate(block, { skills_list: a }); }}
                      className="flex-1 border border-slate-200 rounded p-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
                    <button onClick={() => { const a = [...block.skills_list]; a.splice(i, 1); handleUpdate(block, { skills_list: a }); }} className="text-red-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
                <button onClick={() => handleUpdate(block, { skills_list: [...block.skills_list, ''] })} className="text-xs text-blue-600 flex items-center gap-1 hover:underline"><Plus className="w-3 h-3" /> Add skill</button>
              </div>
            </div>
          )}
        </div>
      ))}
      <button onClick={handleAdd} className="w-full py-2 border border-dashed border-blue-300 text-blue-600 rounded-md text-sm hover:bg-blue-50 flex items-center justify-center gap-2">
        <Plus className="w-4 h-4" /> Add Skill Category
      </button>
    </PluginShell>
  );
};

// ─── Courses ────────────────────────────────────────────────────────────────────
export const CoursesPlugin: React.FC = () => {
  const { state, executeCommand } = useResumeContext();
  const [expandedId, setExpandedId] = useState<UUID | null>(null);

  const handleAdd = () => {
    const b: CourseBlock = { id: uuid(), keepTogether: true, title: 'New Course', institution: 'Provider', date: '2024', credentialUrl: '' };
    executeCommand({ type: 'INSERT_BLOCK', section: 'courses', payload: b, undoPayload: b });
    setExpandedId(b.id);
  };
  const handleUpdate = (block: CourseBlock, patch: Partial<CourseBlock>) => {
    executeCommand({ type: 'UPDATE_BLOCK', section: 'courses', blockId: block.id, payload: { ...block, ...patch }, undoPayload: block });
  };
  const handleDelete = (block: CourseBlock) => {
    executeCommand({ type: 'DELETE_BLOCK', section: 'courses', blockId: block.id, payload: null, undoPayload: block });
  };

  return (
    <PluginShell icon={<BookOpen className="w-4 h-4 text-slate-500" />} title="Training & Certificates" count={state.courses.length}>
      {state.courses.map(block => (
        <div key={block.id} className="border border-slate-100 rounded-md bg-slate-50">
          <div className="p-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-100 rounded-t-md" onClick={() => setExpandedId(expandedId === block.id ? null : block.id)}>
            <div className="flex items-center gap-2 min-w-0">
              <GripVertical className="w-4 h-4 text-slate-300 shrink-0" />
              <div className="min-w-0">
                <p className="font-semibold text-sm text-slate-800 truncate">{block.title}</p>
                <p className="text-xs text-slate-500 truncate">{block.institution} · {block.date}</p>
              </div>
            </div>
            <button onClick={e => { e.stopPropagation(); handleDelete(block); }} className="p-1 text-red-400 hover:text-red-600 rounded shrink-0"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
          {expandedId === block.id && (
            <div className="p-3 border-t border-slate-100 space-y-2">
              {[{ key: 'title', label: 'Course Title' }, { key: 'institution', label: 'Institution / Provider' }, { key: 'date', label: 'Year' }, { key: 'credentialUrl', label: 'Credential URL' }].map(f => (
                <div key={f.key}>
                  <label className="text-xs text-slate-500 mb-1 block">{f.label}</label>
                  <input type="text" value={(block as any)[f.key] ?? ''} onChange={e => handleUpdate(block, { [f.key]: e.target.value })}
                    className="w-full border border-slate-200 rounded p-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      <button onClick={handleAdd} className="w-full py-2 border border-dashed border-blue-300 text-blue-600 rounded-md text-sm hover:bg-blue-50 flex items-center justify-center gap-2">
        <Plus className="w-4 h-4" /> Add Course
      </button>
    </PluginShell>
  );
};

// ─── Languages ─────────────────────────────────────────────────────────────────
const PROFICIENCY_LEVELS: LanguageBlock['proficiency'][] = ['Native', 'Fluent', 'Professional', 'Intermediate', 'Basic'];

export const LanguagesPlugin: React.FC = () => {
  const { state, executeCommand } = useResumeContext();
  const [expandedId, setExpandedId] = useState<UUID | null>(null);

  const handleAdd = () => {
    const b: LanguageBlock = { id: uuid(), keepTogether: true, language: 'New Language', proficiency: 'Intermediate' };
    executeCommand({ type: 'INSERT_BLOCK', section: 'languages', payload: b, undoPayload: b });
    setExpandedId(b.id);
  };
  const handleUpdate = (block: LanguageBlock, patch: Partial<LanguageBlock>) => {
    executeCommand({ type: 'UPDATE_BLOCK', section: 'languages', blockId: block.id, payload: { ...block, ...patch }, undoPayload: block });
  };
  const handleDelete = (block: LanguageBlock) => {
    executeCommand({ type: 'DELETE_BLOCK', section: 'languages', blockId: block.id, payload: null, undoPayload: block });
  };

  return (
    <PluginShell icon={<Languages className="w-4 h-4 text-slate-500" />} title="Languages" count={state.languages.length}>
      {state.languages.map(block => (
        <div key={block.id} className="border border-slate-100 rounded-md bg-slate-50">
          <div className="p-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-100 rounded-t-md" onClick={() => setExpandedId(expandedId === block.id ? null : block.id)}>
            <div className="flex items-center gap-2 min-w-0">
              <GripVertical className="w-4 h-4 text-slate-300 shrink-0" />
              <div className="min-w-0">
                <p className="font-semibold text-sm text-slate-800">{block.language}</p>
                <p className="text-xs text-slate-500">{block.proficiency}</p>
              </div>
            </div>
            <button onClick={e => { e.stopPropagation(); handleDelete(block); }} className="p-1 text-red-400 hover:text-red-600 rounded shrink-0"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
          {expandedId === block.id && (
            <div className="p-3 border-t border-slate-100 space-y-2">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Language</label>
                <input type="text" value={block.language} onChange={e => handleUpdate(block, { language: e.target.value })}
                  className="w-full border border-slate-200 rounded p-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400" />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Proficiency Level</label>
                <select value={block.proficiency} onChange={e => handleUpdate(block, { proficiency: e.target.value as any })}
                  className="w-full border border-slate-200 rounded p-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400">
                  {PROFICIENCY_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>
      ))}
      <button onClick={handleAdd} className="w-full py-2 border border-dashed border-blue-300 text-blue-600 rounded-md text-sm hover:bg-blue-50 flex items-center justify-center gap-2">
        <Plus className="w-4 h-4" /> Add Language
      </button>
    </PluginShell>
  );
};

// ─── Section Layout Manager ───────────────────────────────────────────────────
export const SectionLayoutPlugin: React.FC = () => {
  const { state, executeCommand } = useResumeContext();
  const [isOpen, setIsOpen] = useState(false);

  const toggleColumn = (id: string, currentColumn: 'left' | 'right') => {
    const newConfig = state.sectionConfig.map(s => s.id === id ? { ...s, column: currentColumn === 'left' ? 'right' as const : 'left' as const } : s);
    executeCommand({ type: 'MOVE_SECTION', payload: newConfig, undoPayload: state.sectionConfig });
  };

  const toggleHidden = (id: string, current: boolean) => {
    const newConfig = state.sectionConfig.map(s => s.id === id ? { ...s, hidden: !current } : s);
    executeCommand({ type: 'MOVE_SECTION', payload: newConfig, undoPayload: state.sectionConfig });
  };

  return (
    <div className="border border-slate-200 rounded-lg bg-white mb-3 overflow-hidden">
      <button className="w-full p-3 bg-slate-50 flex items-center justify-between hover:bg-slate-100 transition-colors" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-slate-500" />
          <span className="font-semibold text-slate-700 text-sm">Layout Manager</span>
        </div>
        {isOpen ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
      </button>
      {isOpen && (
        <div className="p-3 space-y-2">
          <p className="text-xs text-slate-400 mb-3">Toggle sections between left and right columns, or hide them entirely.</p>
          {state.sectionConfig.map(s => (
            <div key={s.id} className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
              <span className="text-sm font-medium text-slate-700 capitalize">{s.label || s.id}</span>
              <div className="flex gap-2">
                <button onClick={() => toggleHidden(s.id, s.hidden)}
                  className={`text-xs px-2 py-1 rounded font-medium transition-colors ${s.hidden ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
                  {s.hidden ? 'Hidden' : 'Visible'}
                </button>
                <button onClick={() => toggleColumn(s.id, s.column)}
                  className="text-xs px-2 py-1 rounded font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors">
                  {s.column === 'left' ? '← Left' : 'Right →'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
