import React, { useRef } from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import { Undo, Redo, Type, Square, Circle, Save, Download, Trash, Copy, Image as ImageIcon, LayoutList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fabric } from 'fabric';
import { PDFDocument, PDFString } from 'pdf-lib';

export function EditorToolbar() {
  const { canvas, undo, redo, activeObject } = useEditorStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const autoArrange = () => {
    if (!canvas) return;
    
    // Find the header separator line to know where columns start
    const objects = canvas.getObjects();
    const headerLine = objects.find(o => o.type === 'line' && (o as any).x2 > 700 && (o as any).strokeWidth === 1 && !(o as any).strokeDashArray);
    const headerBottom = headerLine ? (headerLine.top || 0) + 20 : 180;

    // Separate objects into left and right columns
    const colItems = { left: [] as fabric.Object[], right: [] as fabric.Object[] };
    
    objects.forEach(obj => {
      if (!obj.visible || (obj.top || 0) < headerBottom - 5) return; // Skip hidden or header items
      
      // Determine column based on center X coordinate
      const centerX = (obj.left || 0) + ((obj.width || 0) * (obj.scaleX || 1)) / 2;
      if (centerX < 450) colItems.left.push(obj);
      else colItems.right.push(obj);
    });

    const arrangeColumn = (items: fabric.Object[], startY: number) => {
      // Group items into rows by approximate top coordinate
      const rows: fabric.Object[][] = [];
      items.sort((a, b) => (a.top || 0) - (b.top || 0)).forEach(obj => {
        const top = obj.top || 0;
        const matchingRow = rows.find(r => Math.abs((r[0].top || 0) - top) < 8);
        if (matchingRow) matchingRow.push(obj);
        else rows.push([obj]);
      });

      let currentY = startY;
      
      rows.forEach(row => {
        const isSectionHeader = row.some(o => o.type === 'textbox' && (o as any).fontSize === 16);
        const isSectionLine = row.some(o => o.type === 'line' && (o as any).strokeWidth === 2);
        const isDivider = row.some(o => o.type === 'line' && (o as any).strokeDashArray);
        
        if (isSectionHeader) currentY += 15; // Extra space before section
        if (isDivider) currentY += 5; // Space before dashed divider

        let maxHeight = 0;
        row.forEach(obj => {
          obj.set({ top: currentY });
          const h = (obj.height || 0) * (obj.scaleY || 1);
          if (h > maxHeight) maxHeight = h;
          obj.setCoords();
        });

        if (isSectionHeader) currentY += maxHeight + 4;
        else if (isSectionLine) currentY += 18;
        else if (isDivider) currentY += 15;
        else currentY += maxHeight + 4;
      });
    };

    // Store state before arrange for undo
    canvas.fire('object:modified');
    
    arrangeColumn(colItems.left, headerBottom);
    arrangeColumn(colItems.right, headerBottom);
    
    canvas.requestRenderAll();
  };

  const addText = () => {
    if (!canvas) return;
    const text = new fabric.IText('New Text', {
      left: 100,
      top: 100,
      fontFamily: 'Arial',
      fontSize: 20,
    });
    canvas.add(text);
    canvas.setActiveObject(text);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canvas || !e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (f) => {
      const data = f.target?.result;
      if (typeof data === 'string') {
        fabric.Image.fromURL(data, (img) => {
          img.scaleToWidth(200);
          img.set({ left: 100, top: 100 });
          canvas.add(img);
          canvas.setActiveObject(img);
          canvas.requestRenderAll();
        });
      }
    };
    reader.readAsDataURL(file);
    // Reset input so the same file can be selected again
    e.target.value = '';
  };

  const addRect = () => {
    if (!canvas) return;
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      fill: '#e2e8f0',
      width: 100,
      height: 100,
    });
    canvas.add(rect);
    canvas.setActiveObject(rect);
  };

  const addCircle = () => {
    if (!canvas) return;
    const circle = new fabric.Circle({
      left: 100,
      top: 100,
      fill: '#e2e8f0',
      radius: 50,
    });
    canvas.add(circle);
    canvas.setActiveObject(circle);
  };

  const deleteSelected = () => {
    if (!canvas || !activeObject) return;
    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length) {
      canvas.discardActiveObject();
      activeObjects.forEach((obj) => canvas.remove(obj));
    }
  };

  const cloneSelected = () => {
    if (!canvas || !activeObject) return;
    activeObject.clone((cloned: fabric.Object) => {
      canvas.discardActiveObject();
      cloned.set({
        left: (cloned.left || 0) + 20,
        top: (cloned.top || 0) + 20,
        evented: true,
      });
      if (cloned.type === 'activeSelection') {
        cloned.canvas = canvas;
        cloned.forEachObject((obj) => canvas.add(obj));
        cloned.setCoords();
      } else {
        canvas.add(cloned);
      }
      canvas.setActiveObject(cloned);
      canvas.requestRenderAll();
    });
  };

  const exportPDF = async () => {
    if (!canvas) return;
    try {
      // Temporarily undo zoom for export
      const currentZoom = canvas.getZoom();
      canvas.setZoom(1);

      // Get canvas as data URL
      const dataUrl = canvas.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 2 // High resolution
      });

      // Restore zoom
      canvas.setZoom(currentZoom);

      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();
      
      // Embed the PNG
      const pngImage = await pdfDoc.embedPng(dataUrl);
      const pngDims = pngImage.scale(0.5); // scale down since we used multiplier 2

      // Add a blank page matching the image dimensions
      const page = pdfDoc.addPage([pngDims.width, pngDims.height]);

      // Draw the image on the page
      page.drawImage(pngImage, {
        x: 0,
        y: 0,
        width: pngDims.width,
        height: pngDims.height,
      });

      // Add clickable links to the PDF
      canvas.getObjects().forEach((obj: any) => {
        if (obj.linkUrl) {
          // Calculate PDF coordinates (bottom-left origin)
          const objW = (obj.width || 0) * (obj.scaleX || 1);
          const objH = (obj.height || 0) * (obj.scaleY || 1);
          const x = obj.left || 0;
          const y = pngDims.height - ((obj.top || 0) + objH);

          // Create link annotation dictionary
          const link = pdfDoc.context.obj({
            Type: 'Annot',
            Subtype: 'Link',
            Rect: [x, y, x + objW, y + objH],
            Border: [0, 0, 0],
            A: {
              Type: 'Action',
              S: 'URI',
              URI: PDFString.of(obj.linkUrl),
            },
          });
          page.node.addAnnot(link);
        }
      });

      // Serialize the PDF to bytes
      const pdfBytes = await pdfDoc.save();

      // Download the PDF
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'CV_Export.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export PDF Error:", error);
      alert("Failed to export PDF.");
    }
  };

  const setLink = () => {
    if (!canvas || !activeObject) return;
    const url = prompt("Enter URL:", activeObject.get('linkUrl' as keyof fabric.Object) as string || "https://");
    if (url !== null) {
      activeObject.set('linkUrl' as any, url);
      // Underline and color blue to indicate it's a link
      if (activeObject.type === 'i-text' || activeObject.type === 'textbox') {
        activeObject.set({ underline: true, fill: '#0078d4' });
      }
      canvas.requestRenderAll();
    }
  };

  return (
    <div className="bg-white border-b border-slate-200 p-2 flex items-center justify-between overflow-x-auto whitespace-nowrap">
      <div className="flex flex-wrap gap-2 items-center">
        <Button variant="outline" size="sm" onClick={undo} title="Undo">
          <Undo className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={redo} title="Redo">
          <Redo className="w-4 h-4" />
        </Button>
        <div className="w-px h-6 bg-slate-200 mx-1"></div>
        <Button variant="outline" size="sm" onClick={autoArrange} title="Auto Arrange (Remove Gaps)" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
          <LayoutList className="w-4 h-4 mr-2" /> Auto Arrange
        </Button>
        <div className="w-px h-6 bg-slate-200 mx-1"></div>
        <Button variant="ghost" size="sm" onClick={addText} title="Add Text">
          <Type className="w-4 h-4 mr-2" /> Text
        </Button>
        <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()} title="Add Image">
          <ImageIcon className="w-4 h-4 mr-2" /> Image
        </Button>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleImageUpload} 
          accept="image/*" 
          className="hidden" 
        />
        <Button variant="ghost" size="sm" onClick={addRect} title="Add Rectangle">
          <Square className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={addCircle} title="Add Circle">
          <Circle className="w-4 h-4" />
        </Button>
        <div className="w-px h-6 bg-slate-200 mx-2" />
        <Button variant="ghost" size="sm" onClick={setLink} disabled={!activeObject} title="Add Link">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
        </Button>
        <Button variant="ghost" size="sm" onClick={deleteSelected} disabled={!activeObject} title="Delete">
          <Trash className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={cloneSelected} disabled={!activeObject} title="Duplicate">
          <Copy className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2 shrink-0 ml-4">
        <Button variant="outline" size="sm" onClick={exportPDF}>
          <Download className="w-4 h-4 mr-2" /> Export PDF
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white" size="sm">
          <Save className="w-4 h-4 mr-2" /> Save Changes
        </Button>
      </div>
    </div>
  );
}
