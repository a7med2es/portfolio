
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
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-6 border border-indigo-100">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-800 mb-2">Smart Vehicle System (Graduation Project)</h3>
                <p className="text-slate-700 mb-4 leading-relaxed">
                  Integrated sensor-based navigation, PWM speed control, and wireless control 
                  via a web interface. This comprehensive project demonstrates expertise in 
                  embedded systems, IoT integration, and real-time control systems.
                </p>
                
                <div className="flex flex-wrap gap-3 mb-4">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">Sensor Integration</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">PWM Control</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">Web Interface</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Wireless Control</span>
                </div>
                
                <Button asChild className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700">
                  <a href="https://a7med-uot-project.netlify.app/index.html" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    View Project
                  </a>
                </Button>
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
