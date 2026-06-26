import React, { useRef, useState, useEffect } from 'react';
import { useHero, useExperiences, useEducation, useSkills, useProjects } from '@/hooks/usePortfolioData';
import { Loader2, Download, Phone, Mail, Globe, MapPin, Calendar, Link2, Pencil, X, Check, Plus, Trash2, LayoutGrid, Lock, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// ─── Types ────────────────────────────────────────────────────────────────────
interface ModalState {
  type: 'exp' | 'edu' | 'proj' | 'skill' | 'header' | 'summary' | null;
  index: number | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const SectionHeader = ({ title }: { title: string }) => (
  <div className="mb-3">
    <h2 className="text-[15px] font-extrabold tracking-widest uppercase text-black leading-tight">{title}</h2>
    <div className="border-b-2 border-black mt-1" />
  </div>
);

const InfoRow = ({ icon, text, href }: { icon: React.ReactNode; text: string; href?: string }) => (
  <span className="flex items-center gap-1 text-[10px] text-gray-700">
    {icon}
    {href ? (
      <a
        href={href}
        className="text-blue-600 hover:underline transition-colors"
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noreferrer' : undefined}
        onClick={e => e.stopPropagation()}
      >
        {text}
      </a>
    ) : text}
  </span>
);

// ─── Edit Modal ────────────────────────────────────────────────────────────────
interface EditModalProps {
  title: string;
  fields: { label: string; key: string; multiline?: boolean; placeholder?: string }[];
  data: Record<string, any>;
  onSave: (updated: Record<string, any>) => void;
  onClose: () => void;
}
const EditModal = ({ title, fields, data, onSave, onClose }: EditModalProps) => {
  const [values, setValues] = useState<Record<string, any>>({ ...data });

  const handleChange = (key: string, value: string) => {
    setValues(prev => ({ ...prev, [key]: value }));
  };

  const handleDescChange = (index: number, value: string) => {
    const arr = [...(values.description || values.descriptions || values.skills_list || [])];
    arr[index] = value;
    const descKey = values.description !== undefined ? 'description' : values.descriptions !== undefined ? 'descriptions' : 'skills_list';
    setValues(prev => ({ ...prev, [descKey]: arr }));
  };

  const handleDescAdd = () => {
    const descKey = values.description !== undefined ? 'description' : values.descriptions !== undefined ? 'descriptions' : 'skills_list';
    const arr = [...(values[descKey] || []), ''];
    setValues(prev => ({ ...prev, [descKey]: arr }));
  };

  const handleDescRemove = (index: number) => {
    const descKey = values.description !== undefined ? 'description' : values.descriptions !== undefined ? 'descriptions' : 'skills_list';
    const arr = [...(values[descKey] || [])];
    arr.splice(index, 1);
    setValues(prev => ({ ...prev, [descKey]: arr }));
  };

  const descKey = values.description !== undefined ? 'description' : values.descriptions !== undefined ? 'descriptions' : 'skills_list';
  const descList: string[] = Array.isArray(values[descKey]) ? values[descKey] : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b">
          <h3 className="font-bold text-lg text-slate-800">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          {fields.map(f => (
            <div key={f.key}>
              <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wide">{f.label}</label>
              {f.multiline ? (
                <textarea
                  className="w-full border border-slate-200 rounded-lg p-2 text-sm text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                  rows={4}
                  value={values[f.key] || ''}
                  placeholder={f.placeholder}
                  onChange={e => handleChange(f.key, e.target.value)}
                />
              ) : (
                <input
                  className="w-full border border-slate-200 rounded-lg p-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={values[f.key] || ''}
                  placeholder={f.placeholder}
                  onChange={e => handleChange(f.key, e.target.value)}
                />
              )}
            </div>
          ))}

          {/* Description/skills list if present */}
          {descList.length > 0 || values[descKey] !== undefined ? (
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                {descKey === 'skills_list' ? 'Skills List' : 'Description Points'}
              </label>
              <div className="space-y-2">
                {descList.map((item, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <textarea
                      className="flex-1 border border-slate-200 rounded-lg p-2 text-sm text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                      rows={2}
                      value={item}
                      onChange={e => handleDescChange(i, e.target.value)}
                    />
                    <button onClick={() => handleDescRemove(i)} className="text-red-400 hover:text-red-600 mt-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={handleDescAdd}
                className="mt-2 flex items-center gap-1 text-blue-600 text-sm hover:underline"
              >
                <Plus className="w-4 h-4" /> Add point
              </button>
            </div>
          ) : null}
        </div>
        <div className="flex justify-end gap-3 p-5 border-t">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={() => onSave(values)} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Check className="w-4 h-4 mr-1" /> Save
          </Button>
        </div>
      </div>
    </div>
  );
};

// ─── Section Types ────────────────────────────────────────────────────────────
type SectionId = 'summary' | 'experience' | 'education' | 'skills' | 'projects';

// ─── Main Component ────────────────────────────────────────────────────────────
export default function CVEditorPage() {
  const cvRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [pageCount, setPageCount] = useState(1);

  // A4 page height in pixels at 96dpi: 297mm = ~1122.5px
  const A4_PX = 1122.5;
  const { data: hero, isLoading: heroLoading } = useHero();
  const { data: exps, isLoading: expLoading } = useExperiences();
  const { data: edus, isLoading: eduLoading } = useEducation();
  const { data: skills, isLoading: skillsLoading } = useSkills();
  const { data: projs, isLoading: projsLoading } = useProjects();

  // Local override state (edits are in-memory; original data from DB is untouched)
  const [localHero, setLocalHero] = useState<any>(null);
  const [localExps, setLocalExps] = useState<any[] | null>(null);
  const [localEdus, setLocalEdus] = useState<any[] | null>(null);
  const [localSkills, setLocalSkills] = useState<any[] | null>(null);
  const [localProjs, setLocalProjs] = useState<any[] | null>(null);
  const [modal, setModal] = useState<ModalState>({ type: null, index: null });
  const [showTemplate, setShowTemplate] = useState(false);

  // Section order — header is always first and locked
  const [leftSections, setLeftSections] = useState<SectionId[]>(['experience', 'education', 'projects']);
  const [rightSections, setRightSections] = useState<SectionId[]>(['summary', 'skills']);
  
  const dragItem = useRef<{ list: 'left' | 'right', index: number } | null>(null);
  const dragOverItem = useRef<{ list: 'left' | 'right', index: number } | null>(null);

  const handleDragSort = () => {
    if (!dragItem.current || !dragOverItem.current) return;
    
    const sourceList = dragItem.current.list;
    const targetList = dragOverItem.current.list;
    const sourceIndex = dragItem.current.index;
    const targetIndex = dragOverItem.current.index;

    let newLeft = [...leftSections];
    let newRight = [...rightSections];

    // Get the dragged item
    const dragged = sourceList === 'left' ? newLeft[sourceIndex] : newRight[sourceIndex];

    // Remove from source
    if (sourceList === 'left') newLeft.splice(sourceIndex, 1);
    else newRight.splice(sourceIndex, 1);

    // Insert into target
    if (targetList === 'left') newLeft.splice(targetIndex, 0, dragged);
    else newRight.splice(targetIndex, 0, dragged);

    setLeftSections(newLeft);
    setRightSections(newRight);

    dragItem.current = null;
    dragOverItem.current = null;
  };

  const isLoading = heroLoading || expLoading || eduLoading || skillsLoading || projsLoading;

  // Watch content height and recalculate page count
  useEffect(() => {
    if (!contentRef.current) return;
    const observer = new ResizeObserver(() => {
      if (contentRef.current) {
        const h = contentRef.current.scrollHeight;
        setPageCount(Math.max(1, Math.ceil(h / A4_PX)));
      }
    });
    observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, [isLoading]);

  // Resolved data (local override OR from DB)
  const h = localHero || hero;
  const expData: any[] = localExps || exps || [];
  const eduData: any[] = localEdus || edus || [];
  const skillsData: any[] = localSkills || skills || [];
  const projData: any[] = localProjs || projs || [];

  // ── Export to PDF ────────────────────────────────────────────────────────────
  const exportPDF = async () => {
    if (!cvRef.current) return;
    const html2pdf = (await import('html2pdf.js')).default;
    const opt = {
      margin: 0,
      filename: 'CV-Ahmed-Essam.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 3, useCORS: true, backgroundColor: '#ffffff' },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] },
    };
    const el = cvRef.current;
    html2pdf().set(opt).from(el).save();
    toast.success('PDF exported!');
  };

  // ── Save handlers (updates local state) ─────────────────────────────────────
  const saveHeader = (data: any) => { setLocalHero(data); setModal({ type: null, index: null }); };
  const saveSummary = (data: any) => { setLocalHero({ ...h, summary: data.summary }); setModal({ type: null, index: null }); };

  const saveExp = (data: any) => {
    const arr = [...expData];
    arr[modal.index!] = data;
    setLocalExps(arr);
    setModal({ type: null, index: null });
  };
  const addExp = () => {
    setLocalExps([...expData, { id: Date.now(), title: 'New Title', company: 'Company', date: '', description: [''] }]);
    toast.success('Experience added');
  };
  const removeExp = (i: number) => {
    const arr = [...expData];
    arr.splice(i, 1);
    setLocalExps(arr);
  };

  const saveEdu = (data: any) => {
    const arr = [...eduData];
    arr[modal.index!] = data;
    setLocalEdus(arr);
    setModal({ type: null, index: null });
  };
  const addEdu = () => {
    setLocalEdus([...eduData, { id: Date.now(), title: 'New Degree', institution: 'Institution', date: '', honors: '' }]);
    toast.success('Education added');
  };
  const removeEdu = (i: number) => {
    const arr = [...eduData];
    arr.splice(i, 1);
    setLocalEdus(arr);
  };

  const saveSkill = (data: any) => {
    const arr = [...skillsData];
    arr[modal.index!] = data;
    setLocalSkills(arr);
    setModal({ type: null, index: null });
  };
  const addSkill = () => {
    setLocalSkills([...skillsData, { id: Date.now(), category: 'New Category', skills_list: [''] }]);
    toast.success('Skill category added');
  };
  const removeSkill = (i: number) => {
    const arr = [...skillsData];
    arr.splice(i, 1);
    setLocalSkills(arr);
  };

  const saveProj = (data: any) => {
    const arr = [...projData];
    arr[modal.index!] = data;
    setLocalProjs(arr);
    setModal({ type: null, index: null });
  };
  const addProj = () => {
    setLocalProjs([...projData, { id: Date.now(), title: 'New Project', subtitle: '', date: '', project_url: '', descriptions: [''] }]);
    toast.success('Project added');
  };
  const removeProj = (i: number) => {
    const arr = [...projData];
    arr.splice(i, 1);
    setLocalProjs(arr);
  };

  const renderDraggableSection = (sectionId: SectionId, idx: number, list: 'left' | 'right') => {
    let content = null;
    if (sectionId === 'summary') {
      content = (
        <React.Fragment>
          <SectionHeader title="Summary" />
          <div
            className="group relative cursor-pointer hover:outline hover:outline-2 hover:outline-blue-400 hover:outline-offset-2 rounded mb-3"
            style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
            onClick={() => !showTemplate && setModal({ type: 'summary', index: null })}
          >
            <div className="absolute -top-5 right-0 hidden group-hover:flex items-center gap-1 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded z-10">
              <Pencil className="w-3 h-3" /> Edit
            </div>
            <p className="text-[10.5px] text-gray-700 leading-snug">{h?.summary}</p>
          </div>
        </React.Fragment>
      );
    } else if (sectionId === 'experience') {
      content = (
        <React.Fragment>
          <SectionHeader title="Experience" />
          {expData.map((exp, i) => (
            <div
              key={exp.id || i}
              style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
              className="group relative cursor-pointer hover:outline hover:outline-2 hover:outline-blue-400 hover:outline-offset-2 rounded mb-3"
              onClick={() => !showTemplate && setModal({ type: 'exp', index: i })}
            >
              <div className="absolute -top-5 right-0 hidden group-hover:flex items-center gap-1 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded z-10">
                <Pencil className="w-3 h-3" /> Edit
                <button onClick={e => { e.stopPropagation(); removeExp(i); }} className="ml-1 text-red-300 hover:text-red-100">
                  <X className="w-3 h-3" />
                </button>
              </div>
              <p className="font-bold text-black text-[12px]">{exp.title}</p>
              <p className="font-bold text-blue-600 text-[11px]">{exp.company}</p>
              <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-0.5">
                <Calendar className="w-2.5 h-2.5" />
                <span>{exp.date || exp.start_date ? `${exp.start_date || ''} - ${exp.end_date || 'Present'}` : exp.date || 'Date not specified'}</span>
              </div>
              <ul className="mt-1.5 space-y-1">
                {(Array.isArray(exp.description) ? exp.description : (exp.description || '').split('\n').filter(Boolean)).map((d: string, j: number) => (
                  <li key={j} className="text-[10.5px] text-gray-700 leading-snug flex gap-1.5">
                    <span className="shrink-0 text-gray-400">•</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
              {exp.achievement_link && (
                <a href={exp.achievement_link} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-500 text-[10px] mt-1 underline" onClick={e => e.stopPropagation()}>
                  <Link2 className="w-3 h-3" /> {exp.achievement_title || 'View Achievement'}
                </a>
              )}
            </div>
          ))}
          {!showTemplate && (
            <button onClick={addExp} className="flex items-center gap-1 text-blue-500 text-[10px] hover:underline mb-3">
              <Plus className="w-3 h-3" /> Add Experience
            </button>
          )}
        </React.Fragment>
      );
    } else if (sectionId === 'education') {
      content = (
        <React.Fragment>
          <SectionHeader title="Education" />
          {eduData.map((edu, i) => (
            <div
              key={edu.id || i}
              style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
              className="group relative cursor-pointer hover:outline hover:outline-2 hover:outline-blue-400 hover:outline-offset-2 rounded mb-3"
              onClick={() => !showTemplate && setModal({ type: 'edu', index: i })}
            >
              <div className="absolute -top-5 right-0 hidden group-hover:flex items-center gap-1 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded z-10">
                <Pencil className="w-3 h-3" /> Edit
                <button onClick={e => { e.stopPropagation(); removeEdu(i); }} className="ml-1 text-red-300 hover:text-red-100">
                  <X className="w-3 h-3" />
                </button>
              </div>
              <p className="font-bold text-black text-[12px]">{edu.title || edu.degree}</p>
              <p className="font-bold text-blue-600 text-[11px]">{edu.institution}</p>
              <div className="flex items-center gap-3 text-[10px] text-gray-500 mt-0.5">
                <span className="flex items-center gap-1"><Calendar className="w-2.5 h-2.5" />{edu.date || `${edu.start_date || ''} - ${edu.end_date || ''}`}</span>
                {h?.location && <span className="flex items-center gap-1"><MapPin className="w-2.5 h-2.5" />{h.location}</span>}
              </div>
              {edu.honors && <p className="text-[10.5px] text-gray-700 mt-1">• {edu.honors}</p>}
            </div>
          ))}
          {!showTemplate && (
            <button onClick={addEdu} className="flex items-center gap-1 text-blue-500 text-[10px] hover:underline mb-3">
              <Plus className="w-3 h-3" /> Add Education
            </button>
          )}
        </React.Fragment>
      );
    } else if (sectionId === 'projects') {
      if (projData.length === 0 && !showTemplate) return null;
      content = (
        <React.Fragment>
          <SectionHeader title="Projects" />
          {projData.map((proj, i) => (
            <div
              key={proj.id || i}
              style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
              className="group relative cursor-pointer hover:outline hover:outline-2 hover:outline-blue-400 hover:outline-offset-2 rounded mb-3"
              onClick={() => !showTemplate && setModal({ type: 'proj', index: i })}
            >
              <div className="absolute -top-5 right-0 hidden group-hover:flex items-center gap-1 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded z-10">
                <Pencil className="w-3 h-3" /> Edit
                <button onClick={e => { e.stopPropagation(); removeProj(i); }} className="ml-1 text-red-300 hover:text-red-100">
                  <X className="w-3 h-3" />
                </button>
              </div>
              <p className="font-bold text-black text-[12px]">{proj.title}</p>
              {proj.subtitle && <p className="text-[10px] text-gray-500">{proj.subtitle}</p>}
              <div className="flex items-center gap-3 text-[10px] text-gray-500 mt-0.5">
                {proj.date && <span className="flex items-center gap-1"><Calendar className="w-2.5 h-2.5" />{proj.date}</span>}
                {proj.project_url && (
                  <a href={proj.project_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-500 underline" onClick={e => e.stopPropagation()}>
                    <Link2 className="w-2.5 h-2.5" /> {proj.project_url}
                  </a>
                )}
              </div>
              <ul className="mt-1.5 space-y-1">
                {(Array.isArray(proj.descriptions) ? proj.descriptions : (proj.description || '').split('\n').filter(Boolean)).map((d: string, j: number) => (
                  <li key={j} className="text-[10.5px] text-gray-700 leading-snug flex gap-1.5">
                    <span className="shrink-0 text-gray-400">•</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {!showTemplate && (
            <button onClick={addProj} className="flex items-center gap-1 text-blue-500 text-[10px] hover:underline mb-3">
              <Plus className="w-3 h-3" /> Add Project
            </button>
          )}
        </React.Fragment>
      );
    } else if (sectionId === 'skills') {
      content = (
        <React.Fragment>
          <SectionHeader title="Skills" />
          {skillsData.map((skillGroup, i) => (
            <div
              key={skillGroup.id || i}
              style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
              className="group relative cursor-pointer hover:outline hover:outline-2 hover:outline-blue-400 hover:outline-offset-2 rounded mb-3"
              onClick={() => !showTemplate && setModal({ type: 'skill', index: i })}
            >
              <div className="absolute -top-5 right-0 hidden group-hover:flex items-center gap-1 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded z-10">
                <Pencil className="w-3 h-3" /> Edit
                <button onClick={e => { e.stopPropagation(); removeSkill(i); }} className="ml-1 text-red-300 hover:text-red-100">
                  <X className="w-3 h-3" />
                </button>
              </div>
              <p className="font-bold text-blue-600 text-[11px] mb-1">{skillGroup.category}</p>
              {(skillGroup.skills_list || []).map((s: string, j: number) => (
                <div key={j} className="flex items-center justify-between text-[10.5px] text-gray-700 py-0.5 border-b border-slate-100 last:border-0">
                  <span>{s}</span>
                </div>
              ))}
            </div>
          ))}
          {!showTemplate && (
            <button onClick={addSkill} className="flex items-center gap-1 text-blue-500 text-[10px] hover:underline mb-3">
              <Plus className="w-3 h-3" /> Add Skill Category
            </button>
          )}
        </React.Fragment>
      );
    }

    return (
      <div
        key={sectionId}
        draggable={showTemplate}
        onDragStart={() => { dragItem.current = { list, index: idx }; }}
        onDragEnter={() => { dragOverItem.current = { list, index: idx }; }}
        onDragEnd={handleDragSort}
        onDragOver={e => e.preventDefault()}
        className={`relative transition-all ${showTemplate ? 'border border-indigo-400 border-dashed rounded p-2 mb-4 cursor-grab active:cursor-grabbing hover:bg-slate-50' : ''}`}
      >
        {showTemplate && <div className="pointer-events-none opacity-60">{content}</div>}
        {!showTemplate && content}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p>Loading CV Editor...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-slate-100">
      {/* ── Toolbar ── */}
      <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center gap-3 flex-wrap">
        <span className="text-sm font-semibold text-slate-600">CV Editor</span>
        <span className="text-slate-300">|</span>
        <div className="ml-auto flex gap-2">
          <Button
            size="sm"
            variant={showTemplate ? 'default' : 'outline'}
            className={showTemplate ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : ''}
            onClick={() => setShowTemplate(v => !v)}
          >
            <LayoutGrid className="w-4 h-4 mr-2" />
            {showTemplate ? 'Exit Template View' : 'Template View'}
          </Button>
          <Button size="sm" variant="outline" onClick={() => { setLocalHero(null); setLocalExps(null); setLocalEdus(null); setLocalSkills(null); setLocalProjs(null); toast.success('Reset to database data'); }}>
            Reset
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={exportPDF}>
            <Download className="w-4 h-4 mr-2" /> Export PDF
          </Button>
        </div>
      </div>

      {/* ── Scrollable canvas area ── */}
      <div className="flex-1 overflow-auto bg-slate-300 flex justify-center items-start py-8">
        {/* Multi-page continuous A4 wrapper — this is what gets exported */}
        <div 
          ref={cvRef} 
          className="bg-white shadow-2xl relative"
          style={{ 
            width: '210mm', 
            minHeight: '297mm',
            fontFamily: 'Arial, sans-serif', 
            fontSize: '11px', 
            color: '#1a1a1a' 
          }}
        >
          {/* Actual flowing content */}
          <div
            ref={contentRef}
            style={{ padding: '12mm 12mm' }}
          >

            {/* ── HEADER ── */}
            <div
              className="group relative cursor-pointer hover:outline hover:outline-2 hover:outline-blue-400 hover:outline-offset-2 rounded"
              style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
              onClick={() => setModal({ type: 'header', index: null })}
            >
              <div className="absolute -top-5 right-0 hidden group-hover:flex items-center gap-1 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded z-10">
                <Pencil className="w-3 h-3" /> Edit Header
              </div>
              <h1 className="text-[28px] font-extrabold tracking-tight leading-none text-black uppercase">{h?.name || 'AHMED ESSAM'}</h1>
              <p className="text-[13px] font-bold text-blue-600 mt-1">{h?.title || 'Technical Support'}</p>
              <div className="flex flex-wrap gap-4 mt-2">
                {h?.phone && (
                  <InfoRow icon={<Phone className="w-3 h-3 text-gray-500" />} text={h.phone} href={`tel:${h.phone.replace(/\s/g, '')}`} />
                )}
                {h?.email && (
                  <InfoRow icon={<Mail className="w-3 h-3 text-gray-500" />} text={h.email} href={`mailto:${h.email}`} />
                )}
                {(h?.website_url || h?.website) && (
                  <InfoRow icon={<Globe className="w-3 h-3 text-blue-500" />} text={h?.website_url || h?.website} href={h?.website_url || h?.website} />
                )}
                {h?.location && <InfoRow icon={<MapPin className="w-3 h-3 text-gray-500" />} text={h.location} />}
              </div>
            </div>

            <div className="border-t border-slate-200 my-3" />

            {/* ── TWO COLUMN LAYOUT ── */}
            <div className="flex gap-6">

              {/* ── LEFT COLUMN ── */}
              <div style={{ flex: '0 0 55%' }}
                   className={showTemplate ? 'border-2 border-dashed border-gray-300 p-2 rounded-lg bg-gray-50/50 min-h-[100px]' : ''}
                   onDragOver={e => e.preventDefault()}
                   onDrop={() => {
                     if (dragItem.current && dragItem.current.list !== 'left' && leftSections.length === 0) {
                        dragOverItem.current = { list: 'left', index: 0 };
                        handleDragSort();
                     }
                   }}
              >
                {leftSections.map((id, idx) => renderDraggableSection(id, idx, 'left'))}
                {showTemplate && leftSections.length === 0 && <div className="text-gray-400 text-center p-4 text-xs font-semibold">Drop sections here</div>}
              </div>

              {/* ── RIGHT COLUMN ── */}
              <div style={{ flex: '0 0 42%' }}
                   className={showTemplate ? 'border-2 border-dashed border-gray-300 p-2 rounded-lg bg-gray-50/50 min-h-[100px]' : ''}
                   onDragOver={e => e.preventDefault()}
                   onDrop={() => {
                     if (dragItem.current && dragItem.current.list !== 'right' && rightSections.length === 0) {
                        dragOverItem.current = { list: 'right', index: 0 };
                        handleDragSort();
                     }
                   }}
              >
                {rightSections.map((id, idx) => renderDraggableSection(id, idx, 'right'))}
                {showTemplate && rightSections.length === 0 && <div className="text-gray-400 text-center p-4 text-xs font-semibold">Drop sections here</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* ── Modals ── */}
      {modal.type === 'header' && h && (
        <EditModal
          title="Edit Header"
          fields={[
            { label: 'Full Name', key: 'name' },
            { label: 'Job Title', key: 'title' },
            { label: 'Phone', key: 'phone' },
            { label: 'Email', key: 'email' },
            { label: 'Website URL', key: 'website_url' },
            { label: 'Location', key: 'location' },
          ]}
          data={h}
          onSave={saveHeader}
          onClose={() => setModal({ type: null, index: null })}
        />
      )}

      {modal.type === 'summary' && h && (
        <EditModal
          title="Edit Summary"
          fields={[{ label: 'Summary Text', key: 'summary', multiline: true }]}
          data={h}
          onSave={saveSummary}
          onClose={() => setModal({ type: null, index: null })}
        />
      )}

      {modal.type === 'exp' && modal.index !== null && (
        <EditModal
          title="Edit Experience"
          fields={[
            { label: 'Job Title', key: 'title' },
            { label: 'Company', key: 'company' },
            { label: 'Date (e.g. 07/2025 - Present)', key: 'date' },
            { label: 'Achievement Link (optional)', key: 'achievement_link' },
            { label: 'Achievement Label (optional)', key: 'achievement_title' },
          ]}
          data={expData[modal.index]}
          onSave={saveExp}
          onClose={() => setModal({ type: null, index: null })}
        />
      )}

      {modal.type === 'edu' && modal.index !== null && (
        <EditModal
          title="Edit Education"
          fields={[
            { label: 'Degree / Title', key: 'title' },
            { label: 'Institution', key: 'institution' },
            { label: 'Date (e.g. 2021 – 2025)', key: 'date' },
            { label: 'Honors / Notes', key: 'honors' },
          ]}
          data={eduData[modal.index]}
          onSave={saveEdu}
          onClose={() => setModal({ type: null, index: null })}
        />
      )}

      {modal.type === 'skill' && modal.index !== null && (
        <EditModal
          title="Edit Skill Category"
          fields={[
            { label: 'Category Name', key: 'category' },
          ]}
          data={skillsData[modal.index]}
          onSave={saveSkill}
          onClose={() => setModal({ type: null, index: null })}
        />
      )}

      {modal.type === 'proj' && modal.index !== null && (
        <EditModal
          title="Edit Project"
          fields={[
            { label: 'Project Title', key: 'title' },
            { label: 'Subtitle / Type', key: 'subtitle' },
            { label: 'Date', key: 'date' },
            { label: 'Project URL', key: 'project_url' },
          ]}
          data={projData[modal.index]}
          onSave={saveProj}
          onClose={() => setModal({ type: null, index: null })}
        />
      )}
    </div>
  );
}
