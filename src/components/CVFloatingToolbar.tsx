import React, { useEffect, useState, useRef } from 'react';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify, Scissors, Copy, Highlighter, Baseline, Trash2 } from 'lucide-react';

export function CVFloatingToolbar({ containerRef }: { containerRef: React.RefObject<HTMLDivElement> }) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
        setVisible(false);
        return;
      }

      // Check if selection is inside our container
      let node = selection.anchorNode;
      let isInside = false;
      while (node) {
        if (node === containerRef.current) {
          isInside = true;
          break;
        }
        node = node?.parentNode || null;
      }

      if (!isInside) {
        setVisible(false);
        return;
      }

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      // Calculate position above the selection
      const top = rect.top + window.scrollY - 50; // 50px above
      const left = rect.left + window.scrollX + (rect.width / 2);

      setPosition({ top, left });
      setVisible(true);
    };

    document.addEventListener('selectionchange', handleSelection);
    return () => document.removeEventListener('selectionchange', handleSelection);
  }, [containerRef]);

  if (!visible) return null;

  const exec = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
  };

  return (
    <div 
      ref={toolbarRef}
      className="absolute z-50 bg-slate-900 border border-slate-700 shadow-2xl rounded-lg p-1.5 flex items-center gap-1 -translate-x-1/2 transition-opacity"
      style={{ top: position.top, left: position.left }}
      onMouseDown={(e) => e.preventDefault()} // Prevent selection loss when clicking toolbar
    >
      <ToolbarButton onClick={() => exec('bold')} icon={<Bold size={16} />} title="Bold" />
      <ToolbarButton onClick={() => exec('italic')} icon={<Italic size={16} />} title="Italic" />
      <ToolbarButton onClick={() => exec('underline')} icon={<Underline size={16} />} title="Underline" />
      
      <div className="w-px h-5 bg-slate-700 mx-1" />
      
      <ToolbarButton onClick={() => exec('justifyLeft')} icon={<AlignLeft size={16} />} title="Align Left" />
      <ToolbarButton onClick={() => exec('justifyCenter')} icon={<AlignCenter size={16} />} title="Align Center" />
      <ToolbarButton onClick={() => exec('justifyRight')} icon={<AlignRight size={16} />} title="Align Right" />
      <ToolbarButton onClick={() => exec('justifyFull')} icon={<AlignJustify size={16} />} title="Justify" />
      
      <div className="w-px h-5 bg-slate-700 mx-1" />

      {/* Font Size Select */}
      <select 
        className="bg-slate-800 text-slate-200 text-xs rounded border border-slate-700 px-1 py-1 h-7 cursor-pointer hover:bg-slate-700 outline-none"
        onChange={(e) => {
          exec('fontSize', e.target.value);
          e.target.value = "";
        }}
        title="Font Size"
      >
        <option value="">Size</option>
        <option value="1">Tiny</option>
        <option value="2">Small</option>
        <option value="3">Normal</option>
        <option value="4">Large</option>
        <option value="5">X-Large</option>
        <option value="6">Huge</option>
        <option value="7">Max</option>
      </select>

      {/* Colors */}
      <div className="relative flex items-center justify-center w-7 h-7 hover:bg-slate-700 rounded transition-colors" title="Text Color">
        <Baseline size={16} className="text-slate-300 absolute pointer-events-none" />
        <input 
          type="color" 
          className="w-full h-full opacity-0 cursor-pointer" 
          onChange={(e) => exec('foreColor', e.target.value)}
        />
      </div>
      <div className="relative flex items-center justify-center w-7 h-7 hover:bg-slate-700 rounded transition-colors" title="Highlight Color">
        <Highlighter size={16} className="text-slate-300 absolute pointer-events-none" />
        <input 
          type="color" 
          className="w-full h-full opacity-0 cursor-pointer" 
          onChange={(e) => exec('hiliteColor', e.target.value)}
        />
      </div>

      <div className="w-px h-5 bg-slate-700 mx-1" />

      <ToolbarButton onClick={() => exec('cut')} icon={<Scissors size={16} />} title="Cut" />
      <ToolbarButton onClick={() => exec('copy')} icon={<Copy size={16} />} title="Copy" />
      <ToolbarButton onClick={() => exec('removeFormat')} icon={<Trash2 size={16} className="text-red-400" />} title="Clear Formatting" />
    </div>
  );
}

function ToolbarButton({ onClick, icon, title }: { onClick: () => void, icon: React.ReactNode, title: string }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors"
    >
      {icon}
    </button>
  );
}
