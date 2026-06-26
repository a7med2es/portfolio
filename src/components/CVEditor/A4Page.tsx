import React from 'react';
import { ResumeData, ThemeConfig, SectionId, ExperienceBlock, EducationBlock, ProjectBlock, SkillCategoryBlock, CourseBlock, LanguageBlock } from './types';
import { PaginatedPage, A4_WIDTH_PX, A4_HEIGHT_PX } from './PaginationEngine';
import { Phone, Mail, Globe, MapPin, Linkedin, Github, Calendar, Link2, GraduationCap } from 'lucide-react';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const SectionTitle = ({ title, theme }: { title: string; theme: ThemeConfig }) => (
  <div style={{ marginBottom: 8, pageBreakInside: 'avoid' }}>
    <h2 style={{
      fontSize: theme.fontSize + 4,
      fontWeight: 900,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: theme.colors.text,
      margin: 0,
      lineHeight: 1,
    }}>{title}</h2>
    <div style={{ borderBottom: `2.5px solid ${theme.colors.text}`, marginTop: 4 }} />
  </div>
);

const ContactItem = ({ icon, text, href, color }: { icon: React.ReactNode; text: string; href?: string; color: string }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 10, color, fontWeight: 500 }}>
    <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{icon}</span>
    {href
      ? <a href={href} target="_blank" rel="noreferrer" style={{ color, textDecoration: 'none' }}>{text}</a>
      : <span>{text}</span>}
  </span>
);

// ─── Experience ───────────────────────────────────────────────────────────────
const ExperienceSection = ({ items, theme }: { items: ExperienceBlock[]; theme: ThemeConfig }) => (
  <div style={{ marginBottom: theme.sectionSpacing, pageBreakInside: 'avoid' }}>
    {items.map((exp, idx) => (
      <div key={exp.id} style={{ marginBottom: theme.itemSpacing + 2, paddingBottom: theme.itemSpacing, borderBottom: `1px solid ${theme.colors.text}20`, pageBreakInside: 'avoid' }}>
        <div style={{ display: 'flex', gap: 7, alignItems: 'flex-start' }}>
          {/* Blue accent square */}
          <div style={{ width: 13, height: 13, background: theme.colors.primary, borderRadius: 2, flexShrink: 0, marginTop: 2 }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: theme.fontSize + 1.5, color: theme.colors.text, margin: 0, lineHeight: 1.2 }}>{exp.title}</p>
            <a
              href={exp.achievement_link || undefined}
              target="_blank" rel="noreferrer"
              style={{ fontWeight: 700, fontSize: theme.fontSize + 0.5, color: theme.colors.primary, margin: '2px 0 3px 0', display: 'block', textDecoration: 'none' }}
            >{exp.company}</a>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
              <Calendar size={9} color={theme.colors.textLight} />
              <span style={{ fontSize: theme.fontSize - 1, color: theme.colors.textLight }}>{exp.startDate} - {exp.endDate}</span>
              {exp.location && <>
                <MapPin size={9} color={theme.colors.textLight} />
                <span style={{ fontSize: theme.fontSize - 1, color: theme.colors.textLight }}>{exp.location}</span>
              </>}
            </div>
            <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
              {exp.description.map((d, i) => (
                <li key={i} style={{ display: 'flex', gap: 5, fontSize: theme.fontSize, color: theme.colors.text, lineHeight: theme.lineHeight, marginBottom: 2 }}>
                  <span style={{ flexShrink: 0, marginTop: 1 }}>•</span>
                  <span dangerouslySetInnerHTML={{ __html: d }} />
                </li>
              ))}
            </ul>
            {exp.achievement_link && (
              <a href={exp.achievement_link} target="_blank" rel="noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color: theme.colors.primary, fontSize: theme.fontSize - 1, marginTop: 3, textDecoration: 'none' }}>
                <Link2 size={9} /> {exp.achievement_title || 'View Certificate'}
              </a>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>
);

// ─── Education ────────────────────────────────────────────────────────────────
const EducationSection = ({ items, theme }: { items: EducationBlock[]; theme: ThemeConfig }) => (
  <div style={{ marginBottom: theme.sectionSpacing, pageBreakInside: 'avoid' }}>
    {items.map(edu => (
      <div key={edu.id} style={{ marginBottom: theme.itemSpacing, pageBreakInside: 'avoid' }}>
        <div style={{ display: 'flex', gap: 7, alignItems: 'flex-start' }}>
          <div style={{ width: 22, height: 22, borderRadius: '50%', border: `2px solid ${theme.colors.primary}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
            <GraduationCap size={11} color={theme.colors.primary} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: theme.fontSize + 1.5, color: theme.colors.text, margin: 0 }}>{edu.degree}</p>
            <a style={{ fontWeight: 700, fontSize: theme.fontSize + 0.5, color: theme.colors.primary, display: 'block', margin: '2px 0 3px', textDecoration: 'none' }}>{edu.institution}</a>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: theme.fontSize - 1, color: theme.colors.textLight }}>
                <Calendar size={9} color={theme.colors.textLight} />
                {edu.startDate} - {edu.endDate}
              </span>
              {edu.location && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: theme.fontSize - 1, color: theme.colors.textLight }}>
                  <MapPin size={9} color={theme.colors.textLight} />
                  {edu.location}
                </span>
              )}
            </div>
            {edu.honors && (
              <p style={{ fontSize: theme.fontSize, color: theme.colors.text, margin: '4px 0 0', fontStyle: 'italic' }}>
                {edu.honors}
              </p>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>
);

// ─── Projects ─────────────────────────────────────────────────────────────────
const ProjectsSection = ({ items, theme }: { items: ProjectBlock[]; theme: ThemeConfig }) => (
  <div style={{ marginBottom: theme.sectionSpacing, pageBreakInside: 'avoid' }}>
    {items.map(proj => (
      <div key={proj.id} style={{ marginBottom: theme.itemSpacing, pageBreakInside: 'avoid' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <p style={{ fontWeight: 700, fontSize: theme.fontSize + 1.5, color: theme.colors.text, margin: 0 }}>{proj.title}</p>
        </div>
        {proj.subtitle && <p style={{ fontWeight: 600, fontSize: theme.fontSize, color: theme.colors.primary, margin: '2px 0' }}>{proj.subtitle}</p>}
        <p style={{ fontSize: theme.fontSize - 1, color: theme.colors.textLight, margin: '2px 0 4px' }}>
          {proj.date} {proj.url && <span style={{ marginLeft: 6 }}>• <a href={proj.url} target="_blank" rel="noreferrer" style={{ color: theme.colors.primary, textDecoration: 'none' }}>{proj.url.replace(/^https?:\/\//, '')}</a></span>}
        </p>
        <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
          {proj.descriptions.map((d, i) => (
            <li key={i} style={{ display: 'flex', gap: 5, fontSize: theme.fontSize, color: theme.colors.text, lineHeight: theme.lineHeight, marginBottom: 2 }}>
              <span style={{ flexShrink: 0, marginTop: 1 }}>•</span>
              <span dangerouslySetInnerHTML={{ __html: d }} />
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);

// ─── Skills ───────────────────────────────────────────────────────────────────
const SkillsSection = ({ items, theme }: { items: SkillCategoryBlock[]; theme: ThemeConfig }) => (
  <div style={{ marginBottom: theme.sectionSpacing, pageBreakInside: 'avoid' }}>
    {items.map((skill, idx) => (
      <div key={skill.id} style={{ paddingBottom: 6, marginBottom: 6, borderBottom: idx < items.length - 1 ? `1px solid ${theme.colors.text}15` : 'none', pageBreakInside: 'avoid' }}>
        <p style={{ fontWeight: 700, fontSize: theme.fontSize + 0.5, color: theme.colors.primary, margin: '0 0 3px 0' }}>{skill.category}</p>
        <p style={{ fontSize: theme.fontSize, color: theme.colors.text, margin: 0, lineHeight: theme.lineHeight }}>
          {skill.skills_list.join(' • ')}
        </p>
      </div>
    ))}
  </div>
);

// ─── Courses ──────────────────────────────────────────────────────────────────
const CoursesSection = ({ items, theme }: { items: CourseBlock[]; theme: ThemeConfig }) => (
  <div style={{ marginBottom: theme.sectionSpacing, pageBreakInside: 'avoid' }}>
    {items.map(course => (
      <div key={course.id} style={{ marginBottom: theme.itemSpacing, pageBreakInside: 'avoid' }}>
        <p style={{ fontWeight: 700, fontSize: theme.fontSize + 0.5, color: theme.colors.text, margin: 0 }}>
          {course.title}
        </p>
        <p style={{ fontSize: theme.fontSize - 1, color: theme.colors.textLight, margin: '2px 0 0' }}>
          {course.institution} <span style={{ margin: '0 4px' }}>•</span> {course.date}
          {course.credentialUrl && (
            <span style={{ marginLeft: 6 }}>
              <a href={course.credentialUrl} target="_blank" rel="noreferrer" style={{ color: theme.colors.primary, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                <Link2 size={8} /> Credential
              </a>
            </span>
          )}
        </p>
      </div>
    ))}
  </div>
);

// ─── Languages ────────────────────────────────────────────────────────────────
const LanguagesSection = ({ items, theme }: { items: LanguageBlock[]; theme: ThemeConfig }) => (
  <div style={{ marginBottom: theme.sectionSpacing, pageBreakInside: 'avoid' }}>
    {items.map(lang => (
      <div key={lang.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: theme.itemSpacing, pageBreakInside: 'avoid' }}>
        <span style={{ fontWeight: 700, fontSize: theme.fontSize + 0.5, color: theme.colors.text }}>{lang.language}</span>
        <span style={{ fontSize: theme.fontSize - 1, color: theme.colors.textLight, background: `${theme.colors.primary}10`, padding: '2px 8px', borderRadius: 12 }}>
          {lang.proficiency}
        </span>
      </div>
    ))}
  </div>
);

// ─── Page Component ──────────────────────────────────────────────────────────

export const renderSection = (id: SectionId, items: any[], theme: ThemeConfig): React.ReactNode => {
  if (!items || items.length === 0) return null;

  const sectionNameMap: Record<SectionId, string> = {
    experience: 'Experience',
    education: 'Education',
    projects: 'Projects',
    skills: 'Skills',
    courses: 'Training & Courses',
    languages: 'Languages',
  };

  const title = <SectionTitle title={sectionNameMap[id]} theme={theme} />;

  switch (id) {
    case 'experience': return <div key={id}>{title}<ExperienceSection items={items} theme={theme} /></div>;
    case 'education': return <div key={id}>{title}<EducationSection items={items} theme={theme} /></div>;
    case 'projects': return <div key={id}>{title}<ProjectsSection items={items} theme={theme} /></div>;
    case 'skills': return <div key={id}>{title}<SkillsSection items={items} theme={theme} /></div>;
    case 'courses': return <div key={id}>{title}<CoursesSection items={items} theme={theme} /></div>;
    case 'languages': return <div key={id}>{title}<LanguagesSection items={items} theme={theme} /></div>;
    default: return null;
  }
};

export interface A4PageProps {
  data: ResumeData; // Keep original structure available
  pageData: PaginatedPage;
  totalPages?: number;
  isPreview?: boolean;
}

export const A4Page = React.forwardRef<HTMLDivElement, A4PageProps>(({ data, pageData, totalPages = 1, isPreview = false }, ref) => {
  const { theme, hero } = data;
  const leftWidthFraction = theme.leftColumnWidth; // e.g. 0.58
  const gap = 24;
  const innerWidth = A4_WIDTH_PX - theme.pageMargin * 2;
  const leftPx = innerWidth * leftWidthFraction - gap / 2;
  const rightPx = innerWidth * (1 - leftWidthFraction) - gap / 2;

  return (
    <div
      ref={ref}
      className="a4-page"
      style={{
        width: A4_WIDTH_PX,
        height: A4_HEIGHT_PX, // FIXED Height
        background: '#ffffff',
        fontFamily: `'${theme.font}', -apple-system, 'Segoe UI', sans-serif`,
        fontSize: theme.fontSize,
        color: theme.colors.text,
        lineHeight: theme.lineHeight,
        boxSizing: 'border-box',
        position: 'relative',
        boxShadow: isPreview ? '0 2px 40px rgba(0,0,0,0.15)' : 'none',
        overflow: 'hidden', // Enforce strict boundaries for ATS
      }}
    >
      {/* ── HERO ───────────────────────────────────────────────── */}
      {pageData.isFirstPage && (
        <div style={{ padding: `${theme.pageMargin}px ${theme.pageMargin}px 12px` }}>
          {/* Name */}
          <h1 style={{ fontSize: 30, fontWeight: 900, color: '#000', margin: 0, lineHeight: 1.1, letterSpacing: '0.01em' }}>
            {hero.name}
          </h1>
          {/* Job Title */}
          <p style={{ fontSize: theme.fontSize + 3, fontWeight: 500, color: theme.colors.primary, margin: '3px 0 10px' }}>
            {hero.title}
          </p>
          {/* Contact Row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px', marginBottom: 12 }}>
            {hero.phone && <ContactItem icon={<Phone size={12} />} text={hero.phone} href={`tel:${hero.phone}`} color="#475569" />}
            {hero.email && <ContactItem icon={<Mail size={12} />} text={hero.email} href={`mailto:${hero.email}`} color="#475569" />}
            {hero.website && <ContactItem icon={<Globe size={12} />} text={hero.website.replace(/^https?:\/\//, '')} href={hero.website} color={theme.colors.primary} />}
            {hero.linkedin && <ContactItem icon={<Linkedin size={12} />} text={hero.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')} href={hero.linkedin} color="#475569" />}
            {hero.github && <ContactItem icon={<Github size={12} />} text={hero.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')} href={hero.github} color="#475569" />}
            {hero.location && <ContactItem icon={<MapPin size={12} />} text={hero.location} color="#475569" />}
          </div>
          {/* Separator */}
          <div style={{ borderBottom: `1.5px solid ${theme.colors.text}20` }} />
        </div>
      )}

      {/* ── COLUMNS ────────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        gap: gap,
        padding: `${pageData.isFirstPage ? 0 : theme.pageMargin}px ${theme.pageMargin}px ${theme.pageMargin}px`,
        height: pageData.isFirstPage ? `calc(100% - ${pageData.heroHeight}px)` : '100%',
        alignItems: 'flex-start',
      }}>
        {/* LEFT COLUMN */}
        <div style={{ width: leftPx, flexShrink: 0 }}>
          {pageData.leftSections.map(section => renderSection(section.id, section.items, theme))}
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ width: rightPx, flexShrink: 0 }}>
          {/* Summary only on right column, only on first page, if not hidden */}
          {pageData.isFirstPage && data.sectionConfig.find(s => s.id === 'summary' as any) && hero.summary && (
            <div style={{ marginBottom: theme.sectionSpacing }}>
              <SectionTitle title="Summary" theme={theme} />
              <p style={{ margin: 0, textAlign: 'justify', color: theme.colors.text, fontSize: theme.fontSize, lineHeight: theme.lineHeight }}>
                {hero.summary}
              </p>
            </div>
          )}
          {pageData.rightSections.map(section => renderSection(section.id, section.items, theme))}
        </div>
      </div>

      {/* PAGE NUMBERS */}
      {theme.showPageNumbers && totalPages > 1 && (
        <div style={{ position: 'absolute', bottom: theme.pageMargin / 2, left: 0, right: 0, textAlign: 'center', fontSize: 10, color: theme.colors.textLight }}>
          {pageData.pageIndex + 1} / {totalPages}
        </div>
      )}
    </div>
  );
});
