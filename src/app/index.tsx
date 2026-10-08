import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndNavigate = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const userEmail = session.user?.email ?? '';
          const localFlag = userEmail ? await AsyncStorage.getItem(`@kalo_is_new_user_${userEmail}`) : null;
          const metaFlag = session.user?.user_metadata?.is_new_user;
          const isNewUser = metaFlag === true || localFlag === 'true';

          if (isNewUser) {
            if (userEmail) await AsyncStorage.removeItem(`@kalo_is_new_user_${userEmail}`);
            await supabase.auth.updateUser({ data: { is_new_user: false } });
            router.replace('/welcome');
          } else {
            router.replace('/today');
          }
        } else {
          router.replace('/auth/LoginScreen');
        }
      } catch (err) {
        router.replace('/auth/LoginScreen');
      }
    };


    const timer = setTimeout(() => {
      checkAuthAndNavigate();
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Centered Logo */}
      <View style={styles.centerContainer}>
        <Image 
          source={require('../../assets/icons/Kalo-Logo.svg')} 
          style={styles.logo}
          contentFit="contain"
        />
        <Text style={styles.title}>Kalo</Text>
      </View>

      {/* Bottom Tagline */}
      <View style={styles.bottomContainer}>
        <Text style={styles.tagline}>Snap it. Kalo counts it.</Text>
      </View>
    </SafeAreaView>
  );
}


const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#17A558',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  logo: {
    width: width * 0.35,
    height: width * 0.35,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 8,
  },
  bottomContainer: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  tagline: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
});
