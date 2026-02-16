
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Projects = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
            My Programming Projects
          </h1>
          <p className="text-xl text-slate-300">
            A collection of software projects I've developed
          </p>
        </div>
      </div>

      {/* Projects Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-20">
          <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-100 to-slate-100 rounded-full flex items-center justify-center">
            <div className="text-4xl">💻</div>
          </div>
          
          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            Coming Soon...
          </h2>
          
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            My programming projects will be published here soon. Stay tuned to see my latest work in software development and smart systems.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="https://github.com/a7med2es" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-all duration-300 transform hover:scale-105"
            >
              <Github className="w-5 h-5" />
              Browse GitHub
            </a>
            
            <Link to="/">
              <Button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white">
                Back to Resume
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
