import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '@/common/styles/theme';

type SimpleMapViewProps = {
  address?: string;
  relativeTime?: string;
};

export function SimpleMapView({ address, relativeTime }: SimpleMapViewProps) {
  return (
    <View style={styles.map}>
      <Ionicons name="location" size={48} color="#60a5fa" />
      <Text style={styles.title}>Última ubicación puntual</Text>
      <Text style={styles.text}>{address ?? 'Aún no hay una ubicación real compartida.'}</Text>
      <Text style={styles.muted}>{relativeTime ?? 'Cuando se comparta una ubicación, aparecerá aquí.'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    minHeight: 220,
    borderRadius: radius.lg,
    backgroundColor: '#172554',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: { color: colors.surface, fontSize: 18, fontWeight: '900', marginTop: 8 },
  text: { color: '#dbeafe', fontSize: 13, marginTop: 4, textAlign: 'center' },
  muted: { color: '#93c5fd', fontSize: 11, marginTop: 6 },
});
