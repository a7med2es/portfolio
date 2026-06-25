import React, { useRef, useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import { supabase } from '@/lib/supabase';
import { useHero, useExperiences, useEducation, useSkills, useProjects } from '@/hooks/usePortfolioData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Download, Save } from 'lucide-react';
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

    // Hide edit outlines for PDF generation
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
        
        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from('portfolio_files')
          .upload(`cvs/${opt.filename}`, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) throw error;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('portfolio_files')
          .getPublicUrl(`cvs/${opt.filename}`);

        // Update Hero table with new resume_url
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
      // Restore outlines
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

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-white sticky top-0 z-10 rounded-t-xl">
          <div>
            <CardTitle className="text-2xl font-bold text-slate-800">CV Builder</CardTitle>
            <p className="text-slate-500 text-sm mt-1">
              Click any text to edit directly. Changes are not saved to the database tables, only to the generated PDF.
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
            className="bg-white shadow-2xl relative"
            style={{ 
              width: '210mm', 
              minHeight: '297mm', 
              padding: '12mm',
              fontFamily: 'Arial, sans-serif'
            }}
          >
            {/* CV HEADER */}
            <div className="mb-6 border-b-2 border-slate-200 pb-4">
              <h1 contentEditable suppressContentEditableWarning className="text-4xl font-bold text-slate-900 tracking-tight uppercase mb-1 focus:outline-blue-200">
                {hero?.name || "AHMED ESSAM"}
              </h1>
              <h2 contentEditable suppressContentEditableWarning className="text-xl text-blue-600 font-medium mb-3 focus:outline-blue-200">
                {hero?.title || "Technical Support"}
              </h2>
              <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-600">
                <span contentEditable suppressContentEditableWarning className="focus:outline-blue-200">{hero?.phone}</span>
                <span contentEditable suppressContentEditableWarning className="focus:outline-blue-200">{hero?.email}</span>
                <span contentEditable suppressContentEditableWarning className="focus:outline-blue-200">{hero?.website}</span>
                <span contentEditable suppressContentEditableWarning className="focus:outline-blue-200">{hero?.location}</span>
              </div>
            </div>

            <div className="flex gap-8">
              {/* LEFT COLUMN */}
              <div className="w-[60%] flex flex-col gap-6">
                {/* EXPERIENCE */}
                <section>
                  <h3 contentEditable suppressContentEditableWarning className="text-lg font-bold text-slate-900 uppercase tracking-widest border-b-2 border-black pb-1 mb-4 focus:outline-blue-200">
                    Experience
                  </h3>
                  <div className="flex flex-col gap-5">
                    {(exp || []).map((e: any, i: number) => {
                      const descItems = Array.isArray(e.description) 
                        ? e.description 
                        : (e.description || "").split('\n').filter(Boolean);
                      
                      return (
                        <div key={i}>
                          <h4 contentEditable suppressContentEditableWarning className="font-bold text-slate-900 text-[15px] focus:outline-blue-200">{e.title}</h4>
                          <h5 contentEditable suppressContentEditableWarning className="text-blue-600 font-bold text-sm focus:outline-blue-200">{e.company}</h5>
                          <p contentEditable suppressContentEditableWarning className="text-xs text-slate-500 font-semibold mb-2 focus:outline-blue-200">
                            {e.start_date} - {e.end_date || "Present"}
                          </p>
                          <ul className="list-disc ml-4 text-xs text-slate-700 space-y-1">
                            {descItems.map((line: string, j: number) => (
                              <li key={j} contentEditable suppressContentEditableWarning className="focus:outline-blue-200">{line.replace(/^-\s*/, '')}</li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* EDUCATION */}
                <section>
                  <h3 contentEditable suppressContentEditableWarning className="text-lg font-bold text-slate-900 uppercase tracking-widest border-b-2 border-black pb-1 mb-4 focus:outline-blue-200">
                    Education
                  </h3>
                  <div className="flex flex-col gap-4">
                    {(edu || []).map((e: any, i: number) => (
                      <div key={i}>
                        <h4 contentEditable suppressContentEditableWarning className="font-bold text-slate-900 text-[15px] focus:outline-blue-200">{e.degree}</h4>
                        <h5 contentEditable suppressContentEditableWarning className="text-blue-600 font-bold text-sm focus:outline-blue-200">{e.institution}</h5>
                        <div className="flex justify-between items-center text-xs text-slate-500 font-semibold mt-1">
                          <span contentEditable suppressContentEditableWarning className="focus:outline-blue-200">{e.start_date} - {e.end_date}</span>
                        </div>
                        {e.description && (
                          <ul className="list-disc ml-4 mt-2 text-xs text-slate-700 space-y-1">
                             <li contentEditable suppressContentEditableWarning className="font-semibold focus:outline-blue-200">{e.description}</li>
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                {/* PROJECTS */}
                <section>
                  <h3 contentEditable suppressContentEditableWarning className="text-lg font-bold text-slate-900 uppercase tracking-widest border-b-2 border-black pb-1 mb-4 focus:outline-blue-200">
                    Projects
                  </h3>
                  <div className="flex flex-col gap-4">
                    {(projs || []).map((p: any, i: number) => {
                      const descItems = Array.isArray(p.descriptions) 
                        ? p.descriptions 
                        : (p.description || "").split('\n').filter(Boolean);
                      
                      return (
                        <div key={i}>
                          <h4 contentEditable suppressContentEditableWarning className="font-bold text-slate-900 text-[15px] focus:outline-blue-200">{p.title}</h4>
                          <div className="text-xs text-slate-500 font-semibold mb-2">
                             <span contentEditable suppressContentEditableWarning className="focus:outline-blue-200">{p.link || p.github_url || p.project_url}</span>
                          </div>
                          <ul className="list-disc ml-4 text-xs text-slate-700 space-y-1">
                            {descItems.map((line: string, j: number) => (
                              <li key={j} contentEditable suppressContentEditableWarning className="focus:outline-blue-200">{line.replace(/^-\s*/, '')}</li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </div>

              {/* RIGHT COLUMN */}
              <div className="w-[40%] flex flex-col gap-6 pl-4 border-l border-slate-100">
                {/* SUMMARY */}
                <section>
                  <h3 contentEditable suppressContentEditableWarning className="text-lg font-bold text-slate-900 uppercase tracking-widest border-b-2 border-black pb-1 mb-3 focus:outline-blue-200">
                    Summary
                  </h3>
                  <p contentEditable suppressContentEditableWarning className="text-[13px] leading-relaxed text-slate-700 focus:outline-blue-200">
                    {hero?.summary}
                  </p>
                </section>

                {/* SKILLS */}
                <section>
                  <h3 contentEditable suppressContentEditableWarning className="text-lg font-bold text-slate-900 uppercase tracking-widest border-b-2 border-black pb-1 mb-4 focus:outline-blue-200">
                    Skills
                  </h3>
                  <div className="flex flex-col gap-4">
                    {/* Assuming we group skills by category manually or just list them */}
                    <div>
                       <h4 contentEditable suppressContentEditableWarning className="text-blue-600 font-bold text-[13px] mb-2 focus:outline-blue-200">Core Competencies</h4>
                       <ul className="flex flex-col gap-2">
                        {(skills || []).map((s: any, i: number) => {
                          const skillsString = Array.isArray(s.skills_list) ? s.skills_list.join(", ") : s.skills_list;
                          return (
                            <li key={i} contentEditable suppressContentEditableWarning className="text-[13px] text-slate-800 font-semibold border-b border-slate-100 pb-1 focus:outline-blue-200">
                              <span className="font-bold text-blue-600 mr-1">{s.category}:</span> {skillsString}
                            </li>
                          );
                        })}
                       </ul>
                    </div>
                  </div>
                </section>
                
                {/* TRAINING / COURSES (Dummy or derived from data) */}
                <section>
                  <h3 contentEditable suppressContentEditableWarning className="text-lg font-bold text-slate-900 uppercase tracking-widest border-b-2 border-black pb-1 mb-4 focus:outline-blue-200">
                    Training / Courses
                  </h3>
                  <div className="flex flex-col gap-2">
                    <h4 contentEditable suppressContentEditableWarning className="font-bold text-slate-900 text-[14px] focus:outline-blue-200">Cisco Certified Network Associate (CCNA)</h4>
                    <h5 contentEditable suppressContentEditableWarning className="text-slate-700 font-bold text-[13px] focus:outline-blue-200">MK Training Center - Baghdad</h5>
                    <p contentEditable suppressContentEditableWarning className="text-[12px] leading-snug text-slate-600 mt-1 focus:outline-blue-200">
                      Topics Covered: TCP/IP, OSI Model, IPv4 Addressing, Subnetting, VLANs, STP, DHCP, DNS, NAT, Routing & Switching.
                    </p>
                  </div>
                </section>

              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
