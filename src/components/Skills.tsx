import { Code, Cpu, Database, Wrench, Globe, Zap, Users, Handshake, BookOpenCheck, Group } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Skills = () => {
  const skills = [
    { icon: Users, text: "Management Skills" },
    { icon: Handshake, text: "Negotiation" },
    { icon: BookOpenCheck, text: "Self-Learning" },
    { icon: Group, text: "Team Collaboration" },
    { icon: Cpu, text: "MATLAB & Simulink – Lab applications" },
    { icon: Code, text: "Arduino, ESP32, Microcontrollers, UART" },
    { icon: Globe, text: "Web Development – Self-taught practice" },
    { icon: Wrench, text: "PLC Programming – University coursework" }
  ];

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <div className="w-2 h-6 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full"></div>
          SKILLS
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {skills.map((skill, index) => (
            <div key={index} className="flex items-start gap-3">
              <skill.icon className="w-4 h-4 text-purple-600 mt-1 flex-shrink-0" />
              <span className="text-slate-700 text-sm leading-relaxed">{skill.text}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Skills;
