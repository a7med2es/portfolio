import React, { useState } from 'react';
import { useResumeContext } from './ResumeProvider';
import { COLOR_PRESETS, ColorPresetName, FONTS, FontFamily, ThemeConfig } from './types';
import { Command } from './types';
import { Palette, Type, Layout, ChevronDown, ChevronRight } from 'lucide-react';

const SectionShell: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ icon, title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-slate-200 rounded-lg bg-white mb-3 overflow-hidden">
      <button className="w-full p-3 bg-slate-50 flex items-center justify-between hover:bg-slate-100 transition-colors" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center gap-2">{icon}<span className="font-semibold text-slate-700 text-sm">{title}</span></div>
        {isOpen ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
      </button>
      {isOpen && <div className="p-4">{children}</div>}
    </div>
  );
};

export const ThemeEditor: React.FC = () => {
  const { state, executeCommand } = useResumeContext();
  const theme = state.theme;

  const update = (patch: Partial<ThemeConfig>) => {
    const updatedTheme = { ...theme, ...patch };
    const command: Command = { type: 'UPDATE_THEME', payload: updatedTheme, undoPayload: theme };
    executeCommand(command);
  };

  const applyPreset = (name: ColorPresetName) => {
    const preset = COLOR_PRESETS[name];
    update({
      colorPreset: name,
      colors: {
        primary: preset.primary, secondary: preset.secondary, text: preset.text,
        textLight: preset.textLight, background: preset.background, sidebar: preset.sidebar,
        divider: preset.divider, headerBg: preset.headerBg, headerText: preset.headerText,
      }
    });
  };

  return (
    <div className="space-y-3">
      {/* Color Presets */}
      <SectionShell icon={<Palette className="w-4 h-4 text-slate-500" />} title="Color Theme" defaultOpen>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {(Object.entries(COLOR_PRESETS) as [ColorPresetName, typeof COLOR_PRESETS[ColorPresetName]][]).map(([key, preset]) => (
            <button key={key} onClick={() => applyPreset(key)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-all hover:scale-105 ${theme.colorPreset === key ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'}`}>
              <div className="flex gap-1">
                <div className="w-4 h-4 rounded-sm" style={{ background: preset.primary }} />
                <div className="w-4 h-4 rounded-sm" style={{ background: preset.headerText }} />
                <div className="w-4 h-4 rounded-sm border border-slate-200" style={{ background: preset.background }} />
              </div>
              <span className="text-[10px] text-slate-600 text-center leading-tight">{preset.label}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {([
            { key: 'primary', label: 'Primary Color' },
            { key: 'headerBg', label: 'Header Background' },
            { key: 'text', label: 'Text Color' },
            { key: 'textLight', label: 'Subtitle Color' },
            { key: 'divider', label: 'Divider Color' },
            { key: 'background', label: 'Page Background' },
          ] as { key: string; label: string }[]).map(f => (
            <div key={f.key} className="flex items-center gap-2">
              <input type="color" value={(theme.colors as any)[f.key] ?? '#000000'}
                onChange={e => update({ colors: { ...theme.colors, [f.key]: e.target.value }, colorPreset: 'custom' })}
                className="w-8 h-8 rounded cursor-pointer border-0 p-0" />
              <label className="text-xs text-slate-500">{f.label}</label>
            </div>
          ))}
        </div>
      </SectionShell>

      {/* Typography */}
      <SectionShell icon={<Type className="w-4 h-4 text-slate-500" />} title="Typography">
        <div className="space-y-3">
          <div>
            <label className="text-xs text-slate-500 mb-1 block font-medium">Font Family</label>
            <select value={theme.font} onChange={e => update({ font: e.target.value as FontFamily })}
              className="w-full border border-slate-200 rounded p-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400">
              {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Base Font Size ({theme.fontSize}px)</label>
              <input type="range" min={8} max={14} step={0.5} value={theme.fontSize}
                onChange={e => update({ fontSize: parseFloat(e.target.value) })}
                className="w-full accent-blue-600" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Line Height ({theme.lineHeight})</label>
              <input type="range" min={1.2} max={2} step={0.05} value={theme.lineHeight}
                onChange={e => update({ lineHeight: parseFloat(e.target.value) })}
                className="w-full accent-blue-600" />
            </div>
          </div>
        </div>
      </SectionShell>

      {/* Layout */}
      <SectionShell icon={<Layout className="w-4 h-4 text-slate-500" />} title="Page Layout">
        <div className="space-y-3">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Divider Style</label>
            <select value={theme.dividerStyle} onChange={e => update({ dividerStyle: e.target.value as any })}
              className="w-full border border-slate-200 rounded p-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400">
              {['solid', 'thin', 'double', 'accent', 'leftborder', 'minimal'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Left Column Width ({Math.round(theme.leftColumnWidth * 100)}%)</label>
            <input type="range" min={0.4} max={0.7} step={0.01} value={theme.leftColumnWidth}
              onChange={e => update({ leftColumnWidth: parseFloat(e.target.value) })}
              className="w-full accent-blue-600" />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5"><span>40%</span><span>70%</span></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Section Spacing ({theme.sectionSpacing}px)</label>
              <input type="range" min={8} max={28} step={1} value={theme.sectionSpacing}
                onChange={e => update({ sectionSpacing: parseInt(e.target.value) })}
                className="w-full accent-blue-600" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1 block">Item Spacing ({theme.itemSpacing}px)</label>
              <input type="range" min={4} max={16} step={1} value={theme.itemSpacing}
                onChange={e => update({ itemSpacing: parseInt(e.target.value) })}
                className="w-full accent-blue-600" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={theme.showPhoto} onChange={e => update({ showPhoto: e.target.checked })} className="accent-blue-600" />
              <span className="text-xs text-slate-600">Show Profile Photo</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={theme.showPageNumbers} onChange={e => update({ showPageNumbers: e.target.checked })} className="accent-blue-600" />
              <span className="text-xs text-slate-600">Page Numbers</span>
            </label>
          </div>
        </div>
      </SectionShell>
    </div>
  );
};
