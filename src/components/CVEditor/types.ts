export type UUID = string;

// ─── Color Presets ──────────────────────────────────────────────────────────────
export type ColorPresetName = 'executive' | 'navy' | 'modern' | 'gray' | 'minimal' | 'custom';

export interface ColorPreset {
  name: ColorPresetName;
  label: string;
  primary: string;
  secondary: string;
  text: string;
  textLight: string;
  background: string;
  sidebar: string;
  divider: string;
  headerBg: string;
  headerText: string;
}

export const COLOR_PRESETS: Record<ColorPresetName, ColorPreset> = {
  executive: {
    name: 'executive', label: 'Executive Black',
    primary: '#1a1a1a', secondary: '#444444', text: '#1a1a1a',
    textLight: '#666666', background: '#ffffff', sidebar: '#f4f4f4',
    divider: '#1a1a1a', headerBg: '#1a1a1a', headerText: '#ffffff',
  },
  navy: {
    name: 'navy', label: 'Corporate Navy',
    primary: '#1e3a5f', secondary: '#2e5984', text: '#1a1a2e',
    textLight: '#555577', background: '#ffffff', sidebar: '#eef2f7',
    divider: '#1e3a5f', headerBg: '#1e3a5f', headerText: '#ffffff',
  },
  modern: {
    name: 'modern', label: 'Modern Blue',
    primary: '#3b5bdb', secondary: '#4c6ef5', text: '#212529',
    textLight: '#6c757d', background: '#ffffff', sidebar: '#f0f4ff',
    divider: '#3b5bdb', headerBg: '#3b5bdb', headerText: '#ffffff',
  },
  gray: {
    name: 'gray', label: 'Professional Gray',
    primary: '#2d3436', secondary: '#636e72', text: '#2d3436',
    textLight: '#636e72', background: '#ffffff', sidebar: '#f5f5f5',
    divider: '#2d3436', headerBg: '#2d3436', headerText: '#ffffff',
  },
  minimal: {
    name: 'minimal', label: 'Minimal',
    primary: '#000000', secondary: '#333333', text: '#000000',
    textLight: '#666666', background: '#ffffff', sidebar: '#f8f8f8',
    divider: '#cccccc', headerBg: '#ffffff', headerText: '#000000',
  },
  custom: {
    name: 'custom', label: 'Custom',
    primary: '#2563eb', secondary: '#3b82f6', text: '#1e293b',
    textLight: '#64748b', background: '#ffffff', sidebar: '#f1f5f9',
    divider: '#2563eb', headerBg: '#2563eb', headerText: '#ffffff',
  }
};

// ─── Typography ─────────────────────────────────────────────────────────────────
export type FontFamily = 'Calibri' | 'Arial' | 'Helvetica' | 'Aptos' | 'Inter' | 'IBM Plex Sans' | 'Roboto' | 'Lato' | 'Open Sans' | 'Manrope' | 'Plus Jakarta Sans';

export const FONTS: FontFamily[] = ['Calibri', 'Arial', 'Helvetica', 'Aptos', 'Inter', 'IBM Plex Sans', 'Roboto', 'Lato', 'Open Sans', 'Manrope', 'Plus Jakarta Sans'];

// ─── Layout Presets ─────────────────────────────────────────────────────────────
export type LayoutType = 'two-column' | 'single' | 'sidebar-left' | 'sidebar-right';

export interface ThemeConfig {
  colorPreset: ColorPresetName;
  colors: Omit<ColorPreset, 'name' | 'label'>;
  font: FontFamily;
  fontSize: number;        // base px (10-14)
  lineHeight: number;      // 1.2-2.0
  letterSpacing: number;   // em
  sectionSpacing: number;  // px between sections
  itemSpacing: number;     // px between items
  pageMargin: number;      // px
  dividerStyle: 'solid' | 'thin' | 'double' | 'accent' | 'leftborder' | 'minimal';
  layout: LayoutType;
  leftColumnWidth: number; // 0.45-0.65 (fraction)
  showPageNumbers: boolean;
  showPhoto: boolean;
}

export const defaultTheme: ThemeConfig = {
  colorPreset: 'navy',
  colors: { ...COLOR_PRESETS.navy },
  font: 'Arial', // ATS Friendly default
  fontSize: 10.5, // 10.5pt is exactly ATS compliant for body
  lineHeight: 1.5,
  letterSpacing: 0,
  sectionSpacing: 16,
  itemSpacing: 8,
  pageMargin: 76, // ~20mm margin (ATS standard)
  dividerStyle: 'solid',
  layout: 'two-column',
  leftColumnWidth: 0.58,
  showPageNumbers: true,
  showPhoto: false,
};

// ─── Block Types ─────────────────────────────────────────────────────────────────
export interface BaseBlock {
  id: UUID;
  keepTogether: boolean;
  hidden?: boolean;
}

export interface ExperienceBlock extends BaseBlock {
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  description: string[];
  achievement_link?: string;
  achievement_title?: string;
}

export interface EducationBlock extends BaseBlock {
  degree: string;
  institution: string;
  location?: string;
  startDate: string;
  endDate: string;
  honors?: string;
}

export interface ProjectBlock extends BaseBlock {
  title: string;
  subtitle?: string;
  date: string;
  url?: string;
  descriptions: string[];
}

export interface SkillCategoryBlock extends BaseBlock {
  category: string;
  skills_list: string[];
}

export interface CourseBlock extends BaseBlock {
  title: string;
  institution: string;
  date: string;
  credentialUrl?: string;
}

export interface LanguageBlock extends BaseBlock {
  language: string;
  proficiency: 'Native' | 'Fluent' | 'Professional' | 'Intermediate' | 'Basic';
}

export interface HeroData {
  name: string;
  title: string;
  phone: string;
  email: string;
  website?: string;
  linkedin?: string;
  github?: string;
  location?: string;
  nationality?: string;
  summary: string;
  avatar_url?: string;
}

export type SectionId = 'experience' | 'education' | 'projects' | 'skills' | 'courses' | 'languages';

// ─── Grid Layout ─────────────────────────────────────────────────────────────
export interface GridCell {
  sectionId: SectionId;
  colSpan: 1 | 2; // 1 = half row, 2 = full row
}

export interface GridRow {
  id: string;
  cells: GridCell[];
}

export interface SectionConfig {
  id: SectionId;
  label: string;
  hidden: boolean;
  locked: boolean;
}

// ─── Resume Data ──────────────────────────────────────────────────────────────
export interface ResumeData {
  hero: HeroData;
  experience: ExperienceBlock[];
  education: EducationBlock[];
  projects: ProjectBlock[];
  skills: SkillCategoryBlock[];
  courses: CourseBlock[];
  languages: LanguageBlock[];
  sectionConfig: SectionConfig[];
  gridLayout: GridRow[];     // Visual grid of sections
  theme: ThemeConfig;
}

// ─── History (Command Pattern) ───────────────────────────────────────────────
export type CommandType = 'INSERT_BLOCK' | 'DELETE_BLOCK' | 'UPDATE_BLOCK' | 'UPDATE_HERO' | 'UPDATE_THEME' | 'UPDATE_GRID' | 'MOVE_SECTION';

export interface Command {
  type: CommandType;
  section?: SectionId | 'sectionConfig' | 'theme' | 'hero' | 'grid';
  blockId?: UUID;
  payload: any;
  undoPayload: any;
}
