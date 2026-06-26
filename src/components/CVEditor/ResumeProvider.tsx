import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { ResumeData, Command, ThemeConfig, defaultTheme, HeroData, GridRow } from './types';

const LOCAL_STORAGE_KEY = 'resume_builder_state_v3';

const DEFAULT_GRID: GridRow[] = [
  { id: 'row-1', cells: [{ sectionId: 'experience', colSpan: 1 }, { sectionId: 'skills', colSpan: 1 }] },
  { id: 'row-2', cells: [{ sectionId: 'education', colSpan: 1 }, { sectionId: 'languages', colSpan: 1 }] },
  { id: 'row-3', cells: [{ sectionId: 'projects', colSpan: 1 }, { sectionId: 'courses', colSpan: 1 }] },
];

export const DEFAULT_RESUME: ResumeData = {
  hero: {
    name: 'AHMED ESSAM',
    title: 'Technical Support',
    phone: '+9647701773452',
    email: '34asqf@gmail.com',
    website: 'https://ahmedes.netlify.app',
    linkedin: '',
    github: '',
    location: 'Baghdad, Iraq',
    nationality: '',
    summary: 'Results-driven Control and Systems Engineer with hands-on experience in ISP technical support, incident management, and network troubleshooting. Strong background in SLA-driven case handling, service outage diagnosis, and continuous service reliability improvement.',
  },
  experience: [
    {
      id: 'exp-1', keepTogether: true,
      title: 'Technical Support', company: 'EarthLink Telecommunications',
      location: 'Baghdad', startDate: '07/2025', endDate: 'Present',
      description: [
        'Diagnosed and resolved network and service incidents, escalating complex cases within SLA timelines.',
        'Managed technical support tickets end-to-end with accurate documentation and customer follow-up.',
        'Troubleshot connectivity and performance issues to reduce repeat incidents and improve resolution efficiency.',
        'Achievements: Awarded Employee of the Month for two consecutive months in recognition of developing a technical tool that streamlined workflows, simplified access to requirements, and significantly enhanced team productivity and efficiency.',
      ],
      achievement_link: 'https://drive.google.com/file/d/1lGLDZULfFNhttofLGo7vaVqLGTTsww19/view',
      achievement_title: 'View Achievement',
    },
    {
      id: 'exp-2', keepTogether: true,
      title: 'Electronics and Control', company: 'Al-Munir Home Appliances Manufacturing Company',
      location: 'Baghdad', startDate: '06/2024', endDate: '01/2025',
      description: [
        'Participated in testing, validation, and production support of industrial control panels, working directly with electronic assemblies in appliance manufacturing.',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1', keepTogether: true,
      degree: 'B.Sc. in Control and Systems Engineering',
      institution: 'University of Technology',
      location: 'Baghdad, Iraq',
      startDate: '09/2021', endDate: '06/2025',
      honors: 'Graduated Second in Class (Faculty-wide Rank)',
    },
  ],
  projects: [],
  skills: [
    {
      id: 'skill-1', keepTogether: true,
      category: 'Customer Support & Service',
      skills_list: ['Incident Handling & Service Outage Diagnosis', 'Ticket Management, Documentation & SLA Compliance', 'Customer Communication & Case Ownership', 'Escalation Handling & Technical Reporting', 'Network Fault Isolation & First-Level Troubleshooting', 'Remote Support & CRM'],
    },
    {
      id: 'skill-2', keepTogether: true,
      category: 'Web Technologies',
      skills_list: ['HTML5 & CSS3 & SQL', 'Built a web-based control interface integrating ESP32 and Arduino via UART communication.'],
    },
  ],
  courses: [
    {
      id: 'course-1', keepTogether: true,
      title: 'Cisco Certified Network Associate (CCNA)',
      institution: 'MK Training Center — Baghdad',
      date: '2024',
      credentialUrl: '',
    },
  ],
  languages: [
    { id: 'lang-1', keepTogether: true, language: 'Arabic', proficiency: 'Native' },
    { id: 'lang-2', keepTogether: true, language: 'English', proficiency: 'Intermediate' },
  ],
  sectionConfig: [
    { id: 'experience', label: 'Experience', hidden: false, locked: false },
    { id: 'education', label: 'Education', hidden: false, locked: false },
    { id: 'projects', label: 'Projects', hidden: false, locked: false },
    { id: 'skills', label: 'Skills', hidden: false, locked: false },
    { id: 'courses', label: 'Training & Courses', hidden: false, locked: false },
    { id: 'languages', label: 'Languages', hidden: false, locked: false },
  ],
  gridLayout: DEFAULT_GRID,
  theme: defaultTheme,
};

interface HistoryState { past: Command[]; present: ResumeData; future: Command[]; }

type Action =
  | { type: 'EXECUTE'; command: Command }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'LOAD_STATE'; payload: ResumeData };

function applyCommand(state: ResumeData, command: Command): ResumeData {
  const next = { ...state };
  switch (command.type) {
    case 'UPDATE_HERO': next.hero = command.payload as HeroData; break;
    case 'UPDATE_THEME': next.theme = command.payload as ThemeConfig; break;
    case 'UPDATE_GRID': next.gridLayout = command.payload as GridRow[]; break;
    case 'MOVE_SECTION': next.sectionConfig = command.payload; break;
    case 'INSERT_BLOCK': {
      const list = [...((next as any)[command.section!] as any[])];
      list.push(command.payload);
      (next as any)[command.section!] = list;
      break;
    }
    case 'UPDATE_BLOCK': {
      const list = [...((next as any)[command.section!] as any[])];
      const idx = list.findIndex(i => i.id === command.blockId);
      if (idx !== -1) list[idx] = command.payload;
      (next as any)[command.section!] = list;
      break;
    }
    case 'DELETE_BLOCK': {
      (next as any)[command.section!] = ((next as any)[command.section!] as any[]).filter((i: any) => i.id !== command.blockId);
      break;
    }
  }
  return next;
}

function reverseCommand(state: ResumeData, command: Command): ResumeData {
  const next = { ...state };
  switch (command.type) {
    case 'UPDATE_HERO': next.hero = command.undoPayload; break;
    case 'UPDATE_THEME': next.theme = command.undoPayload; break;
    case 'UPDATE_GRID': next.gridLayout = command.undoPayload as GridRow[]; break;
    case 'MOVE_SECTION': next.sectionConfig = command.undoPayload; break;
    case 'INSERT_BLOCK':
      (next as any)[command.section!] = ((next as any)[command.section!] as any[]).filter((i: any) => i.id !== command.payload.id);
      break;
    case 'UPDATE_BLOCK': {
      const list = [...((next as any)[command.section!] as any[])];
      const idx = list.findIndex(i => i.id === command.blockId);
      if (idx !== -1) list[idx] = command.undoPayload;
      (next as any)[command.section!] = list;
      break;
    }
    case 'DELETE_BLOCK': {
      (next as any)[command.section!] = [...((next as any)[command.section!] as any[]), command.undoPayload];
      break;
    }
  }
  return next;
}

function historyReducer(state: HistoryState, action: Action): HistoryState {
  switch (action.type) {
    case 'EXECUTE': {
      const newPresent = applyCommand(state.present, action.command);
      return { past: [...state.past.slice(-49), action.command], present: newPresent, future: [] };
    }
    case 'UNDO': {
      if (state.past.length === 0) return state;
      const prev = state.past[state.past.length - 1];
      return { past: state.past.slice(0, -1), present: reverseCommand(state.present, prev), future: [prev, ...state.future] };
    }
    case 'REDO': {
      if (state.future.length === 0) return state;
      const next = state.future[0];
      return { past: [...state.past, next], present: applyCommand(state.present, next), future: state.future.slice(1) };
    }
    case 'LOAD_STATE': return { past: [], present: action.payload, future: [] };
    default: return state;
  }
}

function loadFromStorage(): ResumeData {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as ResumeData;
      
      // Deep merge to ensure all required fields exist (especially theme and gridLayout)
      return {
        ...DEFAULT_RESUME,
        ...parsed,
        theme: {
          ...DEFAULT_RESUME.theme,
          ...(parsed.theme || {})
        },
        gridLayout: parsed.gridLayout && parsed.gridLayout.length > 0 ? parsed.gridLayout : DEFAULT_GRID,
        sectionConfig: parsed.sectionConfig && parsed.sectionConfig.length > 0 ? parsed.sectionConfig : DEFAULT_RESUME.sectionConfig
      };
    }
  } catch (e) {
    console.error("Failed to load resume from storage", e);
  }
  return DEFAULT_RESUME;
}

interface ResumeContextType {
  state: ResumeData;
  dispatch: React.Dispatch<Action>;
  executeCommand: (command: Command) => void;
  undo: () => void; redo: () => void;
  canUndo: boolean; canRedo: boolean;
  zoom: number; setZoom: (z: number) => void;
}

const ResumeContext = createContext<ResumeContextType | null>(null);

export const ResumeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [historyState, dispatch] = useReducer(historyReducer, { past: [], present: loadFromStorage(), future: [] });
  const [zoom, setZoom] = React.useState(0.9);

  useEffect(() => {
    const timer = setTimeout(() => {
      try { localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(historyState.present)); } catch {}
    }, 1500);
    return () => clearTimeout(timer);
  }, [historyState.present]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && !e.shiftKey && e.key === 'z') { e.preventDefault(); dispatch({ type: 'UNDO' }); }
      if ((e.ctrlKey && e.shiftKey && e.key === 'Z') || (e.ctrlKey && e.key === 'y')) { e.preventDefault(); dispatch({ type: 'REDO' }); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const executeCommand = useCallback((command: Command) => dispatch({ type: 'EXECUTE', command }), []);
  const undo = useCallback(() => dispatch({ type: 'UNDO' }), []);
  const redo = useCallback(() => dispatch({ type: 'REDO' }), []);

  return (
    <ResumeContext.Provider value={{
      state: historyState.present, dispatch, executeCommand,
      undo, redo, canUndo: historyState.past.length > 0, canRedo: historyState.future.length > 0,
      zoom, setZoom,
    }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResumeContext = () => {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error('useResumeContext must be used within ResumeProvider');
  return ctx;
};
