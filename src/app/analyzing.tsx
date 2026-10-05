import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image as RNImage, Animated, Easing } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Image as ExpoImage } from 'expo-image';
import { X, Check } from 'lucide-react-native';

import { useMeals } from '../context/MealContext';

export default function AnalyzingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ imageUri?: string }>();
  const { pendingImageUri } = useMeals();
  
  const rawUri = Array.isArray(params.imageUri) ? params.imageUri[0] : params.imageUri;
  const imageUri = pendingImageUri || rawUri || null;

  // Progress step state (1: Finding foods, 2: Estimating portions, 3: Counting calories)
  const [currentStep, setCurrentStep] = useState(1);

  // Animated scanner value
  const scanAnim = useRef(new Animated.Value(0)).current;

  // Animated spinner rotation value
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Scanning beam loop animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: 200,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 2. Spinner rotation loop animation
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // 3. Fast & responsive step timeline progression (~2.2s total)
    const timer1 = setTimeout(() => setCurrentStep(2), 750);
    const timer2 = setTimeout(() => setCurrentStep(3), 1500);
    const timer3 = setTimeout(() => {
      // Complete analysis & navigate to result screen
      router.replace('/result');
    }, 2250);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [imageUri]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Top Header: Close Button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <X size={20} color="#0F172A" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Dark Food Card with Laser Scanner Beam */}
        <View style={styles.foodCard}>
          {imageUri ? (
<ExpoImage
  source={{ uri: imageUri }}
  style={StyleSheet.absoluteFill}
  contentFit="cover"
  onError={(e) => console.log('Image load error:', e)}
/>
          ) : (
            /* Fallback Plate Outer Circle */
            <View style={styles.plateOuter}>
              <View style={styles.plateInner}>
                {/* Green Salad */}
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

                {/* Brown Chicken */}
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

                {/* Rice Oval */}
                <RNImage 
                  source={require('../../assets/images/Vector (4).png')} 
                  style={styles.riceMound} 
                  resizeMode="contain" 
                />
              </View>
            </View>
          )}

          {/* Animated Laser Scanning Beam */}
          <Animated.View 
            style={[
              styles.scannerBand,
              {
                transform: [{ translateY: scanAnim }],
              },
            ]}
          >
            <View style={styles.scannerLine} />
          </Animated.View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Looking at your meal...</Text>

        {/* Step Progress List */}
        <View style={styles.stepList}>
          {/* Step 1: Finding the foods */}
          <View style={styles.stepRow}>
            {currentStep > 1 ? (
              <View style={styles.checkBadge}>
                <Check size={14} color="#FFFFFF" strokeWidth={3} />
              </View>
            ) : (
              <Animated.View style={[styles.spinnerArc, { transform: [{ rotate: spin }] }]} />
            )}
            <View style={styles.stepTextContainer}>
              <Text style={styles.stepTitle}>Finding the foods</Text>
              {currentStep >= 1 && (
                <Text style={styles.stepSubtitle}>Chicken, rice, salad</Text>
              )}
            </View>
          </View>

          {/* Step 2: Estimating portions */}
          <View style={styles.stepRow}>
            {currentStep > 2 ? (
              <View style={styles.checkBadge}>
                <Check size={14} color="#FFFFFF" strokeWidth={3} />
              </View>
            ) : currentStep === 2 ? (
              <Animated.View style={[styles.spinnerArc, { transform: [{ rotate: spin }] }]} />
            ) : (
              <View style={styles.inactiveCircle} />
            )}
            <View style={styles.stepTextContainer}>
              <Text style={[styles.stepTitle, currentStep < 2 && styles.stepTitleInactive]}>
                Estimating portions
              </Text>
              {currentStep >= 2 && (
                <Text style={styles.stepSubtitle}>About 150 g, 1 cup, 1 bowl</Text>
              )}
            </View>
          </View>

          {/* Step 3: Counting calories */}
          <View style={styles.stepRow}>
            {currentStep > 3 ? (
              <View style={styles.checkBadge}>
                <Check size={14} color="#FFFFFF" strokeWidth={3} />
              </View>
            ) : currentStep === 3 ? (
              <Animated.View style={[styles.spinnerArc, { transform: [{ rotate: spin }] }]} />
            ) : (
              <View style={styles.inactiveCircle} />
            )}
            <View style={styles.stepTextContainer}>
              <Text style={[styles.stepTitle, currentStep < 3 && styles.stepTitleInactive]}>
                Counting calories
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Footer Note */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Usually takes about 5 seconds</Text>
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
    marginTop: 8,
    marginBottom: 12,
  },
  closeButton: {
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
  content: {
    flex: 1,
  },
  foodCard: {
    backgroundColor: '#3A2F26',
    borderRadius: 24,
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
    position: 'relative',
    overflow: 'hidden',
  },
  capturedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  plateOuter: {
    width: 175,
    height: 175,
    borderRadius: 87.5,
    backgroundColor: '#ECE7DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plateInner: {
    width: 145,
    height: 145,
    borderRadius: 72.5,
    backgroundColor: '#FFFDF9',
    position: 'relative',
  },
  saladBall: {
    position: 'absolute',
    top: 20,
    left: 14,
    width: 65.42,
    height: 59.47,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saladImage: {
    width: '90%',
    height: '90%',
    position: 'absolute',
  },
  saladInnerImage: {
    width: 20.75,
    height: 20.79,
    position: 'relative',
    top: 10,
    left: -10,
  },
  chickenPiece: {
    position: 'absolute',
    top: 30,
    right: 8,
    width: 59.47,
    height: 39.65,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chickenImage: {
    width: '95%',
    height: '95%',
    position: 'absolute',
  },
  chickenInnerImage: {
    width: 33.68,
    height: 13.86,
  },
  riceMound: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    width: 87.23,
    height: 47.58,
  },
  scannerBand: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'rgba(23, 165, 88, 0.22)',
    justifyContent: 'flex-end',
  },
  scannerLine: {
    height: 2,
    backgroundColor: '#17A558',
    width: '100%',
    shadowColor: '#17A558',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
    marginBottom: 24,
  },
  stepList: {
    gap: 20,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  checkBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#17A558',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  spinnerArc: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 3,
    borderColor: '#E2E8F0',
    borderTopColor: '#17A558',
    marginTop: 2,
  },
  inactiveCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    marginTop: 2,
  },
  stepTextContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  stepTitleInactive: {
    color: '#94A3B8',
    fontWeight: '600',
  },
  stepSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#64748B',
    marginTop: 2,
  },
  footer: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
});
