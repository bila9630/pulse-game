-- Make user_id nullable since we don't need it for anonymous responses
ALTER TABLE public.user_responses ALTER COLUMN user_id DROP NOT NULL;

-- Drop existing RLS policies
DROP POLICY IF EXISTS "Users can view their own responses" ON public.user_responses;
DROP POLICY IF EXISTS "Users can create their own responses" ON public.user_responses;

-- Create new RLS policies that allow anonymous submissions
CREATE POLICY "Anyone can create responses"
  ON public.user_responses
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view responses"
  ON public.user_responses
  FOR SELECT
  USING (true);