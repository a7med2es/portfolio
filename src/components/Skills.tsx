import { Code, Cpu, Database, Wrench, Globe, Zap, Users, Handshake, BookOpenCheck, Group } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Skills = () => {
  const skills = [
    { icon: Users, text: "Customer Support & Service" },
    { icon: Wrench, text: "PLC Programming - University coursework" },
    { icon: Handshake, text: "Customer Incident Handling (Downtime, Weak Signal)" },
    { icon: BookOpenCheck, text: "Ticket Management & Documentation" },
    { icon: Zap, text: "Service Outage Diagnosis & Escalation" },
    { icon: Globe, text: "Time Management & Multitasking under Pressure" },
    { icon: Database, text: "Networking & ISP Knowledge" },
    { icon: Globe, text: "Basic ISP & Networking Fundamentals" },
    { icon: Cpu, text: "TCP/IP, DNS, VPN, HTTP Basics" },
    { icon: Wrench, text: "Troubleshooting & Service Outage Diagnosis" },
    { icon: Handshake, text: "Escalation Procedures & Communication" },
    { icon: Code, text: "Arduino, ESP32, Microcontrollers" },
    { icon: Cpu, text: "UART Communication Protocols" },
    { icon: BookOpenCheck, text: "Problem Solving & System Thinking" }
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
