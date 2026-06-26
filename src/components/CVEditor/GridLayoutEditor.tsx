import React, { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import { useResumeContext } from './ResumeProvider';
import { GridRow, GridCell, SectionId } from './types';
import { GripVertical, Eye, EyeOff, Lock, Unlock, ArrowLeftRight, LayoutGrid } from 'lucide-react';

const SECTION_LABELS: Record<SectionId, string> = {
  experience: 'Experience',
  education: 'Education',
  projects: 'Projects',
  skills: 'Skills',
  courses: 'Training',
  languages: 'Languages',
};

const SECTION_COLORS: Record<SectionId, string> = {
  experience: '#3b82f6',
  education: '#8b5cf6',
  projects: '#10b981',
  skills: '#f59e0b',
  courses: '#ef4444',
  languages: '#06b6d4',
};

// ─── Draggable Section Card ───────────────────────────────────────────────────
const SectionCard = ({
  sectionId,
  isDragging,
  isOverlay,
}: {
  sectionId: SectionId;
  isDragging?: boolean;
  isOverlay?: boolean;
}) => {
  const color = SECTION_COLORS[sectionId];
  const label = SECTION_LABELS[sectionId];

  return (
    <div
      style={{
        background: isOverlay ? '#fff' : '#fff',
        border: `2px solid ${isDragging ? color : '#e2e8f0'}`,
        borderLeft: `4px solid ${color}`,
        borderRadius: 6,
        padding: '6px 8px',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        cursor: isDragging ? 'grabbing' : 'grab',
        opacity: isDragging && !isOverlay ? 0.3 : 1,
        boxShadow: isOverlay ? '0 8px 24px rgba(0,0,0,0.15)' : 'none',
        userSelect: 'none',
        transition: 'border-color 0.15s',
        minHeight: 34,
      }}
    >
      <GripVertical size={14} color="#94a3b8" />
      <div
        style={{
          width: 8, height: 8, borderRadius: '50%',
          background: color, flexShrink: 0,
        }}
      />
      <span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>{label}</span>
    </div>
  );
};

// ─── Drop Zone ────────────────────────────────────────────────────────────────
const DropZone = ({
  id,
  isOver,
  label,
}: {
  id: string;
  isOver: boolean;
  label: string;
}) => (
  <div
    data-droppable-id={id}
    style={{
      border: `2px dashed ${isOver ? '#3b82f6' : '#cbd5e1'}`,
      borderRadius: 6,
      padding: '8px',
      background: isOver ? '#eff6ff' : '#f8fafc',
      minHeight: 38,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.15s',
    }}
  >
    <span style={{ fontSize: 10, color: isOver ? '#3b82f6' : '#94a3b8', fontWeight: 500 }}>
      {label}
    </span>
  </div>
);

// ─── Main Grid Layout Editor ──────────────────────────────────────────────────
export const GridLayoutEditor: React.FC = () => {
  const { state, executeCommand } = useResumeContext();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const gridLayout = state.gridLayout;

  // Parse droppable id: "row-X-cell-Y"
  const parseDropId = (id: string) => {
    const parts = id.split('-');
    // Format: rowId-cell-cellIdx or "newrow-after-rowId"
    return { raw: id };
  };

  // Find cell position by sectionId
  const findCell = (sectionId: SectionId): { rowIdx: number; cellIdx: number } | null => {
    for (let rowIdx = 0; rowIdx < gridLayout.length; rowIdx++) {
      const cellIdx = gridLayout[rowIdx].cells.findIndex(c => c.sectionId === sectionId);
      if (cellIdx !== -1) return { rowIdx, cellIdx };
    }
    return null;
  };

  const handleDragStart = (e: DragStartEvent) => {
    setActiveId(e.active.id as string);
  };

  const handleDragOver = (e: DragOverEvent) => {
    setOverId(e.over?.id as string ?? null);
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    setActiveId(null);
    setOverId(null);

    if (!over || active.id === over.id) return;

    const draggedId = active.id as SectionId;
    const targetId = over.id as SectionId;

    const fromPos = findCell(draggedId);
    const toPos = findCell(targetId);

    if (!fromPos || !toPos) return;

    // Swap the two sections
    const newLayout: GridRow[] = JSON.parse(JSON.stringify(gridLayout));
    const fromCell = newLayout[fromPos.rowIdx].cells[fromPos.cellIdx];
    const toCell = newLayout[toPos.rowIdx].cells[toPos.cellIdx];

    const tmp = fromCell.sectionId;
    fromCell.sectionId = toCell.sectionId;
    toCell.sectionId = tmp;

    executeCommand({ type: 'UPDATE_GRID', payload: newLayout, undoPayload: gridLayout });
  };

  // Toggle a section's visibility
  const toggleHidden = (id: SectionId) => {
    const newConfig = state.sectionConfig.map(s =>
      s.id === id ? { ...s, hidden: !s.hidden } : s
    );
    executeCommand({ type: 'MOVE_SECTION', payload: newConfig, undoPayload: state.sectionConfig });
  };

  // Move cell between columns in same row
  const swapRowCells = (rowIdx: number) => {
    const newLayout: GridRow[] = JSON.parse(JSON.stringify(gridLayout));
    const cells = newLayout[rowIdx].cells;
    if (cells.length === 2) {
      newLayout[rowIdx].cells = [cells[1], cells[0]];
      executeCommand({ type: 'UPDATE_GRID', payload: newLayout, undoPayload: gridLayout });
    }
  };

  const getHidden = (id: SectionId) => state.sectionConfig.find(s => s.id === id)?.hidden ?? false;

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <LayoutGrid size={16} color="#64748b" />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>Visual Grid Layout</span>
        </div>
        <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>
          Drag sections to swap positions. Click ⇄ to swap columns.
        </p>
      </div>

      {/* Hero row (locked) */}
      <div style={{
        border: '2px solid #e2e8f0',
        borderLeft: '4px solid #0f172a',
        borderRadius: 6,
        padding: '7px 10px',
        background: '#f8fafc',
        marginBottom: 6,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <Lock size={12} color="#94a3b8" />
        <span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>Hero (Locked — always first)</span>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {gridLayout.map((row, rowIdx) => (
            <div key={row.id}>
              {/* Row */}
              <div style={{ display: 'flex', gap: 6, alignItems: 'stretch' }}>
                {row.cells.map((cell, cellIdx) => {
                  const isHidden = getHidden(cell.sectionId);
                  const isDraggingThis = activeId === cell.sectionId;
                  const isOverThis = overId === cell.sectionId;

                  return (
                    <div
                      key={cell.sectionId}
                      data-id={cell.sectionId}
                      style={{ flex: 1, position: 'relative' }}
                    >
                      <div
                        draggable
                        onDragStart={() => setActiveId(cell.sectionId)}
                        onDragEnd={() => {
                          // handled by DndContext
                        }}
                        style={{
                          border: `2px solid ${isOverThis ? SECTION_COLORS[cell.sectionId] : isHidden ? '#e2e8f0' : '#e2e8f0'}`,
                          borderLeft: `4px solid ${isHidden ? '#cbd5e1' : SECTION_COLORS[cell.sectionId]}`,
                          borderRadius: 6,
                          padding: '6px 8px',
                          background: isOverThis ? '#f0f9ff' : isHidden ? '#f1f5f9' : '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          cursor: 'grab',
                          opacity: isHidden ? 0.5 : 1,
                          transition: 'all 0.15s',
                          userSelect: 'none',
                          minHeight: 36,
                        }}
                      >
                        <GripVertical size={13} color="#94a3b8" />
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: SECTION_COLORS[cell.sectionId], flexShrink: 0 }} />
                        <span style={{ fontSize: 11, fontWeight: 600, color: isHidden ? '#94a3b8' : '#334155', flex: 1 }}>
                          {SECTION_LABELS[cell.sectionId]}
                        </span>
                        <button
                          onClick={() => toggleHidden(cell.sectionId)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex', alignItems: 'center', color: '#94a3b8' }}
                          title={isHidden ? 'Show section' : 'Hide section'}
                        >
                          {isHidden ? <EyeOff size={12} /> : <Eye size={12} />}
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Swap columns button */}
                {row.cells.length === 2 && (
                  <button
                    onClick={() => swapRowCells(rowIdx)}
                    style={{
                      background: 'none', border: '1.5px solid #e2e8f0',
                      borderRadius: 6, cursor: 'pointer', padding: '0 6px',
                      display: 'flex', alignItems: 'center', color: '#94a3b8',
                      flexShrink: 0, transition: 'all 0.15s',
                    }}
                    title="Swap columns"
                  >
                    <ArrowLeftRight size={13} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <DragOverlay>
          {activeId ? <SectionCard sectionId={activeId as SectionId} isOverlay /> : null}
        </DragOverlay>
      </DndContext>

      {/* Legend */}
      <div style={{ marginTop: 14, padding: '8px 10px', background: '#f8fafc', borderRadius: 6, border: '1px solid #e2e8f0' }}>
        <p style={{ fontSize: 10, color: '#64748b', margin: 0, lineHeight: 1.6 }}>
          💡 <strong>Tip:</strong> Use the ⇄ button to swap left & right sections in each row. Use 👁 to hide/show sections.
        </p>
      </div>
    </div>
  );
};
