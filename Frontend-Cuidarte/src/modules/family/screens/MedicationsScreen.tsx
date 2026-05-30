import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Card } from '@/common/components/Card';
import { Screen } from '@/common/components/Screen';
import { colors } from '@/common/styles/theme';
import { useAppStore } from '@/store/AppStore';
import { MedicationScheduleCard } from '../components/MedicationScheduleCard';

export function MedicationsScreen() {
  const { medications } = useAppStore();
  return (
    <Screen>
      <Card style={styles.card}>
        <Text style={styles.title}>Medicamentos</Text>
        {medications.map(item => <MedicationScheduleCard key={item.id} medication={item} />)}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { gap: 12 },
  title: { color: colors.primary, fontSize: 20, fontWeight: '900' },
});
