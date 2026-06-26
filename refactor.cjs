const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin/CVEditorPage.tsx', 'utf8');

// The new renderSection function
const renderSectionCode = `  const renderDraggableSection = (sectionId: SectionId, idx: number, list: 'left' | 'right') => {
    let content = null;
    if (sectionId === 'summary') {
      content = (
        <React.Fragment>
          <SectionHeader title="Summary" />
          <div
            className="group relative cursor-pointer hover:outline hover:outline-2 hover:outline-blue-400 hover:outline-offset-2 rounded mb-4"
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
              className="group relative cursor-pointer hover:outline hover:outline-2 hover:outline-blue-400 hover:outline-offset-2 rounded mb-4"
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
                <span>{exp.date || exp.start_date ? \`\${exp.start_date || ''} - \${exp.end_date || 'Present'}\` : exp.date || 'Date not specified'}</span>
              </div>
              <ul className="mt-1.5 space-y-1">
                {(Array.isArray(exp.description) ? exp.description : (exp.description || '').split('\\n').filter(Boolean)).map((d: string, j: number) => (
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
            <button onClick={addExp} className="flex items-center gap-1 text-blue-500 text-[10px] hover:underline mb-4">
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
              className="group relative cursor-pointer hover:outline hover:outline-2 hover:outline-blue-400 hover:outline-offset-2 rounded mb-4"
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
                <span className="flex items-center gap-1"><Calendar className="w-2.5 h-2.5" />{edu.date || \`\${edu.start_date || ''} - \${edu.end_date || ''}\`}</span>
                {h?.location && <span className="flex items-center gap-1"><MapPin className="w-2.5 h-2.5" />{h.location}</span>}
              </div>
              {edu.honors && <p className="text-[10.5px] text-gray-700 mt-1">• {edu.honors}</p>}
            </div>
          ))}
          {!showTemplate && (
            <button onClick={addEdu} className="flex items-center gap-1 text-blue-500 text-[10px] hover:underline mb-4">
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
              className="group relative cursor-pointer hover:outline hover:outline-2 hover:outline-blue-400 hover:outline-offset-2 rounded mb-4"
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
                {(Array.isArray(proj.descriptions) ? proj.descriptions : (proj.description || '').split('\\n').filter(Boolean)).map((d: string, j: number) => (
                  <li key={j} className="text-[10.5px] text-gray-700 leading-snug flex gap-1.5">
                    <span className="shrink-0 text-gray-400">•</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {!showTemplate && (
            <button onClick={addProj} className="flex items-center gap-1 text-blue-500 text-[10px] hover:underline mb-4">
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
            <button onClick={addSkill} className="flex items-center gap-1 text-blue-500 text-[10px] hover:underline mb-4">
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
        className={\`relative transition-all \${showTemplate ? 'border border-indigo-400 border-dashed rounded p-2 mb-4 cursor-grab active:cursor-grabbing hover:bg-slate-50' : ''}\`}
      >
        {showTemplate && <div className="pointer-events-none opacity-60">{content}</div>}
        {!showTemplate && content}
      </div>
    );
  };`;

const startComment = '{/* ── TWO COLUMN LAYOUT ── */}';
const endComment = '{/* ── Modals ── */}';
let startIndex = code.indexOf(startComment);
let endIndex = code.indexOf(endComment);

const columnsCode = `{/* ── TWO COLUMN LAYOUT ── */}
            <div className="flex gap-6 min-h-[500px]">

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
      
      `;

const injectPoint = code.indexOf('return (', code.lastIndexOf('if (isLoading)'));
code = code.slice(0, injectPoint) + renderSectionCode + '\n\n  ' + code.slice(injectPoint, startIndex) + columnsCode + code.slice(endIndex);

fs.writeFileSync('src/pages/Admin/CVEditorPage.tsx', code);
console.log('done');
