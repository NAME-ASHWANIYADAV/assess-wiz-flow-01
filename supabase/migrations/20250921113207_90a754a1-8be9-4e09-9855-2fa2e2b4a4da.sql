-- Create classes table
CREATE TABLE public.classes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  subject TEXT NOT NULL,
  class_code TEXT NOT NULL UNIQUE,
  invite_link TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create class_memberships table
CREATE TABLE public.class_memberships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'student',
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, class_id)
);

-- Enable RLS on both tables
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_memberships ENABLE ROW LEVEL SECURITY;

-- RLS Policies for classes table
CREATE POLICY "Creators can manage their own classes" 
ON public.classes 
FOR ALL 
USING (auth.uid() = creator_id);

CREATE POLICY "Anyone can view classes they're members of"
ON public.classes
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.class_memberships 
    WHERE class_memberships.class_id = classes.id 
    AND class_memberships.user_id = auth.uid()
  )
  OR auth.uid() = creator_id
);

-- RLS Policies for class_memberships table
CREATE POLICY "Users can view memberships for their classes"
ON public.class_memberships
FOR SELECT
USING (
  auth.uid() = user_id 
  OR EXISTS (
    SELECT 1 FROM public.classes 
    WHERE classes.id = class_memberships.class_id 
    AND classes.creator_id = auth.uid()
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
  EXISTS (
    SELECT 1 FROM public.classes 
    WHERE classes.id = class_memberships.class_id 
    AND classes.creator_id = auth.uid()
  )
);

-- Add trigger for updated_at on classes
CREATE TRIGGER update_classes_updated_at
BEFORE UPDATE ON public.classes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update assignments table to link to classes (make it optional)
ALTER TABLE public.assignments 
ADD COLUMN class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL;

-- Update assessment_submissions to link to classes through assignments
-- No direct changes needed as it will be linked via assignments