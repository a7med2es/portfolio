import { GraduationCap, Calendar, Award, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Education = () => {
  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <div className="w-2 h-6 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></div>
            EDUCATION
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-4 p-3 rounded-lg bg-green-50/50 border border-green-100">
              <GraduationCap className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-slate-800 text-lg">B.Sc. in Control and Systems Engineering</h3>
                <p className="text-slate-700 font-medium">University of Technology</p>
                <p className="text-green-700 font-bold text-sm mt-1">Graduated Second in Class (Faculty-wide Rank)</p>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-12 text-slate-500 font-medium">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">09/2021 – 06/2025 | Baghdad, Iraq</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <div className="w-2 h-6 bg-gradient-to-b from-amber-500 to-amber-600 rounded-full"></div>
            TRAINING / COURSES
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <div className="flex items-start gap-4 p-3 rounded-lg bg-amber-50/50 border border-amber-100">
                <Award className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 text-lg">Cisco Certified Network Associate (CCNA)</h3>
                  <p className="text-slate-700 font-medium mb-2">MK Training Center - Baghdad</p>
                  <div className="space-y-2">
                    <p className="text-sm text-slate-600 leading-relaxed">
                      <span className="font-semibold text-slate-700">Topics Covered:</span> TCP/IP, OSI Model, IPv4 Addressing, Subnetting, VLANs, STP, DHCP, DNS, NAT, Routing & Switching, IP Connectivity, Network Troubleshooting, and Hands-on Lab Practice using Cisco Packet Tracer.
                    </p>
                    <a
                      href="https://drive.google.com/file/d/1tBURSwr5hNqv7cfQRsX9tllfljg1CVzg/view"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100/50 text-amber-700 rounded-md text-sm font-bold border border-amber-200 hover:bg-amber-100 transition-colors shadow-sm mt-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Certificate
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Education;
