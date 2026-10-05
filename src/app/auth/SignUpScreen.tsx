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
import SignUpSuccessModal from './SignUpSuccessModal';
import { supabase } from '../../lib/supabase';

const SignUpScreen = () => {
  const router = useRouter();
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTextInput, setActiveTextInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [modalVisibility, setModalVisibility] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignUp = async () => {
    setErrorMessage('');

    if (!fullname.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          data: {
            full_name: fullname.trim(),
            contact: contact.trim(),
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        if (data.session) {
          router.replace('/today');
        } else {
          setModalVisibility(true);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Signup failed. Please try again.');
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
          <SignUpSuccessModal
            visible={modalVisibility}
            onClose={() => {
              setModalVisibility(false);
              router.replace('/auth/LoginScreen');
            }}
          />

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
            Create an Account
          </Text>
          <Text
            style={{
              textAlign: 'center',
              color: '#64748B',
              fontSize: 14,
              marginBottom: 24,
            }}
          >
            Start your calorie tracking journey today.
          </Text>

          {/* Full Name Input */}
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1.5,
              borderColor: activeTextInput === 'fullname' ? '#17A558' : '#E2E8F0',
              backgroundColor: '#FFFFFF',
              borderRadius: 14,
              marginBottom: 14,
              paddingHorizontal: 15,
            }}
          >
            <Image
              source={require('../../../assets/icons/person.svg')}
              style={{ width: 22, height: 22 }}
              contentFit="contain"
            />
            <TextInput
              placeholder="Full Name"
              placeholderTextColor="#94A3B8"
              style={{
                flex: 1,
                paddingVertical: 14,
                paddingHorizontal: 10,
                color: '#0F172A',
                fontSize: 15,
              }}
              onFocus={() => setActiveTextInput('fullname')}
              onBlur={() => setActiveTextInput('')}
              value={fullname}
              onChangeText={(txt) => setFullname(txt)}
            />
          </View>

          {/* Email Input */}
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1.5,
              borderColor: activeTextInput === 'email' ? '#17A558' : '#E2E8F0',
              backgroundColor: '#FFFFFF',
              borderRadius: 14,
              marginBottom: 14,
              paddingHorizontal: 15,
            }}
          >
            <Image
              source={require('../../../assets/icons/smart-email.svg')}
              style={{ width: 22, height: 22 }}
              contentFit="contain"
            />
            <TextInput
              placeholder="Email Address"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
              style={{
                flex: 1,
                paddingVertical: 14,
                paddingHorizontal: 10,
                color: '#0F172A',
                fontSize: 15,
              }}
              onFocus={() => setActiveTextInput('email')}
              onBlur={() => setActiveTextInput('')}
              value={email}
              onChangeText={(txt) => setEmail(txt)}
            />
          </View>

          {/* Phone/Contact Input */}
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1.5,
              borderColor: activeTextInput === 'contact' ? '#17A558' : '#E2E8F0',
              backgroundColor: '#FFFFFF',
              borderRadius: 14,
              marginBottom: 14,
              paddingHorizontal: 15,
            }}
          >
            <Image
              source={require('../../../assets/icons/phone.svg')}
              style={{ width: 22, height: 22 }}
              contentFit="contain"
            />
            <TextInput
              placeholder="Phone Number (Optional)"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
              style={{
                flex: 1,
                paddingVertical: 14,
                paddingHorizontal: 10,
                color: '#0F172A',
                fontSize: 15,
              }}
              onFocus={() => setActiveTextInput('contact')}
              onBlur={() => setActiveTextInput('')}
              value={contact}
              onChangeText={(txt) => setContact(txt)}
            />
          </View>

          {/* Password Input */}
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1.5,
              borderColor: activeTextInput === 'password' ? '#17A558' : '#E2E8F0',
              backgroundColor: '#FFFFFF',
              borderRadius: 14,
              marginBottom: 14,
              paddingHorizontal: 15,
            }}
          >
            <Image
              source={require('../../../assets/icons/protected-lock.svg')}
              style={{ width: 22, height: 22 }}
              contentFit="contain"
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#94A3B8"
              style={{
                flex: 1,
                paddingVertical: 14,
                paddingHorizontal: 10,
                color: '#0F172A',
                fontSize: 15,
              }}
              onFocus={() => setActiveTextInput('password')}
              onBlur={() => setActiveTextInput('')}
              secureTextEntry={!showPassword}
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

          {/* Confirm Password Input */}
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1.5,
              borderColor: activeTextInput === 'confirmPassword' ? '#17A558' : '#E2E8F0',
              backgroundColor: '#FFFFFF',
              borderRadius: 14,
              marginBottom: 20,
              paddingHorizontal: 15,
            }}
          >
            <Image
              source={require('../../../assets/icons/protected-lock.svg')}
              style={{ width: 22, height: 22 }}
              contentFit="contain"
            />
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor="#94A3B8"
              style={{
                flex: 1,
                paddingVertical: 14,
                paddingHorizontal: 10,
                color: '#0F172A',
                fontSize: 15,
              }}
              onFocus={() => setActiveTextInput('confirmPassword')}
              onBlur={() => setActiveTextInput('')}
              secureTextEntry={!showPassword}
              value={confirmPassword}
              onChangeText={(txt) => setConfirmPassword(txt)}
            />
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            onPress={handleSignUp}
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
                Create Account
              </Text>
            )}
          </TouchableOpacity>

          {/* Error Message */}
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

          {/* Login Redirect */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 24,
            }}
          >
            <Text style={{ color: '#64748B', fontSize: 15 }}>Already have an account? </Text>
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

export default SignUpScreen;
