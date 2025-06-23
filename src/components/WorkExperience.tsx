
import { Briefcase, Building, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const WorkExperience = () => {
  const experiences = [
    {
      title: "Technical Projects Developer",
      company: "esp32 - Arduino - user interface",
      description: "Developed technical projects using ESP32 and Arduino platforms with user interface design."
    },
    {
      title: "Medical Supplies Specialist",
      company: "Beirut Medical Supplies",
      description: "Worked in medical supplies distribution and management."
    },
    {
      title: "Manufacturing Specialist",
      company: "Al-Munir Home Appliances Manufacturing Company",
      description: "Involved in home appliances manufacturing processes and quality control."
    },
    {
      title: "Control Systems Engineer",
      company: "MATLAB/Simulink Projects",
      description: "Simulated and tested control systems using MATLAB/Simulink for various engineering applications."
    }
  ];

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
          {experiences.map((exp, index) => (
            <div key={index} className="relative">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800 text-lg mb-1">{exp.title}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <Building className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-600 font-medium">{exp.company}</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{exp.description}</p>
                </div>
              </div>
              {index < experiences.length - 1 && (
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
