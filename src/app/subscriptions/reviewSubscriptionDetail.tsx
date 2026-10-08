import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, CheckCircle2, ShieldCheck, CreditCard } from 'lucide-react-native';
import { useStripe } from '@stripe/stripe-react-native';
import { useAuth } from '../../context/AuthContext';
import { saveSubscriptionData, PlanType } from '../../lib/subscriptionStorage';

export default function ReviewSubscriptionDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ plan?: string }>();
  const { user } = useAuth();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const selectedPlan: PlanType = params.plan === 'yearly' ? 'yearly' : 'monthly';
  const planTitle = selectedPlan === 'yearly' ? 'KALO PLUS - Yearly' : 'KALO PLUS - Monthly';
  const planPrice = selectedPlan === 'yearly' ? '$29.99 / year' : '$4.99 / month';
  const priceDetail = selectedPlan === 'yearly' ? '$29.99 billed annually' : '$4.99 billed monthly';
  const planAmountNumber = selectedPlan === 'yearly' ? 29.99 : 4.99;

  // Helper to create PaymentIntent with Stripe API
  const createPaymentIntent = async (amount: number) => {
    const secretKey =
      process.env.EXPO_PUBLIC_STRIPE_SECRET_KEY ||
      process.env.STRIPE_SECRET_KEY ||
      '';

    const response = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        amount: Math.round(amount * 100).toString(),
        currency: 'usd',
        'payment_method_types[]': 'card',
        ...(user?.email ? { receipt_email: user.email } : {}),
      }).toString(),
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error.message);
    }
    return data.client_secret;
  };


  const handleConfirmPayment = async () => {
    setLoading(true);
    try {
      // 1. Generate client secret from Stripe
      const clientSecret = await createPaymentIntent(planAmountNumber);

      // 2. Initialize native Stripe Payment Sheet
      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: 'KALO PLUS',
        defaultBillingDetails: {
          email: user?.email ?? '',
        },
      });

      if (initError) {
        Alert.alert('Payment Setup Error', initError.message);
        setLoading(false);
        return;
      }

      // 3. Present Stripe Payment Sheet UI to user
      const { error: paymentError } = await presentPaymentSheet();

      if (paymentError) {
        if (paymentError.code !== 'Canceled') {
          Alert.alert('Payment Failed', paymentError.message);
        }
        setLoading(false);
        return;
      }

      // 4. Payment Succeeded -> Activate subscription in Supabase & AsyncStorage
      await saveSubscriptionData(
        {
          planType: selectedPlan,
          hasUsedTrial: true,
          subscriptionCreatedAt: new Date().toISOString(),
        },
        user?.email
      );

      Alert.alert(
        'Subscription Activated!',
        `Your ${selectedPlan === 'yearly' ? 'Yearly' : 'Monthly'} plan is now active. Enjoy unlimited meal photos!`,
        [
          {
            text: 'Get Started',
            onPress: () => {
              router.replace('/today');
            },
          },
        ]
      );
    } catch (err: any) {
      console.error('Stripe Payment processing failed:', err);
      Alert.alert('Payment Error', err?.message || 'Failed to process subscription payment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Review Plan</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Order Summary Card */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Order Summary</Text>

          <View style={styles.summaryRow}>
            <View>
              <Text style={styles.planName}>{planTitle}</Text>
              <Text style={styles.planSubtext}>{priceDetail}</Text>
            </View>
          </View>

          {user?.email ? (
            <View style={styles.accountRow}>
              <Text style={styles.accountLabel}>Account:</Text>
              <Text style={styles.accountEmail}>{user.email}</Text>
            </View>
          ) : null}
        </View>

        {/* Benefits List */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Included with KALO PLUS</Text>

          <View style={styles.benefitItem}>
            <CheckCircle2 size={18} color="#17A558" />
            <Text style={styles.benefitText}>Unlimited meal, snack & drink photo tracking</Text>
          </View>

          <View style={styles.benefitItem}>
            <CheckCircle2 size={18} color="#17A558" />
            <Text style={styles.benefitText}>Full history & weekly trend analytics</Text>
          </View>

          <View style={styles.benefitItem}>
            <CheckCircle2 size={18} color="#17A558" />
            <Text style={styles.benefitText}>No ads, ever</Text>
          </View>
        </View>

        {/* Payment Guarantee Notice */}
        <View style={styles.guaranteeBox}>
          <ShieldCheck size={22} color="#17A558" />
          <Text style={styles.guaranteeText}>
            Stripe secure transaction. You can cancel anytime from your settings.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.payButton}
          onPress={handleConfirmPayment}
          disabled={loading}
          activeOpacity={0.88}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <View style={styles.payButtonContent}>
              <CreditCard size={20} color="#FFFFFF" />
              <Text style={styles.payButtonText}>Pay {planPrice.split(' ')[0]} with Stripe</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
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
    paddingBottom: 12,
  },
  backButton: {
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  planName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  planSubtext: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  accountLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  accountEmail: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },
  guaranteeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F4EA',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  guaranteeText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: '#166534',
    lineHeight: 18,
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  payButton: {
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
  payButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
});
