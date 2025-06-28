
import { collection, getDocs, query, where, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  billing_cycle: string;
  video_quality: string;
  device_limit: number;
  simultaneous_streams: number;
  features: string[];
  is_active: boolean;
}

export const getSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  try {
    const plansRef = collection(db, 'subscription_plans');
    const q = query(
      plansRef, 
      where('is_active', '==', true),
      orderBy('price', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    const plans: SubscriptionPlan[] = [];
    
    querySnapshot.forEach((doc) => {
      plans.push({ id: doc.id, ...doc.data() } as SubscriptionPlan);
    });
    
    return plans;
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    return [];
  }
};

export const getSubscriptionPlan = async (planId: string): Promise<SubscriptionPlan | null> => {
  try {
    const planDoc = await getDoc(doc(db, 'subscription_plans', planId));
    if (planDoc.exists()) {
      return { id: planDoc.id, ...planDoc.data() } as SubscriptionPlan;
    }
    return null;
  } catch (error) {
    console.error('Error fetching subscription plan:', error);
    return null;
  }
};
