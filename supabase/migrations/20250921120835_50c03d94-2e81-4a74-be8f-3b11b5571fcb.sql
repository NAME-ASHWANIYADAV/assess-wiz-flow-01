-- Add missing foreign key relationship between class_memberships and profiles
ALTER TABLE public.class_memberships 
ADD CONSTRAINT class_memberships_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Add time_limit column to assignments table (in minutes)
ALTER TABLE public.assignments 
ADD COLUMN time_limit INTEGER DEFAULT 60;