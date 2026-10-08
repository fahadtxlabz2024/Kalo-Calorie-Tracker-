import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { saveUserProfile } from '../lib/userProfile';

export default function AboutYouScreen() {
  const router = useRouter();
  const { user } = useAuth();

  // State for form selections
  const [goal, setGoal] = useState<'Lose' | 'Keep' | 'Gain'>('Lose');
  const [sex, setSex] = useState<'Female' | 'Male'>('Female');
  const [age, setAge] = useState('29');
  const [height, setHeight] = useState('172');
  const [weight, setWeight] = useState('78');
  const [activity, setActivity] = useState<'Low' | 'Medium' | 'High'>('Medium');

  // Track focused text input
  const [focusedField, setFocusedField] = useState<'age' | 'height' | 'weight' | null>(null);

  const handleContinue = async () => {
    try {
      await saveUserProfile(
        {
          goal,
          sex,
          age,
          height,
          weight,
          activity,
        },
        user?.email
      );
    } catch (err) {
      console.error('Error saving user profile on about screen:', err);
    }
    // Navigate to Step 2 of onboarding
    router.push('/plan');
  };


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

        <View style={styles.progressContainer}>
          <View style={[styles.progressSegment, styles.progressActive]} />
          <View style={[styles.progressSegment, styles.progressInactive]} />
        </View>

        {/* Empty placeholder for balance */}
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title & Description */}
        <Text style={styles.title}>About you</Text>
        <Text style={styles.subtitle}>
          So Kalo can set your daily calories. This is the only form in the app.
        </Text>

        {/* Form Fields */}

        {/* 1. Goal */}
        <View style={styles.fieldCard}>
          <Text style={styles.fieldLabel}>Goal</Text>
          <View style={styles.segmentedControl}>
            {(['Lose', 'Keep', 'Gain'] as const).map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.segmentOption,
                  goal === option && styles.segmentActive,
                ]}
                onPress={() => setGoal(option)}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.segmentText,
                  goal === option && styles.segmentTextActive,
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 2. Sex */}
        <View style={styles.fieldCard}>
          <Text style={styles.fieldLabel}>Sex</Text>
          <View style={styles.segmentedControl}>
            {(['Female', 'Male'] as const).map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.segmentOption,
                  sex === option && styles.segmentActive,
                ]}
                onPress={() => setSex(option)}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.segmentText,
                  sex === option && styles.segmentTextActive,
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 3. Age */}
        <View style={[styles.fieldCard, focusedField === 'age' && styles.fieldCardActive]}>
          <Text style={styles.fieldLabel}>Age</Text>
          <View style={styles.numberInputContainer}>
            <TextInput
              style={styles.numberInput}
              value={age}
              onChangeText={setAge}
              keyboardType="number-pad"
              maxLength={3}
              onFocus={() => setFocusedField('age')}
              onBlur={() => setFocusedField(null)}
            />
            <Text style={styles.unitText}>years</Text>
          </View>
        </View>

        {/* 4. Height */}
        <View style={[styles.fieldCard, focusedField === 'height' && styles.fieldCardActive]}>
          <Text style={styles.fieldLabel}>Height</Text>
          <View style={styles.numberInputContainer}>
            <TextInput
              style={styles.numberInput}
              value={height}
              onChangeText={setHeight}
              keyboardType="number-pad"
              maxLength={3}
              onFocus={() => setFocusedField('height')}
              onBlur={() => setFocusedField(null)}
            />
            <Text style={styles.unitText}>cm</Text>
          </View>
        </View>

        {/* 5. Weight */}
        <View style={[styles.fieldCard, focusedField === 'weight' && styles.fieldCardActive]}>
          <Text style={styles.fieldLabel}>Weight</Text>
          <View style={styles.numberInputContainer}>
            <TextInput
              style={styles.numberInput}
              value={weight}
              onChangeText={setWeight}
              keyboardType="number-pad"
              maxLength={3}
              onFocus={() => setFocusedField('weight')}
              onBlur={() => setFocusedField(null)}
            />
            <Text style={styles.unitText}>kg</Text>
          </View>
        </View>

        {/* 6. Activity */}
        <View style={styles.fieldCard}>
          <Text style={styles.fieldLabel}>Activity</Text>
          <View style={styles.segmentedControl}>
            {(['Low', 'Medium', 'High'] as const).map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.segmentOption,
                  activity === option && styles.segmentActive,
                ]}
                onPress={() => setActivity(option)}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.segmentText,
                  activity === option && styles.segmentTextActive,
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.button} 
          activeOpacity={0.85}
          onPress={handleContinue}
        >
          <Text style={styles.buttonText}>Continue</Text>
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
  },
  progressActive: {
    width: 44,
    backgroundColor: '#17A558',
  },
  progressInactive: {
    width: 44,
    backgroundColor: '#E2E8F0',
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
  fieldCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  fieldCardActive: {
    borderColor: '#17A558',
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 3,
    gap: 2,
  },
  segmentOption: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  segmentActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  segmentTextActive: {
    fontWeight: '700',
    color: '#0F172A',
  },
  numberInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  numberInput: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'right',
    minWidth: 36,
  },
  unitText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
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
