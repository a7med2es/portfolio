import { ResumeData, ThemeConfig, GridRow, SectionId, BaseBlock } from './types';

export const A4_WIDTH_PX = 794;
export const A4_HEIGHT_PX = 1123;

// --- MATHEMATICAL HEIGHT CALCULATORS ---
// These functions use formulas instead of slow DOM measurements.

const estimateTextHeight = (text: string, fontSize: number, containerWidth: number, lineHeight: number, isBold: boolean = false): number => {
  if (!text) return 0;
  // Average character width estimate (varies by font, but 0.55 is a good average for sans-serif)
  const charWidth = fontSize * (isBold ? 0.6 : 0.5);
  const charsPerLine = Math.max(1, Math.floor(containerWidth / charWidth));
  const lines = Math.ceil(text.length / charsPerLine);
  return lines * (fontSize * lineHeight);
};

const getSectionTitleHeight = (theme: ThemeConfig): number => {
  // Title (fontSize + 4) + marginTop(4) + borderBottom(2.5) + marginBottom(8)
  return (theme.fontSize + 4) + 4 + 2.5 + 8;
};

// Item Height Estimators
const estimateExperienceHeight = (item: any, theme: ThemeConfig, columnWidth: number): number => {
  let h = 0;
  // Padding/Margins: marginBottom(itemSpacing + 2) + paddingBottom(itemSpacing)
  h += (theme.itemSpacing * 2) + 2;
  
  const contentWidth = columnWidth - 20; // 20px for the accent square gap
  
  // Title
  h += estimateTextHeight(item.title, theme.fontSize + 1.5, contentWidth, 1.2, true);
  // Company
  h += estimateTextHeight(item.company, theme.fontSize + 0.5, contentWidth, 1.2, true);
  // Dates/Location row
  h += estimateTextHeight(`${item.startDate} ${item.endDate} ${item.location || ''}`, theme.fontSize - 1, contentWidth, 1.2);
  
  // Descriptions
  if (item.description && item.description.length > 0) {
    item.description.forEach((d: string) => {
      // Strip HTML tags for length calculation
      const text = d.replace(/<[^>]*>?/gm, '');
      h += estimateTextHeight(text, theme.fontSize, contentWidth - 10, theme.lineHeight);
      h += 2; // marginBottom 2
    });
  }
  
  if (item.achievement_link) {
    h += estimateTextHeight(item.achievement_title || 'Link', theme.fontSize - 1, contentWidth, 1.2);
    h += 3; // marginTop 3
  }
  
  return h;
};

const estimateEducationHeight = (item: any, theme: ThemeConfig, columnWidth: number): number => {
  let h = 0;
  h += theme.itemSpacing; // marginBottom
  const contentWidth = columnWidth - 30; // graduation cap gap
  
  h += estimateTextHeight(item.degree, theme.fontSize + 1.5, contentWidth, 1.2, true);
  h += estimateTextHeight(item.institution, theme.fontSize + 0.5, contentWidth, 1.2, true);
  h += estimateTextHeight(`${item.startDate} ${item.endDate}`, theme.fontSize - 1, contentWidth, 1.2);
  
  if (item.honors) {
    h += estimateTextHeight(item.honors, theme.fontSize, contentWidth, theme.lineHeight);
    h += 4; // marginTop
  }
  return h;
};

const estimateProjectHeight = (item: any, theme: ThemeConfig, columnWidth: number): number => {
  let h = 0;
  h += theme.itemSpacing;
  
  h += estimateTextHeight(item.title, theme.fontSize + 1.5, columnWidth, 1.2, true);
  if (item.subtitle) {
    h += estimateTextHeight(item.subtitle, theme.fontSize, columnWidth, 1.2, true);
  }
  h += estimateTextHeight(item.date, theme.fontSize - 1, columnWidth, 1.2);
  
  if (item.descriptions && item.descriptions.length > 0) {
    item.descriptions.forEach((d: string) => {
      h += estimateTextHeight(d, theme.fontSize, columnWidth - 10, theme.lineHeight);
      h += 2;
    });
  }
  return h;
};

const estimateSkillHeight = (item: any, theme: ThemeConfig, columnWidth: number): number => {
  let h = 0;
  h += 12; // margin/padding
  h += estimateTextHeight(item.category, theme.fontSize + 0.5, columnWidth, 1.2, true);
  
  // Skills string
  const skillsText = (item.skills_list || []).join(' • ');
  h += estimateTextHeight(skillsText, theme.fontSize, columnWidth, theme.lineHeight);
  return h;
};

const estimateCourseHeight = (item: any, theme: ThemeConfig, columnWidth: number): number => {
  let h = 0;
  h += theme.itemSpacing;
  h += estimateTextHeight(item.title, theme.fontSize + 0.5, columnWidth, 1.2, true);
  h += estimateTextHeight(`${item.institution} - ${item.date}`, theme.fontSize - 1, columnWidth, 1.2);
  return h;
};

const estimateLanguageHeight = (item: any, theme: ThemeConfig, columnWidth: number): number => {
  let h = 0;
  h += theme.itemSpacing;
  h += estimateTextHeight(item.language, theme.fontSize + 0.5, columnWidth, 1.2, true);
  h += estimateTextHeight(item.proficiency, theme.fontSize - 1, columnWidth, 1.2);
  return h;
};

// Map estimators
const heightEstimators: Record<string, (item: any, theme: ThemeConfig, w: number) => number> = {
  experience: estimateExperienceHeight,
  education: estimateEducationHeight,
  projects: estimateProjectHeight,
  skills: estimateSkillHeight,
  courses: estimateCourseHeight,
  languages: estimateLanguageHeight,
};

// ─── PAGINATION ENGINE ────────────────────────────────────────────────────────

export interface PaginatedPage {
  pageIndex: number;
  isFirstPage: boolean;
  leftSections: { id: SectionId; items: any[] }[];
  rightSections: { id: SectionId; items: any[] }[];
  heroHeight: number;
}

export const paginateResumeData = (data: ResumeData): PaginatedPage[] => {
  const { theme, gridLayout } = data;
  
  const innerWidth = A4_WIDTH_PX - (theme.pageMargin * 2);
  const gap = 24;
  const leftColumnWidth = innerWidth * theme.leftColumnWidth - gap / 2;
  const rightColumnWidth = innerWidth * (1 - theme.leftColumnWidth) - gap / 2;
  
  const MAX_PAGE_HEIGHT = A4_HEIGHT_PX - (theme.pageMargin * 2);

  // 1. Calculate Hero Height (only on page 1)
  let heroHeight = 0;
  if (data.hero) {
    heroHeight += 30 * 1.1; // Name
    heroHeight += (theme.fontSize + 3) * 1.5; // Title
    heroHeight += 12; // gap
    
    // Contacts (rough estimate)
    const contactsCount = [data.hero.phone, data.hero.email, data.hero.website, data.hero.linkedin, data.hero.github, data.hero.location].filter(Boolean).length;
    const contactRows = Math.ceil(contactsCount / 3);
    heroHeight += contactRows * 18; 
    heroHeight += 12; // margin bottom
    heroHeight += 2; // separator
    heroHeight += 16; // spacing after hero
  }

  // 2. Identify Sections for Left and Right Columns
  const leftSectionIds: SectionId[] = [];
  const rightSectionIds: SectionId[] = [];
  
  gridLayout.forEach(row => {
    row.cells.forEach((cell, idx) => {
      if (row.cells.length === 1 || idx === 0) leftSectionIds.push(cell.sectionId);
      else rightSectionIds.push(cell.sectionId);
    });
  });

  // 3. Helper to chunk a column
  const paginateColumn = (
    sectionIds: SectionId[],
    colWidth: number,
    firstPageStartingHeight: number
  ) => {
    const pages: { id: SectionId; items: any[] }[][] = [];
    let currentPageIdx = 0;
    let currentHeight = firstPageStartingHeight;
    pages[currentPageIdx] = [];

    for (const sId of sectionIds) {
      const config = data.sectionConfig.find(s => s.id === sId);
      if (config?.hidden) continue;

      const items = (data as any)[sId] as any[];
      if (!items || items.length === 0) continue;

      const estimator = heightEstimators[sId];
      if (!estimator) continue;

      // Add section title height
      const titleHeight = getSectionTitleHeight(theme) + theme.sectionSpacing;
      
      // If title doesn't fit, push to next page
      if (currentHeight + titleHeight + 50 > MAX_PAGE_HEIGHT) {
        currentPageIdx++;
        currentHeight = 0;
        pages[currentPageIdx] = [];
      }

      currentHeight += titleHeight;
      
      // Add section to current page
      let currentSectionObj = { id: sId, items: [] as any[] };
      pages[currentPageIdx].push(currentSectionObj);

      for (const item of items) {
        if (item.hidden) continue;
        
        const itemHeight = estimator(item, theme, colWidth);
        
        if (currentHeight + itemHeight > MAX_PAGE_HEIGHT && currentHeight > (MAX_PAGE_HEIGHT * 0.2)) {
          // Page break
          currentPageIdx++;
          currentHeight = 0;
          pages[currentPageIdx] = [];
          
          // Re-add title on new page? Usually no, but we just continue adding items
          currentSectionObj = { id: sId, items: [] as any[] };
          pages[currentPageIdx].push(currentSectionObj);
        }
        
        currentSectionObj.items.push(item);
        currentHeight += itemHeight;
      }
    }
    
    return pages;
  };

  const leftPages = paginateColumn(leftSectionIds, leftColumnWidth, heroHeight);
  const rightPages = paginateColumn(rightSectionIds, rightColumnWidth, heroHeight);

  // 4. Merge Left and Right Pages into unified PaginatedPage array
  const totalPagesCount = Math.max(leftPages.length, rightPages.length);
  const resultPages: PaginatedPage[] = [];

  for (let i = 0; i < totalPagesCount; i++) {
    resultPages.push({
      pageIndex: i,
      isFirstPage: i === 0,
      heroHeight: i === 0 ? heroHeight : 0,
      leftSections: leftPages[i] || [],
      rightSections: rightPages[i] || [],
    });
  }

  // Ensure at least 1 page
  if (resultPages.length === 0) {
    resultPages.push({
      pageIndex: 0,
      isFirstPage: true,
      heroHeight,
      leftSections: [],
      rightSections: []
    });
  }

  return resultPages;
};
