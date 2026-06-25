-- 1. Drop the previous policies that didn't work because we don't use Supabase Auth
DROP POLICY IF EXISTS "Allow authenticated full access to hero" ON public.hero;
DROP POLICY IF EXISTS "Allow authenticated full access to experiences" ON public.experiences;
DROP POLICY IF EXISTS "Allow authenticated full access to education" ON public.education;
DROP POLICY IF EXISTS "Allow authenticated full access to skills" ON public.skills;
DROP POLICY IF EXISTS "Allow authenticated full access to projects" ON public.projects;

-- 2. Create new policies that allow the dashboard to save data successfully
CREATE POLICY "Allow full access to hero" ON public.hero FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access to experiences" ON public.experiences FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access to education" ON public.education FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access to skills" ON public.skills FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow full access to projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);
