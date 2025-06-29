
import { supabase } from '@/integrations/supabase/client';

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  stripe_subscription_id?: string;
  created_at: string;
  updated_at: string;
  plan?: {
    name: string;
    price: number;
    video_quality: string;
    device_limit: number;
    simultaneous_streams: number;
    features: string[];
  };
}

export const getUserSubscription = async (userId: string): Promise<UserSubscription | null> => {
  const { data, error } = await supabase
    .from('user_subscriptions')
    .select(`
      *,
      subscription_plans (
        name,
        price,
        video_quality,
        device_limit,
        simultaneous_streams,
        features
      )
    `)
    .eq('user_id', userId)
    .eq('status', 'active')
    .maybeSingle();

  if (error) {
    console.error('Error fetching user subscription:', error);
    return null;
  }

  return data;
};

export const hasActiveSubscription = async (userId: string): Promise<boolean> => {
  const subscription = await getUserSubscription(userId);
  return subscription !== null;
};

export const canWatchContent = async (userId: string, requiredPlanLevel: number = 1): Promise<boolean> => {
  const subscription = await getUserSubscription(userId);
  
  if (!subscription) {
    return requiredPlanLevel <= 1; // Basic access for free content
  }

  // Map plan names to levels
  const planLevels: { [key: string]: number } = {
    'Free Trial': 1,
    'Basic': 1,
    'Standard': 2,
    'Premium': 3,
    'Annual': 3
  };

  const userPlanLevel = planLevels[subscription.plan?.name || 'Basic'] || 1;
  return userPlanLevel >= requiredPlanLevel;
};
