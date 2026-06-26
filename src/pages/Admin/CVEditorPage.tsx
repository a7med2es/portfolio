import React, { useMemo, useState } from 'react';
import { ResumeProvider, useResumeContext, DEFAULT_RESUME } from '@/components/CVEditor/ResumeProvider';
import { A4Page } from '@/components/CVEditor/A4Page';
import { paginateResumeData, PaginatedPage, A4_HEIGHT_PX } from '@/components/CVEditor/PaginationEngine';
import { HeroPlugin } from '@/components/CVEditor/plugins/HeroPlugin';
import { ExperiencePlugin } from '@/components/CVEditor/plugins/ExperiencePlugin';
import {
  EducationPlugin, ProjectsPlugin, SkillsPlugin,
  CoursesPlugin, LanguagesPlugin,
} from '@/components/CVEditor/plugins/AllPlugins';
import { ThemeEditor } from '@/components/CVEditor/ThemeEditor';
import { GridLayoutEditor } from '@/components/CVEditor/GridLayoutEditor';
import { FONTS } from '@/components/CVEditor/types';
import {
  Undo2, Redo2, Download, ZoomIn, ZoomOut,
  FileText, Palette, LayoutGrid, ChevronLeft, ChevronRight,
  RotateCcw, Maximize2, Minimize2,
} from 'lucide-react';
import { toast } from 'sonner';

// Load Google Fonts dynamically
const loadFont = (name: string) => {
  const id = `gf-${name.replace(/\s/g, '-')}`;
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${name.replace(/\s/g, '+')}:wght@300;400;500;600;700;800;900&display=swap`;
  document.head.appendChild(link);
};
FONTS.forEach(loadFont);

type Tab = 'content' | 'design' | 'layout';

const ZOOM_STEPS = [0.5, 0.65, 0.75, 0.9, 1, 1.25, 1.5];

const CVEditorCore = () => {
  const { state, undo, redo, canUndo, canRedo, zoom, setZoom, dispatch } = useResumeContext();
  const [activeTab, setActiveTab] = useState<Tab>('content');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);

  React.useEffect(() => loadFont(state.theme.font), [state.theme.font]);

  const zoomIdx = ZOOM_STEPS.findIndex(z => z === zoom);

  // Paginate data whenever state changes
  const pages = React.useMemo(() => paginateResumeData(state), [state]);

  const handleExport = () => {
    window.print();
    toast.success('Opening print dialog — select "Save as PDF"');
  };

  const handleReset = () => {
    if (window.confirm('Reset all resume data to defaults?')) {
      dispatch({ type: 'LOAD_STATE', payload: DEFAULT_RESUME });
      toast.success('Resume reset to defaults');
    }
  };

  const tabs: { id: Tab; icon: React.ReactNode; label: string }[] = [
    { id: 'content', icon: <FileText size={14} />, label: 'Content' },
    { id: 'design', icon: <Palette size={14} />, label: 'Design' },
    { id: 'layout', icon: <LayoutGrid size={14} />, label: 'Layout' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-300">
      {/* ── SIDEBAR ─────────────────────────────────────────────── */}
      {sidebarOpen && !fullscreen && (
        <div className="w-[360px] min-w-[360px] h-full flex flex-col bg-white border-r border-slate-200 shadow-xl z-20">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50 flex-shrink-0">
            <div>
              <h1 className="text-sm font-bold text-slate-800">Resume Builder</h1>
              <p className="text-[10px] text-slate-400">Auto-saves every 1.5s</p>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={undo} disabled={!canUndo} title="Undo (Ctrl+Z)"
                className="p-1.5 rounded hover:bg-slate-200 disabled:opacity-30 text-slate-600 transition-colors">
                <Undo2 size={14} />
              </button>
              <button onClick={redo} disabled={!canRedo} title="Redo (Ctrl+Y)"
                className="p-1.5 rounded hover:bg-slate-200 disabled:opacity-30 text-slate-600 transition-colors">
                <Redo2 size={14} />
              </button>
              <button onClick={handleReset} title="Reset to defaults"
                className="p-1.5 rounded hover:bg-red-100 hover:text-red-600 text-slate-400 transition-colors">
                <RotateCcw size={14} />
              </button>
              <div className="w-px h-4 bg-slate-200 mx-1" />
              <button onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded hover:bg-slate-200 text-slate-400 transition-colors">
                <ChevronLeft size={14} />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-100 flex-shrink-0">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold transition-colors ${activeTab === t.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>
                {t.icon}{t.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-3">
            {activeTab === 'content' && (
              <div>
                <HeroPlugin />
                <ExperiencePlugin />
                <EducationPlugin />
                <ProjectsPlugin />
                <SkillsPlugin />
                <CoursesPlugin />
                <LanguagesPlugin />
              </div>
            )}
            {activeTab === 'design' && <ThemeEditor />}
            {activeTab === 'layout' && <GridLayoutEditor />}
          </div>

          {/* Export */}
          <div className="p-3 border-t border-slate-100 flex-shrink-0">
            <button onClick={handleExport}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors">
              <Download size={15} /> Export PDF
            </button>
          </div>
        </div>
      )}

      {/* Collapsed sidebar toggle */}
      {!sidebarOpen && !fullscreen && (
        <div className="w-10 h-full bg-white border-r border-slate-200 flex flex-col items-center py-3 gap-3 z-20">
          <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-slate-100 rounded text-slate-500">
            <ChevronRight size={15} />
          </button>
        </div>
      )}

      {/* ── PREVIEW AREA ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-slate-200 shadow-sm flex-shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setZoom(ZOOM_STEPS[Math.max(0, zoomIdx - 1)])}
              disabled={zoomIdx <= 0}
              className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-30 text-slate-600">
              <ZoomOut size={15} />
            </button>
            <select
              value={zoom}
              onChange={e => setZoom(parseFloat(e.target.value))}
              className="text-xs border border-slate-200 rounded px-1.5 py-1 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-400 cursor-pointer">
              {ZOOM_STEPS.map(z => <option key={z} value={z}>{Math.round(z * 100)}%</option>)}
            </select>
            <button
              onClick={() => setZoom(ZOOM_STEPS[Math.min(ZOOM_STEPS.length - 1, zoomIdx + 1)])}
              disabled={zoomIdx >= ZOOM_STEPS.length - 1}
              className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-30 text-slate-600">
              <ZoomIn size={15} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-green-600 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
              Auto-saved
            </span>
            <button
              onClick={() => setFullscreen(f => !f)}
              className="p-1.5 rounded hover:bg-slate-100 text-slate-500"
              title="Toggle fullscreen preview">
              {fullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            </button>
          </div>
        </div>

        {/* Pages canvas */}
        <div
          className="flex-1 overflow-auto flex flex-col items-center gap-8"
          style={{ background: '#94a3b8', padding: '32px 24px' }}
        >
          <div style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
            // Shrink the space the element takes up when zoomed out
            marginBottom: zoom < 1 ? `${(zoom - 1) * A4_HEIGHT_PX * pages.length}px` : 0,
          }}>
            {pages.map((pageData, i) => (
              <div key={i} className="print-page-wrapper" style={{ breakInside: 'avoid', pageBreakAfter: 'always' }}>
                <A4Page data={state} pageData={pageData} totalPages={pages.length} isPreview />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Print CSS injected globally
const PRINT_CSS = `
@media print {
  @page { size: A4 portrait; margin: 0; }
  body { background: white !important; margin: 0 !important; padding: 0 !important; }
  body > * { display: none !important; }
  .a4-page { 
    display: block !important; 
    width: 210mm !important; 
    height: 297mm !important; 
    transform: none !important; 
    box-shadow: none !important; 
    margin: 0 !important;
    page-break-after: always;
    break-after: page;
  }
  .print-page-wrapper {
    display: block !important;
    visibility: visible !important;
    page-break-after: always;
  }
  .print-page-wrapper *, .a4-page, .a4-page * { visibility: visible !important; }
}
`;

export default function CVEditorPage() {
  return (
    <>
      <style>{PRINT_CSS}</style>
      <ResumeProvider>
        <CVEditorCore />
      </ResumeProvider>
    </>
  );
}
