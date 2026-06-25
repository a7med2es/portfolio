import { Briefcase, Building, ArrowRight, ExternalLink, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useExperiences } from "@/hooks/usePortfolioData";

const WorkExperience = () => {
  const { data: experiences, isLoading } = useExperiences();

  if (isLoading) {
    return <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>;
  }

  const visibleExperiences = (experiences || []).filter((exp: any) => !exp.is_hidden);

  if (visibleExperiences.length === 0) return null;


  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <div className="w-3 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
          WORK EXPERIENCE
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {visibleExperiences.map((exp: any, index: number) => (
            <div key={exp.id} className="relative">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 text-xl mb-1">{exp.title}</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-blue-500" />
                      <span className="text-slate-600 font-semibold">{exp.company}</span>
                    </div>
                    {exp.date && (
                      <div className="text-sm text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-full whitespace-nowrap w-fit">
                        {exp.date}
                      </div>
                    )}
                  </div>
                  <ul className="space-y-2 list-disc list-inside text-slate-700 leading-relaxed mb-4">
                    {(Array.isArray(exp.description) ? exp.description : []).map((item: string, id: number) => (
                      <li key={id} className="text-sm lg:text-base pl-1">
                        {item}
                      </li>
                    ))}
                  </ul>
                  {exp.achievement_link && (
                    <a
                      href={exp.achievement_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-bold border border-blue-100 hover:bg-blue-100 transition-colors shadow-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {exp.achievement_title || "View Achievement"}
                    </a>
                  )}
                </div>
              </div>
              {index < visibleExperiences.length - 1 && (
                <div className="ml-5 mt-4 mb-2">
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkExperience;
