import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import {
  generateRandomCalorieGoal,
  getUserProfile,
  saveUserProfile,
  UserProfileData,
} from '../lib/userProfile';

export default function YourPlanScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [remindMeals, setRemindMeals] = useState(true);
  const [profile, setProfile] = useState<UserProfileData | null>(null);

  useEffect(() => {
    let isMounted = true;
    const initPlan = async () => {
      // 1. Generate new random calorie goal (2500 - 3000 kcal)
      const randomKcal = generateRandomCalorieGoal();
      
      // 2. Save updated calorie goal to profile
      const updated = await saveUserProfile(randomKcal, user?.email);
      if (isMounted) {
        setProfile(updated);
      }
    };

    initPlan();
    return () => {
      isMounted = false;
    };
  }, [user?.email]);

  const handleLetsGo = () => {
    // Navigate to Main Dashboard screen
    router.push('/today');
  };

  const calorieGoalText = profile?.calorieGoal
    ? profile.calorieGoal.toLocaleString()
    : '2,650';
  const carbsText = profile?.carbsGoal ? `${profile.carbsGoal} g` : '298 g';
  const proteinText = profile?.proteinGoal ? `${profile.proteinGoal} g` : '166 g';
  const fatText = profile?.fatGoal ? `${profile.fatGoal} g` : '88 g';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Top Bar: Back Button & Step Progress */}
      <View style={styles.topBar}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>

        {/* Step 2 Progress (Both Green) */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressSegment, styles.progressActive]} />
          <View style={[styles.progressSegment, styles.progressActive]} />
        </View>

        {/* Empty placeholder for balance */}
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title & Subtitle */}
        <Text style={styles.title}>Your plan is ready</Text>
        <Text style={styles.subtitle}>
          Worked out from your details. You never have to count anything.
        </Text>

        {/* Daily Goal Card */}
        <View style={styles.goalCard}>
          <Text style={styles.goalCategory}>DAILY GOAL</Text>
          
          <View style={styles.kcalRow}>
            <Text style={styles.kcalNumber}>{calorieGoalText}</Text>
            <Text style={styles.kcalUnit}> kcal</Text>
          </View>

          {/* Macro Breakdown Cards */}
          <View style={styles.macroRow}>
            {/* Carbs */}
            <View style={[styles.macroCard, { backgroundColor: '#FEF3C7' }]}>
              <View style={styles.macroHeader}>
                <View style={[styles.dot, { backgroundColor: '#F59E0B' }]} />
                <Text style={styles.macroLabel}>Carbs</Text>
              </View>
              <Text style={styles.macroValue}>{carbsText}</Text>
            </View>

            {/* Protein */}
            <View style={[styles.macroCard, { backgroundColor: '#EFF6FF' }]}>
              <View style={styles.macroHeader}>
                <View style={[styles.dot, { backgroundColor: '#3B82F6' }]} />
                <Text style={styles.macroLabel}>Protein</Text>
              </View>
              <Text style={styles.macroValue}>{proteinText}</Text>
            </View>

            {/* Fat */}
            <View style={[styles.macroCard, { backgroundColor: '#F3E8FF' }]}>
              <View style={styles.macroHeader}>
                <View style={[styles.dot, { backgroundColor: '#A855F7' }]} />
                <Text style={styles.macroLabel}>Fat</Text>
              </View>
              <Text style={styles.macroValue}>{fatText}</Text>
            </View>
          </View>

          {/* Target Weight Loss Pill Badge */}
          <View style={styles.targetBadge}>
            <Text style={styles.targetIcon}>🎯</Text>
            <Text style={styles.targetText}>
              Set to {profile?.goal ? profile.goal.toLowerCase() : 'lose'} weight
            </Text>
          </View>
        </View>


        {/* Notification Settings Card */}
        <View style={styles.reminderCard}>
          <View style={styles.reminderLeft}>
            <Text style={styles.bellIcon}>🔔</Text>
            <View>
              <Text style={styles.reminderTitle}>Remind me to snap meals</Text>
              <Text style={styles.reminderTime}>8:00 · 13:00 · 19:00</Text>
            </View>
          </View>

          <Switch
            value={remindMeals}
            onValueChange={setRemindMeals}
            trackColor={{ false: '#E2E8F0', true: '#17A558' }}
            thumbColor="#FFFFFF"
          />
        </View>
      </ScrollView>

      {/* Bottom Action Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.button} 
          activeOpacity={0.85}
          onPress={handleLetsGo}
        >
          <Text style={styles.buttonText}>Let’s go</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F2',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  backArrow: {
    fontSize: 26,
    color: '#0F172A',
    marginTop: -2,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  progressSegment: {
    height: 6,
    borderRadius: 3,
    width: 44,
  },
  progressActive: {
    backgroundColor: '#17A558',
  },
  scrollContent: {
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '400',
    color: '#64748B',
    lineHeight: 22,
    marginBottom: 24,
  },
  goalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
  },
  goalCategory: {
    fontSize: 12,
    fontWeight: '800',
    color: '#17A558',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  kcalRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  kcalNumber: {
    fontSize: 48,
    fontWeight: '800',
    color: '#0F172A',
  },
  kcalUnit: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748B',
  },
  macroRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  macroCard: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
  },
  macroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  macroLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  macroValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  targetBadge: {
    backgroundColor: '#E6F4EA',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  targetIcon: {
    fontSize: 16,
  },
  targetText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#15803D',
  },
  reminderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reminderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bellIcon: {
    fontSize: 22,
  },
  reminderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  reminderTime: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  bottomContainer: {
    paddingBottom: 20,
  },
  button: {
    backgroundColor: '#17A558',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
