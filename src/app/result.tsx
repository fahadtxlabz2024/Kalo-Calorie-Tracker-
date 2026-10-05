import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image as RNImage, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Image as ExpoImage } from 'expo-image';
import { ChevronLeft, Trash2, Check } from 'lucide-react-native';
import { useMeals } from '../context/MealContext';

// Preset pool of food items for 3-item random meal generation
const PROTEIN_OPTIONS = [
  { name: 'Grilled chicken breast', portion: 'about 150 g', baseRatio: 0.45 },
  { name: 'Pan-seared salmon', portion: 'about 180 g', baseRatio: 0.42 },
  { name: 'Ribeye steak', portion: 'about 160 g', baseRatio: 0.50 },
  { name: 'Roasted turkey breast', portion: 'about 175 g', baseRatio: 0.44 },
  { name: 'Tofu scramble with herbs', portion: 'about 200 g', baseRatio: 0.38 },
];

const CARB_OPTIONS = [
  { name: 'White rice', portion: 'about 1 cup', baseRatio: 0.35 },
  { name: 'Brown rice & quinoa', portion: 'about 1 cup', baseRatio: 0.36 },
  { name: 'Roasted sweet potatoes', portion: 'about 150 g', baseRatio: 0.34 },
  { name: 'Garlic mashed potatoes', portion: 'about 180 g', baseRatio: 0.38 },
  { name: 'Whole wheat pasta', portion: 'about 1 cup', baseRatio: 0.37 },
];

const SIDE_OPTIONS = [
  { name: 'Green salad with olive oil', portion: 'about 1 bowl', baseRatio: 0.20 },
  { name: 'Steamed broccoli & carrots', portion: 'about 1 cup', baseRatio: 0.18 },
  { name: 'Grilled asparagus & parmesan', portion: 'about 100 g', baseRatio: 0.22 },
  { name: 'Sautéed spinach with garlic', portion: 'about 1 bowl', baseRatio: 0.19 },
  { name: 'Avocado & cherry tomatoes', portion: 'about 1/2 avocado', baseRatio: 0.25 },
];

export default function ResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ imageUri?: string }>();
  const { pendingImageUri, addMeal } = useMeals();
  
  const rawUri = Array.isArray(params.imageUri) ? params.imageUri[0] : params.imageUri;
  const imageUri = pendingImageUri || rawUri || null;


  // Generate a random meal result between 500 and 1100 kcal
  const mealData = useMemo(() => {
    // 1. Pick total calories between 500 and 1100
    const totalKcal = Math.floor(Math.random() * (1100 - 500 + 1)) + 500;

    // 2. Select 3 random food items
    const protein = PROTEIN_OPTIONS[Math.floor(Math.random() * PROTEIN_OPTIONS.length)];
    const carb = CARB_OPTIONS[Math.floor(Math.random() * CARB_OPTIONS.length)];
    const side = SIDE_OPTIONS[Math.floor(Math.random() * SIDE_OPTIONS.length)];

    // 3. Divide calories among the 3 items so they sum up to totalKcal
    const proteinKcal = Math.round(totalKcal * 0.44);
    const carbKcal = Math.round(totalKcal * 0.36);
    const sideKcal = totalKcal - proteinKcal - carbKcal;

    // 4. Calculate macros
    const carbsGrams = Math.round((totalKcal * 0.40) / 4);
    const proteinGrams = Math.round((totalKcal * 0.36) / 4);
    const fatGrams = Math.round((totalKcal * 0.24) / 9);

    // 5. Short title (e.g. "Chicken, rice & salad")
    const title = `${protein.name.split(' ')[1] || protein.name}, ${carb.name.split(' ')[1] || carb.name} & salad`;

    // 6. Time string
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const timeString = `Today, ${hours}:${mins}`;

    return {
      totalKcal,
      carbsGrams,
      proteinGrams,
      fatGrams,
      title,
      timeString,
      items: [
        { name: protein.name, portion: protein.portion, kcal: proteinKcal },
        { name: carb.name, portion: carb.portion, kcal: carbKcal },
        { name: side.name, portion: side.portion, kcal: sideKcal },
      ],
    };
  }, []);

  const handleDone = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    
    let category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' = 'Dinner';
    const hour = now.getHours();
    if (hour >= 5 && hour < 11) category = 'Breakfast';
    else if (hour >= 11 && hour < 16) category = 'Lunch';
    else if (hour >= 16 && hour < 22) category = 'Dinner';
    else category = 'Snack';

    addMeal({
      title: mealData.title,
      category,
      timeString: `${category} · ${hours}:${mins}`,
      totalKcal: mealData.totalKcal,
      carbsGrams: mealData.carbsGrams,
      proteinGrams: mealData.proteinGrams,
      fatGrams: mealData.fatGrams,
      imageUri: imageUri || null,
      items: mealData.items,
    });

    router.push('/today');
  };

  const handleRetake = () => {
    router.push('/camera');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Top Navigation Bar */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerButton} 
          onPress={() => router.push('/today')}
          activeOpacity={0.7}
        >
          <ChevronLeft size={24} color="#0F172A" />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.mealCategory}>Dinner</Text>
          <Text style={styles.mealTime}>{mealData.timeString}</Text>
        </View>

        <TouchableOpacity 
          style={styles.headerButton} 
          onPress={() => router.push('/today')}
          activeOpacity={0.7}
        >
          <Trash2 size={20} color="#0F172A" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Dark Food Preview Card */}
        <View style={styles.foodCard}>
          {imageUri ? (
<ExpoImage
  source={{ uri: imageUri }}
  style={StyleSheet.absoluteFill}
  contentFit="cover"
  onError={(e) => console.log('Image load error:', e)}
/>
          ) : (
            <View style={styles.plateOuter}>
              <View style={styles.plateInner}>
                {/* Salad */}
                <View style={styles.saladBall}>
                  <RNImage 
                    source={require('../../assets/images/Vector.png')} 
                    style={styles.saladImage} 
                    resizeMode="contain" 
                  />
                  <RNImage 
                    source={require('../../assets/images/Vector (1).png')} 
                    style={styles.saladInnerImage} 
                    resizeMode="contain" 
                  />
                </View>

                {/* Chicken */}
                <View style={styles.chickenPiece}>
                  <RNImage 
                    source={require('../../assets/images/Vector (2).png')} 
                    style={styles.chickenImage} 
                    resizeMode="contain" 
                  />
                  <RNImage 
                    source={require('../../assets/images/Vector (3).png')} 
                    style={styles.chickenInnerImage} 
                    resizeMode="contain" 
                  />
                </View>

                {/* Rice */}
                <RNImage 
                  source={require('../../assets/images/Vector (4).png')} 
                  style={styles.riceMound} 
                  resizeMode="contain" 
                />
              </View>
            </View>
          )}
        </View>

        {/* Added to Today Badge & Title */}
        <View style={styles.titleSection}>
          <View style={styles.statusBadge}>
            <View style={styles.greenCheckBadge}>
              <Check size={12} color="#FFFFFF" strokeWidth={3} />
            </View>
            <Text style={styles.statusText}>Added to today</Text>
          </View>

          <Text style={styles.mealTitle}>{mealData.title}</Text>
        </View>

        {/* Calorie & Macros Summary Pill Card */}
        <View style={styles.summaryCard}>
          <View style={styles.kcalContainer}>
            <Text style={styles.kcalValue}>{mealData.totalKcal}</Text>
            <Text style={styles.kcalUnit}>kcal</Text>
          </View>

          <View style={styles.macroPillsRow}>
            {/* Carbs */}
            <View style={styles.macroPill}>
              <Text style={styles.macroValue}>{mealData.carbsGrams} g</Text>
              <View style={styles.macroLabelRow}>
                <View style={[styles.macroDot, { backgroundColor: '#F59E0B' }]} />
                <Text style={styles.macroLabel}>Carbs</Text>
              </View>
            </View>

            {/* Protein */}
            <View style={styles.macroPill}>
              <Text style={styles.macroValue}>{mealData.proteinGrams} g</Text>
              <View style={styles.macroLabelRow}>
                <View style={[styles.macroDot, { backgroundColor: '#3B82F6' }]} />
                <Text style={styles.macroLabel}>Protein</Text>
              </View>
            </View>

            {/* Fat */}
            <View style={styles.macroPill}>
              <Text style={styles.macroValue}>{mealData.fatGrams} g</Text>
              <View style={styles.macroLabelRow}>
                <View style={[styles.macroDot, { backgroundColor: '#A855F7' }]} />
                <Text style={styles.macroLabel}>Fat</Text>
              </View>
            </View>
          </View>
        </View>

        {/* "What Kalo saw" Itemized Breakdown Card */}
        <View style={styles.detailsCard}>
          <Text style={styles.detailsHeader}>What Kalo saw</Text>

          {mealData.items.map((item, index) => (
            <View key={index} style={styles.foodItemRow}>
              <View style={styles.foodItemLeft}>
                <Text style={styles.foodName}>{item.name}</Text>
                <Text style={styles.foodPortion}>{item.portion}</Text>
              </View>
              <Text style={styles.foodKcal}>{item.kcal}</Text>
            </View>
          ))}
        </View>

        {/* Estimation Disclaimer */}
        <Text style={styles.disclaimerText}>
          Estimated from your photo. Real values can differ a little.
        </Text>
      </ScrollView>

      {/* Bottom Action Area */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.doneButton} 
          activeOpacity={0.85}
          onPress={handleDone}
        >
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.retakeButton} 
          activeOpacity={0.7}
          onPress={handleRetake}
        >
          <Text style={styles.retakeButtonText}>Not right? Retake the photo</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 16,
  },
  headerButton: {
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
  headerTitleContainer: {
    alignItems: 'center',
  },
  mealCategory: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  mealTime: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  foodCard: {
    backgroundColor: '#3A2F26',
    borderRadius: 24,
    height: 190,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  capturedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  plateOuter: {
    width: 155,
    height: 155,
    borderRadius: 77.5,
    backgroundColor: '#ECE7DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plateInner: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: '#FFFDF9',
    position: 'relative',
  },
  saladBall: {
    position: 'absolute',
    top: 18,
    left: 12,
    width: 58,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saladImage: {
    width: '90%',
    height: '90%',
    position: 'absolute',
  },
  saladInnerImage: {
    width: 18,
    height: 18,
    position: 'relative',
    top: 8,
    left: -8,
  },
  chickenPiece: {
    position: 'absolute',
    top: 26,
    right: 8,
    width: 52,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chickenImage: {
    width: '95%',
    height: '95%',
    position: 'absolute',
  },
  chickenInnerImage: {
    width: 30,
    height: 12,
  },
  riceMound: {
    position: 'absolute',
    bottom: 16,
    left: 24,
    width: 78,
    height: 42,
  },
  titleSection: {
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  greenCheckBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#17A558',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#17A558',
  },
  mealTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  kcalContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  kcalValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  kcalUnit: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  macroPillsRow: {
    flexDirection: 'row',
    gap: 14,
  },
  macroPill: {
    alignItems: 'center',
  },
  macroValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  macroLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  macroDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  macroLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    gap: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  detailsHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  foodItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  foodItemLeft: {
    flex: 1,
  },
  foodName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  foodPortion: {
    fontSize: 13,
    fontWeight: '400',
    color: '#64748B',
    marginTop: 2,
  },
  foodKcal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    paddingLeft: 12,
  },
  disclaimerText: {
    fontSize: 13,
    fontWeight: '400',
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 8,
  },
  bottomContainer: {
    paddingBottom: 20,
  },
  doneButton: {
    backgroundColor: '#17A558',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  retakeButton: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  retakeButtonText: {
    color: '#17A558',
    fontSize: 16,
    fontWeight: '700',
  },
});
