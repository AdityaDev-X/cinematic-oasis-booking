
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Crown, Zap, Star, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getSubscriptionPlans, SubscriptionPlan } from '@/lib/firestore';
import { useToast } from '@/hooks/use-toast';

interface UpgradePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: string;
}

export const UpgradePlanModal = ({ isOpen, onClose, currentPlan }: UpgradePlanModalProps) => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchPlans();
    }
  }, [isOpen]);

  const fetchPlans = async () => {
    try {
      const fetchedPlans = await getSubscriptionPlans();
      // Filter out Free Trial and sort by price
      const filteredPlans = fetchedPlans
        .filter(plan => plan.name !== 'Free Trial')
        .sort((a, b) => a.price - b.price);
      setPlans(filteredPlans);
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

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
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
      case 'annual':
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
      case 'annual':
        return 'border-purple-500 bg-purple-500/10';
      default:
        return 'border-gray-500 bg-gray-500/10';
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl bg-black border-red-900">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold text-white">Upgrade Your Plan</DialogTitle>
              <DialogDescription className="text-gray-300">
                Choose a plan that works best for you
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {plans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative overflow-hidden transition-all duration-300 hover:scale-105 ${getPlanColor(plan.name)} border-2 ${
                  currentPlan === plan.name ? 'ring-2 ring-red-500' : ''
                }`}
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
                  <CardTitle className="text-xl font-bold text-white">{plan.name}</CardTitle>
                  <CardDescription className="text-gray-300">
                    <span className="text-2xl font-bold text-white">₹{plan.price}</span>
                    <span className="text-sm">/{plan.billing_cycle}</span>
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">
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
                    {plan.features && plan.features.slice(0, 2).map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    className={`w-full text-white font-medium py-2 ${
                      currentPlan === plan.name 
                        ? 'bg-gray-600 cursor-not-allowed' 
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={currentPlan === plan.name || selectedPlan === plan.id}
                  >
                    {currentPlan === plan.name 
                      ? 'Current Plan' 
                      : selectedPlan === plan.id 
                        ? 'Processing...' 
                        : 'Choose Plan'
                    }
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
