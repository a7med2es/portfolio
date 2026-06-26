import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Database } from "lucide-react";

export default function SeedData() {
  const [loading, setLoading] = useState(false);

  const handleSeed = async () => {
    setLoading(true);
    try {
      // 1. Experiences
      await supabase.from("experiences").insert([
        {
          title: "Technical Support",
          company: "EarthLink Telecommunications",
          location: "Baghdad",
          date: "07/2025 - Present",
          description: [
            "Diagnosed and resolved network and service incidents, escalating complex cases within SLA timelines.",
            "Managed technical support tickets end-to-end with accurate documentation and customer follow-up.",
            "Troubleshot connectivity and performance issues to reduce repeat incidents and improve resolution efficiency.",
            "Recognized as Employee of the Month for developing a technical tool that significantly accelerated workflows, simplified access to requirements, and improved overall team efficiency."
          ],
          achievement_link: "https://drive.google.com/file/d/1lGLDZULfFNhttofLGo7vaVqLGTTsww19/view",
          achievement_title: "Employee of the Month – View Achievement",
          sort_order: 0
        },
        {
          title: "Electronics and Control",
          company: "Al-Munir Home Appliances Manufacturing Company",
          location: "Baghdad",
          date: "06/2024 - 01/2025",
          description: [
            "Assisted in testing and supporting the production of control panels.",
            "Gained hands-on experience with electronic systems in appliance manufacturing."
          ],
          achievement_link: "",
          achievement_title: "",
          sort_order: 1
        }
      ]);

      // 2. Education
      await supabase.from("education").insert([
        {
          title: "B.Sc. in Control and Systems Engineering",
          institution: "University of Technology",
          date: "09/2021 – 06/2025 | Baghdad, Iraq",
          honors: "Graduated Second in Class (Faculty-wide Rank)",
          is_training: false,
          sort_order: 0
        },
        {
          title: "Cisco Certified Network Associate (CCNA)",
          institution: "MK Training Center - Baghdad",
          date: "",
          honors: "",
          is_training: true,
          course_details: "Topics Covered: TCP/IP, OSI Model, IPv4 Addressing, Subnetting, VLANs, STP, DHCP, DNS, NAT, Routing & Switching, IP Connectivity, Network Troubleshooting, and Hands-on Lab Practice using Cisco Packet Tracer.",
          certificate_link: "https://drive.google.com/file/d/1tBURSwr5hNqv7cfQRsX9tllfljg1CVzg/view",
          sort_order: 1
        }
      ]);

      // 3. Projects
      await supabase.from("projects").insert([
        {
          title: "Smart Vehicle System",
          subtitle: "Graduation Project - University of Technology",
          date: "01/2021 - 05/2025",
          project_url: "https://a7med-uot-project.netlify.app/index.html",
          descriptions: [
            "Designed and implemented a sensor-based autonomous vehicle model",
            "Implemented PWM motor speed control and embedded control logic",
            "Implemented web-based control and real-time device communication",
            "Integrated ultrasonic sensing and camera-based tracking",
            "Combined embedded systems, control, and real-time signal processing"
          ],
          tags: ["ESP32", "Arduino", "UART", "Sensors", "Real-time Control", "Web Interface"],
          icon_name: "Rocket",
          sort_order: 0
        },
        {
          title: "University Project Exhibitions",
          subtitle: "",
          date: "",
          project_url: "",
          descriptions: ["Participated in university project exhibitions showcasing innovative control and IoT applications."],
          tags: [],
          icon_name: "Award",
          sort_order: 1
        },
        {
          title: "Technical Workshops",
          subtitle: "",
          date: "",
          project_url: "",
          descriptions: ["Attended and contributed to technical workshops focused on IoT and control systems."],
          tags: [],
          icon_name: "Users",
          sort_order: 2
        }
      ]);

      // 4. Skills
      await supabase.from("skills").insert([
        {
          category: "Customer Support & Service",
          skills_list: [
            "Incident Handling & Service Outage Diagnosis",
            "Ticket Management, Documentation & SLA Compliance",
            "Customer Communication & Case Ownership",
            "Escalation Handling & Technical Reporting"
          ],
          icon_name: "Users",
          color: "purple",
          sort_order: 0
        },
        {
          category: "Networking & ISP Knowledge",
          skills_list: [
            "TCP/IP, DNS, VPN, HTTP",
            "Network Fault Isolation & First-Level Troubleshooting",
            "Remote Support & CRM/Ticketing Systems"
          ],
          icon_name: "Database",
          color: "blue",
          sort_order: 1
        },
        {
          category: "Technical Skills",
          skills_list: [
            "ESP32 & Arduino Development",
            "Control Systems & Electronics Testing",
            "UART & Embedded Communication"
          ],
          icon_name: "Cpu",
          color: "green",
          sort_order: 2
        },
        {
          category: "Web Technologies",
          skills_list: [
            "HTML5, CSS3, & SQL",
            "Integrated web-based control interfaces via UART"
          ],
          icon_name: "Globe",
          color: "orange",
          sort_order: 3
        }
      ]);

      toast.success("All previous data restored successfully!");
    } catch (err: any) {
      toast.error("Failed to restore data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-800">Restore Default Data</h2>
        <p className="text-slate-500 max-w-md mx-auto">
          Click the button below to insert all your original Experience, Education, Projects, and Skills into the database so you can edit them.
        </p>
      </div>
      
      <Button 
        onClick={handleSeed} 
        disabled={loading} 
        size="lg"
        className="bg-indigo-600 hover:bg-indigo-700 h-14 px-8 text-lg"
      >
        {loading ? (
          <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Restoring...</>
        ) : (
          <><Database className="w-5 h-5 mr-2" /> Restore All Data</>
        )}
      </Button>
    </div>
  );
}
