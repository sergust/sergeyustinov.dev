-- Row Level Security (RLS) Policies for Blog Application
-- Run these commands in your Supabase SQL Editor

-- =============================================================================
-- 1. ENABLE RLS ON ALL TABLES
-- =============================================================================

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- 2. POSTS TABLE POLICIES
-- =============================================================================

-- Allow everyone to read published posts
CREATE POLICY "Anyone can read published posts"
ON public.posts
FOR SELECT
TO public
USING (published = true);

-- Allow authenticated users to read all posts (including drafts for admins)
CREATE POLICY "Authenticated users can read all posts"
ON public.posts
FOR SELECT
TO authenticated
USING (true);

-- Allow only admin users to create posts
CREATE POLICY "Only admins can create posts"
ON public.posts
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid()::text IN (
    SELECT value FROM public.config WHERE key = 'admin_user_ids'
  )
);

-- Allow only admin users to update posts
CREATE POLICY "Only admins can update posts"
ON public.posts
FOR UPDATE
TO authenticated
USING (
  auth.uid()::text IN (
    SELECT value FROM public.config WHERE key = 'admin_user_ids'
  )
);

-- Allow only admin users to delete posts
CREATE POLICY "Only admins can delete posts"
ON public.posts
FOR DELETE
TO authenticated
USING (
  auth.uid()::text IN (
    SELECT value FROM public.config WHERE key = 'admin_user_ids'
  )
);

-- =============================================================================
-- 3. COMMENTS TABLE POLICIES
-- =============================================================================

-- Allow everyone to read comments on published posts
CREATE POLICY "Anyone can read comments on published posts"
ON public.comments
FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 FROM public.posts 
    WHERE posts.id = comments.post_id 
    AND posts.published = true
  )
);

-- Allow authenticated users to create comments
CREATE POLICY "Authenticated users can create comments"
ON public.comments
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid()::text = author_id
  AND EXISTS (
    SELECT 1 FROM public.posts 
    WHERE posts.id = post_id 
    AND posts.published = true
  )
);

-- Allow users to update their own comments
CREATE POLICY "Users can update their own comments"
ON public.comments
FOR UPDATE
TO authenticated
USING (auth.uid()::text = author_id)
WITH CHECK (auth.uid()::text = author_id);

-- Allow users to delete their own comments
CREATE POLICY "Users can delete their own comments"
ON public.comments
FOR DELETE
TO authenticated
USING (auth.uid()::text = author_id);

-- Allow admin users to moderate all comments
CREATE POLICY "Admins can moderate all comments"
ON public.comments
FOR ALL
TO authenticated
USING (
  auth.uid()::text IN (
    SELECT value FROM public.config WHERE key = 'admin_user_ids'
  )
);

-- =============================================================================
-- 4. LIKES TABLE POLICIES
-- =============================================================================

-- Allow everyone to read likes (for like counts)
CREATE POLICY "Anyone can read likes"
ON public.likes
FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 FROM public.posts 
    WHERE posts.id = likes.post_id 
    AND posts.published = true
  )
);

-- Allow authenticated users to create likes
CREATE POLICY "Authenticated users can create likes"
ON public.likes
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid()::text = user_id
  AND EXISTS (
    SELECT 1 FROM public.posts 
    WHERE posts.id = post_id 
    AND posts.published = true
  )
);

-- Allow users to delete their own likes (unlike)
CREATE POLICY "Users can delete their own likes"
ON public.likes
FOR DELETE
TO authenticated
USING (auth.uid()::text = user_id);

-- Prevent users from updating likes (likes are immutable)
CREATE POLICY "Likes cannot be updated"
ON public.likes
FOR UPDATE
TO authenticated
USING (false);

-- =============================================================================
-- 5. SUBSCRIBERS TABLE POLICIES
-- =============================================================================

-- Allow only authenticated admin users to read subscribers
CREATE POLICY "Only admins can read subscribers"
ON public.subscribers
FOR SELECT
TO authenticated
USING (
  auth.uid()::text IN (
    SELECT value FROM public.config WHERE key = 'admin_user_ids'
  )
);

-- Allow anyone to subscribe (create subscriber record)
CREATE POLICY "Anyone can subscribe"
ON public.subscribers
FOR INSERT
TO public
WITH CHECK (true);

-- Allow subscribers to update their own subscription
CREATE POLICY "Subscribers can update their own subscription"
ON public.subscribers
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Allow only admins to delete subscribers
CREATE POLICY "Only admins can delete subscribers"
ON public.subscribers
FOR DELETE
TO authenticated
USING (
  auth.uid()::text IN (
    SELECT value FROM public.config WHERE key = 'admin_user_ids'
  )
);

-- =============================================================================
-- 6. ANALYTICS TABLE POLICIES
-- =============================================================================

-- Allow only admin users to read analytics
CREATE POLICY "Only admins can read analytics"
ON public.analytics
FOR SELECT
TO authenticated
USING (
  auth.uid()::text IN (
    SELECT value FROM public.config WHERE key = 'admin_user_ids'
  )
);

-- Allow anyone to create analytics events (for tracking)
CREATE POLICY "Anyone can create analytics events"
ON public.analytics
FOR INSERT
TO public
WITH CHECK (true);

-- Prevent updating analytics (immutable records)
CREATE POLICY "Analytics cannot be updated"
ON public.analytics
FOR UPDATE
TO authenticated
USING (false);

-- Allow only admins to delete analytics (for cleanup)
CREATE POLICY "Only admins can delete analytics"
ON public.analytics
FOR DELETE
TO authenticated
USING (
  auth.uid()::text IN (
    SELECT value FROM public.config WHERE key = 'admin_user_ids'
  )
);

-- =============================================================================
-- 7. CONFIGURATION TABLE FOR ADMIN USER IDS
-- =============================================================================

-- Create configuration table for storing admin user IDs
CREATE TABLE IF NOT EXISTS public.config (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on config table
ALTER TABLE public.config ENABLE ROW LEVEL SECURITY;

-- Only allow reading config for authenticated users
CREATE POLICY "Authenticated users can read config"
ON public.config
FOR SELECT
TO authenticated
USING (true);

-- Only allow admins to manage config
CREATE POLICY "Only superusers can manage config"
ON public.config
FOR ALL
TO authenticated
USING (
  auth.jwt() ->> 'role' = 'service_role'
);

-- Insert admin user IDs (replace with your actual admin user IDs)
INSERT INTO public.config (key, value) VALUES 
  ('admin_user_ids', 'user_2example123,user_2example456')
ON CONFLICT (key) DO UPDATE SET 
  value = EXCLUDED.value,
  updated_at = NOW();

-- =============================================================================
-- 8. UTILITY FUNCTIONS
-- =============================================================================

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id TEXT DEFAULT auth.uid()::text)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT user_id IN (
    SELECT value FROM public.config WHERE key = 'admin_user_ids'
  );
$$;

-- Function to check if user owns a comment
CREATE OR REPLACE FUNCTION public.owns_comment(comment_id TEXT, user_id TEXT DEFAULT auth.uid()::text)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.comments 
    WHERE id = comment_id 
    AND author_id = user_id
  );
$$;

-- Function to check if user owns a like
CREATE OR REPLACE FUNCTION public.owns_like(like_id TEXT, user_id TEXT DEFAULT auth.uid()::text)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.likes 
    WHERE id = like_id 
    AND user_id = user_id
  );
$$;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- =============================================================================
-- 9. TRIGGERS FOR UPDATED_AT
-- =============================================================================

-- Add triggers for updated_at columns
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_config_updated_at
  BEFORE UPDATE ON public.config
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- =============================================================================
-- 10. INDEXES FOR PERFORMANCE
-- =============================================================================

-- Indexes for faster RLS policy evaluation
CREATE INDEX IF NOT EXISTS idx_posts_published ON public.posts(published);
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON public.posts(author_id);
CREATE INDEX IF NOT EXISTS idx_comments_author_id ON public.comments(author_id);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON public.comments(post_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON public.likes(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON public.likes(post_id);
CREATE INDEX IF NOT EXISTS idx_config_key ON public.config(key);

-- =============================================================================
-- SETUP COMPLETE
-- =============================================================================

-- To test the policies, you can run:
-- SELECT * FROM public.posts; -- Should show only published posts for anonymous users
-- SELECT * FROM public.comments; -- Should show comments on published posts only
-- SELECT * FROM public.likes; -- Should show likes on published posts only

-- Remember to:
-- 1. Update the admin_user_ids in the config table with your actual Clerk user IDs
-- 2. Test the policies with different user roles
-- 3. Monitor policy performance and adjust indexes as needed
-- 4. Regularly review and update policies as your application evolves 