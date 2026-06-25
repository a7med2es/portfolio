import { ArrowRight, Download, Mail, Phone, MapPin, Loader2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHero } from "@/hooks/usePortfolioData";
import { useEffect, useState } from "react";

const Hero = () => {
  const { data: heroData, isLoading } = useHero();
  const [hiddenFields, setHiddenFields] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const hidden = new Set(JSON.parse(localStorage.getItem("portfolio_hero_hidden_fields") || "[]")) as Set<string>;
      setHiddenFields(hidden);
    } catch { }
  }, []);

  const handleDownload = () => {
    if (heroData?.resume_url) {
      window.open(heroData.resume_url, '_blank');
    }
  };

  if (isLoading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 relative overflow-hidden">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </section>
    );
  }

  // Fallback to existing data if DB is empty for some reason
  const data = heroData || {
    name: "AHMED ESSAM",
    title: "Control & Systems Engineer",
    summary: "Results-driven Control and Systems Engineer with hands-on experience in ISP technical support, incident management, and network troubleshooting. Strong background in SLA-driven case handling, service outage diagnosis, and continuous service reliability improvement.",
    phone: "+9647701773452",
    email: "34asqf@gmail.com",
    location: "Baghdad, Iraq",
    avatar_url: "/ahmed-uploads/b10adb61-3762-4a61-b548-b4bac3b6d5d4.png",
    resume_url: "/ahmed-uploads/AhmedEssam_Resume.pdf"
  };

  return (
    <section className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Profile Image */}
          {!hiddenFields.has("avatar_url") && (
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-80 h-80 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
                  <img
                    src={data.avatar_url}
                    alt={data.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/20 to-transparent"></div>
              </div>
            </div>
          )}

          {/* Profile Info */}
          <div className="text-center lg:text-left space-y-6">
            <div className="space-y-4">
              {!hiddenFields.has("name") && (
                <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
                  {data.name}
                </h1>
              )}
              {!hiddenFields.has("title") && (
                <h2 className="text-2xl lg:text-3xl text-blue-400 font-medium tracking-wide">
                  {data.title}
                </h2>
              )}
              {!hiddenFields.has("summary") && (
                <p className="text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  {data.summary}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 shadow-lg shadow-blue-900/20 transition-all hover:-translate-y-0.5"
                onClick={() => {
                  const el = document.getElementById('footer-contact');
                  if (el) {
                    const top = el.getBoundingClientRect().top + window.scrollY;
                    window.scrollTo({ top, behavior: 'smooth' });
                  }
                }}
              >
                Contact Me
              </Button>
              {!hiddenFields.has("resume_url") && (
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto rounded-full px-8 bg-transparent border-2 border-slate-500 text-white hover:bg-slate-700 hover:text-white hover:border-slate-400 transition-all hover:-translate-y-0.5"
                  onClick={handleDownload}
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Resume
                </Button>
              )}
            </div>

            {/* Quick Contact */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm mt-8">
              {!hiddenFields.has("phone") && data.phone && (
                <a href={`tel:${data.phone}`} className="flex items-center gap-2 hover:text-blue-300 transition-colors">
                  <Phone className="w-4 h-4 text-blue-400" />
                  <span>{data.phone}</span>
                </a>
              )}
              {!hiddenFields.has("email") && data.email && (
                <a href={`mailto:${data.email}`} className="flex items-center gap-2 hover:text-blue-300 transition-colors">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <span>{data.email}</span>
                </a>
              )}
              {!hiddenFields.has("location") && data.location && (
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span>{data.location}</span>
                </div>
              )}
              {!hiddenFields.has("website") && data.website && (
                <a href={data.website.startsWith('http') ? data.website : `https://${data.website}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-blue-300 transition-colors text-slate-300">
                  <Globe className="w-4 h-4 text-blue-400" />
                  <span>{data.website.replace(/^https?:\/\//, '')}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
