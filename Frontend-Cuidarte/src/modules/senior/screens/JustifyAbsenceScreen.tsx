import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import type { Activity } from '@/types';
import { AppButton } from '@/common/components/AppButton';
import { Card } from '@/common/components/Card';
import { FormInput } from '@/common/components/FormInput';
import { Screen } from '@/common/components/Screen';
import { colors } from '@/common/styles/theme';
import { useSeniorActivities } from '../hooks/useSeniorActivities';

export function JustifyAbsenceScreen({ activity, onDone }: { activity: Activity; onDone: () => void }) {
  const [reason, setReason] = useState('');
  const { justifyActivity } = useSeniorActivities();
  return (
    <Screen>
      <Card style={styles.card}>
        <Text style={styles.title}>¿Por qué no puedes realizarla?</Text>
        <Text style={styles.text}>{activity.title}</Text>
        <FormInput label="Razón" value={reason} onChangeText={setReason} placeholder="Ej: No me siento bien" />
        <AppButton
          title="Enviar justificación"
          disabled={!reason}
          onPress={() => {
            justifyActivity(activity.id, reason);
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
  text: { color: colors.muted, fontSize: 14 },
});
