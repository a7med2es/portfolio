-- Run this script in your Supabase SQL Editor to populate the initial data

INSERT INTO public.experiences (title, company, location, date, description, achievement_link, achievement_title, sort_order) VALUES
(
    'Technical Support', 
    'EarthLink Telecommunications', 
    'Baghdad', 
    '07/2025 - Present', 
    '["Diagnosed and resolved network and service incidents, escalating complex cases within SLA timelines.", "Managed technical support tickets end-to-end with accurate documentation and customer follow-up.", "Troubleshot connectivity and performance issues to reduce repeat incidents and improve resolution efficiency.", "Recognized as Employee of the Month for developing a technical tool that significantly accelerated workflows, simplified access to requirements, and improved overall team efficiency."]', 
    'https://drive.google.com/file/d/1lGLDZULfFNhttofLGo7vaVqLGTTsww19/view', 
    'Employee of the Month – View Achievement', 
    0
),
(
    'Electronics and Control', 
    'Al-Munir Home Appliances Manufacturing Company', 
    'Baghdad', 
    '06/2024 - 01/2025', 
    '["Assisted in testing and supporting the production of control panels.", "Gained hands-on experience with electronic systems in appliance manufacturing."]', 
    '', 
    '', 
    1
);

INSERT INTO public.education (title, institution, date, honors, is_training, course_details, certificate_link, sort_order) VALUES
(
    'B.Sc. in Control and Systems Engineering', 
    'University of Technology', 
    '09/2021 – 06/2025 | Baghdad, Iraq', 
    'Graduated Second in Class (Faculty-wide Rank)', 
    false, 
    null, 
    null, 
    0
),
(
    'Cisco Certified Network Associate (CCNA)', 
    'MK Training Center - Baghdad', 
    '', 
    '', 
    true, 
    'Topics Covered: TCP/IP, OSI Model, IPv4 Addressing, Subnetting, VLANs, STP, DHCP, DNS, NAT, Routing & Switching, IP Connectivity, Network Troubleshooting, and Hands-on Lab Practice using Cisco Packet Tracer.', 
    'https://drive.google.com/file/d/1tBURSwr5hNqv7cfQRsX9tllfljg1CVzg/view', 
    1
);

INSERT INTO public.projects (title, subtitle, date, project_url, descriptions, tags, icon_name, sort_order) VALUES
(
    'Smart Vehicle System', 
    'Graduation Project - University of Technology', 
    '01/2021 - 05/2025', 
    'https://a7med-uot-project.netlify.app/index.html', 
    '["Designed and implemented a sensor-based autonomous vehicle model", "Implemented PWM motor speed control and embedded control logic", "Implemented web-based control and real-time device communication", "Integrated ultrasonic sensing and camera-based tracking", "Combined embedded systems, control, and real-time signal processing"]', 
    '["ESP32", "Arduino", "UART", "Sensors", "Real-time Control", "Web Interface"]', 
    'Rocket', 
    0
),
(
    'University Project Exhibitions', 
    '', 
    '', 
    '', 
    '["Participated in university project exhibitions showcasing innovative control and IoT applications."]', 
    '[]', 
    'Award', 
    1
),
(
    'Technical Workshops', 
    '', 
    '', 
    '', 
    '["Attended and contributed to technical workshops focused on IoT and control systems."]', 
    '[]', 
    'Users', 
    2
);

INSERT INTO public.skills (category, skills_list, icon_name, color, sort_order) VALUES
(
    'Customer Support & Service', 
    '["Incident Handling & Service Outage Diagnosis", "Ticket Management, Documentation & SLA Compliance", "Customer Communication & Case Ownership", "Escalation Handling & Technical Reporting"]', 
    'Users', 
    'purple', 
    0
),
(
    'Networking & ISP Knowledge', 
    '["TCP/IP, DNS, VPN, HTTP", "Network Fault Isolation & First-Level Troubleshooting", "Remote Support & CRM/Ticketing Systems"]', 
    'Database', 
    'blue', 
    1
),
(
    'Technical Skills', 
    '["ESP32 & Arduino Development", "Control Systems & Electronics Testing", "UART & Embedded Communication"]', 
    'Cpu', 
    'green', 
    2
),
(
    'Web Technologies', 
    '["HTML5, CSS3, & SQL", "Integrated web-based control interfaces via UART"]', 
    'Globe', 
    'orange', 
    3
);
