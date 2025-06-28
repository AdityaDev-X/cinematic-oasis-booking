
-- Remove booking-related tables and create subscription-focused tables
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.show_seats CASCADE;
DROP TABLE IF EXISTS public.shows CASCADE;
DROP TABLE IF EXISTS public.screens CASCADE;
DROP TABLE IF EXISTS public.seats CASCADE;
DROP TABLE IF EXISTS public.theaters CASCADE;

-- Create subscription plans table
CREATE TABLE public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  billing_cycle TEXT DEFAULT 'monthly', -- monthly, yearly
  video_quality TEXT NOT NULL, -- SD, HD, 4K
  device_limit INTEGER NOT NULL,
  simultaneous_streams INTEGER NOT NULL,
  features JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user subscriptions table
CREATE TABLE public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES public.subscription_plans(id),
  stripe_subscription_id TEXT,
  status TEXT DEFAULT 'active', -- active, cancelled, expired, past_due
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user devices table to track device limits
CREATE TABLE public.user_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  device_name TEXT NOT NULL,
  device_type TEXT NOT NULL, -- mobile, tablet, desktop, tv
  device_id TEXT NOT NULL,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Update movies table for streaming
ALTER TABLE public.movies 
ADD COLUMN IF NOT EXISTS video_url TEXT,
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT,
ADD COLUMN IF NOT EXISTS content_type TEXT DEFAULT 'movie', -- movie, series
ADD COLUMN IF NOT EXISTS seasons INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS episodes INTEGER,
ADD COLUMN IF NOT EXISTS required_plan_level INTEGER DEFAULT 1; -- 1=basic, 2=standard, 3=premium

-- Insert default subscription plans
INSERT INTO public.subscription_plans (name, price, video_quality, device_limit, simultaneous_streams, features) VALUES
('Basic', 8.99, 'HD', 1, 1, '["Mobile", "Tablet", "Computer"]'),
('Standard', 13.99, 'HD', 2, 2, '["Mobile", "Tablet", "Computer", "TV"]'),
('Premium', 17.99, '4K', 4, 4, '["Mobile", "Tablet", "Computer", "TV", "Ultra HD"]');

-- Enable RLS
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_devices ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view subscription plans" ON public.subscription_plans FOR SELECT USING (is_active = true);

CREATE POLICY "Users can view their own subscriptions" ON public.user_subscriptions 
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own devices" ON public.user_devices 
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own devices" ON public.user_devices 
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own devices" ON public.user_devices 
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own devices" ON public.user_devices 
FOR DELETE USING (auth.uid() = user_id);

-- Service role policies for subscriptions (for edge functions)
CREATE POLICY "Service role can manage subscriptions" ON public.user_subscriptions 
FOR ALL USING (true);
