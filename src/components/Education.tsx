import { GraduationCap, Calendar, Award, ExternalLink, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEducation } from "@/hooks/usePortfolioData";
import { useEffect, useState } from "react";

const Education = () => {
  const { data: educationData, isLoading } = useEducation();
  const [hiddenItems, setHiddenItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const hidden = new Set(JSON.parse(localStorage.getItem("portfolio_hidden_education") || "[]")) as Set<string>;
      setHiddenItems(hidden);
    } catch { }
  }, []);

  if (isLoading) {
    return <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-green-500" /></div>;
  }

  const visibleEdu = (educationData || []).filter((edu: any) => !hiddenItems.has(edu.id));
  
  if (visibleEdu.length === 0) return null;

  const degrees = visibleEdu.filter((e: any) => !e.is_training);
  const trainings = visibleEdu.filter((e: any) => e.is_training);

  return (
    <div className="space-y-6">
      {degrees.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <div className="w-2 h-6 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></div>
              EDUCATION
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {degrees.map((edu: any) => (
                <div key={edu.id} className="space-y-3">
                  <div className="flex items-start gap-4 p-3 rounded-lg bg-green-50/50 border border-green-100">
                    <GraduationCap className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg">{edu.title}</h3>
                      <p className="text-slate-700 font-medium">{edu.institution}</p>
                      {edu.honors && <p className="text-green-700 font-bold text-sm mt-1">{edu.honors}</p>}
                    </div>
                  </div>
                  {edu.date && (
                    <div className="flex items-center gap-2 ml-12 text-slate-500 font-medium">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{edu.date}</span>
                    </div>
                  )}
                  {edu.certificate_link && (
                    <div className="ml-12 mt-2">
                       <a
                        href={edu.certificate_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100/50 text-green-700 rounded-md text-sm font-bold border border-green-200 hover:bg-green-100 transition-colors shadow-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Certificate
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {trainings.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <div className="w-2 h-6 bg-gradient-to-b from-amber-500 to-amber-600 rounded-full"></div>
              TRAINING / COURSES
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trainings.map((edu: any) => (
                <div key={edu.id} className="relative">
                  <div className="flex items-start gap-4 p-3 rounded-lg bg-amber-50/50 border border-amber-100">
                    <Award className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-800 text-lg">{edu.title}</h3>
                      <p className="text-slate-700 font-medium mb-2">{edu.institution}</p>
                      {edu.course_details && (
                        <div className="space-y-2">
                          <p className="text-sm text-slate-600 leading-relaxed">
                            {edu.course_details}
                          </p>
                        </div>
                      )}
                      {edu.certificate_link && (
                        <a
                          href={edu.certificate_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100/50 text-amber-700 rounded-md text-sm font-bold border border-amber-200 hover:bg-amber-100 transition-colors shadow-sm mt-3"
                        >
                          <ExternalLink className="w-4 h-4" />
                          View Certificate
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Education;
