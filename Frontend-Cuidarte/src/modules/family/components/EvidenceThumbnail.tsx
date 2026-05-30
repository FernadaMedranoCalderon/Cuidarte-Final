import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/common/styles/theme';

export function EvidenceThumbnail({ evidence }: { evidence?: string }) {
  if (!evidence) return null;
  const isLocation = evidence === 'location-shared';
  return (
    <View style={styles.box}>
      <Ionicons name={isLocation ? 'location-outline' : 'camera-outline'} size={28} color={isLocation ? '#60a5fa' : '#4ade80'} />
      <Text style={styles.text}>{isLocation ? 'Ubicación compartida' : 'Foto de evidencia'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderRadius: radius.md,
    padding: 14,
    backgroundColor: '#111827',
    alignItems: 'center',
    gap: 6,
  },
  text: { color: colors.surface, fontSize: 12, fontWeight: '800' },
});
