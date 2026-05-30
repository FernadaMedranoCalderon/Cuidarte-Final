import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/common/styles/theme';

export function ComplianceBadge({ value }: { value: number }) {
  const tone = value >= 80 ? colors.success : value >= 50 ? colors.warning : colors.danger;
  return (
    <View style={[styles.badge, { backgroundColor: `${tone}20` }]}>
      <Text style={[styles.text, { color: tone }]}>{value}% cumplimiento</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6, alignSelf: 'flex-start' },
  text: { fontSize: 12, fontWeight: '900' },
});
