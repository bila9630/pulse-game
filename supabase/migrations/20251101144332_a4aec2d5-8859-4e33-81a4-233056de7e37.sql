-- Add count field to track how many responses this keypoint represents
ALTER TABLE public.response_keypoints
ADD COLUMN IF NOT EXISTS response_count INTEGER NOT NULL DEFAULT 1;