
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Crown, Zap, Star, Gift } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  billing_cycle: string;
  video_quality: string;
  device_limit: number;
  simultaneous_streams: number;
  features: string[];
  is_active: boolean;
}

export const SubscriptionPlans = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true });

      if (error) throw error;

      console.log('Fetched plans:', data);
      setPlans(data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast({
        title: "Error",
        description: "Failed to load subscription plans",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = async (planId: string) => {
    setSelectedPlan(planId);
    // Here you would integrate with Stripe/Razorpay checkout
    toast({
      title: "Coming Soon",
      description: "Payment integration will be implemented next",
    });
  };

  function getPlanIcon(planName: string) {
    switch (planName.toLowerCase()) {
      case 'free trial':
        return <Gift className="h-6 w-6" />;
      case 'basic':
        return <Zap className="h-6 w-6" />;
      case 'standard':
        return <Star className="h-6 w-6" />;
      case 'premium':
      case 'annual':
        return <Crown className="h-6 w-6" />;
      default:
        return <Check className="h-6 w-6" />;
    }
  }

  function getPlanColor(planName: string) {
    switch (planName.toLowerCase()) {
      case 'free trial':
        return 'border-gray-500 bg-gray-500/10';
      case 'basic':
        return 'border-blue-500 bg-blue-500/10';
      case 'standard':
        return 'border-green-500 bg-green-500/10';
      case 'premium':
        return 'border-purple-500 bg-purple-500/10';
      case 'annual':
        return 'border-yellow-500 bg-yellow-500/10';
      default:
        return 'border-gray-500 bg-gray-500/10';
    }
  }

  function formatPrice(price: number, currency: string, billing_cycle: string) {
    if (price === 0) {
      return 'Free';
    }
    
    const symbol = currency === 'INR' ? '₹' : '$';
    return `${symbol}${price}`;
  }

  function formatBillingCycle(cycle: string) {
    if (cycle === '7-day trial') return '/7 days';
    if (cycle === 'yearly') return '/year';
    return '/month';
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
      {plans.map((plan) => (
        <Card 
          key={plan.id} 
          className={`relative overflow-hidden transition-all duration-300 hover:scale-105 ${getPlanColor(plan.name)} border-2`}
        >
          {plan.name.toLowerCase() === 'standard' && (
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-center py-2 text-sm font-medium">
              Most Popular
            </div>
          )}
          
          {plan.name.toLowerCase() === 'annual' && (
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-center py-2 text-sm font-medium">
              Best Value
            </div>
          )}
          
          <CardHeader className={`text-center ${(plan.name.toLowerCase() === 'standard' || plan.name.toLowerCase() === 'annual') ? 'pt-12' : 'pt-6'}`}>
            <div className="flex justify-center mb-4 text-white">
              {getPlanIcon(plan.name)}
            </div>
            <CardTitle className="text-xl font-bold text-white">{plan.name}</CardTitle>
            <CardDescription className="text-gray-300">
              <span className="text-2xl font-bold text-white">
                {formatPrice(plan.price, plan.currency, plan.billing_cycle)}
              </span>
              <span className="text-sm">{formatBillingCycle(plan.billing_cycle)}</span>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-300 text-sm">{plan.video_quality} Video Quality</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-300 text-sm">Watch on {plan.device_limit} device{plan.device_limit > 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-gray-300 text-sm">{plan.simultaneous_streams} simultaneous stream{plan.simultaneous_streams > 1 ? 's' : ''}</span>
              </div>
              {plan.features && plan.features.slice(0, 3).map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <Button 
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3"
              onClick={() => handleSelectPlan(plan.id)}
              disabled={selectedPlan === plan.id}
            >
              {selectedPlan === plan.id ? 'Processing...' : 'Choose Plan'}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
