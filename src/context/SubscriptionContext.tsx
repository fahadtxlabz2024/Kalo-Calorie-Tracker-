import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from './AuthContext';
import {
  getSubscriptionData,
  markTrialExpiredNotified,
  SubscriptionData,
} from '../lib/subscriptionStorage';
import TrialExpiredModal from '../components/TrialExpiredModal';

type SubscriptionContextType = {
  subscription: SubscriptionData | null;
  refreshSubscription: () => Promise<void>;
};

const SubscriptionContext = createContext<SubscriptionContextType>({
  subscription: null,
  refreshSubscription: async () => {},
});

export const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  const checkSubscription = useCallback(async () => {
    try {
      const data = await getSubscriptionData(user?.email);
      setSubscription(data);

      // Check if trial has expired and user has not been notified yet
      if (
        data.hasUsedTrial &&
        data.planType === 'none' &&
        data.subscriptionCreatedAt !== null &&
        !data.trialExpiredNotified
      ) {
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error checking subscription in SubscriptionProvider:', error);
    }
  }, [user?.email]);

  useEffect(() => {
    checkSubscription();

    // Check periodically (every 5 seconds) to catch trial expiration in real-time
    const interval = setInterval(() => {
      checkSubscription();
    }, 5000);

    return () => clearInterval(interval);
  }, [checkSubscription]);

  const handleCloseModal = async () => {
    setShowModal(false);
    await markTrialExpiredNotified(user?.email);
    await checkSubscription();
  };

  const handleViewPlans = async () => {
    setShowModal(false);
    await markTrialExpiredNotified(user?.email);
    await checkSubscription();
    router.push('/subscriptions/subscriptions');
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        refreshSubscription: checkSubscription,
      }}
    >
      {children}
      <TrialExpiredModal
        visible={showModal}
        onClose={handleCloseModal}
        onViewPlans={handleViewPlans}
      />
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => useContext(SubscriptionContext);
