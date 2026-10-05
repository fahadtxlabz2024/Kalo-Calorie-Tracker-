import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/about');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.scrollContent}>
        {/* Top Header Logo */}
        <View style={styles.header}>
          <ExpoImage 
            source={require('../../assets/icons/Kalo-mark.svg')} 
            style={styles.logoMark}
            contentFit="contain"
          />
          <Text style={styles.logoText}>kalo</Text>
        </View>

        {/* Dark Brown Food Card (#3A2F26) */}
        <View style={styles.foodCard}>
          {/* Plate Outer Circle (#ECE7DB) */}
          <View style={styles.plateOuter}>
            <View style={styles.plateInner}>
              {/* Green Salad Vector Images */}
              <View style={styles.saladBall}>
                <Image 
                  source={require('../../assets/images/Vector.png')} 
                  style={styles.saladImage} 
                  resizeMode="contain" 
                />
                <Image 
                  source={require('../../assets/images/Vector (1).png')} 
                  style={styles.saladInnerImage} 
                  resizeMode="contain" 
                />
              </View>

              {/* Brown Chicken Vector Images */}
              <View style={styles.chickenPiece}>
                <Image 
                  source={require('../../assets/images/Vector (2).png')} 
                  style={styles.chickenImage} 
                  resizeMode="contain" 
                />
                <Image 
                  source={require('../../assets/images/Vector (3).png')} 
                  style={styles.chickenInnerImage} 
                  resizeMode="contain" 
                />
              </View>

              {/* Rice Oval Vector Image */}
              <Image 
                source={require('../../assets/images/Vector (4).png')} 
                style={styles.riceMound} 
                resizeMode="contain" 
              />
            </View>
          </View>

          {/* Floating Result Badge */}
          <View style={styles.resultCard}>
            <View style={styles.resultLeft}>
              <View style={styles.greenCheckBadge}>
                <Text style={styles.whiteCheckMark}>✓</Text>
              </View>
              <Text style={styles.resultMealTitle}>Chicken, rice & salad</Text>
            </View>
            <Text style={styles.resultKcal}>575 kcal</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>
          Snap your meal.{"\n"}That’s it.
        </Text>

        {/* Feature List */}
        <View style={styles.featureList}>
          <View style={styles.featureRow}>
            <View style={styles.checkBadge}>
              <Text style={styles.checkMark}>✓</Text>
            </View>
            <Text style={styles.featureText}>No typing, searching or scanning</Text>
          </View>

          <View style={styles.featureRow}>
            <View style={styles.checkBadge}>
              <Text style={styles.checkMark}>✓</Text>
            </View>
            <Text style={styles.featureText}>Calories and macros in seconds</Text>
          </View>

          <View style={styles.featureRow}>
            <View style={styles.checkBadge}>
              <Text style={styles.checkMark}>✓</Text>
            </View>
            <Text style={styles.featureText}>No ads. Ever.</Text>
          </View>
        </View>
      </View>

      {/* Bottom Action Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.button} 
          activeOpacity={0.85}
          onPress={handleGetStarted}
        >
          <Text style={styles.buttonText}>Get started</Text>
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
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
    gap: 8,
  },
  logoMark: {
    width: 28,
    height: 28,
  },
  logoText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: -0.5,
  },
  foodCard: {
    backgroundColor: '#3A2F26',
    borderRadius: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    marginBottom: 24,
    position: 'relative',
  },
  plateOuter: {
    width: 165,
    height: 165,
    borderRadius: 82.5,
    backgroundColor: '#ECE7DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
  },
  plateInner: {
    width: 145,
    height: 145,
    borderRadius: 67.5,
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
    top:10,
    left:-10
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
  resultCard: {
    marginTop: -35,
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  greenCheckBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#17A558',
    justifyContent: 'center',
    alignItems: 'center',
  },
  whiteCheckMark: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  resultMealTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  resultKcal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 42,
    letterSpacing: -0.5,
    marginBottom: 24,
  },
  featureList: {
    gap: 18,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  checkBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E6F4EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMark: {
    color: '#17A558',
    fontSize: 14,
    fontWeight: '800',
  },
  featureText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
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
