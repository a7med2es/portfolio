import { Github, Linkedin, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-12 mt-16">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-8">
          {/* Left Side - Name and Title */}
          <div className="text-center lg:text-left">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent mb-2">
              AHMED ESSAM
            </h3>
          </div>
          
          {/* Center - Social Links */}
          <div className="flex flex-wrap justify-center gap-6">
            <a 
              href="https://github.com/a7med2es" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 rounded-lg hover:bg-slate-600/50 transition-all duration-300 transform hover:scale-105"
            >
              <Github className="w-5 h-5" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
            
            <a 
              href="https://www.linkedin.com/in/ahmed-essam-881382326/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600/50 rounded-lg hover:bg-blue-500/50 transition-all duration-300 transform hover:scale-105"
            >
              <Linkedin className="w-5 h-5" />
              <span className="hidden sm:inline">LinkedIn</span>
            </a>
            
            <a 
              href="mailto:34asqf@gmail.com"
              className="flex items-center gap-2 px-4 py-2 bg-red-600/50 rounded-lg hover:bg-red-500/50 transition-all duration-300 transform hover:scale-105"
            >
              <Mail className="w-5 h-5" />
              <span className="hidden sm:inline">Email</span>
            </a>
            
            <a 
              href="tel:+9647701773452"
              className="flex items-center gap-2 px-4 py-2 bg-green-600/50 rounded-lg hover:bg-green-500/50 transition-all duration-300 transform hover:scale-105"
            >
              <Phone className="w-5 h-5" />
              <span className="hidden sm:inline">Phone</span>
            </a>
            
            <a 
              href="https://t.me/a7_ess" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600/50 rounded-lg hover:bg-cyan-500/50 transition-all duration-300 transform hover:scale-105"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              <span className="hidden sm:inline">Telegram</span>
            </a>
          </div>
          
          {/* Right Side - Contact Info */}
          <div className="text-center lg:text-right text-sm text-slate-300">
            <p>Baghdad, Iraq</p>
            <p>+9647701773452</p>
            <p>34asqf@gmail.com</p>
          </div>
        </div>
        
        {/* Bottom Border */}
        <div className="border-t border-slate-700 pt-6">
          <div className="text-center text-slate-400 text-sm">
            <p>© 𝖆7𝖒𝖊𝖉</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
