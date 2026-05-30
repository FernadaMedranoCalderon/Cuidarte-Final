import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/common/styles/theme';

type BadgeStatus = 'completed' | 'pending' | 'rejected';

export function VerificationBadge({ status = 'pending' }: { status?: BadgeStatus }) {
  const icon = status === 'completed' ? 'checkmark-circle' : status === 'rejected' ? 'close-circle' : 'time-outline';
  const label = status === 'completed' ? 'Completada' : status === 'rejected' ? 'No realizada' : 'Pendiente';
  const tone = status === 'completed' ? colors.success : status === 'rejected' ? colors.danger : colors.warning;

  return (
    <View style={[styles.badge, status === 'completed' ? styles.done : status === 'rejected' ? styles.rejected : styles.pending]}>
      <Ionicons name={icon} size={18} color={tone} />
      <Text style={[styles.text, { color: tone }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  done: {
    backgroundColor: '#dcfce7',
  },
  pending: {
    backgroundColor: '#fef3c7',
  },
  rejected: {
    backgroundColor: '#fee2e2',
  },
  text: {
    fontSize: 12,
    fontWeight: '800',
  },
});
