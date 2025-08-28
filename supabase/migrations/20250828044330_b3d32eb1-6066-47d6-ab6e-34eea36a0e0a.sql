-- Fix security warnings by setting search_path for functions

-- Update newsletter subscription function with proper security
CREATE OR REPLACE FUNCTION public.subscribe_newsletter(
  subscriber_email text,
  subscriber_name text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Update newsletter unsubscription function with proper security
CREATE OR REPLACE FUNCTION public.unsubscribe_newsletter(
  subscriber_email text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Update member application function with proper security
CREATE OR REPLACE FUNCTION public.handle_member_application()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Update event participant count function with proper security
CREATE OR REPLACE FUNCTION public.update_event_participant_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Update club application function with proper security
CREATE OR REPLACE FUNCTION public.submit_club_application(
  applicant_email text,
  applicant_name text,
  motivation_text text,
  experience_text text DEFAULT NULL,
  skills_list text[] DEFAULT NULL,
  github_user text DEFAULT NULL,
  linkedin_user text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
  user_profile profiles%ROWTYPE;
BEGIN
  -- Check if user already has an application
  SELECT * INTO user_profile FROM public.profiles WHERE email = applicant_email;
  
  IF user_profile.id IS NOT NULL THEN
    -- Check if they already have a pending or approved application
    IF EXISTS (
      SELECT 1 FROM public.member_applications 
      WHERE user_id = user_profile.id 
      AND status IN ('pending', 'approved')
    ) THEN
      RETURN jsonb_build_object(
        'success', false,
        'message', 'You already have a pending or approved application'
      );
    END IF;
    
    -- Create new application
    INSERT INTO public.member_applications (
      user_id, 
      email,
      full_name,
      motivation,
      experience,
      skills,
      github_username,
      linkedin_username,
      status
    ) VALUES (
      user_profile.id,
      applicant_email,
      applicant_name,
      motivation_text,
      experience_text,
      skills_list,
      github_user,
      linkedin_user,
      'pending'
    );
    
    result := jsonb_build_object(
      'success', true,
      'message', 'Application submitted successfully! Please wait for admin approval.'
    );
  ELSE
    result := jsonb_build_object(
      'success', false,
      'message', 'Please create an account first before applying'
    );
  END IF;
  
  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Failed to submit application'
    );
END;
$$;