-- Insert sample admin data
INSERT INTO public.admins (name, role, description, expertise, achievements, social_links, display_order) VALUES
('Alex Johnson', 'President', 'Computer Science senior with 3+ years of full-stack development experience. Passionate about building inclusive tech communities and mentoring fellow students.', ARRAY['JavaScript', 'React', 'Python', 'Leadership'], ARRAY['Led team of 15 developers in hackathon', 'Published 2 research papers on ML', 'Google Summer of Code participant'], '{"github": "alexjohnson", "linkedin": "alex-johnson-dev", "email": "alex@codeclub.edu"}', 1),
('Sarah Chen', 'Vice President', 'Software Engineering major specializing in AI/ML. Experienced in organizing tech events and workshops for 200+ students.', ARRAY['Machine Learning', 'Python', 'TensorFlow', 'Event Planning'], ARRAY['Organized 5 successful hackathons', 'Interned at Microsoft AI Research', 'Founded Women in Tech initiative'], '{"github": "sarahchen", "linkedin": "sarah-chen-ai", "email": "sarah@codeclub.edu"}', 2),
('Marcus Rodriguez', 'Technical Lead', 'Full-stack developer with expertise in modern web technologies. Maintains club open-source projects and mentors new members.', ARRAY['Node.js', 'TypeScript', 'Docker', 'AWS'], ARRAY['Contributed to 10+ open source projects', 'Built club management system', 'Mentored 25+ junior developers'], '{"github": "marcusrodriguez", "linkedin": "marcus-rodriguez-dev", "email": "marcus@codeclub.edu"}', 3),
('Emily Wang', 'Community Manager', 'Cybersecurity major focused on building strong community connections. Expert in social media strategy and member engagement.', ARRAY['Cybersecurity', 'Community Building', 'Social Media', 'Public Speaking'], ARRAY['Grew club membership by 150%', 'Organized industry networking events', 'Featured speaker at 3 conferences'], '{"github": "emilywang", "linkedin": "emily-wang-security", "email": "emily@codeclub.edu"}', 4);

-- Insert sample gallery items
INSERT INTO public.gallery_items (title, description, image_url, category, display_order) VALUES
('Annual Hackathon 2024', 'Our biggest hackathon yet with 200+ participants and $10K in prizes', '/src/assets/gallery-1.jpg', 'events', 1),
('Web Development Workshop', 'Hands-on React and Node.js workshop for beginners', '/src/assets/gallery-2.jpg', 'workshops', 2),
('Industry Meet & Greet', 'Networking event with tech professionals from top companies', '/src/assets/gallery-3.jpg', 'networking', 3),
('AI/ML Study Group', 'Weekly study sessions covering machine learning fundamentals', '/src/assets/gallery-1.jpg', 'education', 4),
('Open Source Contribution Drive', 'Contributing to popular open source projects as a team', '/src/assets/gallery-2.jpg', 'projects', 5),
('Code Review Sessions', 'Peer code reviews to improve programming skills', '/src/assets/gallery-3.jpg', 'education', 6);

-- Insert sample stats
INSERT INTO public.stats (label, value, icon, display_order) VALUES
('Active Members', 250, 'Users', 1),
('Projects Completed', 45, 'Code', 2),
('Workshops Held', 32, 'BookOpen', 3),
('Industry Partners', 18, 'Building', 4);