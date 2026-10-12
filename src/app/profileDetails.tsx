import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ChevronLeft,
  Target,
  User,
  Ruler,
  Trash2,
  ChevronDown,
  Check,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMeals } from '../context/MealContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { getUserProfile, UserProfileData, DEFAULT_USER_PROFILE } from '../lib/userProfile';

export default function ProfileDetailsScreen() {
  const router = useRouter();
  const { clearMeals } = useMeals();
  const { signOut, user } = useAuth();

  const [userProfile, setUserProfile] = useState<UserProfileData>(DEFAULT_USER_PROFILE);
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  const [showUnitsDropdown, setShowUnitsDropdown] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getUserProfile(user?.email).then((prof) => {
      if (isMounted) {
        setUserProfile(prof);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [user?.email]);

  // Dynamic unit strings and conversion based on userProfile from About screen
  const unitText = unitSystem === 'metric' ? 'kg · cm' : 'lbs · ft/in';
  const rawWeight = userProfile.weight || '78';
  const rawHeight = userProfile.height || '172';
  const weightNum = parseFloat(rawWeight) || 78;
  const heightNum = parseFloat(rawHeight) || 172;

  const displayWeight =
    unitSystem === 'metric'
      ? `${weightNum} kg`
      : `${Math.round(weightNum * 2.20462)} lbs`;

  const displayHeight =
    unitSystem === 'metric'
      ? `${heightNum} cm`
      : `${Math.floor(heightNum / 30.48)}' ${Math.round((heightNum % 30.48) / 2.54)}"`;

  const detailsText = `${displayWeight} · ${displayHeight}`;
  const calorieGoalText = `${(userProfile.calorieGoal || 2650).toLocaleString()} kcal`;

  const selectUnitSystem = (system: 'metric' | 'imperial') => {
    setUnitSystem(system);
    setShowUnitsDropdown(false);
  };

  const handleConfirmDeleteAccount = async () => {
    setDeleting(true);
    try {
      if (user) {
        // 1. Delete user from Supabase Auth (auth.users) via RPC function
        const { error: rpcError } = await supabase.rpc('delete_user');
        if (rpcError) {
          console.warn('Supabase delete_user RPC warning:', rpcError.message);
          // Fallback manual table row delete if RPC function has not been created yet
          if (user.email) {
            await supabase.from('subscriptions').delete().eq('email', user.email);
          }
        }
      }

      // 2. Clear local meals state & AsyncStorage keys completely
      clearMeals();

      if (user?.email) {
        await AsyncStorage.removeItem(`@kalo_is_new_user_${user.email}`);
        await AsyncStorage.removeItem(`@kalo_user_profile_${user.email}`);
      }
      await AsyncStorage.clear();

      // 3. Sign out session
      await signOut();

      setShowDeleteModal(false);
      router.replace('/auth/LoginScreen');
    } catch (error) {
      console.error('Error deleting account:', error);
      if (user?.email) {
        await AsyncStorage.removeItem(`@kalo_is_new_user_${user.email}`);
        await AsyncStorage.removeItem(`@kalo_user_profile_${user.email}`);
      }
      await AsyncStorage.clear();
      await signOut();
      setShowDeleteModal(false);
      router.replace('/auth/LoginScreen');
    } finally {
      setDeleting(false);
    }
  };

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

        <Text style={styles.headerTitle}>Profile Details</Text>

        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* User Info Card */}
        <View style={styles.userInfoCard}>
          <View style={styles.userAvatarBadge}>
            <Text style={styles.userAvatarText}>
              {(user?.user_metadata?.full_name?.[0] || user?.email?.[0] || 'U').toUpperCase()}
            </Text>
          </View>
          <Text style={styles.userNameText}>
            {user?.user_metadata?.full_name || 'Kalo User'}
          </Text>
          <Text style={styles.userEmailText}>{user?.email || ''}</Text>
        </View>

        {/* Profile Attributes Section */}
        <View style={styles.sectionCard}>
          {/* Daily Goal */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Target size={20} color="#0F172A" />
              <Text style={styles.settingLabel}>Daily goal</Text>
            </View>
            <View style={styles.settingRight}>
              <Text style={styles.settingValue}>{calorieGoalText}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* My Details */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <User size={20} color="#0F172A" />
              <Text style={styles.settingLabel}>My details</Text>
            </View>
            <View style={styles.settingRight}>
              <Text style={styles.settingValue}>{detailsText}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Units Selection */}
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => setShowUnitsDropdown(true)}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <Ruler size={20} color="#0F172A" />
              <Text style={styles.settingLabel}>Units</Text>
            </View>
            <View style={styles.settingRight}>
              <Text style={styles.settingValue}>{unitText}</Text>
              <ChevronDown size={18} color="#94A3B8" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Account Deletion Card */}
        <View style={styles.sectionCard}>
          <TouchableOpacity
            style={styles.settingRow}
            activeOpacity={0.7}
            onPress={() => setShowDeleteModal(true)}
          >
            <View style={styles.settingLeft}>
              <Trash2 size={20} color="#EF4444" />
              <Text style={[styles.settingLabel, { color: '#EF4444' }]}>
                Delete account
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Units Dropdown Bottom Sheet Modal */}
      <Modal
        visible={showUnitsDropdown}
        transparent
        animationType="slide"
        onRequestClose={() => setShowUnitsDropdown(false)}
      >
        <View style={styles.dropdownModalOverlay}>
          <Pressable
            style={styles.dropdownBackdrop}
            onPress={() => setShowUnitsDropdown(false)}
          />

          <View style={styles.dropdownSheetContainer}>
            <View style={styles.dropdownDragHandle} />

            <Text style={styles.dropdownTitle}>Select Units</Text>
            <Text style={styles.dropdownSubtitle}>
              Choose your preferred unit system for weight and height.
            </Text>

            <View style={styles.dropdownOptionsList}>
              {/* Option 1: Metric */}
              <TouchableOpacity
                style={[
                  styles.dropdownOptionRow,
                  unitSystem === 'metric' && styles.dropdownOptionRowSelected,
                ]}
                activeOpacity={0.8}
                onPress={() => selectUnitSystem('metric')}
              >
                <View>
                  <Text
                    style={[
                      styles.dropdownOptionTitle,
                      unitSystem === 'metric' && styles.dropdownOptionTitleSelected,
                    ]}
                  >
                    Metric
                  </Text>
                  <Text style={styles.dropdownOptionDesc}>Kilograms (kg) and Centimeters (cm)</Text>
                </View>
                {unitSystem === 'metric' && <Check size={20} color="#17A558" strokeWidth={2.5} />}
              </TouchableOpacity>

              {/* Option 2: Imperial */}
              <TouchableOpacity
                style={[
                  styles.dropdownOptionRow,
                  unitSystem === 'imperial' && styles.dropdownOptionRowSelected,
                ]}
                activeOpacity={0.8}
                onPress={() => selectUnitSystem('imperial')}
              >
                <View>
                  <Text
                    style={[
                      styles.dropdownOptionTitle,
                      unitSystem === 'imperial' && styles.dropdownOptionTitleSelected,
                    ]}
                  >
                    Imperial
                  </Text>
                  <Text style={styles.dropdownOptionDesc}>Pounds (lbs) and Feet/Inches (ft/in)</Text>
                </View>
                {unitSystem === 'imperial' && <Check size={20} color="#17A558" strokeWidth={2.5} />}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Account Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalWarningIcon}>
              <Trash2 size={28} color="#EF4444" />
            </View>

            <Text style={styles.modalTitle}>Delete Account?</Text>

            <Text style={styles.modalDescription}>
              This will permanently delete your account, saved meal logs, and subscription data. This action cannot be undone.
            </Text>

            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                activeOpacity={0.7}
                onPress={() => setShowDeleteModal(false)}
                disabled={deleting}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                activeOpacity={0.85}
                onPress={handleConfirmDeleteAccount}
                disabled={deleting}
              >
                <Text style={styles.deleteButtonText}>
                  {deleting ? 'Deleting...' : 'Delete Account'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  userInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  userAvatarBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#17A558',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  userAvatarText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  userNameText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  userEmailText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 6,
    paddingHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
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
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  dropdownModalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  dropdownBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
  },
  dropdownSheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
  },
  dropdownDragHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 20,
  },
  dropdownTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  dropdownSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 20,
  },
  dropdownOptionsList: {
    gap: 12,
  },
  dropdownOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  dropdownOptionRowSelected: {
    borderColor: '#17A558',
    backgroundColor: '#F0FDF4',
  },
  dropdownOptionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  dropdownOptionTitleSelected: {
    color: '#17A558',
  },
  dropdownOptionDesc: {
    fontSize: 13,
    color: '#64748B',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
  },
  modalWarningIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  modalButtonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#475569',
  },
  deleteButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#EF4444',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
