
import { GraduationCap, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Education = () => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <div className="w-2 h-6 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></div>
          EDUCATION
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <GraduationCap className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-slate-800">BSc in Control and Systems Engineering</h3>
              <p className="text-slate-600 text-sm">University of Technology - Baghdad</p>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-8">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span className="text-slate-600 text-sm">2025-2021</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Education;
