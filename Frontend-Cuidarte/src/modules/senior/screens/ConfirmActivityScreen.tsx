import React from 'react';
import { StyleSheet, Text } from 'react-native';
import type { Activity } from '@/types';
import { AppButton } from '@/common/components/AppButton';
import { Card } from '@/common/components/Card';
import { Screen } from '@/common/components/Screen';
import { colors } from '@/common/styles/theme';
import { useSeniorActivities } from '../hooks/useSeniorActivities';

export function ConfirmActivityScreen({ activity, onDone }: { activity: Activity; onDone: () => void }) {
  const { completeActivity } = useSeniorActivities();
  return (
    <Screen>
      <Card style={styles.card}>
        <Text style={styles.title}>Confirmar actividad</Text>
        <Text style={styles.text}>{activity.title}</Text>
        <Text style={styles.muted}>Validación requerida: {activity.evidenceRequired}</Text>
        <AppButton
          title="Confirmar"
          onPress={() => {
            completeActivity(activity.id, activity.evidenceRequired);
            onDone();
          }}
        />
        <AppButton title="Cancelar" variant="outline" onPress={onDone} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { gap: 12 },
  title: { color: colors.primary, fontSize: 20, fontWeight: '900' },
  text: { color: colors.text, fontSize: 18, fontWeight: '800' },
  muted: { color: colors.muted, fontSize: 13 },
});
