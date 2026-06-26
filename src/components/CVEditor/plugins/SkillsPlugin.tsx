import React, { useState } from 'react';
import { ChevronDown, ChevronRight, GripVertical, Plus, Trash2 } from 'lucide-react';
import { useResumeContext } from '../ResumeProvider';
import { Command, SkillCategoryBlock, UUID } from '../types';

const generateUUID = (): UUID => {
  return typeof crypto !== 'undefined' && crypto.randomUUID 
    ? crypto.randomUUID() 
    : Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export const SkillsPlugin: React.FC = () => {
  const { state, executeCommand } = useResumeContext();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<UUID | null>(null);

  const handleAdd = () => {
    const newBlock: SkillCategoryBlock = {
      id: generateUUID(),
      keepTogether: true,
      category: 'New Skill Category',
      skills_list: ['Skill 1', 'Skill 2'],
    };
    
    executeCommand({
      type: 'INSERT_BLOCK',
      section: 'skills',
      payload: newBlock,
      undoPayload: newBlock
    });
    setExpandedId(newBlock.id);
  };

  const handleUpdate = (block: SkillCategoryBlock, field: keyof SkillCategoryBlock, value: any) => {
    executeCommand({
      type: 'UPDATE_BLOCK',
      section: 'skills',
      blockId: block.id,
      payload: { ...block, [field]: value },
      undoPayload: block
    });
  };

  const handleDelete = (block: SkillCategoryBlock) => {
    executeCommand({
      type: 'DELETE_BLOCK',
      section: 'skills',
      blockId: block.id,
      payload: null,
      undoPayload: block
    });
  };

  const handleSkillChange = (block: SkillCategoryBlock, index: number, value: string) => {
    const newList = [...block.skills_list];
    newList[index] = value;
    handleUpdate(block, 'skills_list', newList);
  };

  const handleAddSkill = (block: SkillCategoryBlock) => {
    const newList = [...block.skills_list, ''];
    handleUpdate(block, 'skills_list', newList);
  };

  const handleRemoveSkill = (block: SkillCategoryBlock, index: number) => {
    const newList = [...block.skills_list];
    newList.splice(index, 1);
    handleUpdate(block, 'skills_list', newList);
  };

  return (
    <div className="border border-slate-200 rounded-lg bg-white mb-4 overflow-hidden">
      <div 
        className="p-3 bg-slate-50 flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="font-bold text-slate-800 text-sm tracking-wide">Skills</h3>
        {isOpen ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
      </div>
      
      {isOpen && (
        <div className="p-3 space-y-3">
          {state.skills.map(block => (
            <div key={block.id} className="border border-slate-100 rounded bg-slate-50">
              <div 
                className="p-2 flex items-center justify-between cursor-pointer hover:bg-slate-100"
                onClick={() => setExpandedId(expandedId === block.id ? null : block.id)}
              >
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-slate-400 cursor-grab" />
                  <div className="font-semibold text-sm text-slate-700">
                    {block.category || '(No Category)'}
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
                  <div className="mt-3">
                    <label className="block text-xs text-slate-500 mb-1">Category Name</label>
                    <input 
                      type="text" 
                      value={block.category} 
                      onChange={e => handleUpdate(block, 'category', e.target.value)}
                      className="w-full border border-slate-200 p-1.5 rounded text-sm focus:outline-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Skills</label>
                    <div className="space-y-2">
                      {block.skills_list.map((skill, i) => (
                        <div key={i} className="flex gap-2">
                          <input 
                            value={skill}
                            onChange={e => handleSkillChange(block, i, e.target.value)}
                            className="flex-1 border border-slate-200 p-1.5 rounded text-sm focus:outline-blue-500"
                          />
                          <button onClick={() => handleRemoveSkill(block, i)} className="text-red-400 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => handleAddSkill(block)} className="mt-2 text-xs text-blue-600 flex items-center gap-1">
                      <Plus className="w-3 h-3" /> Add Skill
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
            <Plus className="w-4 h-4" /> Add Skill Category
          </button>
        </div>
      )}
    </div>
  );
};
