
import { Code, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ProjectsButton = () => {
  return (
    <div className="flex justify-center py-12">
      <Link to="/projects">
        <Button className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative flex items-center gap-3">
            <Code className="w-6 h-6" />
            <span>View My Programming Projects</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </div>
          
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/20 to-indigo-600/20 blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300 -z-10 transform scale-110"></div>
        </Button>
      </Link>
    </div>
  );
};

export default ProjectsButton;
