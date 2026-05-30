import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Card } from '@/common/components/Card';
import { FormInput } from '@/common/components/FormInput';
import { Screen } from '@/common/components/Screen';
import { colors } from '@/common/styles/theme';

export function HealthSectionScreen() {
  return (
    <Screen>
      <Card style={styles.card}>
        <Text style={styles.title}>Salud</Text>
        <FormInput label="Cita médica" value="Cardiólogo · 10:00" editable={false} />
        <FormInput label="Notas de texto" value="Llevar estudios previos. Sin audio por privacidad." editable={false} multiline />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { gap: 12 },
  title: { color: colors.primary, fontSize: 20, fontWeight: '900' },
});
