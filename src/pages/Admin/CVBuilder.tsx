import React, { useRef, useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import { supabase } from '@/lib/supabase';
import { useHero, useExperiences, useEducation, useSkills, useProjects } from '@/hooks/usePortfolioData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Download, Save, Phone, Mail, Globe, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export default function CVBuilder() {
  const templateRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  const { data: hero, isLoading: heroLoading } = useHero();
  const { data: exp, isLoading: expLoading } = useExperiences();
  const { data: edu, isLoading: eduLoading } = useEducation();
  const { data: skills, isLoading: skillsLoading } = useSkills();
  const { data: projs, isLoading: projsLoading } = useProjects();

  useEffect(() => {
    if (!heroLoading && !expLoading && !eduLoading && !skillsLoading && !projsLoading) {
      setDataLoaded(true);
    }
  }, [heroLoading, expLoading, eduLoading, skillsLoading, projsLoading]);

  const generatePDF = async (action: 'download' | 'save') => {
    const element = templateRef.current;
    if (!element) return;

    if (action === 'download') setIsGenerating(true);
    else setIsSaving(true);

    const editables = element.querySelectorAll('[contenteditable="true"]');
    editables.forEach(el => (el as HTMLElement).style.outline = 'none');

    const opt = {
      margin: 0,
      filename: `Ahmed_Essam_CV_${Date.now()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      if (action === 'download') {
        await html2pdf().set(opt).from(element).save();
      } else if (action === 'save') {
        const pdfBlob = await html2pdf().set(opt).from(element).outputPdf('blob');
        const file = new File([pdfBlob], opt.filename, { type: 'application/pdf' });
        const { error } = await supabase.storage
          .from('portfolio_files')
          .upload(`cvs/${opt.filename}`, file, { cacheControl: '3600', upsert: false });
        if (error) throw error;
        const { data: { publicUrl } } = supabase.storage.from('portfolio_files').getPublicUrl(`cvs/${opt.filename}`);
        if (hero?.id) {
          const { error: updateError } = await supabase.from("hero").update({ resume_url: publicUrl }).eq("id", hero.id);
          if (updateError) throw updateError;
        }
        toast.success("CV saved and set as your live resume!");
      }
    } catch (err: any) {
      toast.error(action === 'save' ? "Failed to save CV: " + err.message : "Failed to download CV: " + err.message);
    } finally {
      if (action === 'download') setIsGenerating(false);
      else setIsSaving(false);
      editables.forEach(el => (el as HTMLElement).style.outline = '');
    }
  };

  if (!dataLoaded) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p>Loading CV Data...</p>
      </div>
    );
  }

  // Separate degree education from training courses
  const degrees = (edu || []).filter((e: any) => !e.is_training);
  const trainings = (edu || []).filter((e: any) => e.is_training);

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-white sticky top-0 z-10 rounded-t-xl">
          <div>
            <CardTitle className="text-2xl font-bold text-slate-800">CV Builder</CardTitle>
            <p className="text-slate-500 text-sm mt-1">
              Click any text to edit directly. Changes are only reflected in the generated PDF.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => generatePDF('download')} disabled={isGenerating || isSaving}>
              {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
              Download PDF
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => generatePDF('save')} disabled={isGenerating || isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save & Publish Live
            </Button>
          </div>
        </CardHeader>

        <CardContent className="bg-slate-100 p-8 flex justify-center overflow-x-auto">
          {/* A4 Container */}
          <div
            ref={templateRef}
            className="bg-white shadow-2xl"
            style={{
              width: '210mm',
              minHeight: '297mm',
              fontFamily: '"Arial", sans-serif',
              fontSize: '11px',
            }}
          >
            {/* HEADER */}
            <div style={{ background: '#1e293b', color: 'white', padding: '20px 24px 16px' }}>
              <h1
                contentEditable suppressContentEditableWarning
                style={{ fontSize: '28px', fontWeight: 'bold', letterSpacing: '2px', margin: 0, outline: 'none' }}
              >
                {hero?.name || 'AHMED ESSAM'}
              </h1>
              <h2
                contentEditable suppressContentEditableWarning
                style={{ fontSize: '13px', color: '#93c5fd', fontWeight: '500', margin: '4px 0 12px', outline: 'none' }}
              >
                {hero?.title || 'Control & Systems Engineer'}
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '11px', color: '#cbd5e1' }}>
                {hero?.phone && (
                  <span contentEditable suppressContentEditableWarning style={{ outline: 'none' }}>
                    📞 {hero.phone}
                  </span>
                )}
                {hero?.email && (
                  <span contentEditable suppressContentEditableWarning style={{ outline: 'none' }}>
                    ✉ {hero.email}
                  </span>
                )}
                {hero?.location && (
                  <span contentEditable suppressContentEditableWarning style={{ outline: 'none' }}>
                    📍 {hero.location}
                  </span>
                )}
                {hero?.website && (
                  <span contentEditable suppressContentEditableWarning style={{ outline: 'none' }}>
                    🌐 {hero.website}
                  </span>
                )}
              </div>
            </div>

            {/* BODY */}
            <div style={{ display: 'flex', gap: '0', padding: '0' }}>
              {/* LEFT COLUMN - 62% */}
              <div style={{ width: '62%', padding: '20px 16px 20px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* OBJECTIVE */}
                {hero?.summary && (
                  <section>
                    <h3 style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1.5px', borderBottom: '2px solid #1e293b', paddingBottom: '4px', marginBottom: '8px', color: '#1e293b' }}>
                      Objective
                    </h3>
                    <p contentEditable suppressContentEditableWarning style={{ fontSize: '11px', lineHeight: '1.6', color: '#475569', outline: 'none' }}>
                      {hero.summary}
                    </p>
                  </section>
                )}

                {/* EXPERIENCE */}
                {(exp || []).length > 0 && (
                  <section>
                    <h3 style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1.5px', borderBottom: '2px solid #1e293b', paddingBottom: '4px', marginBottom: '12px', color: '#1e293b' }}>
                      Work Experience
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {(exp || []).map((e: any, i: number) => (
                        <div key={i}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <h4 contentEditable suppressContentEditableWarning style={{ fontWeight: 'bold', fontSize: '12px', color: '#1e293b', margin: 0, outline: 'none' }}>
                                {e.title}
                              </h4>
                              <h5 contentEditable suppressContentEditableWarning style={{ color: '#2563eb', fontWeight: '600', fontSize: '11px', margin: '2px 0', outline: 'none' }}>
                                {e.company}{e.location ? ` — ${e.location}` : ''}
                              </h5>
                            </div>
                            {e.date && (
                              <span contentEditable suppressContentEditableWarning style={{ fontSize: '10px', color: '#64748b', whiteSpace: 'nowrap', outline: 'none' }}>
                                {e.date}
                              </span>
                            )}
                          </div>
                          <ul style={{ marginLeft: '14px', marginTop: '6px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                            {(Array.isArray(e.description) ? e.description : []).map((line: string, j: number) => (
                              <li key={j} contentEditable suppressContentEditableWarning style={{ fontSize: '11px', lineHeight: '1.5', outline: 'none' }}>
                                {line}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* EDUCATION */}
                {degrees.length > 0 && (
                  <section>
                    <h3 style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1.5px', borderBottom: '2px solid #1e293b', paddingBottom: '4px', marginBottom: '12px', color: '#1e293b' }}>
                      Education
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {degrees.map((e: any, i: number) => (
                        <div key={i}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <h4 contentEditable suppressContentEditableWarning style={{ fontWeight: 'bold', fontSize: '12px', color: '#1e293b', margin: 0, outline: 'none' }}>
                                {e.title}
                              </h4>
                              <h5 contentEditable suppressContentEditableWarning style={{ color: '#2563eb', fontWeight: '600', fontSize: '11px', margin: '2px 0', outline: 'none' }}>
                                {e.institution}
                              </h5>
                              {e.honors && (
                                <p contentEditable suppressContentEditableWarning style={{ fontSize: '11px', color: '#475569', margin: '2px 0', outline: 'none' }}>
                                  {e.honors}
                                </p>
                              )}
                            </div>
                            {e.date && (
                              <span contentEditable suppressContentEditableWarning style={{ fontSize: '10px', color: '#64748b', whiteSpace: 'nowrap', outline: 'none' }}>
                                {e.date}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* PROJECTS */}
                {(projs || []).length > 0 && (
                  <section>
                    <h3 style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1.5px', borderBottom: '2px solid #1e293b', paddingBottom: '4px', marginBottom: '12px', color: '#1e293b' }}>
                      Academic Projects
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {(projs || []).map((p: any, i: number) => (
                        <div key={i}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <h4 contentEditable suppressContentEditableWarning style={{ fontWeight: 'bold', fontSize: '12px', color: '#1e293b', margin: 0, outline: 'none' }}>
                              {p.title}
                            </h4>
                            {p.project_url && (
                              <span contentEditable suppressContentEditableWarning style={{ fontSize: '10px', color: '#2563eb', outline: 'none' }}>
                                {p.project_url}
                              </span>
                            )}
                          </div>
                          {p.subtitle && (
                            <p contentEditable suppressContentEditableWarning style={{ fontSize: '10px', color: '#64748b', margin: '2px 0', outline: 'none' }}>
                              {p.subtitle}
                            </p>
                          )}
                          {(Array.isArray(p.descriptions) ? p.descriptions : []).length > 0 && (
                            <ul style={{ marginLeft: '14px', marginTop: '4px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              {(Array.isArray(p.descriptions) ? p.descriptions : []).map((line: string, j: number) => (
                                <li key={j} contentEditable suppressContentEditableWarning style={{ fontSize: '10px', lineHeight: '1.5', outline: 'none' }}>
                                  {line}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              {/* RIGHT COLUMN - 38% */}
              <div style={{ width: '38%', padding: '20px 20px 20px 16px', borderLeft: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '20px', background: '#f8fafc' }}>

                {/* SKILLS */}
                {(skills || []).length > 0 && (
                  <section>
                    <h3 style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1.5px', borderBottom: '2px solid #1e293b', paddingBottom: '4px', marginBottom: '12px', color: '#1e293b' }}>
                      Skills
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {(skills || []).map((s: any, i: number) => (
                        <div key={i}>
                          <h4 contentEditable suppressContentEditableWarning style={{ fontWeight: 'bold', fontSize: '11px', color: '#2563eb', marginBottom: '4px', outline: 'none' }}>
                            {s.category}
                          </h4>
                          <ul style={{ marginLeft: '10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            {(Array.isArray(s.skills_list) ? s.skills_list : []).map((skill: string, j: number) => (
                              <li key={j} contentEditable suppressContentEditableWarning style={{ fontSize: '10px', color: '#475569', lineHeight: '1.5', outline: 'none' }}>
                                {skill}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* TRAINING */}
                {trainings.length > 0 && (
                  <section>
                    <h3 style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1.5px', borderBottom: '2px solid #1e293b', paddingBottom: '4px', marginBottom: '12px', color: '#1e293b' }}>
                      Training / Courses
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {trainings.map((e: any, i: number) => (
                        <div key={i}>
                          <h4 contentEditable suppressContentEditableWarning style={{ fontWeight: 'bold', fontSize: '11px', color: '#1e293b', margin: 0, outline: 'none' }}>
                            {e.title}
                          </h4>
                          <h5 contentEditable suppressContentEditableWarning style={{ color: '#2563eb', fontWeight: '600', fontSize: '10px', margin: '2px 0', outline: 'none' }}>
                            {e.institution}
                          </h5>
                          {e.course_details && (
                            <p contentEditable suppressContentEditableWarning style={{ fontSize: '10px', color: '#475569', lineHeight: '1.5', outline: 'none' }}>
                              {e.course_details}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
