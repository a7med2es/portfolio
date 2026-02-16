import { Briefcase, Building, ArrowRight, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const WorkExperience = () => {
  const experiences = [
    {
      title: "Technical Support",
      company: "EarthLink Telecommunications",
      location: "Baghdad",
      description: [
        "Diagnosed and resolved network and service incidents, escalating complex cases within SLA timelines.",
        "Managed technical support tickets end-to-end with accurate documentation and customer follow-up.",
        "Troubleshot connectivity and performance issues to reduce repeat incidents and improve resolution efficiency.",
        "Recognized as Employee of the Month for developing a technical tool that significantly accelerated workflows, simplified access to requirements, and improved overall team efficiency."
      ],
      achievementLink: "https://drive.google.com/file/d/1lGLDZULfFNhttofLGo7vaVqLGTTsww19/view",
      achievementTitle: "Employee of the Month – View Achievement"
    },
    {
      title: "Electronics and Control",
      company: "Al-Munir Home Appliances Manufacturing Company",
      location: "Baghdad",
      description: [
        "Assisted in testing and supporting the production of control panels.",
        "Gained hands-on experience with electronic systems in appliance manufacturing."
      ]
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
                  <h3 className="font-bold text-slate-800 text-xl mb-1">{exp.title}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <Building className="w-4 h-4 text-blue-500" />
                    <span className="text-slate-600 font-semibold">{exp.company}</span>
                  </div>
                  <ul className="space-y-2 list-disc list-inside text-slate-700 leading-relaxed mb-4">
                    {exp.description.map((item, id) => (
                      <li key={id} className="text-sm lg:text-base pl-1">
                        {item}
                      </li>
                    ))}
                  </ul>
                  {exp.achievementLink && (
                    <a
                      href={exp.achievementLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-bold border border-blue-100 hover:bg-blue-100 transition-colors shadow-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {exp.achievementTitle}
                    </a>
                  )}
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
