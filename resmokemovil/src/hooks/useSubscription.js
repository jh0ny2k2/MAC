import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SubscriptionService } from '../services/subscriptionService';

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [stats, setStats] = useState({
    availablePromotions: 0,
    usedPromotions: 0,
    totalPromotions: 10,
    activePromotions: 0,
    resetDate: null
  });

  useEffect(() => {
    if (user?.originalId) {
      fetchSubscriptionData();
    } else {
      setLoading(false);
      setIsPremium(false);
      setSubscription(null);
      setStats({
        availablePromotions: 0,
        usedPromotions: 0,
        totalPromotions: 10,
        activePromotions: 0,
        resetDate: null
      });
    }
  }, [user?.originalId]);

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);
      
      const [subscriptionData, premiumStatus, subscriptionStats] = await Promise.all([
        SubscriptionService.getUserSubscription(user.originalId),
        SubscriptionService.isUserPremium(user.originalId),
        SubscriptionService.getSubscriptionStats(user.originalId)
      ]);

      setSubscription(subscriptionData);
      setIsPremium(premiumStatus);
      setStats(subscriptionStats);
    } catch (error) {
      console.error('Error fetching subscription data:', error);
      setSubscription(null);
      setIsPremium(false);
      setStats({
        availablePromotions: 0,
        usedPromotions: 0,
        totalPromotions: 10,
        activePromotions: 0,
        resetDate: null
      });
    } finally {
      setLoading(false);
    }
  };

  const createSubscription = async (planType, stripeSubscriptionId) => {
    try {
      if (!user?.id) {
        throw new Error('Usuario no autenticado');
      }

      const subscriptionData = {
        user_id: user.id,
        plan_type: planType,
        status: 'active',
        stripe_subscription_id: stripeSubscriptionId,
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días
      };

      const data = await SubscriptionService.createSubscription(subscriptionData);
      
      // Refrescar datos
      await fetchSubscriptionData();
      
      return { success: true, data };
    } catch (error) {
      console.error('Error creating subscription:', error);
      return { success: false, error: error.message };
    }
  };

  const cancelSubscription = async () => {
    try {
      if (!user?.id) {
        throw new Error('Usuario no autenticado');
      }

      const data = await SubscriptionService.cancelSubscription(user.id);
      
      // Refrescar datos
      await fetchSubscriptionData();
      
      return { success: true, data };
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      return { success: false, error: error.message };
    }
  };

  const getAvailablePromotions = async () => {
    try {
      if (!user?.originalId) return 0;
      return await SubscriptionService.getAvailableFreePromotions(user.originalId);
    } catch (error) {
      console.error('Error getting available promotions:', error);
      return 0;
    }
  };

  const usePromotion = async (productId) => {
    try {
      if (!user?.originalId) {
        throw new Error('Usuario no autenticado');
      }

      const promotion = await SubscriptionService.useFreePromotion(user.originalId, productId);
      
      // Refrescar datos
      await fetchSubscriptionData();
      
      return { success: true, data: promotion };
    } catch (error) {
      console.error('Error using promotion:', error);
      return { success: false, error: error.message };
    }
  };

  const getUserPromotions = async () => {
    try {
      if (!user?.originalId) return [];
      return await SubscriptionService.getUserPromotions(user.originalId);
    } catch (error) {
      console.error('Error getting user promotions:', error);
      return [];
    }
  };

  const getSubscriptionStatus = () => {
    if (loading) return 'loading';
    if (!subscription) return 'free';
    if (subscription.status === 'active') return 'premium';
    if (subscription.status === 'cancelled') return 'cancelled';
    return 'free';
  };

  return {
    subscription,
    loading,
    isPremium,
    stats,
    promotionsUsed: stats.usedPromotions,
    promotionsRemaining: stats.availablePromotions,
    createSubscription,
    cancelSubscription,
    getAvailablePromotions,
    usePromotion,
    getUserPromotions,
    getSubscriptionStatus,
    refreshSubscription: fetchSubscriptionData,
    refreshPromotions: fetchSubscriptionData,
    refetch: fetchSubscriptionData
  };
};

export default useSubscription;