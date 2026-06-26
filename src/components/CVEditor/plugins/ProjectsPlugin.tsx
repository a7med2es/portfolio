import React, { useState } from 'react';
import { ChevronDown, ChevronRight, GripVertical, Plus, Trash2 } from 'lucide-react';
import { useResumeContext } from '../ResumeProvider';
import { Command, ProjectBlock, UUID } from '../types';

const generateUUID = (): UUID => {
  return typeof crypto !== 'undefined' && crypto.randomUUID 
    ? crypto.randomUUID() 
    : Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export const ProjectsPlugin: React.FC = () => {
  const { state, executeCommand } = useResumeContext();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<UUID | null>(null);

  const handleAdd = () => {
    const newBlock: ProjectBlock = {
      id: generateUUID(),
      keepTogether: true,
      title: 'New Project',
      date: 'Present',
      descriptions: ['Implemented a cool feature.'],
    };
    
    executeCommand({
      type: 'INSERT_BLOCK',
      section: 'projects',
      payload: newBlock,
      undoPayload: newBlock
    });
    setExpandedId(newBlock.id);
  };

  const handleUpdate = (block: ProjectBlock, field: keyof ProjectBlock, value: any) => {
    executeCommand({
      type: 'UPDATE_BLOCK',
      section: 'projects',
      blockId: block.id,
      payload: { ...block, [field]: value },
      undoPayload: block
    });
  };

  const handleDelete = (block: ProjectBlock) => {
    executeCommand({
      type: 'DELETE_BLOCK',
      section: 'projects',
      blockId: block.id,
      payload: null,
      undoPayload: block
    });
  };

  const handleDescChange = (block: ProjectBlock, index: number, value: string) => {
    const newDesc = [...block.descriptions];
    newDesc[index] = value;
    handleUpdate(block, 'descriptions', newDesc);
  };

  const handleAddDesc = (block: ProjectBlock) => {
    const newDesc = [...block.descriptions, ''];
    handleUpdate(block, 'descriptions', newDesc);
  };

  const handleRemoveDesc = (block: ProjectBlock, index: number) => {
    const newDesc = [...block.descriptions];
    newDesc.splice(index, 1);
    handleUpdate(block, 'descriptions', newDesc);
  };

  return (
    <div className="border border-slate-200 rounded-lg bg-white mb-4 overflow-hidden">
      <div 
        className="p-3 bg-slate-50 flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="font-bold text-slate-800 text-sm tracking-wide">Projects</h3>
        {isOpen ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
      </div>
      
      {isOpen && (
        <div className="p-3 space-y-3">
          {state.projects.map(block => (
            <div key={block.id} className="border border-slate-100 rounded bg-slate-50">
              <div 
                className="p-2 flex items-center justify-between cursor-pointer hover:bg-slate-100"
                onClick={() => setExpandedId(expandedId === block.id ? null : block.id)}
              >
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-slate-400 cursor-grab" />
                  <div className="font-semibold text-sm text-slate-700">
                    {block.title || '(No Title)'}
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
                      <label className="block text-xs text-slate-500 mb-1">Project Name</label>
                      <input 
                        type="text" 
                        value={block.title} 
                        onChange={e => handleUpdate(block, 'title', e.target.value)}
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
                    <div className="col-span-2">
                      <label className="block text-xs text-slate-500 mb-1">URL (Optional)</label>
                      <input 
                        type="text" 
                        value={block.project_url || ''} 
                        onChange={e => handleUpdate(block, 'project_url', e.target.value)}
                        className="w-full border border-slate-200 p-1.5 rounded text-sm focus:outline-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Descriptions</label>
                    <div className="space-y-2">
                      {block.descriptions.map((desc, i) => (
                        <div key={i} className="flex gap-2">
                          <textarea 
                            value={desc}
                            onChange={e => handleDescChange(block, i, e.target.value)}
                            rows={2}
                            className="flex-1 border border-slate-200 p-1.5 rounded text-sm focus:outline-blue-500 resize-none"
                          />
                          <button onClick={() => handleRemoveDesc(block, i)} className="text-red-400 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => handleAddDesc(block)} className="mt-2 text-xs text-blue-600 flex items-center gap-1">
                      <Plus className="w-3 h-3" /> Add Point
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          <button 
            onClick={handleAdd}
            className="w-full py-2 border border-dashed border-blue-300 text-blue-600 rounded text-sm font-medium hover:bg-blue-50 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Project
          </button>
        </div>
      )}
    </div>
  );
};
