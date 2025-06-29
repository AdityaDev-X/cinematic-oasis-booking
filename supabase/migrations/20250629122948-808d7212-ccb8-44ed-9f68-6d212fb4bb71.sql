
-- Update subscription plans with Netflix-like pricing and features
DELETE FROM public.subscription_plans;

INSERT INTO public.subscription_plans (name, price, currency, billing_cycle, video_quality, device_limit, simultaneous_streams, features) VALUES
('Basic', 99.00, 'INR', 'monthly', 'SD', 1, 1, '["SD quality (480p)", "Watch on 1 screen at a time", "Limited content access", "Ads may appear", "No downloads"]'),
('Standard', 299.00, 'INR', 'monthly', 'HD', 2, 2, '["HD quality (720p/1080p)", "Watch on 2 screens", "Full content access", "No ads", "Download for offline use (limit: 5 titles)", "Parental controls"]'),
('Premium', 499.00, 'INR', 'monthly', '4K', 4, 4, '["Ultra HD/4K quality", "Watch on 4 screens at once", "Unlimited downloads", "Exclusive early access to new content", "Priority customer support", "Share with family (profile-based access)"]'),
('Annual', 2499.00, 'INR', 'yearly', '4K', 4, 4, '["Same as Premium", "Discounted for long-term users (save ₹489)", "Ultra HD/4K quality", "Watch on 4 screens at once", "Unlimited downloads", "Priority customer support"]'),
('Free Trial', 0.00, 'INR', '7-day trial', 'HD', 1, 1, '["Access to all content (but limited features)", "Limited to 1 screen", "Ads enabled", "Download not allowed", "7 days free access"]');

-- Add user settings table for Netflix-like functionality
CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  language TEXT DEFAULT 'en',
  subtitle_language TEXT DEFAULT 'en',
  auto_play_next BOOLEAN DEFAULT true,
  auto_play_previews BOOLEAN DEFAULT true,
  playback_quality TEXT DEFAULT 'auto', -- auto, high, medium, low
  download_quality TEXT DEFAULT 'standard', -- standard, high
  notifications_enabled BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  parental_controls BOOLEAN DEFAULT false,
  maturity_rating TEXT DEFAULT 'all', -- all, teen, mature
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS for user settings
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for user settings
CREATE POLICY "Users can view their own settings" ON public.user_settings
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings" ON public.user_settings
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" ON public.user_settings
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own settings" ON public.user_settings
FOR DELETE USING (auth.uid() = user_id);
