import { Mail, Phone, MapPin, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const handleDownloadCV = () => {
    // Create a temporary link to download CV
    const link = document.createElement('a');
    link.href = '/ahmed-uploads/AhmedEssam_Resume.pdf'; // You'll need to add your CV PDF to the public folder
    link.download = 'AhmedEssam_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Profile Image - Made larger */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="w-80 h-80 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
                <img
                  src="/ahmed-uploads/b10adb61-3762-4a61-b548-b4bac3b6d5d4.png"
                  alt="Ahmed Essam"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/20 to-transparent"></div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent whitespace-nowrap">
              AHMED ESSAM
            </h1>
            <div className="space-y-4 mb-8">
              <p className="text-xl text-blue-200 font-semibold tracking-wide uppercase">Technical Support</p>
              <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
                Results-driven Control and Systems Engineer with hands-on experience in ISP technical support, incident management, and network troubleshooting. Strong background in SLA-driven case handling, service outage diagnosis, and continuous service reliability improvement.
              </p>
            </div>

            {/* Download CV Button */}
            <div className="mb-6">
              <Button
                onClick={handleDownloadCV}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Download className="w-5 h-5 mr-2" />
                AhmedEssam_Resume
              </Button>
            </div>

            {/* Quick Contact */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400" />
                <span>+9647701773452</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>34asqf@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>Baghdad, Iraq</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
