-- First, let's see what policies exist
-- Drop ALL existing policies on classes table to start fresh
DROP POLICY IF EXISTS "Anyone can view classes they're members of" ON public.classes;
DROP POLICY IF EXISTS "Creators can manage their own classes" ON public.classes;

-- Drop ALL existing policies on class_memberships table to start fresh
DROP POLICY IF EXISTS "Class creators can manage memberships" ON public.class_memberships;
DROP POLICY IF EXISTS "Users can join classes" ON public.class_memberships;
DROP POLICY IF EXISTS "Users can view memberships for their classes" ON public.class_memberships;

-- Create simple, non-recursive policies for classes
CREATE POLICY "creators_can_manage_classes" 
ON public.classes 
FOR ALL 
USING (auth.uid() = creator_id)
WITH CHECK (auth.uid() = creator_id);

-- Create simple policies for class_memberships without circular references
CREATE POLICY "users_can_view_own_memberships" 
ON public.class_memberships 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "users_can_create_memberships" 
ON public.class_memberships 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);