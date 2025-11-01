-- Create table for response keypoints
CREATE TABLE IF NOT EXISTS public.response_keypoints (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  keypoint TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for keypoint likes
CREATE TABLE IF NOT EXISTS public.keypoint_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  keypoint_id UUID NOT NULL REFERENCES public.response_keypoints(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(keypoint_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.response_keypoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.keypoint_likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for response_keypoints
CREATE POLICY "Anyone can view keypoints"
ON public.response_keypoints
FOR SELECT
USING (true);

CREATE POLICY "Service role can insert keypoints"
ON public.response_keypoints
FOR INSERT
WITH CHECK (true);

-- RLS Policies for keypoint_likes
CREATE POLICY "Anyone can view likes"
ON public.keypoint_likes
FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert likes"
ON public.keypoint_likes
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can delete their own likes"
ON public.keypoint_likes
FOR DELETE
USING (true);

-- Create indexes for performance
CREATE INDEX idx_response_keypoints_question_id ON public.response_keypoints(question_id);
CREATE INDEX idx_keypoint_likes_keypoint_id ON public.keypoint_likes(keypoint_id);