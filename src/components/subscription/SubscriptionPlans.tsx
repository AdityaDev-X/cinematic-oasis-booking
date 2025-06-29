import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Crown, Zap, Star } from 'lucide-react';
import { getSubscriptionPlans, SubscriptionPlan } from '@/lib/firestore';
import { useToast } from '@/hooks/use-toast';

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
      const fetchedPlans = await getSubscriptionPlans();
      console.log('Fetched plans:', fetchedPlans);
      setPlans(fetchedPlans);
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
    // Here you would integrate with Stripe checkout
    toast({
      title: "Coming Soon",
      description: "Payment integration will be implemented next",
    });
  };

  function getPlanIcon(planName: string) {
    switch (planName.toLowerCase()) {
      case 'basic':
        return <Zap className="h-6 w-6" />;
      case 'standard':
        return <Star className="h-6 w-6" />;
      case 'premium':
        return <Crown className="h-6 w-6" />;
      default:
        return <Check className="h-6 w-6" />;
    }
  }

  function getPlanColor(planName: string) {
    switch (planName.toLowerCase()) {
      case 'basic':
        return 'border-blue-500 bg-blue-500/10';
      case 'standard':
        return 'border-green-500 bg-green-500/10';
      case 'premium':
        return 'border-purple-500 bg-purple-500/10';
      default:
        return 'border-gray-500 bg-gray-500/10';
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
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
          
          <CardHeader className={`text-center ${plan.name.toLowerCase() === 'standard' ? 'pt-12' : 'pt-6'}`}>
            <div className="flex justify-center mb-4 text-white">
              {getPlanIcon(plan.name)}
            </div>
            <CardTitle className="text-2xl font-bold text-white">{plan.name}</CardTitle>
            <CardDescription className="text-gray-300">
              <span className="text-3xl font-bold text-white">${plan.price}</span>
              <span className="text-sm">/{plan.billing_cycle}</span>
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-gray-300">{plan.video_quality} Video Quality</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-gray-300">Watch on {plan.device_limit} device{plan.device_limit > 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-gray-300">{plan.simultaneous_streams} simultaneous stream{plan.simultaneous_streams > 1 ? 's' : ''}</span>
              </div>
              {plan.features && plan.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-gray-300">{feature}</span>
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
