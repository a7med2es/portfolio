import Hero from "@/components/Hero";
import Contact from "@/components/Contact";
import Education from "@/components/Education";
import Skills from "@/components/Skills";
import WorkExperience from "@/components/WorkExperience";
import AcademicProjects from "@/components/AcademicProjects";
import Languages from "@/components/Languages";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] selection:bg-blue-100 selection:text-blue-900">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.05),transparent_50%)] pointer-events-none"></div>
      {/* Hero Section */}
      <Hero />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-8">
            <Contact />
            <Education />
            <Skills />
            <Languages />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-8">
            <WorkExperience />
            <AcademicProjects />
          </div>
        </div>
      </div>

      {/* Projects Button */}
      {/* <ProjectsButton /> */}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
