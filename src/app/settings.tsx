import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { 
  ChevronLeft, 
  Sparkles, 
  Target, 
  User, 
  Cloud, 
  HelpCircle, 
  ShieldCheck, 
  LogOut,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { getSubscriptionData } from '../lib/subscriptionStorage';
import { getUserProfile, UserProfileData, DEFAULT_USER_PROFILE } from '../lib/userProfile';

export default function SettingsScreen() {
  const router = useRouter();
  const { signOut, user } = useAuth();

  // Subscription state
  const [hasUsedTrial, setHasUsedTrial] = useState<boolean>(false);
  const [planType, setPlanType] = useState<string>('none');
  const [userProfile, setUserProfile] = useState<UserProfileData>(DEFAULT_USER_PROFILE);
  const [backupData, setBackupData] = useState(false);

  // Reload profile & subscription whenever screen is focused
  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      getSubscriptionData(user?.email).then((data) => {
        if (isMounted) {
          setHasUsedTrial(data.hasUsedTrial);
          setPlanType(data.planType);
        }
      });

      getUserProfile(user?.email).then((prof) => {
        if (isMounted) {
          setUserProfile(prof);
        }
      });

      return () => {
        isMounted = false;
      };
    }, [user?.email])
  );

  // Helper to determine active subscription indicator metadata
  const getSubInfo = () => {
    if (planType === 'trial') {
      return {
        title: '7-Day Free Trial',
        subtitle: 'Full access to unlimited meal photos',
        badge: 'ACTIVE TRIAL',
        isPro: true,
      };
    }
    if (planType === 'monthly') {
      return {
        title: 'KALO PLUS - Monthly',
        subtitle: '$4.99 / month · Billed monthly',
        badge: 'ACTIVE',
        isPro: true,
      };
    }
    if (planType === 'yearly') {
      return {
        title: 'KALO PLUS - Yearly',
        subtitle: '$29.99 / year · Billed annually',
        badge: 'ACTIVE',
        isPro: true,
      };
    }
    return {
      title: 'Free Plan',
      subtitle: hasUsedTrial ? '3 free meal photos per day (Trial used)' : '3 free meal photos per day',
      badge: 'FREE PLAN',
      isPro: false,
    };
  };

  const subInfo = getSubInfo();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header Bar */}
      <View style={styles.headerRow}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ChevronLeft size={22} color="#0F172A" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Settings</Text>

        <View style={{ width: 44 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Active Subscription Indicator Banner */}
        <TouchableOpacity
          style={[
            styles.activeSubCard,
            subInfo.isPro ? styles.activeSubCardPro : styles.activeSubCardFree,
          ]}
          activeOpacity={0.85}
          onPress={() => router.push('/subscriptions/subscriptions')}
        >
          <View style={styles.subCardLeft}>
            <View style={[styles.subIconBadge, subInfo.isPro ? styles.subIconBadgePro : styles.subIconBadgeFree]}>
              <Sparkles size={22} color={subInfo.isPro ? '#17A558' : '#64748B'} fill={subInfo.isPro ? '#17A558' : 'none'} />
            </View>
            <View style={styles.subTextGroup}>
              <Text style={[styles.subTitleText, subInfo.isPro ? styles.subTitleTextPro : styles.subTitleTextFree]}>
                {subInfo.title}
              </Text>
              <Text style={styles.subSubtitleText}>{subInfo.subtitle}</Text>
            </View>
          </View>

          <View style={[styles.statusBadgePill, subInfo.isPro ? styles.statusBadgePro : styles.statusBadgeFree]}>
            {subInfo.isPro && <CheckCircle2 size={12} color="#FFFFFF" style={{ marginRight: 4 }} />}
            <Text style={[styles.statusBadgeText, subInfo.isPro ? styles.statusBadgeTextPro : styles.statusBadgeTextFree]}>
              {subInfo.badge}
            </Text>
          </View>
        </TouchableOpacity>


        {/* First Settings Group (Goals & Preferences) */}
        <View style={styles.sectionCard}>
          {/* Profile Details (Opens ProfileDetails Screen) */}
          <TouchableOpacity 
            style={styles.settingRow} 
            onPress={() => router.push('/profileDetails')} 
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <User size={20} color="#0F172A" />
              <Text style={styles.settingLabel}>Profile Details</Text>
            </View>
            <View style={styles.settingRight}>
              <ChevronRight size={18} color="#94A3B8" />
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Set up a new plan (Opens About Screen) */}
          <TouchableOpacity 
            style={styles.settingRow} 
            onPress={() => router.push('/about')} 
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <Target size={20} color="#0F172A" />
              <Text style={styles.settingLabel}>Set up a new plan</Text>
            </View>
            <View style={styles.settingRight}>
              <ChevronRight size={18} color="#94A3B8" />
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Back Up My Data (Toggle Switch) */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Cloud size={20} color="#0F172A" />
              <Text style={styles.settingLabel}>Back up my data</Text>
            </View>
            <View style={styles.settingRight}>
              <Text style={styles.settingValue}>{backupData ? 'On' : 'Off'}</Text>
              <Switch
                value={backupData}
                onValueChange={setBackupData}
                trackColor={{ false: '#E2E8F0', true: '#17A558' }}
                thumbColor="#FFFFFF"
                style={styles.switchControl}
              />
            </View>
          </View>
        </View>

        {/* Second Settings Group (Help & Privacy) */}
        <View style={styles.sectionCard}>
          {/* Help & Feedback */}
          <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <HelpCircle size={20} color="#0F172A" />
              <Text style={styles.settingLabel}>Help & feedback</Text>
            </View>
            <View style={styles.settingRight}>
              <ChevronRight size={18} color="#94A3B8" />
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Privacy */}
          <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <ShieldCheck size={20} color="#0F172A" />
              <Text style={styles.settingLabel}>Privacy</Text>
            </View>
            <View style={styles.settingRight}>
              <ChevronRight size={18} color="#94A3B8" />
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Sign Out Button */}
          <TouchableOpacity 
            style={styles.settingRow} 
            activeOpacity={0.7}
            onPress={async () => {
              await signOut();
              router.replace('/auth/LoginScreen');
            }}
          >
            <View style={styles.settingLeft}>
              <LogOut size={20} color="#EF4444" />
              <Text style={[styles.settingLabel, { color: '#EF4444' }]}>Sign out</Text>
            </View>
          </TouchableOpacity>
        </View>



        {/* Footer Info Note */}
        <Text style={styles.footerNote}>
          Meal photos are analysed by AI to estimate calories.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F2',
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  activeSubCard: {
    borderRadius: 24,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  activeSubCardPro: {
    backgroundColor: '#121C16',
  },
  activeSubCardFree: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  subCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  subIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subIconBadgePro: {
    backgroundColor: 'rgba(23, 165, 88, 0.15)',
  },
  subIconBadgeFree: {
    backgroundColor: '#F1F5F9',
  },
  subTextGroup: {
    justifyContent: 'center',
    flex: 1,
  },
  subTitleText: {
    fontSize: 16,
    fontWeight: '700',
  },
  subTitleTextPro: {
    color: '#FFFFFF',
  },
  subTitleTextFree: {
    color: '#0F172A',
  },
  subSubtitleText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '400',
    marginTop: 2,
  },
  statusBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusBadgePro: {
    backgroundColor: '#17A558',
  },
  statusBadgeFree: {
    backgroundColor: '#F1F5F9',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  statusBadgeTextPro: {
    color: '#FFFFFF',
  },
  statusBadgeTextFree: {
    color: '#64748B',
  },
  kaloPlusCard: {
    backgroundColor: '#121C16',
    borderRadius: 24,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  kaloPlusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  starBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  kaloPlusTextGroup: {
    justifyContent: 'center',
  },
  kaloPlusTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  kaloPlusSubtitle: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '400',
    marginTop: 2,
  },
  tryFreeButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
  },
  tryFreeText: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '700',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 4,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#64748B',
  },
  switchControl: {
    transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }],
    marginLeft: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    width: '100%',
  },
  footerNote: {
    fontSize: 13,
    fontWeight: '400',
    color: '#94A3B8',
    marginTop: 2,
    paddingHorizontal: 4,
  },
});
