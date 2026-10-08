import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,

  Sparkles,
  Camera,
  Calendar,
  BarChart2,
  Check,
} from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import {
  getSubscriptionData,
  saveSubscriptionData,
  PlanType,
} from '../../lib/subscriptionStorage';

export default function SubscriptionsScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [hasUsedTrial, setHasUsedTrial] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<'yearly' | 'monthly' | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    getSubscriptionData(user?.email).then((data) => {
      if (isMounted) {
        setHasUsedTrial(data.hasUsedTrial);
        // No pre-selected plan by default
        setSelectedPlan(null);
        setIsLoaded(true);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [user?.email]);

  const handleClose = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/today');
    }
  };

  const handleStartTrial = async () => {
    try {
      await saveSubscriptionData(
        {
          planType: 'trial',
          hasUsedTrial: true,
          subscriptionCreatedAt: new Date().toISOString(),
        },
        user?.email
      );
      setHasUsedTrial(true);

      Alert.alert(
        'Trial Started!',
        'Your 7-day free trial has officially begun.',
        [{ text: 'Great!', onPress: handleClose }]
      );
    } catch (err) {
      console.error('Failed to start trial:', err);
      Alert.alert('Error', 'Could not start your free trial. Please try again.');
    }
  };

  const handleProceedToPayment = () => {
    if (!selectedPlan) return;
    router.push({
      pathname: '/subscriptions/reviewSubscriptionDetail' as any,
      params: { plan: selectedPlan },
    });
  };

  // Dynamic footer message logic based on user state & selected plan
  const getFooterText = () => {
    if (selectedPlan === 'yearly') {
      return 'Billed annually at $29.99/yr. Cancel anytime.';
    }
    if (selectedPlan === 'monthly') {
      return 'Billed monthly at $4.99/mo. Cancel anytime.';
    }
    return !hasUsedTrial
      ? '7 days free, then choose a plan. Cancel anytime.'
      : 'Choose a plan above to continue.';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Top Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleClose}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft size={20} color="#0F172A" strokeWidth={2.5} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            // Restore purchases action
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.restoreText}>Restore</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* KALO PLUS Gold Badge */}
        <View style={styles.goldBadge}>
          <Sparkles size={13} color="#000000" fill="#000000" />
          <Text style={styles.goldBadgeText}>KALO PLUS</Text>
        </View>

        {/* Headline */}
        <Text style={styles.headline}>
          Unlimited{'\n'}meal photos.
        </Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          You’ve used today’s 3 free photos.
        </Text>

        {/* Feature List */}
        <View style={styles.featureList}>
          {/* Feature 1 */}
          <View style={styles.featureItem}>
            <View style={styles.iconContainer}>
              <Camera size={22} color="#17A558" strokeWidth={2} />
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Unlimited photos</Text>
              <Text style={styles.featureSubtitle}>
                Every meal, snack and drink
              </Text>
            </View>
          </View>

          {/* Feature 2 */}
          <View style={styles.featureItem}>
            <View style={styles.iconContainer}>
              <Calendar size={22} color="#17A558" strokeWidth={2} />
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Full history</Text>
              <Text style={styles.featureSubtitle}>
                Free keeps the last 7 days
              </Text>
            </View>
          </View>

          {/* Feature 3 */}
          <View style={styles.featureItem}>
            <View style={styles.iconContainer}>
              <BarChart2 size={22} color="#17A558" strokeWidth={2} />
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>Weekly report</Text>
              <Text style={styles.featureSubtitle}>
                Your average, best day and trend
              </Text>
            </View>
          </View>
        </View>

        {/* Subscription Plan Cards */}
        <View style={styles.plansRow}>
          {/* Yearly Plan (Save 50%) */}
          <Pressable
            style={[
              styles.planCard,
              selectedPlan === 'yearly' && styles.selectedPlanCard,
            ]}
            onPress={() => setSelectedPlan('yearly')}
          >
            <View style={styles.planCardHeader}>
              <Text
                style={[
                  styles.planTitle,
                  selectedPlan === 'yearly' && styles.selectedPlanTitle,
                ]}
              >
                Yearly
              </Text>
              <View style={styles.saveBadge}>
                <Text style={styles.saveBadgeText}>SAVE 50%</Text>
              </View>
            </View>

            <View style={styles.cardBottomRow}>
              <View>
                <Text style={styles.planPrice}>$29.99</Text>
                <Text style={styles.planSubtext}>$2.50 / month</Text>
              </View>

              <View
                style={[
                  styles.radioOuter,
                  selectedPlan === 'yearly' && styles.radioOuterSelected,
                ]}
              >
                {selectedPlan === 'yearly' && (
                  <Check size={12} color="#FFFFFF" strokeWidth={3} />
                )}
              </View>
            </View>
          </Pressable>

          {/* Monthly Plan */}
          <Pressable
            style={[
              styles.planCard,
              selectedPlan === 'monthly' && styles.selectedPlanCard,
            ]}
            onPress={() => setSelectedPlan('monthly')}
          >
            <View style={styles.planCardHeader}>
              <Text
                style={[
                  styles.planTitle,
                  selectedPlan === 'monthly' && styles.selectedPlanTitle,
                ]}
              >
                Monthly
              </Text>

              <View
                style={[
                  styles.radioOuter,
                  selectedPlan === 'monthly' && styles.radioOuterSelected,
                ]}
              >
                {selectedPlan === 'monthly' && (
                  <Check size={12} color="#FFFFFF" strokeWidth={3} />
                )}
              </View>
            </View>

            <Text style={styles.planPrice}>$4.99</Text>
            <Text style={styles.planSubtext}>per month</Text>
          </Pressable>
        </View>

        {/* CTA Container with Constant Height */}
        <View style={styles.ctaContainer}>
          {selectedPlan !== null ? (
            /* When user selects any plan card, button becomes 'Proceed to Payment' */
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={handleProceedToPayment}
              activeOpacity={0.88}
            >
              <Text style={styles.ctaButtonText}>Proceed to Payment</Text>
            </TouchableOpacity>
          ) : !hasUsedTrial ? (
            /* Initial state for new user: 'Start 7-day free trial' button */
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={handleStartTrial}
              activeOpacity={0.88}
            >
              <Text style={styles.ctaButtonText}>Start 7-day free trial</Text>
            </TouchableOpacity>
          ) : (
            /* When trial already used and no plan card selected */
            <View style={styles.ctaDisabledBox}>
              <Text style={styles.ctaDisabledText}>
                Select subscription plan of your choice
              </Text>
            </View>
          )}
        </View>

        {/* Footer Notes */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>{getFooterText()}</Text>
          <Text style={styles.footerText}>
            3 photos a day stay free. No ads, ever.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F2',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  restoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  goldBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FACC15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    marginBottom: 16,
  },
  goldBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: 0.5,
  },
  headline: {
    fontSize: 34,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 40,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 28,
  },
  featureList: {
    gap: 20,
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#E6F4EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  featureSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#64748B',
  },
  plansRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  planCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    minHeight: 110,
    justifyContent: 'space-between',
  },
  selectedPlanCard: {
    backgroundColor: '#E6F4EA',
    borderColor: '#17A558',
    borderWidth: 2,
  },
  planCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  planTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#64748B',
  },
  selectedPlanTitle: {
    color: '#166534',
    fontWeight: '800',
  },
  saveBadge: {
    backgroundColor: '#17A558',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  saveBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: '#17A558',
    backgroundColor: '#17A558',
  },
  planPrice: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  planSubtext: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  ctaContainer: {
    height: 56,
    marginBottom: 16,
    justifyContent: 'center',
  },
  ctaButton: {
    backgroundColor: '#17A558',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#17A558',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  ctaDisabledBox: {
    backgroundColor: '#E2E8F0',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  ctaDisabledText: {
    color: '#64748B',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  footerContainer: {
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 13,
    fontWeight: '400',
    color: '#64748B',
    textAlign: 'center',
  },
});
