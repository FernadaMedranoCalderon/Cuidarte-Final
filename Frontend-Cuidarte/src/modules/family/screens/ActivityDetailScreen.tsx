import React from 'react';
import { StyleSheet, Text } from 'react-native';
import type { Activity } from '@/types';
import { Card } from '@/common/components/Card';
import { Screen } from '@/common/components/Screen';
import { colors } from '@/common/styles/theme';
import { EvidenceThumbnail } from '../components/EvidenceThumbnail';

export function ActivityDetailScreen({ activity }: { activity?: Activity }) {
  return (
    <Screen>
      <Card style={styles.card}>
        <Text style={styles.title}>{activity?.title ?? 'Detalle de actividad'}</Text>
        <Text style={styles.text}>{activity?.description ?? 'Selecciona una actividad para revisar su evidencia.'}</Text>
        <Text style={styles.status}>{activity?.completed ? 'Completada' : 'Pendiente'}</Text>
        <EvidenceThumbnail evidence={activity?.evidencePhoto} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { gap: 12 },
  title: { color: colors.primary, fontSize: 20, fontWeight: '900' },
  text: { color: colors.muted },
  status: { color: colors.text, fontWeight: '900' },
});
