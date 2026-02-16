import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Contact = () => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
          CONTACT
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-4 p-2 rounded-lg hover:bg-slate-50 transition-colors">
          <Phone className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <a
            href="tel:+9647701773452"
            className="text-slate-700 hover:text-blue-600 font-medium"
          >
            +9647701773452
          </a>
        </div>
        <div className="flex items-start gap-4 p-2 rounded-lg hover:bg-slate-50 transition-colors">
          <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <a
            href="mailto:34asqf@gmail.com"
            className="text-slate-700 hover:text-blue-600 font-medium"
          >
            34asqf@gmail.com
          </a>
        </div>
        <div className="flex items-start gap-4 p-2 rounded-lg hover:bg-slate-50 transition-colors">
          <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <span className="text-slate-700 font-medium">Baghdad, Iraq</span>
        </div>
        <div className="flex items-start gap-4 p-2 rounded-lg bg-blue-50/50 border border-blue-100 mt-2">
          <Globe className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <a
            href="https://ahmedes.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 hover:underline font-semibold"
          >
            ahmedes.netlify.app
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default Contact;
