
import { Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Languages = () => {
  const languages = [
    { name: "Arabic", level: "Native" },
    { name: "English", level: "Intermediate" }
  ];

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <div className="w-2 h-6 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
          LANGUAGE
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {languages.map((lang, index) => (
            <div key={index} className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-orange-600 flex-shrink-0" />
              <div>
                <span className="font-medium text-slate-800">{lang.name}</span>
                <span className="text-slate-600 text-sm ml-2">- {lang.level}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Languages;
