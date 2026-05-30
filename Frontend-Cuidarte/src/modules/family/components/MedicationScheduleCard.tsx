import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Medication } from '@/types';
import { colors, radius } from '@/common/styles/theme';

export function MedicationScheduleCard({ medication }: { medication: Medication }) {
  return (
    <View style={styles.card}>
      <Ionicons name="medkit-outline" size={24} color={colors.primary} />
      <View style={styles.body}>
        <Text style={styles.title}>{medication.name} {medication.dosage}</Text>
        <Text style={styles.text}>{medication.frequency} · {medication.times.join(', ')}</Text>
        <Text style={styles.stock}>Stock: {medication.stock} unidades</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 12,
  },
  body: { flex: 1 },
  title: { color: colors.text, fontWeight: '900', fontSize: 15 },
  text: { color: colors.muted, fontSize: 12, marginTop: 2 },
  stock: { color: colors.primary, fontSize: 12, fontWeight: '800', marginTop: 6 },
});
