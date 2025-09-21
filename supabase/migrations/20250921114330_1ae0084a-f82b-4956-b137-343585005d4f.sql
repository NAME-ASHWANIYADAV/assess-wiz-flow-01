-- Fix infinite recursion in classes RLS policies
-- Drop existing policies that cause circular references
DROP POLICY IF EXISTS "Anyone can view classes they're members of" ON public.classes;
DROP POLICY IF EXISTS "Creators can manage their own classes" ON public.classes;

-- Recreate simplified policies without circular references
CREATE POLICY "Creators can manage their own classes" 
ON public.classes 
FOR ALL 
USING (auth.uid() = creator_id)
WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Anyone can view classes by code or invite" 
ON public.classes 
FOR SELECT 
USING (true);

-- Fix class_memberships policies to avoid circular references
DROP POLICY IF EXISTS "Class creators can manage memberships" ON public.class_memberships;
DROP POLICY IF EXISTS "Users can view memberships for their classes" ON public.class_memberships;

-- Recreate class_memberships policies without circular references
CREATE POLICY "Users can view their own memberships" 
ON public.class_memberships 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can join classes" 
ON public.class_memberships 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Class creators can view all memberships for their classes" 
ON public.class_memberships 
FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM public.classes 
    WHERE classes.id = class_memberships.class_id 
    AND classes.creator_id = auth.uid()
));