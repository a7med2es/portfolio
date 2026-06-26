import { Rocket, ExternalLink, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/hooks/usePortfolioData";
import { useEffect, useState } from "react";

const AcademicProjects = () => {
  const { data: projects, isLoading } = useProjects();
  const [hiddenItems, setHiddenItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const hidden = new Set(JSON.parse(localStorage.getItem("portfolio_hidden_projects") || "[]")) as Set<string>;
      setHiddenItems(hidden);
    } catch { }
  }, []);

  if (isLoading) {
    return <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-indigo-500" /></div>;
  }

  const visibleProjects = (projects || []).filter((proj: any) => !hiddenItems.has(proj.id));

  if (visibleProjects.length === 0) return null;

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <div className="w-3 h-8 bg-gradient-to-b from-indigo-500 to-indigo-600 rounded-full"></div>
          ACADEMIC PROJECTS
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {visibleProjects.map((proj: any) => (
            <div key={proj.id} className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 rounded-xl p-6 border border-indigo-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 hover:rotate-0 transition-transform">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-800 mb-1 tracking-tight">{proj.title}</h3>
                      <p className="text-indigo-600 font-bold text-sm uppercase tracking-widest">{proj.subtitle}</p>
                      {proj.date && <p className="text-slate-500 text-sm mt-1 font-medium">{proj.date}</p>}
                    </div>
                    {proj.project_url && (
                      <Button asChild className="bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 shadow-md">
                        <a href={proj.project_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                          <ExternalLink className="w-4 h-4" />
                          View Project
                        </a>
                      </Button>
                    )}
                  </div>

                  {Array.isArray(proj.descriptions) && proj.descriptions.length > 0 && (
                    <ul className="space-y-3 mb-6">
                      {proj.descriptions.filter((p: string) => p.trim() !== "").map((point: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-slate-700 leading-relaxed">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2.5 flex-shrink-0"></div>
                          <span className="text-sm lg:text-base">{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {Array.isArray(proj.tags) && proj.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {proj.tags.filter((t: string) => t.trim() !== "").map((tech: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-white border border-indigo-100 text-indigo-700 rounded-md text-xs font-bold uppercase tracking-wider shadow-sm">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AcademicProjects;
