
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
          <div className="flex items-start gap-4 p-3 rounded-lg bg-green-50/50 border border-green-100">
            <GraduationCap className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-slate-800 text-lg">BSc in Control and Systems Engineering</h3>
              <p className="text-slate-700 font-medium">University of Technology</p>
              <p className="text-green-700 font-bold text-sm mt-1">Graduated Second in Class (Faculty-wide Rank)</p>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-12 text-slate-500 font-medium">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">2021 – 2025</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Education;
