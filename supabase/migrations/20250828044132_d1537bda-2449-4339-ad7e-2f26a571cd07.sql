-- Fix admin setup and create newsletter subscription functionality

-- Create newsletters table for subscription management
CREATE TABLE IF NOT EXISTS public.newsletters (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  name text,
  status text DEFAULT 'subscribed' CHECK (status IN ('subscribed', 'unsubscribed')),
  subscribed_at timestamp with time zone DEFAULT now(),
  unsubscribed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS for newsletters
ALTER TABLE public.newsletters ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for newsletter subscriptions (anyone can subscribe)
CREATE POLICY "Anyone can subscribe to newsletter" 
ON public.newsletters 
FOR INSERT 
WITH CHECK (true);

-- Create RLS policy for admins to view all newsletter subscriptions
CREATE POLICY "Admins can view all newsletter subscriptions" 
ON public.newsletters 
FOR SELECT 
USING (get_user_role(auth.uid()) = 'admin');

-- Create RLS policy for users to unsubscribe using email
CREATE POLICY "Users can unsubscribe from newsletter" 
ON public.newsletters 
FOR UPDATE 
USING (true);

-- Insert sample admin user if it doesn't exist
DO $$
BEGIN
  -- Check if admin user exists
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE email = 'admin@codeclub.university.edu'
  ) THEN
    -- Create admin user in auth.users would be done through Supabase Auth UI
    -- Instead, we'll create a sample admin profile that can be linked later
    INSERT INTO public.profiles (
      id,
      email, 
      full_name, 
      role, 
      status
    ) VALUES (
      '00000000-0000-0000-0000-000000000000'::uuid,
      'admin@codeclub.university.edu',
      'Admin User',
      'admin',
      'approved'
    ) ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;

-- Create function to handle newsletter subscription
CREATE OR REPLACE FUNCTION public.subscribe_newsletter(
  subscriber_email text,
  subscriber_name text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  -- Insert or update subscription
  INSERT INTO public.newsletters (email, name, status, subscribed_at)
  VALUES (subscriber_email, subscriber_name, 'subscribed', now())
  ON CONFLICT (email) 
  DO UPDATE SET 
    status = 'subscribed',
    subscribed_at = now(),
    unsubscribed_at = NULL,
    name = COALESCE(EXCLUDED.name, newsletters.name);
    
  result := jsonb_build_object(
    'success', true,
    'message', 'Successfully subscribed to newsletter'
  );
  
  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Failed to subscribe to newsletter'
    );
END;
$$;

-- Create function to handle newsletter unsubscription
CREATE OR REPLACE FUNCTION public.unsubscribe_newsletter(
  subscriber_email text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  -- Update subscription status
  UPDATE public.newsletters 
  SET 
    status = 'unsubscribed',
    unsubscribed_at = now()
  WHERE email = subscriber_email;
    
  IF FOUND THEN
    result := jsonb_build_object(
      'success', true,
      'message', 'Successfully unsubscribed from newsletter'
    );
  ELSE
    result := jsonb_build_object(
      'success', false,
      'message', 'Email not found in newsletter subscriptions'
    );
  END IF;
  
  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Failed to unsubscribe from newsletter'
    );
END;
$$;

-- Update the member application process to be more robust
CREATE OR REPLACE FUNCTION public.handle_member_application()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- When a member application is approved, update the profile status
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    UPDATE public.profiles 
    SET status = 'approved'
    WHERE id = NEW.user_id;
  ELSIF NEW.status = 'rejected' AND OLD.status != 'rejected' THEN
    UPDATE public.profiles 
    SET status = 'rejected'
    WHERE id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for member application status changes
DROP TRIGGER IF EXISTS on_member_application_status_change ON public.member_applications;
CREATE TRIGGER on_member_application_status_change
  AFTER UPDATE ON public.member_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_member_application();

-- Create trigger for updating event participant counts
CREATE OR REPLACE FUNCTION public.update_event_participant_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment participant count
    UPDATE public.events 
    SET current_participants = current_participants + 1
    WHERE id = NEW.event_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement participant count
    UPDATE public.events 
    SET current_participants = GREATEST(current_participants - 1, 0)
    WHERE id = OLD.event_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Create trigger for event registration changes
DROP TRIGGER IF EXISTS on_event_registration_change ON public.event_registrations;
CREATE TRIGGER on_event_registration_change
  AFTER INSERT OR DELETE ON public.event_registrations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_event_participant_count();