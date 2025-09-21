-- First, let's add classes table
CREATE TABLE public.classes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID NOT NULL,
  class_name TEXT NOT NULL,
  class_description TEXT,
  invite_code TEXT NOT NULL UNIQUE,
  share_link TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Enable RLS on classes
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

-- Create class memberships table
CREATE TABLE public.class_memberships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('teacher', 'student')),
  UNIQUE(class_id, user_id)
);

-- Enable RLS on class memberships
ALTER TABLE public.class_memberships ENABLE ROW LEVEL SECURITY;

-- Update assignments table to link to classes
ALTER TABLE public.assignments ADD COLUMN class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE;
ALTER TABLE public.assignments ALTER COLUMN class_id SET NOT NULL;

-- Update assessment_submissions to include class context
ALTER TABLE public.assessment_submissions ADD COLUMN class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE;

-- Update profiles to remove the role requirement (users can be both)
ALTER TABLE public.profiles ALTER COLUMN role DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'user';

-- Create RLS policies for classes
CREATE POLICY "Class creators can manage their classes" 
ON public.classes 
FOR ALL 
USING (auth.uid() = creator_id);

CREATE POLICY "Class members can view classes they're in" 
ON public.classes 
FOR SELECT 
USING (
  id IN (
    SELECT class_id 
    FROM public.class_memberships 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Anyone can view classes by invite code" 
ON public.classes 
FOR SELECT 
USING (true);

-- Create RLS policies for class memberships
CREATE POLICY "Users can view memberships for their classes" 
ON public.class_memberships 
FOR SELECT 
USING (
  user_id = auth.uid() 
  OR 
  class_id IN (
    SELECT id 
    FROM public.classes 
    WHERE creator_id = auth.uid()
  )
);

CREATE POLICY "Users can join classes" 
ON public.class_memberships 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Class creators can manage memberships" 
ON public.class_memberships 
FOR ALL 
USING (
  class_id IN (
    SELECT id 
    FROM public.classes 
    WHERE creator_id = auth.uid()
  )
);

-- Update assignments policies to work with classes
DROP POLICY "Creators can create assignments" ON public.assignments;
DROP POLICY "Creators can update their assignments" ON public.assignments;
DROP POLICY "Creators can view their own assignments" ON public.assignments;
DROP POLICY "Anyone can view active assignments by share link" ON public.assignments;

CREATE POLICY "Class teachers can create assignments" 
ON public.assignments 
FOR INSERT 
WITH CHECK (
  class_id IN (
    SELECT class_id 
    FROM public.class_memberships 
    WHERE user_id = auth.uid() AND role = 'teacher'
  )
  OR 
  class_id IN (
    SELECT id 
    FROM public.classes 
    WHERE creator_id = auth.uid()
  )
);

CREATE POLICY "Class teachers can update assignments" 
ON public.assignments 
FOR UPDATE 
USING (
  class_id IN (
    SELECT class_id 
    FROM public.class_memberships 
    WHERE user_id = auth.uid() AND role = 'teacher'
  )
  OR 
  class_id IN (
    SELECT id 
    FROM public.classes 
    WHERE creator_id = auth.uid()
  )
);

CREATE POLICY "Class teachers can view assignments" 
ON public.assignments 
FOR SELECT 
USING (
  class_id IN (
    SELECT class_id 
    FROM public.class_memberships 
    WHERE user_id = auth.uid() AND role = 'teacher'
  )
  OR 
  class_id IN (
    SELECT id 
    FROM public.classes 
    WHERE creator_id = auth.uid()
  )
);

CREATE POLICY "Class members can view assignments" 
ON public.assignments 
FOR SELECT 
USING (
  is_active = true 
  AND class_id IN (
    SELECT class_id 
    FROM public.class_memberships 
    WHERE user_id = auth.uid()
  )
);

-- Update assessment submissions policies
DROP POLICY "Anyone can create submissions" ON public.assessment_submissions;
DROP POLICY "Assignment creators can view submissions for their assignments" ON public.assessment_submissions;
DROP POLICY "Learners can view their own submissions" ON public.assessment_submissions;

CREATE POLICY "Class members can submit assessments" 
ON public.assessment_submissions 
FOR INSERT 
WITH CHECK (
  assignment_id IN (
    SELECT id 
    FROM public.assignments 
    WHERE class_id IN (
      SELECT class_id 
      FROM public.class_memberships 
      WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Users can view their own submissions" 
ON public.assessment_submissions 
FOR SELECT 
USING (auth.uid() = learner_id);

CREATE POLICY "Class teachers can view all submissions" 
ON public.assessment_submissions 
FOR SELECT 
USING (
  assignment_id IN (
    SELECT id 
    FROM public.assignments 
    WHERE class_id IN (
      SELECT class_id 
      FROM public.class_memberships 
      WHERE user_id = auth.uid() AND role = 'teacher'
    )
    OR 
    class_id IN (
      SELECT id 
      FROM public.classes 
      WHERE creator_id = auth.uid()
    )
  )
);

-- Create trigger for automatic timestamp updates on classes
CREATE TRIGGER update_classes_updated_at
BEFORE UPDATE ON public.classes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to generate unique invite codes
CREATE OR REPLACE FUNCTION public.generate_invite_code()
RETURNS TEXT AS $$
BEGIN
  RETURN upper(substring(gen_random_uuid()::text from 1 for 8));
END;
$$ LANGUAGE plpgsql;