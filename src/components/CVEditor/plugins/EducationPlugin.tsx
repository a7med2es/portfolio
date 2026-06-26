import React, { useState } from 'react';
import { ChevronDown, ChevronRight, GripVertical, Plus, Trash2 } from 'lucide-react';
import { useResumeContext } from '../ResumeProvider';
import { Command, EducationBlock, UUID } from '../types';

const generateUUID = (): UUID => {
  return typeof crypto !== 'undefined' && crypto.randomUUID 
    ? crypto.randomUUID() 
    : Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export const EducationPlugin: React.FC = () => {
  const { state, executeCommand } = useResumeContext();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<UUID | null>(null);

  const handleAdd = () => {
    const newBlock: EducationBlock = {
      id: generateUUID(),
      keepTogether: true,
      title: 'New Degree',
      institution: 'University Name',
      date: '2020 - 2024',
    };
    
    executeCommand({
      type: 'INSERT_BLOCK',
      section: 'education',
      payload: newBlock,
      undoPayload: newBlock
    });
    setExpandedId(newBlock.id);
  };

  const handleUpdate = (block: EducationBlock, field: keyof EducationBlock, value: any) => {
    executeCommand({
      type: 'UPDATE_BLOCK',
      section: 'education',
      blockId: block.id,
      payload: { ...block, [field]: value },
      undoPayload: block
    });
  };

  const handleDelete = (block: EducationBlock) => {
    executeCommand({
      type: 'DELETE_BLOCK',
      section: 'education',
      blockId: block.id,
      payload: null,
      undoPayload: block
    });
  };

  return (
    <div className="border border-slate-200 rounded-lg bg-white mb-4 overflow-hidden">
      <div 
        className="p-3 bg-slate-50 flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="font-bold text-slate-800 text-sm tracking-wide">Education</h3>
        {isOpen ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
      </div>
      
      {isOpen && (
        <div className="p-3 space-y-3">
          {state.education.map(block => (
            <div key={block.id} className="border border-slate-100 rounded bg-slate-50">
              <div 
                className="p-2 flex items-center justify-between cursor-pointer hover:bg-slate-100"
                onClick={() => setExpandedId(expandedId === block.id ? null : block.id)}
              >
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-slate-400 cursor-grab" />
                  <div className="font-semibold text-sm text-slate-700">
                    {block.title || '(No Degree)'} <span className="font-normal text-slate-400 text-xs">at {block.institution}</span>
                  </div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDelete(block); }}
                  className="p-1 text-red-400 hover:text-red-600 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {expandedId === block.id && (
                <div className="p-3 pt-0 space-y-3 border-t border-slate-100">
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Degree / Title</label>
                      <input 
                        type="text" 
                        value={block.title} 
                        onChange={e => handleUpdate(block, 'title', e.target.value)}
                        className="w-full border border-slate-200 p-1.5 rounded text-sm focus:outline-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Institution</label>
                      <input 
                        type="text" 
                        value={block.institution} 
                        onChange={e => handleUpdate(block, 'institution', e.target.value)}
                        className="w-full border border-slate-200 p-1.5 rounded text-sm focus:outline-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Date</label>
                      <input 
                        type="text" 
                        value={block.date} 
                        onChange={e => handleUpdate(block, 'date', e.target.value)}
                        className="w-full border border-slate-200 p-1.5 rounded text-sm focus:outline-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Honors (Optional)</label>
                      <input 
                        type="text" 
                        value={block.honors || ''} 
                        onChange={e => handleUpdate(block, 'honors', e.target.value)}
                        className="w-full border border-slate-200 p-1.5 rounded text-sm focus:outline-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          <button 
            onClick={handleAdd}
            className="w-full py-2 border border-dashed border-blue-300 text-blue-600 rounded text-sm font-medium hover:bg-blue-50 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Education
          </button>
        </div>
      )}
    </div>
  );
};
