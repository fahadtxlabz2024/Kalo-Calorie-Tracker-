import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Image as ExpoImage } from 'expo-image';
import { X, Zap, ZapOff, Image as ImageIcon, Check, RotateCcw } from 'lucide-react-native';
import { useMeals } from '../context/MealContext';

export default function CameraScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const { setPendingImageUri } = useMeals();
  const [isCapturing, setIsCapturing] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [capturedPhotoUri, setCapturedPhotoUri] = useState<string | null>(null);
  const cameraRef = useRef<any>(null);

  const toggleFlash = () => {
    setFlash(prev => (prev === 'off' ? 'on' : 'off'));
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const uri = asset.base64 
        ? `data:image/jpeg;base64,${asset.base64}` 
        : asset.uri;
      setCapturedPhotoUri(uri);
    }
  };

  const handleTakePicture = async () => {
    if (cameraRef.current && !isCapturing) {
      setIsCapturing(true);
      try {
        const photo = await cameraRef.current.takePictureAsync({ 
          quality: 0.7,
          base64: true,
        });
        if (photo) {
          const uri = photo.base64 
            ? `data:image/jpeg;base64,${photo.base64}` 
            : photo.uri;
          setCapturedPhotoUri(uri);
        }
      } catch (e) {
        console.log('Error capturing photo:', e);
      } finally {
        setIsCapturing(false);
      }
    }
  };

  const handleConfirmPhoto = () => {
    if (capturedPhotoUri && !isConfirming) {
      setIsConfirming(true);
      setPendingImageUri(capturedPhotoUri);
      router.push('/analyzing');
    }
  };

  const handleRetakePhoto = () => {
    setCapturedPhotoUri(null);
    setIsConfirming(false);
  };

  // Permission UI if not granted
  if (!permission) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color="#17A558" />
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <StatusBar style="light" />
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
            <X size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.permissionContent}>
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionText}>
            Kalo needs camera access so you can snap your meals and track calories automatically.
          </Text>

          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Allow Camera Access</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Top Bar Navigation */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()} activeOpacity={0.7}>
          <X size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {capturedPhotoUri ? 'Check your meal' : 'Snap your meal'}
        </Text>

        {!capturedPhotoUri ? (
          <TouchableOpacity style={styles.iconButton} onPress={toggleFlash} activeOpacity={0.7}>
            {flash === 'on' ? (
              <Zap size={22} color="#F59E0B" fill="#F59E0B" />
            ) : (
              <ZapOff size={22} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        ) : (
          <View style={{ width: 44 }} />
        )}
      </View>

      {/* Camera Viewfinder / Captured Photo Frame */}
      <View style={styles.viewfinderContainer}>
        {capturedPhotoUri ? (
          <ExpoImage 
            source={{ uri: capturedPhotoUri }} 
            style={StyleSheet.absoluteFill} 
            contentFit="cover" 
          />
        ) : (
          <CameraView
            ref={cameraRef}
            style={styles.cameraView}
            facing="back"
            enableTorch={flash === 'on'}
          />
        )}

        {/* Target Corner Reticles Overlay */}
        <View style={[styles.cornerReticle, styles.topLeft]} pointerEvents="none" />
        <View style={[styles.cornerReticle, styles.topRight]} pointerEvents="none" />
        <View style={[styles.cornerReticle, styles.bottomLeft]} pointerEvents="none" />
        <View style={[styles.cornerReticle, styles.bottomRight]} pointerEvents="none" />
      </View>

      {/* Instruction Text */}
      <View style={styles.instructionContainer}>
        <Text style={styles.instructionTitle}>
          {capturedPhotoUri ? 'Looks good?' : 'Fit the whole plate in the frame'}
        </Text>
        <Text style={styles.instructionSubtitle}>
          {capturedPhotoUri ? 'Tap the check mark to analyze' : 'Kalo does the rest'}
        </Text>
      </View>

      {/* Bottom Action Controls */}
      <View style={styles.controlsRow}>
        {capturedPhotoUri ? (
          <>
            {/* Retake Photo Button */}
            <TouchableOpacity style={styles.retakeButton} onPress={handleRetakePhoto} activeOpacity={0.7}>
              <RotateCcw size={22} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Confirm Green Tick Button */}
            <TouchableOpacity 
              style={styles.confirmTickButton} 
              onPress={handleConfirmPhoto} 
              activeOpacity={0.85}
              disabled={isConfirming}
            >
              {isConfirming ? (
                <ActivityIndicator size="large" color="#FFFFFF" />
              ) : (
                <Check size={36} color="#FFFFFF" strokeWidth={3} />
              )}
            </TouchableOpacity>

            {/* Empty space balancer */}
            <View style={{ width: 52 }} />
          </>
        ) : (
          <>
            {/* Gallery Pick Button */}
            <TouchableOpacity style={styles.galleryButton} onPress={handlePickImage} activeOpacity={0.7}>
              <ImageIcon size={22} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Shutter Capture Button */}
            <TouchableOpacity 
              style={styles.shutterOuterCircle} 
              onPress={handleTakePicture}
              activeOpacity={0.85}
              disabled={isCapturing}
            >
              {isCapturing ? (
                <ActivityIndicator size="small" color="#17A558" />
              ) : (
                <View style={styles.shutterInnerCircle} />
              )}
            </TouchableOpacity>

            {/* Empty space balancer */}
            <View style={{ width: 52 }} />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B130E',
    justifyContent: 'space-between',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#0B130E',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  permissionContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 28,
  },
  permissionButton: {
    backgroundColor: '#17A558',
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 28,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewfinderContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: '#1C2820',
    position: 'relative',
  },
  cameraView: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  cornerReticle: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderColor: '#FFFFFF',
  },
  topLeft: {
    top: 24,
    left: 24,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 14,
  },
  topRight: {
    top: 24,
    right: 24,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 14,
  },
  bottomLeft: {
    bottom: 24,
    left: 24,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 14,
  },
  bottomRight: {
    bottom: 24,
    right: 24,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 14,
  },
  instructionContainer: {
    alignItems: 'center',
    marginVertical: 14,
  },
  instructionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  instructionSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#94A3B8',
    marginTop: 4,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingBottom: 24,
  },
  galleryButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  retakeButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmTickButton: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: '#17A558',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#17A558',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  shutterOuterCircle: {
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  shutterInnerCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
  },
});
