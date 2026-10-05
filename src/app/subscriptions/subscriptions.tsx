import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Pressable,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import {
  X,
  Sparkles,
  Camera,
  Calendar,
  BarChart2,
  Check,
} from 'lucide-react-native';

export default function SubscriptionsScreen() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<'yearly' | 'monthly'>('yearly');

  const handleClose = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/today');
    }
  };

  const handleStartTrial = () => {
    // Action for subscribing / trial start
    handleClose();
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
          <X size={20} color="#0F172A" strokeWidth={2.5} />
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

            <Text style={styles.planPrice}>$29.99</Text>
            <Text style={styles.planSubtext}>$2.50 / month</Text>
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

              {/* Radio Indicator */}
              <View
                style={[
                  styles.radioOuter,
                  selectedPlan === 'monthly' && styles.radioOuterSelected,
                ]}
              >
                {selectedPlan === 'monthly' && (
                  <View style={styles.radioInner} />
                )}
              </View>
            </View>

            <Text style={styles.planPrice}>$4.99</Text>
            <Text style={styles.planSubtext}>per month</Text>
          </Pressable>
        </View>

        {/* CTA Button */}
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={handleStartTrial}
          activeOpacity={0.88}
        >
          <Text style={styles.ctaButtonText}>Start 7-day free trial</Text>
        </TouchableOpacity>

        {/* Footer Notes */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            {selectedPlan === 'yearly'
              ? 'Then $29.99 / year. Cancel anytime.'
              : 'Then $4.99 / month. Cancel anytime.'}
          </Text>
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
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: '#17A558',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
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
  ctaButton: {
    backgroundColor: '#17A558',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
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
