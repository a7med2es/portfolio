import { Code, Cpu, Database, Wrench, Globe, Zap, Users, Handshake, BookOpenCheck, Group, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSkills } from "@/hooks/usePortfolioData";

// Helper to map string icon names to Lucide icons
const iconMap: Record<string, any> = {
  Users, Database, Cpu, Globe, Code, Wrench, Zap, Handshake, BookOpenCheck, Group
};

const Skills = () => {
  const { data: skillsData, isLoading } = useSkills();

  if (isLoading) {
    return <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-purple-500" /></div>;
  }

  const visibleSkills = (skillsData || []).filter((skill: any) => !skill.is_hidden);

  if (visibleSkills.length === 0) return null;

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 overflow-hidden">
      <CardHeader className="pb-4 bg-slate-50/50">
        <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <div className="w-2 h-6 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full"></div>
          PROFESSIONAL SKILLS
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-slate-100">
          {visibleSkills.map((category: any) => {
            const Icon = iconMap[category.icon_name] || Wrench;
            const colorClass = category.color || "slate";
            return (
              <div key={category.id} className="p-5 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <Icon className={`w-5 h-5 text-${colorClass}-600`} />
                  <h4 className="font-bold text-slate-800 text-sm uppercase tracking-tight">{category.category}</h4>
                </div>
                {Array.isArray(category.skills_list) && category.skills_list.length > 0 && (
                  <div className="grid grid-cols-1 gap-2">
                    {category.skills_list.filter((s: string) => s.trim() !== "").map((skill: string, sIndex: number) => (
                      <div key={sIndex} className="flex items-center gap-2 pl-7">
                        <div className={`w-1.5 h-1.5 rounded-full bg-${colorClass}-400/50 flex-shrink-0`}></div>
                        <span className="text-slate-600 text-sm leading-tight">{skill}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default Skills;
