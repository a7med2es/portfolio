import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useHero = () => {
  return useQuery({
    queryKey: ["hero"],
    queryFn: async () => {
      const { data, error } = await supabase.from("hero").select("*").single();
      if (error && error.code !== "PGRST116") throw error;
      return data || {
        name: "AHMED ESSAM",
        title: "Control & Systems Engineer",
        summary: "Results-driven Control and Systems Engineer with hands-on experience in ISP technical support, incident management, and network troubleshooting. Strong background in SLA-driven case handling, service outage diagnosis, and continuous service reliability improvement.",
        phone: "+9647701773452",
        email: "34asqf@gmail.com",
        location: "Baghdad, Iraq",
        avatar_url: "/ahmed-uploads/b10adb61-3762-4a61-b548-b4bac3b6d5d4.png",
        resume_url: "/ahmed-uploads/AhmedEssam_Resume.pdf",
        website: "https://ahmedes.netlify.app"
      };
    },
  });
};

export const useExperiences = () => {
  return useQuery({
    queryKey: ["experiences"],
    queryFn: async () => {
      const { data, error } = await supabase.from("experiences").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      if (!data || data.length === 0) {
        return [
          {
            id: "fallback-exp-1",
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
            achievement_title: "Employee of the Month – View Achievement"
          },
          {
            id: "fallback-exp-2",
            title: "Electronics and Control",
            company: "Al-Munir Home Appliances Manufacturing Company",
            location: "Baghdad",
            date: "06/2024 - 01/2025",
            description: [
              "Assisted in testing and supporting the production of control panels.",
              "Gained hands-on experience with electronic systems in appliance manufacturing."
            ]
          }
        ];
      }
      return data;
    },
  });
};

export const useCourses = () => {
  return useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase.from("courses").select("*").order("sort_order", { ascending: true });
      // If error occurs (e.g. table doesn't exist), fallback gracefully
      if (error && error.code !== "PGRST116" && error.code !== "42P01") {
        console.warn("Courses fetch error:", error);
      }
      if (!data || data.length === 0) {
        return [
          {
            id: "fallback-course-1",
            title: "Advanced Control Systems",
            institution: "Coursera",
            date: "10/2023 - 12/2023",
            certificate_link: ""
          }
        ];
      }
      return data;
    },
  });
};

export const useEducation = () => {
  return useQuery({
    queryKey: ["education"],
    queryFn: async () => {
      const { data, error } = await supabase.from("education").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      if (!data || data.length === 0) {
        return [
          {
            id: "fallback-edu-1",
            title: "BSc in Control and Systems Engineering",
            institution: "University of Technology",
            date: "2021 – 2025",
            honors: "Graduated Second in Class (Faculty-wide Rank)",
            is_training: false
          }
        ];
      }
      return data;
    },
  });
};

export const useSkills = () => {
  return useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const { data, error } = await supabase.from("skills").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      if (!data || data.length === 0) {
        return [
          {
            id: "fallback-skill-1",
            category: "Customer Support & Service",
            skills_list: [
              "Incident Handling & Service Outage Diagnosis",
              "Ticket Management, Documentation & SLA Compliance",
              "Customer Communication & Case Ownership",
              "Escalation Handling & Technical Reporting"
            ],
            icon_name: "Users",
            color: "purple"
          },
          {
            id: "fallback-skill-2",
            category: "Networking & ISP Knowledge",
            skills_list: [
              "TCP/IP, DNS, VPN, HTTP",
              "Network Fault Isolation & First-Level Troubleshooting",
              "Remote Support & CRM/Ticketing Systems"
            ],
            icon_name: "Database",
            color: "blue"
          },
          {
            id: "fallback-skill-3",
            category: "Technical Skills",
            skills_list: [
              "ESP32 & Arduino Development",
              "Control Systems & Electronics Testing",
              "UART & Embedded Communication"
            ],
            icon_name: "Cpu",
            color: "green"
          },
          {
            id: "fallback-skill-4",
            category: "Web Technologies",
            skills_list: [
              "HTML5 & CSS3",
              "Integrated web-based control interfaces via UART"
            ],
            icon_name: "Globe",
            color: "orange"
          },
          {
            id: "fallback-skill-5",
            category: "Languages",
            skills_list: [
              "Arabic - Native",
              "English - Intermediate"
            ],
            icon_name: "Languages",
            color: "cyan"
          }
        ];
      }
      return data;
    },
  });
};

export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").order("sort_order", { ascending: true });
      if (error) throw error;
      if (!data || data.length === 0) {
        return [
          {
            id: "fallback-proj-1",
            title: "Smart Vehicle System",
            subtitle: "Graduation Project - University of Technology",
            date: "",
            project_url: "https://a7med-uot-project.netlify.app/index.html",
            descriptions: [
              "Designed and implemented a sensor-based autonomous vehicle model",
              "Implemented PWM motor speed control and embedded control logic",
              "Implemented web-based control and real-time device communication",
              "Integrated ultrasonic sensing and camera-based tracking",
              "Combined embedded systems, control, and real-time signal processing"
            ],
            tags: ["ESP32", "Arduino", "UART", "Sensors", "Real-time Control", "Web Interface"],
            icon_name: "Rocket"
          },
          {
            id: "fallback-proj-2",
            title: "University Project Exhibitions",
            subtitle: "",
            date: "",
            project_url: "",
            descriptions: ["Participated in university project exhibitions showcasing innovative control and IoT applications."],
            tags: [],
            icon_name: "Award"
          },
          {
            id: "fallback-proj-3",
            title: "Technical Workshops",
            subtitle: "",
            date: "",
            project_url: "",
            descriptions: ["Attended and contributed to technical workshops focused on IoT and control systems."],
            tags: [],
            icon_name: "Users"
          }
        ];
      }
      return data;
    },
  });
};
