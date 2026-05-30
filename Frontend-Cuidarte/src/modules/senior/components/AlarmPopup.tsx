import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Activity } from '@/types';
import { AppButton } from '@/common/components/AppButton';
import { AppModal } from '@/common/components/AppModal';
import { Card } from '@/common/components/Card';
import { colors } from '@/common/styles/theme';

export function AlarmPopup({
  activity,
  onComplete,
  onJustify,
  onClose,
}: {
  activity?: Activity;
  onComplete: () => void;
  onJustify: () => void;
  onClose: () => void;
}) {
  return (
    <AppModal visible={Boolean(activity)} onClose={onClose}>
      <Card style={styles.card}>
        <View style={styles.circle}>
          <Ionicons name="notifications-outline" size={36} color={colors.warning} />
        </View>
        <Text style={styles.title}>¡Es hora de tu actividad!</Text>
        <Text style={styles.text}>{activity?.title}</Text>
        <Text style={styles.time}>{activity?.time}</Text>
        <AppButton title="Sí, voy a realizarla" onPress={onComplete} />
        <AppButton title="No puedo realizarla" variant="outline" onPress={onJustify} />
        <AppButton title="Recordar más tarde" variant="ghost" onPress={onClose} />
      </Card>
    </AppModal>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    gap: 10,
  },
  circle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
  },
  text: {
    color: colors.muted,
    fontSize: 15,
    textAlign: 'center',
  },
  time: {
    color: colors.muted,
    fontSize: 13,
    marginBottom: 4,
  },
});
