/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
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

const ResetPasswordScreen = () => {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleUpdatePassword = async () => {
    setErrorMessage('');

    if (!password.trim() || !confirmPassword.trim()) {
      setErrorMessage('Please fill in both password fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password.trim(),
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        Alert.alert('Success', 'Password updated successfully!', [
          {
            text: 'Log In',
            onPress: () => router.replace('/auth/LoginScreen'),
          },
        ]);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update password.');
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
            Create New Password
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
            Enter your new password below to secure your account.
          </Text>

          {/* New Password Input */}
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1.5,
              borderColor: '#E2E8F0',
              backgroundColor: '#FFFFFF',
              borderRadius: 14,
              paddingHorizontal: 15,
              marginBottom: 16,
            }}
          >
            <Image
              source={require('../../../assets/icons/protected-lock.svg')}
              style={{ width: 22, height: 22 }}
              contentFit="contain"
            />
            <TextInput
              placeholder="New Password"
              placeholderTextColor="#94A3B8"
              secureTextEntry={!showPassword}
              style={{
                flex: 1,
                paddingVertical: 14,
                paddingLeft: 10,
                color: '#0F172A',
                fontSize: 15,
              }}
              value={password}
              onChangeText={(txt) => setPassword(txt)}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Image
                source={
                  showPassword
                    ? require('../../../assets/icons/hide-password.svg')
                    : require('../../../assets/icons/show-password.svg')
                }
                style={{ width: 22, height: 22 }}
                contentFit="contain"
              />
            </TouchableOpacity>
          </View>

          {/* Confirm New Password Input */}
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1.5,
              borderColor: '#E2E8F0',
              backgroundColor: '#FFFFFF',
              borderRadius: 14,
              paddingHorizontal: 15,
              marginBottom: 24,
            }}
          >
            <Image
              source={require('../../../assets/icons/protected-lock.svg')}
              style={{ width: 22, height: 22 }}
              contentFit="contain"
            />
            <TextInput
              placeholder="Confirm New Password"
              placeholderTextColor="#94A3B8"
              secureTextEntry={!showPassword}
              style={{
                flex: 1,
                paddingVertical: 14,
                paddingLeft: 10,
                color: '#0F172A',
                fontSize: 15,
              }}
              value={confirmPassword}
              onChangeText={(txt) => setConfirmPassword(txt)}
            />
          </View>

          <TouchableOpacity
            onPress={handleUpdatePassword}
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
                Update Password
              </Text>
            )}
          </TouchableOpacity>

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
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ResetPasswordScreen;
