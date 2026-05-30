import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radius, shadow } from '../styles/theme';
import { useAppStore } from '@/store/AppStore';

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  const { appearance } = useAppStore();
  return <View style={[styles.card, appearance.contrast === 'high' && styles.highContrast, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 16,
    ...shadow,
  },
  highContrast: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
});
