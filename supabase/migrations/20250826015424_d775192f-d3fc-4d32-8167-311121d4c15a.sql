-- Create contacts table for contact form submissions
CREATE TABLE public.contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'replied', 'archived'))
);

-- Create admins table for dynamic admin profiles
CREATE TABLE public.admins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  avatar_url TEXT,
  expertise TEXT[] DEFAULT '{}',
  description TEXT,
  achievements TEXT[] DEFAULT '{}',
  social_links JSONB DEFAULT '{}',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create gallery items table for dynamic gallery
CREATE TABLE public.gallery_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create stats table for dynamic statistics
CREATE TABLE public.stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  value INTEGER NOT NULL,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stats ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (no auth required for viewing)
CREATE POLICY "Anyone can view admins" ON public.admins FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view gallery items" ON public.gallery_items FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view stats" ON public.stats FOR SELECT USING (is_active = true);

-- Create policy for contact form submissions (no auth required)
CREATE POLICY "Anyone can submit contacts" ON public.contacts FOR INSERT WITH CHECK (true);

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_admins_updated_at
  BEFORE UPDATE ON public.admins
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_gallery_items_updated_at
  BEFORE UPDATE ON public.gallery_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data for admins
INSERT INTO public.admins (name, role, expertise, description, achievements, social_links, display_order) VALUES
('Alex Chen', 'President', '{"Full-Stack Development", "Machine Learning", "Cloud Computing"}', 'Leading our club towards innovative technology solutions and fostering a collaborative learning environment.', '{"Led 15+ successful hackathons", "Published 3 research papers", "Interned at Google"}', '{"github": "alexchen", "linkedin": "alexchen", "twitter": "alexchen"}', 1),
('Sarah Johnson', 'Vice President', '{"UI/UX Design", "Frontend Development", "Product Management"}', 'Passionate about creating user-centered designs and bridging the gap between technology and human needs.', '{"Winner of 5 design competitions", "Led design for university app", "Mentored 20+ students"}', '{"github": "sarahj", "linkedin": "sarahj", "twitter": "sarahj"}', 2),
('David Rodriguez', 'Technical Lead', '{"DevOps", "System Architecture", "Cybersecurity"}', 'Ensuring our technical infrastructure is robust, secure, and scalable for all our club activities.', '{"AWS Certified Solutions Architect", "Built club''s entire infrastructure", "Security researcher"}', '{"github": "davidr", "linkedin": "davidr"}', 3),
('Emily Wang', 'Events Coordinator', '{"Project Management", "Community Building", "Data Science"}', 'Organizing engaging events and workshops that bring our community together and foster learning.', '{"Organized 50+ events", "Data Science competition winner", "Google Code-in mentor"}', '{"github": "emilyw", "linkedin": "emilyw", "twitter": "emilyw"}', 4);

-- Insert sample data for gallery items
INSERT INTO public.gallery_items (title, description, category, image_url, display_order) VALUES
('Annual Hackathon 2024', 'Our biggest event of the year with 200+ participants building innovative solutions', 'Events', '/src/assets/gallery-1.jpg', 1),
('AI Workshop Series', 'Weekly workshops covering machine learning, neural networks, and AI applications', 'Workshops', '/src/assets/gallery-2.jpg', 2),
('Project Showcase', 'Students presenting their semester projects to industry professionals', 'Projects', '/src/assets/gallery-3.jpg', 3);

-- Insert sample data for stats
INSERT INTO public.stats (label, value, icon, display_order) VALUES
('Years Active', 8, 'calendar', 1),
('Events Organized', 150, 'trophy', 2),
('Projects Completed', 75, 'code', 3);