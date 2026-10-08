import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { Clock, ArrowRight } from 'lucide-react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
  onViewPlans: () => void;
};

export default function TrialExpiredModal({ visible, onClose, onViewPlans }: Props) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Top Clock Badge */}
          <View style={styles.iconContainer}>
            <Clock size={32} color="#F59E0B" strokeWidth={2.2} />
          </View>

          {/* Title */}
          <Text style={styles.title}>Trial Expired</Text>

          {/* Description */}
          <Text style={styles.description}>
            Your 7 Day Trial Has Been Over
          </Text>

          {/* View Plans Button */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={onViewPlans}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryButtonText}>View Subscription Plans</Text>
            <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.5} style={{ marginLeft: 6 }} />
          </TouchableOpacity>

          {/* Dismiss Button */}
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryButtonText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 10,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    fontWeight: '500',
    color: '#475569',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#17A558',
    paddingVertical: 14,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#17A558',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#64748B',
    fontSize: 15,
    fontWeight: '600',
  },
});
