import { Mail, Phone, MapPin } from "lucide-react";
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
        <div className="flex items-start gap-3">
          <Phone className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <a 
            href="tel:+9647701773452" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-700 hover:underline"
          >
            Call: +9647701773452
          </a>
        </div>
        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <a 
            href="mailto:34asqf@gmail.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-700 hover:underline"
          >
            Email: 34asqf@gmail.com
          </a>
        </div>
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <a 
            href="https://www.linkedin.com/in/ahmed-essam-881382326" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-700 hover:underline"
          >
            Open LinkedIn Profile
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default Contact;
