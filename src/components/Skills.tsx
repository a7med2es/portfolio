import { Code, Cpu, Database, Wrench, Globe, Zap, Users, Handshake, BookOpenCheck, Group } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Skills = () => {
  const skillCategories = [
    {
      title: "Customer Support & Service",
      skills: [
        "Incident Handling & Service Outage Diagnosis",
        "Ticket Management, Documentation & SLA Compliance",
        "Customer Communication & Case Ownership",
        "Escalation Handling & Technical Reporting"
      ],
      icon: Users,
      color: "purple"
    },
    {
      title: "Networking & ISP Knowledge",
      skills: [
        "TCP/IP, DNS, VPN, HTTP",
        "Network Fault Isolation & First-Level Troubleshooting",
        "Remote Support & CRM/Ticketing Systems"
      ],
      icon: Database,
      color: "blue"
    },
    {
      title: "Technical Skills",
      skills: [
        "ESP32 & Arduino Development",
        "Control Systems & Electronics Testing",
        "UART & Embedded Communication"
      ],
      icon: Cpu,
      color: "green"
    },
    {
      title: "Web Technologies",
      skills: [
        "HTML5 & CSS3",
        "Integrated web-based control interfaces via UART"
      ],
      icon: Globe,
      color: "orange"
    }
  ];

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
          {skillCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div key={index} className="p-5 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <Icon className={`w-5 h-5 text-${category.color}-600`} />
                  <h4 className="font-bold text-slate-800 text-sm uppercase tracking-tight">{category.title}</h4>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {category.skills.map((skill, sIndex) => (
                    <div key={sIndex} className="flex items-center gap-2 pl-7">
                      <div className={`w-1.5 h-1.5 rounded-full bg-${category.color}-400/50`}></div>
                      <span className="text-slate-600 text-sm leading-tight">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default Skills;
