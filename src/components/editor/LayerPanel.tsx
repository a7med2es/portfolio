import React, { useEffect, useState } from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import { Layers, Eye, EyeOff, Lock, Unlock, ArrowUp, ArrowDown } from 'lucide-react';

export function LayerPanel() {
  const { canvas, activeObject, setActiveObject } = useEditorStore();
  const [objects, setObjects] = useState<fabric.Object[]>([]);

  const updateLayers = () => {
    if (canvas) {
      // Fabric objects are ordered from back to front (0 is bottom).
      // We reverse it so top layers appear at the top of the list.
      setObjects([...canvas.getObjects()].reverse());
    }
  };

  useEffect(() => {
    if (!canvas) return;
    updateLayers();
    canvas.on('object:added', updateLayers);
    canvas.on('object:removed', updateLayers);
    canvas.on('object:modified', updateLayers);
    return () => {
      canvas.off('object:added', updateLayers);
      canvas.off('object:removed', updateLayers);
      canvas.off('object:modified', updateLayers);
    };
  }, [canvas]);

  const toggleVisibility = (obj: fabric.Object, e: React.MouseEvent) => {
    e.stopPropagation();
    obj.set('visible', !obj.visible);
    canvas?.requestRenderAll();
    updateLayers();
  };

  const toggleLock = (obj: fabric.Object, e: React.MouseEvent) => {
    e.stopPropagation();
    const isLocked = obj.lockMovementX;
    obj.set({
      lockMovementX: !isLocked,
      lockMovementY: !isLocked,
      lockRotation: !isLocked,
      lockScalingX: !isLocked,
      lockScalingY: !isLocked,
      hasControls: isLocked,
    });
    canvas?.requestRenderAll();
    updateLayers();
  };

  const bringForward = (obj: fabric.Object, e: React.MouseEvent) => {
    e.stopPropagation();
    canvas?.bringForward(obj);
    updateLayers();
  };

  const sendBackward = (obj: fabric.Object, e: React.MouseEvent) => {
    e.stopPropagation();
    canvas?.sendBackwards(obj);
    updateLayers();
  };

  const [isMinimized, setIsMinimized] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleEditStart = (obj: any, index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingIndex(index);
    const typeLabel = obj.type === 'i-text' || obj.type === 'textbox' ? 'Text' : obj.type === 'rect' ? 'Rectangle' : obj.type === 'circle' ? 'Circle' : 'Image';
    setEditValue(obj.layerName || typeLabel);
  };

  const handleEditSave = (obj: any) => {
    obj.set('layerName', editValue);
    setEditingIndex(null);
    updateLayers();
  };

  const handleEditKeyDown = (e: React.KeyboardEvent, obj: any) => {
    if (e.key === 'Enter') {
      handleEditSave(obj);
    } else if (e.key === 'Escape') {
      setEditingIndex(null);
    }
  };

  return (
    <div className={`flex flex-col h-full bg-slate-50 transition-all duration-300 ${isMinimized ? 'w-12' : 'w-64'}`}>
      <div 
        className={`p-3 border-b border-slate-200 flex items-center gap-2 font-semibold text-slate-700 cursor-pointer hover:bg-slate-100 ${isMinimized ? 'justify-center' : 'justify-between'}`}
        onClick={() => setIsMinimized(!isMinimized)}
        title="Toggle Layers Panel"
      >
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" /> 
          {!isMinimized && <span>Layers</span>}
        </div>
      </div>
      
      {!isMinimized && (
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {objects.map((obj: any, i) => {
            const isSelected = activeObject === obj;
            const typeLabel = obj.type === 'i-text' || obj.type === 'textbox' ? 'Text' : obj.type === 'rect' ? 'Rectangle' : obj.type === 'circle' ? 'Circle' : 'Image';
            const displayName = obj.layerName || typeLabel;
            
            return (
              <div 
                key={i} 
                className={`flex items-center justify-between p-2 rounded-md text-sm cursor-pointer border ${isSelected ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-transparent hover:border-slate-200 text-slate-700'}`}
                onClick={() => {
                  if (canvas) {
                    canvas.setActiveObject(obj);
                    canvas.requestRenderAll();
                  }
                }}
                onDoubleClick={(e) => handleEditStart(obj, i, e)}
              >
                <div className="flex items-center gap-2 flex-1 truncate">
                  {obj.layerColor && <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: obj.layerColor }}></div>}
                  {editingIndex === i ? (
                    <input 
                      autoFocus
                      className="flex-1 w-full bg-white border border-blue-400 rounded px-1 text-sm outline-none text-slate-800"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={() => handleEditSave(obj)}
                      onKeyDown={(e) => handleEditKeyDown(e, obj)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span className="truncate" title="Double click to rename">{displayName}</span>
                  )}
                </div>
                
                {editingIndex !== i && (
                  <div className="flex items-center gap-1 ml-2 shrink-0">
                    <button onClick={(e) => bringForward(obj, e)} className="p-1 hover:bg-slate-200 rounded text-slate-500">
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button onClick={(e) => sendBackward(obj, e)} className="p-1 hover:bg-slate-200 rounded text-slate-500">
                      <ArrowDown className="w-3 h-3" />
                    </button>
                    <button onClick={(e) => toggleLock(obj, e)} className="p-1 hover:bg-slate-200 rounded text-slate-500">
                      {obj.lockMovementX ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                    </button>
                    <button onClick={(e) => toggleVisibility(obj, e)} className="p-1 hover:bg-slate-200 rounded text-slate-500">
                      {obj.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
          {objects.length === 0 && (
            <div className="text-center p-4 text-xs text-slate-400">No objects on canvas</div>
          )}
        </div>
      )}
    </div>
  );
}
