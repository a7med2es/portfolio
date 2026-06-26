import { create } from 'zustand';
import { fabric } from 'fabric';

interface EditorState {
  canvas: fabric.Canvas | null;
  setCanvas: (canvas: fabric.Canvas) => void;
  
  activeObject: fabric.Object | null;
  setActiveObject: (obj: fabric.Object | null) => void;
  
  zoom: number;
  setZoom: (zoom: number) => void;
  
  pages: string[];
  currentPageIndex: number;
  addPage: () => void;
  setPageIndex: (index: number) => void;
  
  history: string[];
  historyIndex: number;
  saveHistory: () => void;
  undo: () => void;
  redo: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  canvas: null,
  setCanvas: (canvas) => set({ canvas }),
  
  activeObject: null,
  setActiveObject: (activeObject) => set({ activeObject }),
  
  zoom: 1,
  setZoom: (zoom) => {
    const canvas = get().canvas;
    if (canvas) {
      canvas.setZoom(zoom);
      canvas.requestRenderAll();
    }
    set({ zoom });
  },
  
  pages: ['page1'],
  currentPageIndex: 0,
  addPage: () => set((state) => ({ pages: [...state.pages, `page${state.pages.length + 1}`] })),
  setPageIndex: (index) => set({ currentPageIndex: index }),
  
  history: [],
  historyIndex: -1,
  saveHistory: () => {
    const canvas = get().canvas;
    if (!canvas) return;
    const json = JSON.stringify(canvas.toJSON());
    const { history, historyIndex } = get();
    
    // Only keep up to 50 states
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(json);
    if (newHistory.length > 50) newHistory.shift();
    
    set({ history: newHistory, historyIndex: newHistory.length - 1 });
  },
  undo: () => {
    const { canvas, history, historyIndex } = get();
    if (!canvas || historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    canvas.loadFromJSON(history[newIndex], () => {
      canvas.renderAll();
      set({ historyIndex: newIndex });
    });
  },
  redo: () => {
    const { canvas, history, historyIndex } = get();
    if (!canvas || historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    canvas.loadFromJSON(history[newIndex], () => {
      canvas.renderAll();
      set({ historyIndex: newIndex });
    });
  }
}));
