import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Card } from '@/common/components/Card';
import { Screen } from '@/common/components/Screen';
import { colors } from '@/common/styles/theme';
import { SimpleMapView } from '../components/SimpleMapView';

export function LocationTrackingScreen() {
  return (
    <Screen>
      <Card style={styles.card}>
        <Text style={styles.title}>Ubicación</Text>
        <Text style={styles.text}>Solo se muestra la última ubicación puntual compartida al completar una cita.</Text>
        <SimpleMapView />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { gap: 12 },
  title: { color: colors.primary, fontSize: 20, fontWeight: '900' },
  text: { color: colors.muted, fontSize: 13 },
});
