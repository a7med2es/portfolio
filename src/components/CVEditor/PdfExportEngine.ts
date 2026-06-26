import { jsPDF } from 'jspdf';
import { PageLayout } from './PaginationEngine';
import { ThemeConfig } from './theme';

export const exportToPdf = (pages: PageLayout[], theme: ThemeConfig) => {
  // A4 size in mm is 210 x 297. jspdf uses mm by default.
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  
  // Mapping logic from pixels to mm (96 DPI standard)
  const pxToMm = (px: number) => px * 0.264583;

  pages.forEach((page, index) => {
    if (index > 0) doc.addPage();
    
    // In a real implementation, we would map the exact X,Y coordinates
    // from the PaginationEngine directly into jsPDF text primitives.
    
    // Set up standard font
    doc.setFont("helvetica"); // Can map theme.typography.fontFamily later
    
    let currentYMm = pxToMm(theme.spacing.pageMargin);
    const leftMarginMm = pxToMm(theme.spacing.pageMargin);
    
    page.sections.forEach(section => {
      // Draw Section Header
      doc.setFontSize(theme.typography.h2Size);
      doc.setFont("helvetica", "bold");
      doc.text(section.type.toUpperCase(), leftMarginMm, currentYMm);
      currentYMm += 2;
      
      // Draw separator line
      doc.setLineWidth(0.5);
      doc.line(leftMarginMm, currentYMm, 210 - leftMarginMm, currentYMm);
      currentYMm += 6;
      
      section.blocks.forEach(block => {
        // Simple mapping just to demonstrate the logic
        doc.setFontSize(theme.typography.h3Size);
        doc.setFont("helvetica", "bold");
        
        // This relies on block.data structure being uniform or checking type
        const title = block.data.title || block.data.category || '';
        if (title) {
          doc.text(title, leftMarginMm, currentYMm);
          currentYMm += 5;
        }
        
        const subtitle = block.data.company || block.data.institution || '';
        if (subtitle) {
          doc.setFontSize(theme.typography.bodySize);
          doc.setTextColor(theme.colors.primary); // Not hex directly in jsPDF, needs rgb map, simplifying here
          doc.text(subtitle, leftMarginMm, currentYMm);
          doc.setTextColor(0,0,0);
          currentYMm += 4;
        }
        
        if (block.data.description && Array.isArray(block.data.description)) {
          doc.setFontSize(theme.typography.bodySize);
          doc.setFont("helvetica", "normal");
          
          block.data.description.forEach((desc: string) => {
            const splitText = doc.splitTextToSize(desc, 210 - (leftMarginMm * 2) - 5);
            doc.text(splitText, leftMarginMm + 5, currentYMm); // Bullet indent
            currentYMm += (splitText.length * 4); // Approximate height per line
          });
        }
        
        currentYMm += 4; // Gap after block
      });
      
      currentYMm += 6; // Gap after section
    });
  });

  doc.save('resume.pdf');
};
