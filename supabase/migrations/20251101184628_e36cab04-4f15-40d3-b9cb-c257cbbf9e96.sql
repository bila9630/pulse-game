-- Create user_progress table to track XP and levels
CREATE TABLE public.user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL,
  username text NOT NULL,
  current_xp integer NOT NULL DEFAULT 0,
  level integer NOT NULL DEFAULT 1,
  total_xp integer NOT NULL DEFAULT 0,
  updated_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view all user progress (for leaderboard)
CREATE POLICY "Anyone can view user progress"
ON public.user_progress
FOR SELECT
USING (true);

-- Users can insert their own progress
CREATE POLICY "Users can insert their own progress"
ON public.user_progress
FOR INSERT
WITH CHECK (true);

-- Users can update their own progress
CREATE POLICY "Users can update their own progress"
ON public.user_progress
FOR UPDATE
USING (true);

-- Create index for faster leaderboard queries
CREATE INDEX idx_user_progress_total_xp ON public.user_progress(total_xp DESC);

-- Insert 10 sample users for the leaderboard
INSERT INTO public.user_progress (user_id, username, current_xp, level, total_xp) VALUES
  (gen_random_uuid(), 'Sarah Chen', 245, 8, 2845),
  (gen_random_uuid(), 'Michael Torres', 180, 7, 2380),
  (gen_random_uuid(), 'Emma Rodriguez', 320, 6, 2120),
  (gen_random_uuid(), 'James Wilson', 90, 5, 1790),
  (gen_random_uuid(), 'Olivia Kim', 150, 5, 1650),
  (gen_random_uuid(), 'Daniel Brown', 420, 4, 1420),
  (gen_random_uuid(), 'Sophia Patel', 280, 4, 1280),
  (gen_random_uuid(), 'Liam Johnson', 95, 3, 895),
  (gen_random_uuid(), 'Ava Martinez', 540, 2, 540),
  (gen_random_uuid(), 'Noah Davis', 210, 2, 210);