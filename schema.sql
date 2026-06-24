-- Create Tables
CREATE TABLE public.hero (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    location TEXT,
    avatar_url TEXT,
    resume_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.experiences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT,
    date TEXT NOT NULL,
    description JSONB NOT NULL, -- Array of strings
    achievement_link TEXT,
    achievement_title TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.education (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    institution TEXT NOT NULL,
    date TEXT NOT NULL,
    honors TEXT,
    is_training BOOLEAN DEFAULT false,
    course_details TEXT,
    certificate_link TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.skills (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category TEXT NOT NULL,
    skills_list JSONB NOT NULL, -- Array of strings
    icon_name TEXT,
    color TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    date TEXT,
    project_url TEXT,
    descriptions JSONB NOT NULL, -- Array of strings
    tags JSONB NOT NULL, -- Array of strings
    icon_name TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on RLS (Row Level Security)
ALTER TABLE public.hero ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create Policies to allow public read access
CREATE POLICY "Allow public read-only access to hero" ON public.hero FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access to experiences" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access to education" ON public.education FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access to skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access to projects" ON public.projects FOR SELECT USING (true);

-- Insert Initial Data (Seeding)
INSERT INTO public.hero (name, title, summary, phone, email, location, avatar_url, resume_url)
VALUES (
    'AHMED ESSAM', 
    'Control & Systems Engineer', 
    'Results-driven Control and Systems Engineer with hands-on experience in ISP technical support, incident management, and network troubleshooting. Strong background in SLA-driven case handling, service outage diagnosis, and continuous service reliability improvement.', 
    '+9647701773452', 
    '34asqf@gmail.com', 
    'Baghdad, Iraq', 
    '/ahmed-uploads/b10adb61-3762-4a61-b548-b4bac3b6d5d4.png', 
    '/ahmed-uploads/AhmedEssam_Resume.pdf'
);
