import React, { useRef, useState } from 'react';
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import type { Activity } from '@/types';
import { AppButton } from '@/common/components/AppButton';
import { colors } from '@/common/styles/theme';
import { getTextScale, useAppStore } from '@/store/AppStore';

export function EvidencePhotoScreen({
  activity,
  onCancel,
  onDone,
}: {
  activity?: Activity;
  onCancel: () => void;
  onDone: (evidence?: { photoUri?: string }) => void;
}) {
  const cameraRef = useRef<React.ElementRef<typeof CameraView> | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedPhotoUri, setCapturedPhotoUri] = useState<string | null>(null);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const { appearance } = useAppStore();
  const scale = getTextScale(appearance.textSize);

  const takePhoto = async () => {
    if (!cameraRef.current || isTakingPhoto) return;

    setIsTakingPhoto(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      setCapturedPhotoUri(photo.uri);
    } finally {
      setIsTakingPhoto(false);
    }
  };

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Pressable onPress={onCancel} style={styles.backButton}>
            <Ionicons name="chevron-back" size={26} color="#fff" />
            <Text style={[styles.backText, { fontSize: 16 * scale }]}>Actividades</Text>
          </Pressable>

          <View style={styles.permissionCard}>
            <View style={styles.iconCircle}>
              <Ionicons name="camera-outline" size={36} color="#fff" />
            </View>
            <Text style={[styles.title, { fontSize: 24 * scale }]}>Evidencia fotográfica</Text>
            <Text style={[styles.subtitle, { fontSize: 14 * scale }]}>Necesitamos permiso de cámara para tomar la foto y notificar a tu familiar o familiares.</Text>
            <View style={styles.permissionBox}>
              <Ionicons name="lock-closed-outline" size={28} color={colors.primary} />
              <Text style={styles.permissionText}>Activa el permiso de cámara para continuar.</Text>
            </View>
            <View style={styles.actions}>
              <AppButton title="Cancelar" variant="outline" onPress={onCancel} style={styles.flex} />
              <AppButton title="Permitir cámara" onPress={requestPermission} style={styles.flex} />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.fullScreenCamera}>
        {capturedPhotoUri ? (
          <Image source={{ uri: capturedPhotoUri }} style={styles.fullScreenCameraPreview} />
        ) : (
          <CameraView ref={cameraRef} style={styles.fullScreenCameraPreview} facing="back" />
        )}

        <View style={styles.cameraOverlay}>
          <View style={styles.topHeader}>
            <Pressable onPress={onCancel} style={styles.backButton}>
              <Ionicons name="chevron-back" size={26} color="#fff" />
              <Text style={[styles.backText, { fontSize: 16 * scale }]}>Actividades</Text>
            </Pressable>

            <View style={styles.cameraBadge}>
              <Ionicons name="camera-outline" size={16} color={colors.primary} />
              <Text style={styles.cameraBadgeText}>{capturedPhotoUri ? 'Foto capturada' : 'Apunta la cámara a la evidencia'}</Text>
            </View>
          </View>

          {/* caption moved to top badge when photo captured */}

          {capturedPhotoUri ? (
            <View style={styles.bottomPanel}>
              <AppButton
                title="Repetir"
                variant="outline"
                onPress={() => setCapturedPhotoUri(null)}
                style={[styles.capturedButton, styles.buttonHalo, styles.largeButton]}
                textStyle={{ fontSize: 18 * scale }}
              />
              <AppButton
                title="Enviar"
                onPress={() => onDone({ photoUri: capturedPhotoUri })}
                style={[styles.capturedButton, styles.buttonHalo, styles.largeButton]}
                textStyle={{ fontSize: 18 * scale }}
              />
            </View>
          ) : (
            <View style={styles.bottomPanelSingle}>
              <AppButton title={isTakingPhoto ? 'Tomando foto...' : 'Tomar foto'} onPress={takePhoto} disabled={isTakingPhoto} style={[styles.singleButton, styles.buttonHalo, styles.largeButton]} textStyle={{ fontSize: 20 * scale, fontWeight: '900' }} />
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

export const EvidenceCameraScreen = EvidencePhotoScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 18,
  },
  permissionCard: {
    gap: 14,
    padding: 18,
    borderRadius: 24,
    backgroundColor: '#fff',
  },
  fullScreenCamera: {
    flex: 1,
    backgroundColor: '#000',
  },
  fullScreenCameraPreview: {
    ...StyleSheet.absoluteFillObject,
  },
  cameraOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    paddingTop: 14,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    backgroundColor: '#1f4f45',
    borderRadius: 22,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginTop: 2,
  },
  capturedHeader: {
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 18,
    gap: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  backText: {
    color: '#fff',
    fontWeight: '900',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: colors.primary,
  },
  title: {
    color: colors.primary,
    fontWeight: '900',
    textAlign: 'center',
  },
  subtitle: {
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 20,
  },
  camera: {
    flex: 1,
  },
  cameraBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    flexShrink: 1,
  },
  cameraBadgeText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '800',
  },
  buttonHalo: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 14,
  },
  largeButton: {
    minHeight: 64,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
  },
  
  permissionBox: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#dbeafe',
    backgroundColor: '#f8fbff',
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  permissionText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  bottomPanel: {
    gap: 12,
    backgroundColor: 'rgba(0,0,0,0.38)',
    padding: 14,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 12,
  },
  bottomPanelSingle: {
    gap: 12,
    backgroundColor: 'rgba(0,0,0,0.38)',
    padding: 14,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 12,
  },
  singleButton: {
    width: '100%',
    alignSelf: 'center',
  },
  capturedButton: {
    flex: 0,
    width: '48%',
  },
  flex: { flex: 1 },
});
