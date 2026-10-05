/* eslint-disable react-native/no-inline-styles */
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import React from 'react';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const SignUpSuccessModal = ({ visible, onClose }: Props) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          paddingHorizontal: 20,
        }}
      >
        <View
          style={{
            width: '100%',
            maxWidth: 340,
            backgroundColor: '#FFFFFF',
            borderRadius: 24,
            padding: 24,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: '#E6F4EA',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <Text style={{ color: '#17A558', fontSize: 28, fontWeight: 'bold' }}>✓</Text>
          </View>

          <Text
            style={{
              fontSize: 22,
              fontWeight: '800',
              color: '#0F172A',
              marginBottom: 8,
              textAlign: 'center',
            }}
          >
            Account Created!
          </Text>

          <Text
            style={{
              fontSize: 14,
              color: '#64748B',
              textAlign: 'center',
              lineHeight: 20,
              marginBottom: 24,
            }}
          >
            A confirmation link has been sent to your email. Please verify your email to start using Kalo.
          </Text>

          <TouchableOpacity
            style={{
              width: '100%',
              backgroundColor: '#17A558',
              paddingVertical: 14,
              borderRadius: 14,
              alignItems: 'center',
            }}
            onPress={onClose}
            activeOpacity={0.85}
          >
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 16,
                fontWeight: '700',
              }}
            >
              Continue to Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SignUpSuccessModal;