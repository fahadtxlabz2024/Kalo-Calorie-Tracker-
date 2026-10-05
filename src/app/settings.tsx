import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch, Modal, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  ChevronLeft, 
  Sparkles, 
  Target, 
  User, 
  Bell, 
  Ruler, 
  Cloud, 
  HelpCircle, 
  ShieldCheck, 
  Trash2, 
  LogOut,
  ChevronRight,
  ChevronDown,
  Check
} from 'lucide-react-native';
import { useMeals } from '../context/MealContext';
import { useAuth } from '../context/AuthContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { clearMeals } = useMeals();
  const { signOut, user } = useAuth();


  // Interactive settings state
  const [mealReminders, setMealReminders] = useState(true);
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  const [backupData, setBackupData] = useState(false);
  const [showUnitsDropdown, setShowUnitsDropdown] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Dynamic unit strings and conversion (78 kg -> 172 lbs, 172 cm -> 5' 8")
  const unitText = unitSystem === 'metric' ? 'kg · cm' : 'lbs · ft/in';
  const detailsText = unitSystem === 'metric' ? '78 kg · 172 cm' : '172 lbs · 5\' 8"';

  const selectUnitSystem = (system: 'metric' | 'imperial') => {
    setUnitSystem(system);
    setShowUnitsDropdown(false);
  };

  const handleConfirmDelete = () => {
    clearMeals();
    setShowDeleteModal(false);
    router.replace('/today');
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

        <Text style={styles.headerTitle}>Settings</Text>

        <View style={{ width: 44 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Kalo Plus Promo Banner */}
        <TouchableOpacity style={styles.kaloPlusCard} activeOpacity={0.85}>
          <View style={styles.kaloPlusLeft}>
            <View style={styles.starBadge}>
              <Sparkles size={22} color="#121C16" fill="#121C16" />
            </View>
            <View style={styles.kaloPlusTextGroup}>
              <Text style={styles.kaloPlusTitle}>Kalo Plus</Text>
              <Text style={styles.kaloPlusSubtitle}>Unlimited meal photos</Text>
            </View>
          </View>

          <View style={styles.tryFreeButton}>
            <Text style={styles.tryFreeText}>Try free</Text>
          </View>
        </TouchableOpacity>

        {/* First Settings Group (Goals & Preferences) */}
        <View style={styles.sectionCard}>
          {/* Daily Goal (No arrow) */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Target size={20} color="#0F172A" />
              <Text style={styles.settingLabel}>Daily goal</Text>
            </View>
            <View style={styles.settingRight}>
              <Text style={styles.settingValue}>2,000 kcal</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* My Details (No arrow, dynamic conversion) */}
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

          {/* Meal Reminders (Toggle Switch) */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Bell size={20} color="#0F172A" />
              <Text style={styles.settingLabel}>Meal reminders</Text>
            </View>
            <View style={styles.settingRight}>
              <Text style={styles.settingValue}>{mealReminders ? 'On' : 'Off'}</Text>
              <Switch
                value={mealReminders}
                onValueChange={setMealReminders}
                trackColor={{ false: '#E2E8F0', true: '#17A558' }}
                thumbColor="#FFFFFF"
                style={styles.switchControl}
              />
            </View>
          </View>

          <View style={styles.divider} />

          {/* Units (Opens Dropdown Selector) */}
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

          <View style={styles.divider} />

          {/* Delete My Data */}
          <TouchableOpacity 
            style={styles.settingRow} 
            activeOpacity={0.7}
            onPress={() => setShowDeleteModal(true)}
          >
            <View style={styles.settingLeft}>
              <Trash2 size={20} color="#EF4444" />
              <Text style={[styles.settingLabel, { color: '#EF4444' }]}>Delete my data</Text>
            </View>
          </TouchableOpacity>
        </View>


        {/* Footer Info Note */}
        <Text style={styles.footerNote}>
          Meal photos are analysed by AI to estimate calories.
        </Text>
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
                  styles.dropdownOptionCard,
                  unitSystem === 'metric' && styles.dropdownOptionCardSelected
                ]}
                activeOpacity={0.7}
                onPress={() => selectUnitSystem('metric')}
              >
                <View>
                  <Text style={[
                    styles.dropdownOptionTitle,
                    unitSystem === 'metric' && styles.dropdownOptionTitleSelected
                  ]}>
                    Metric (kg, cm)
                  </Text>
                  <Text style={styles.dropdownOptionSubtext}>Kilograms & Centimeters</Text>
                </View>

                {unitSystem === 'metric' ? (
                  <View style={styles.checkBadge}>
                    <Check size={16} color="#FFFFFF" strokeWidth={3} />
                  </View>
                ) : null}
              </TouchableOpacity>

              {/* Option 2: Imperial */}
              <TouchableOpacity
                style={[
                  styles.dropdownOptionCard,
                  unitSystem === 'imperial' && styles.dropdownOptionCardSelected
                ]}
                activeOpacity={0.7}
                onPress={() => selectUnitSystem('imperial')}
              >
                <View>
                  <Text style={[
                    styles.dropdownOptionTitle,
                    unitSystem === 'imperial' && styles.dropdownOptionTitleSelected
                  ]}>
                    Imperial (lbs, ft/in)
                  </Text>
                  <Text style={styles.dropdownOptionSubtext}>Pounds, Feet & Inches</Text>
                </View>

                {unitSystem === 'imperial' ? (
                  <View style={styles.checkBadge}>
                    <Check size={16} color="#FFFFFF" strokeWidth={3} />
                  </View>
                ) : null}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Data Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentBox}>
            <View style={styles.modalIconBadge}>
              <Trash2 size={28} color="#EF4444" />
            </View>

            <Text style={styles.modalTitle}>Delete all data?</Text>
            <Text style={styles.modalDescription}>
              This will permanently remove all your logged meals, progress, and personal details. This action cannot be undone.
            </Text>

            <View style={styles.modalButtonRow}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                activeOpacity={0.7}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.deleteButton} 
                activeOpacity={0.85}
                onPress={handleConfirmDelete}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
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

  /* Dropdown Bottom Sheet Styles */
  dropdownModalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  dropdownBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
  },
  dropdownSheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 36,
  },
  dropdownDragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 16,
  },
  dropdownTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  dropdownSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#64748B',
    marginBottom: 20,
  },
  dropdownOptionsList: {
    gap: 12,
  },
  dropdownOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  dropdownOptionCardSelected: {
    backgroundColor: '#F0FDF4',
    borderColor: '#17A558',
  },
  dropdownOptionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  dropdownOptionTitleSelected: {
    color: '#17A558',
  },
  dropdownOptionSubtext: {
    fontSize: 13,
    fontWeight: '400',
    color: '#64748B',
    marginTop: 2,
  },
  checkBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#17A558',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Confirmation Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContentBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  modalIconBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
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
  },
  modalDescription: {
    fontSize: 14,
    fontWeight: '400',
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
    backgroundColor: '#F1F5F9',
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#475569',
    fontSize: 16,
    fontWeight: '700',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
