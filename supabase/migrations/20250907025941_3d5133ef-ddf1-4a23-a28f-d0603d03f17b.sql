-- Create all necessary tables for the IT Hub application

-- 1. Profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  bio TEXT,
  skills TEXT[],
  discord_username TEXT,
  github_username TEXT,
  linkedin_username TEXT,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Member applications table
CREATE TABLE public.member_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  discord_username TEXT,
  github_username TEXT,
  linkedin_username TEXT,
  motivation TEXT NOT NULL,
  skills TEXT[],
  experience_level TEXT NOT NULL CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT NOT NULL,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 4. Event registrations table
CREATE TABLE public.event_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  registered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- 5. Contacts table for contact form submissions
CREATE TABLE public.contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 6. Newsletter subscriptions table
CREATE TABLE public.newsletter_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 7. Admins table for admin profiles
CREATE TABLE public.admins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  expertise TEXT[],
  achievements TEXT[],
  social_links JSONB,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 8. Gallery items table
CREATE TABLE public.gallery_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 9. Stats table for homepage statistics
CREATE TABLE public.stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stat_name TEXT NOT NULL UNIQUE,
  stat_value INTEGER NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" 
  ON public.profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for member_applications
CREATE POLICY "Users can view their own applications" 
  ON public.member_applications FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all applications" 
  ON public.member_applications FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin' AND status = 'approved'
    )
  );

CREATE POLICY "Users can create their own applications" 
  ON public.member_applications FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update applications" 
  ON public.member_applications FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin' AND status = 'approved'
    )
  );

-- RLS Policies for events
CREATE POLICY "Everyone can view upcoming events" 
  ON public.events FOR SELECT 
  USING (status = 'upcoming');

CREATE POLICY "Admins can view all events" 
  ON public.events FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin' AND status = 'approved'
    )
  );

CREATE POLICY "Admins can create events" 
  ON public.events FOR INSERT 
  WITH CHECK (
    auth.uid() = created_by AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin' AND status = 'approved'
    )
  );

CREATE POLICY "Admins can update events" 
  ON public.events FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin' AND status = 'approved'
    )
  );

-- RLS Policies for event_registrations
CREATE POLICY "Users can view their own registrations" 
  ON public.event_registrations FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all registrations" 
  ON public.event_registrations FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin' AND status = 'approved'
    )
  );

CREATE POLICY "Members can register for events" 
  ON public.event_registrations FOR INSERT 
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND status = 'approved'
    )
  );

CREATE POLICY "Users can cancel their own registrations" 
  ON public.event_registrations FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS Policies for contacts (public submission)
CREATE POLICY "Anyone can submit contact forms" 
  ON public.contacts FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Admins can view contact submissions" 
  ON public.contacts FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin' AND status = 'approved'
    )
  );

-- RLS Policies for newsletter_subscriptions (public)
CREATE POLICY "Anyone can subscribe to newsletter" 
  ON public.newsletter_subscriptions FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Admins can view newsletter subscriptions" 
  ON public.newsletter_subscriptions FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin' AND status = 'approved'
    )
  );

-- RLS Policies for admins (public read)
CREATE POLICY "Everyone can view active admins" 
  ON public.admins FOR SELECT 
  USING (status = 'active');

CREATE POLICY "Admins can manage admin profiles" 
  ON public.admins FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin' AND status = 'approved'
    )
  );

-- RLS Policies for gallery_items (public read)
CREATE POLICY "Everyone can view gallery items" 
  ON public.gallery_items FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage gallery items" 
  ON public.gallery_items FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin' AND status = 'approved'
    )
  );

-- RLS Policies for stats (public read)
CREATE POLICY "Everyone can view stats" 
  ON public.stats FOR SELECT 
  USING (true);

CREATE POLICY "Admins can update stats" 
  ON public.stats FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin' AND status = 'approved'
    )
  );

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, role, status)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email), 
    'member', 
    'pending'
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create function to update event participant count
CREATE OR REPLACE FUNCTION public.update_event_participants()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.events 
    SET current_participants = current_participants + 1 
    WHERE id = NEW.event_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.events 
    SET current_participants = current_participants - 1 
    WHERE id = OLD.event_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Create trigger for event participant count
CREATE TRIGGER update_event_participant_count
  AFTER INSERT OR DELETE ON public.event_registrations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_event_participants();

-- Insert sample data
INSERT INTO public.stats (stat_name, stat_value) VALUES
  ('members', 150),
  ('events', 25),
  ('projects', 12),
  ('workshops', 8);

INSERT INTO public.gallery_items (title, description, image_url, category) VALUES
  ('Hackathon 2024', 'Annual coding competition', '/assets/gallery-1.jpg', 'events'),
  ('Workshop Series', 'Technical skill building sessions', '/assets/gallery-2.jpg', 'education'),
  ('Team Projects', 'Collaborative development work', '/assets/gallery-3.jpg', 'projects');

INSERT INTO public.events (title, description, event_date, location, max_participants, created_by) VALUES
  ('React Workshop', 'Learn modern React development techniques and best practices', '2024-09-15 14:00:00+00', 'Tech Hub Room A', 30, (SELECT id FROM auth.users LIMIT 1)),
  ('AI/ML Seminar', 'Introduction to Machine Learning and AI applications', '2024-09-22 16:00:00+00', 'Main Auditorium', 50, (SELECT id FROM auth.users LIMIT 1)),
  ('Hackathon Kickoff', 'Start of our annual 48-hour coding challenge', '2024-10-01 09:00:00+00', 'Innovation Lab', 100, (SELECT id FROM auth.users LIMIT 1));