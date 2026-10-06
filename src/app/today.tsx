import { Image as ExpoImage } from 'expo-image';
import { useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Camera, Flame, SlidersHorizontal } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { Image as RNImage, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, G } from 'react-native-svg';
import { useMeals } from '../context/MealContext';
import { useAuth } from '../context/AuthContext';
import { getSubscriptionData } from '../lib/subscriptionStorage';

export default function TodayScreen() {
  const router = useRouter();
  const segments = useSegments();
  const { meals } = useMeals();
  const { user } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

  // Check subscription status whenever screen is viewed
  useEffect(() => {
    let isMounted = true;
    getSubscriptionData(user?.email).then((data) => {
      if (isMounted) {
        setIsSubscribed(data.planType !== 'none');
      }
    });
    return () => {
      isMounted = false;
    };
  }, [user?.email, segments]);

  // Dynamic current date calculations
  const today = useMemo(() => new Date(), []);

  const currentScreen = () => {
    console.log('Current Screen Segments:', segments);
  };

  const headerSubtitle = useMemo(() => {
    const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const dayOfWeek = DAYS[today.getDay()];
    const dateNum = today.getDate();
    const monthStr = MONTHS[today.getMonth()];

    return `${dayOfWeek}, ${dateNum} ${monthStr}`;
  }, [today]);

  // Dynamic 7-day week strip (Monday to Sunday)
  const weekDays = useMemo(() => {
    const currentDay = today.getDay(); // 0 = Sun, 1 = Mon...
    const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;

    const monday = new Date(today);
    monday.setDate(today.getDate() + distanceToMonday);

    const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return {
        day: DAY_LETTERS[i],
        date: d.getDate(),
        fullDate: d,
        isToday: d.toDateString() === today.toDateString(),
      };
    });
  }, [today]);
  // Goals
  const calorieGoal = 2000;
  const carbsGoal = 225;
  const proteinGoal = 125;
  const fatGoal = 67;

  // Calculate dynamic totals from logged meals
  const totalEaten = meals.reduce((sum, m) => sum + m.totalKcal, 0);
  const totalCarbs = meals.reduce((sum, m) => sum + m.carbsGrams, 0);
  const totalProtein = meals.reduce((sum, m) => sum + m.proteinGrams, 0);
  const totalFat = meals.reduce((sum, m) => sum + m.fatGrams, 0);

  const kcalLeft = Math.max(0, calorieGoal - totalEaten);
  const progressRatio = Math.min(1, totalEaten / calorieGoal);

  // SVG ring stroke math
  const radius = 46;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progressRatio);

  const handleSnapMeal = async () => {
    const subData = await getSubscriptionData(user?.email);
    const activeSub = subData.planType !== 'none';
    if (!activeSub && meals.length >= 3) {
      router.push('/subscriptions/subscriptions');
    } else {
      router.push('/camera');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Main Scroll Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Header: Title & Action Icons */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Welcome {user?.user_metadata.fullname}</Text>
            <Text style={styles.headerSubtitle}>{headerSubtitle}</Text>
          </View>

          <View style={styles.headerActions}>
            {/* Streak Badge */}
            <View style={styles.streakBadge}>
              <Flame size={15} color="#F59E0B" fill="#F59E0B" />
              <Text style={styles.streakNumber}>{meals.length > 0 ? 12 : 1}</Text>
            </View>

            {/* Filter / Sliders Button -> Opens Settings */}
            <TouchableOpacity
              style={styles.iconButton}
              activeOpacity={0.7}
              onPress={() => router.push('/settings' as any)}
            >
              <SlidersHorizontal size={18} color="#0F172A" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Static Non-Interactive 7-Day Week Strip */}
        <View style={styles.weekStrip}>
          {weekDays.map((item, index) => (
            <View key={index} style={styles.dayColumn}>
              <Text style={[styles.dayLetter, item.isToday && styles.dayLetterActive]}>
                {item.day}
              </Text>
              <View style={[styles.dateCircle, item.isToday && styles.dateCircleActive]}>
                <Text style={[styles.dateText, item.isToday && styles.dateTextActive]}>
                  {item.date}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Calorie & Macro Summary Card */}
        <View style={styles.summaryCard}>
          {/* Circular Calorie Progress Indicator */}
          <View style={styles.calorieRingContainer}>
            <Svg width={112} height={112} viewBox="0 0 112 112">
              <G rotation="-90" origin="56, 56">
                <Circle
                  cx="56"
                  cy="56"
                  r={radius}
                  stroke="#ECE7DB"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                />
                <Circle
                  cx="56"
                  cy="56"
                  r={radius}
                  stroke="#17A558"
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${circumference}`}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </G>
            </Svg>
            <View style={styles.calorieRingTextOverlay}>
              <Text style={styles.calorieValue}>{kcalLeft.toLocaleString()}</Text>
              <Text style={styles.calorieLabel}>kcal left</Text>
            </View>
          </View>

          {/* Macro Breakdown Lines */}
          <View style={styles.macroColumn}>
            {/* Carbs */}
            <View style={styles.macroItem}>
              <View style={styles.macroHeader}>
                <Text style={styles.macroName}>Carbs</Text>
                <Text style={styles.macroProgressText}>{totalCarbs} / {carbsGoal} g</Text>
              </View>
              <View style={styles.trackBar}>
                <View
                  style={[
                    styles.fillBar,
                    {
                      width: `${Math.min(100, (totalCarbs / carbsGoal) * 100)}%`,
                      backgroundColor: '#F59E0B',
                    }
                  ]}
                />
              </View>
            </View>

            {/* Protein */}
            <View style={styles.macroItem}>
              <View style={styles.macroHeader}>
                <Text style={styles.macroName}>Protein</Text>
                <Text style={styles.macroProgressText}>{totalProtein} / {proteinGoal} g</Text>
              </View>
              <View style={styles.trackBar}>
                <View
                  style={[
                    styles.fillBar,
                    {
                      width: `${Math.min(100, (totalProtein / proteinGoal) * 100)}%`,
                      backgroundColor: '#3B82F6',
                    }
                  ]}
                />
              </View>
            </View>

            {/* Fat */}
            <View style={styles.macroItem}>
              <View style={styles.macroHeader}>
                <Text style={styles.macroName}>Fat</Text>
                <Text style={styles.macroProgressText}>{totalFat} / {fatGoal} g</Text>
              </View>
              <View style={styles.trackBar}>
                <View
                  style={[
                    styles.fillBar,
                    {
                      width: `${Math.min(100, (totalFat / fatGoal) * 100)}%`,
                      backgroundColor: '#A855F7',
                    }
                  ]}
                />
              </View>
            </View>

            {/* Total Eaten / Goal Footer */}
            <Text style={styles.macroFooterText}>
              {totalEaten.toLocaleString()} eaten · goal {calorieGoal.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Logged Meals List / Empty State */}
        {meals.length > 0 ? (
          <View style={styles.mealsListSection}>
            {meals.map((meal) => (
              <View key={meal.id} style={styles.mealCard}>
                {/* Left Food Thumbnail */}
                <View style={styles.mealThumbnailContainer}>
                  {meal.imageUri ? (
                    <ExpoImage
                      source={{ uri: meal.imageUri }}
                      style={StyleSheet.absoluteFill}
                      contentFit="cover"
                    />
                  ) : (
                    <View style={styles.miniPlateOuter}>
                      <View style={styles.miniPlateInner}>
                        {/* Mini Salad */}
                        <View style={styles.miniSaladBall}>
                          <RNImage
                            source={require('../../assets/images/Vector.png')}
                            style={styles.miniSaladImage}
                            resizeMode="contain"
                          />
                        </View>
                        {/* Mini Chicken */}
                        <View style={styles.miniChickenPiece}>
                          <RNImage
                            source={require('../../assets/images/Vector (2).png')}
                            style={styles.miniChickenImage}
                            resizeMode="contain"
                          />
                        </View>
                        {/* Mini Rice */}
                        <RNImage
                          source={require('../../assets/images/Vector (4).png')}
                          style={styles.miniRiceMound}
                          resizeMode="contain"
                        />
                      </View>
                    </View>
                  )}
                </View>

                {/* Middle Title & Subtitle */}
                <View style={styles.mealContent}>
                  <Text style={styles.mealTitle} numberOfLines={1}>{meal.title}</Text>
                  <Text style={styles.mealSubtitle}>{meal.timeString}</Text>
                </View>

                {/* Right Calories */}
                <View style={styles.mealKcalContainer}>
                  <Text style={styles.mealKcalValue}>{meal.totalKcal}</Text>
                  <Text style={styles.mealKcalUnit}>kcal</Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyStateContainer}>
            {/* Empty State Banner */}
            <View style={styles.cameraIconBadge}>
              <Camera size={32} color="#17A558" />
            </View>

            <Text style={styles.emptyStateTitle}>No meals yet</Text>
            <Text style={styles.emptyStateDescription}>
              Take a photo of whatever you’re about to eat. Kalo works out the rest.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Action Area */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.snapButton}
          activeOpacity={0.85}
          onPress={() => {
            handleSnapMeal();
            currentScreen();
          }}
        >
          <Camera size={22} color="#FFFFFF" />
          <Text style={styles.snapButtonText}>Snap a meal</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            currentScreen();
            if (!isSubscribed && meals.length >= 3) {
              router.push('/subscriptions/subscriptions');
            }
          }}
          activeOpacity={!isSubscribed && meals.length >= 3 ? 0.7 : 1}
        >
          <Text
            style={[
              styles.freePhotosText,
              !isSubscribed && meals.length >= 3 && styles.freePhotosTextUnlimited,
            ]}
          >
            {isSubscribed
              ? 'Unlimited photos active'
              : meals.length >= 3
              ? 'No photos left today · Go unlimited'
              : `${3 - meals.length} free photo${3 - meals.length === 1 ? '' : 's'} left today`}
          </Text>
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
  scrollContent: {
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  streakNumber: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  iconButton: {
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
  weekStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  dayColumn: {
    alignItems: 'center',
    flex: 1,
  },
  dayLetter: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 6,
  },
  dayLetterActive: {
    color: '#17A558',
  },
  dateCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateCircleActive: {
    backgroundColor: '#17A558',
    borderColor: '#17A558',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  dateTextActive: {
    color: '#FFFFFF',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  calorieRingContainer: {
    width: 112,
    height: 112,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calorieRingTextOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calorieValue: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  calorieLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 1,
  },
  macroColumn: {
    flex: 1,
    paddingLeft: 16,
    gap: 10,
  },
  macroItem: {
    width: '100%',
  },
  macroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  macroName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  macroProgressText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  trackBar: {
    height: 7,
    backgroundColor: '#E2E8F0',
    borderRadius: 3.5,
    overflow: 'hidden',
  },
  fillBar: {
    height: '100%',
    borderRadius: 3.5,
  },
  macroFooterText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  mealsListSection: {
    gap: 12,
    marginBottom: 16,
  },
  mealCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  mealThumbnailContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#3A2F26',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniPlateOuter: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ECE7DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniPlateInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFDF9',
    position: 'relative',
  },
  miniSaladBall: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: 16,
    height: 16,
  },
  miniSaladImage: {
    width: '100%',
    height: '100%',
  },
  miniChickenPiece: {
    position: 'absolute',
    top: 6,
    right: 3,
    width: 14,
    height: 10,
  },
  miniChickenImage: {
    width: '100%',
    height: '100%',
  },
  miniRiceMound: {
    position: 'absolute',
    bottom: 4,
    left: 8,
    width: 20,
    height: 12,
  },
  mealContent: {
    flex: 1,
    marginLeft: 14,
    marginRight: 8,
  },
  mealTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  mealSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 4,
  },
  mealKcalContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 3,
  },
  mealKcalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  mealKcalUnit: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
  },
  cameraIconBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#E6F4EA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 15,
    fontWeight: '400',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 24,
  },
  bottomContainer: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  snapButton: {
    width: '100%',
    backgroundColor: '#17A558',
    height: 56,
    borderRadius: 28,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#17A558',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  snapButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  snapButtonDisabled: {
    backgroundColor: '#E2E8F0',
    shadowOpacity: 0,
    elevation: 0,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  snapButtonTextDisabled: {
    color: '#94A3B8',
  },
  freePhotosText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 10,
  },
  freePhotosTextUnlimited: {
    color: '#17A558',
    fontWeight: '700',
  },
});
