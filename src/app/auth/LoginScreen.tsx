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

const LoginScreen = () => {
  const router = useRouter();
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [activityLoading, setActivityLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setActivityLoading(true);
    setErrorMessage('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        setErrorMessage(error.message);
      } else if (data.session) {
        router.replace('/today');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setActivityLoading(false);
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
          {/* Logo & Header */}
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
            Welcome Back!
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
            Sign in to track your meals and hit your daily goals.
          </Text>

          {/* Email Input */}
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
              marginBottom: 16,
            }}
          >
            <Image
              source={require('../../../assets/icons/smart-email.svg')}
              style={{ width: 22, height: 22 }}
              contentFit="contain"
            />
            <TextInput
              placeholder="Enter your email"
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
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              onChangeText={(txt) => {
                setEmail(txt);
                setErrorMessage('');
              }}
              value={email}
            />
          </View>

          {/* Password Input */}
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1.5,
              borderColor: passwordFocused ? '#17A558' : '#E2E8F0',
              backgroundColor: '#FFFFFF',
              borderRadius: 14,
              paddingHorizontal: 15,
              marginBottom: 12,
            }}
          >
            <Image
              source={require('../../../assets/icons/protected-lock.svg')}
              style={{ width: 30, height: 30 }}
              contentFit="contain"
            />
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor="#94A3B8"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrorMessage('');
              }}
              style={{
                flex: 1,
                paddingVertical: 14,
                paddingLeft: 10,
                paddingRight: 10,
                color: '#0F172A',
                fontSize: 15,
              }}
              secureTextEntry={!showPassword}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
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

          {/* Forgot Password Link */}
          <TouchableOpacity
            onPress={() => router.push('/auth/ForgetPasswordScreen')}
            style={{
              alignSelf: 'flex-end',
              marginBottom: 24,
            }}
          >
            <Text style={{ color: '#17A558', fontSize: 14, fontWeight: '600' }}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          {/* Sign In Button */}
          <TouchableOpacity
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
            onPress={handleLogin}
            disabled={activityLoading}
            activeOpacity={0.85}
          >
            {activityLoading ? (
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
                Sign In
              </Text>
            )}
          </TouchableOpacity>

          {/* Error Message Display */}
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

          {/* Sign Up Redirect Footer */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 24,
            }}
          >
            <Text style={{ color: '#64748B', fontSize: 15 }}>Don't have an account? </Text>
            <TouchableOpacity
              onPress={() => {
                router.push('/auth/SignUpScreen');
              }}
            >
              <Text style={{ color: '#17A558', fontSize: 15, fontWeight: '700' }}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
