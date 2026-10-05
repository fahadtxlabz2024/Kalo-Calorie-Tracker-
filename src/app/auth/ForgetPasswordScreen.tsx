/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { supabase } from '../../lib/supabase';

const ForgetPasswordScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleResetPassword = async () => {
    setMessage('');
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: 'kaloapp://reset-password',
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        setMessage('Password reset instructions have been sent to your email.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to send reset email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#F5F7F2' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 40,
            paddingHorizontal: 20,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Image
            source={require('../../../assets/icons/Kalo-mark.svg')}
            style={{ width: 70, height: 70, alignSelf: 'center', marginBottom: 10 }}
            contentFit="contain"
          />
          <Text
            style={{
              fontSize: 36,
              fontWeight: '800',
              textAlign: 'center',
              color: '#17A558',
              marginBottom: 4,
            }}
          >
            Kalo
          </Text>
          <Text
            style={{
              fontSize: 22,
              fontWeight: '700',
              textAlign: 'center',
              color: '#0F172A',
              marginBottom: 6,
            }}
          >
            Forgot Password?
          </Text>
          <Text
            style={{
              textAlign: 'center',
              color: '#64748B',
              fontSize: 14,
              marginBottom: 30,
              paddingHorizontal: 10,
            }}
          >
            Enter your email address and we'll send you a link to reset your password.
          </Text>

          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1.5,
              borderColor: emailFocused ? '#17A558' : '#E2E8F0',
              backgroundColor: '#FFFFFF',
              borderRadius: 14,
              paddingHorizontal: 15,
              marginBottom: 20,
            }}
          >
            <Image
              source={require('../../../assets/icons/smart-email.svg')}
              style={{ width: 22, height: 22 }}
              contentFit="contain"
            />
            <TextInput
              placeholder="Enter your registered email"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
              style={{
                flex: 1,
                paddingVertical: 14,
                paddingLeft: 10,
                color: '#0F172A',
                fontSize: 15,
              }}
              value={email}
              onChangeText={(txt) => {
                setEmail(txt);
                setErrorMessage('');
                setMessage('');
              }}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
            />
          </View>

          <TouchableOpacity
            onPress={handleResetPassword}
            disabled={isLoading}
            activeOpacity={0.85}
            style={{
              width: '100%',
              backgroundColor: '#17A558',
              borderRadius: 14,
              paddingVertical: 16,
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#17A558',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 16,
                  fontWeight: '700',
                  textAlign: 'center',
                }}
              >
                Send Reset Link
              </Text>
            )}
          </TouchableOpacity>

          {message ? (
            <Text
              style={{
                color: '#17A558',
                marginTop: 14,
                fontSize: 14,
                fontWeight: '600',
                textAlign: 'center',
              }}
            >
              {message}
            </Text>
          ) : null}

          {errorMessage ? (
            <Text
              style={{
                color: '#EF4444',
                marginTop: 14,
                fontSize: 14,
                fontWeight: '500',
                textAlign: 'center',
              }}
            >
              {errorMessage}
            </Text>
          ) : null}

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 24,
            }}
          >
            <Text style={{ color: '#64748B', fontSize: 15 }}>Remembered your password? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/LoginScreen')}>
              <Text style={{ color: '#17A558', fontSize: 15, fontWeight: '700' }}>
                Log In
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ForgetPasswordScreen;
