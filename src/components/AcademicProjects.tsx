
import { Rocket, ExternalLink, Award, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AcademicProjects = () => {
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
          {/* Main Project */}
          <div className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 rounded-xl p-6 border border-indigo-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 hover:rotate-0 transition-transform">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-1 tracking-tight">Smart Vehicle System</h3>
                    <p className="text-indigo-600 font-bold text-sm uppercase tracking-widest">Graduation Project - University of Technology</p>
                  </div>
                  <Button asChild className="bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 shadow-md">
                    <a href="https://a7med-uot-project.netlify.app/index.html" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      View Project
                    </a>
                  </Button>
                </div>

                <ul className="space-y-3 mb-6">
                  {[
                    "Designed and implemented a sensor-based autonomous vehicle model",
                    "Implemented PWM motor speed control and embedded control logic",
                    "Implemented web-based control and real-time device communication",
                    "Integrated ultrasonic sensing and camera-based tracking",
                    "Combined embedded systems, control, and real-time signal processing"
                  ].map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-700 leading-relaxed">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2.5 flex-shrink-0"></div>
                      <span className="text-sm lg:text-base">{point}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2">
                  {["ESP32", "Arduino", "UART", "Sensors", "Real-time Control", "Web Interface"].map((tech) => (
                    <span key={tech} className="px-3 py-1 bg-white border border-indigo-100 text-indigo-700 rounded-md text-xs font-bold uppercase tracking-wider shadow-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Activities */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Award className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-slate-800">University Project Exhibitions</h4>
                <p className="text-slate-700 text-sm">Participated in university project exhibitions showcasing innovative control and IoT applications.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-slate-800">Technical Workshops</h4>
                <p className="text-slate-700 text-sm">Attended and contributed to technical workshops focused on IoT and control systems.</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AcademicProjects;
