import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { colors } from '../styles/theme';
import { useAppStore } from '@/store/AppStore';

type ScreenProps = {
  children: React.ReactNode;
  scroll?: boolean;
  footer?: React.ReactNode;
};

export function Screen({ children, scroll = true, footer }: ScreenProps) {
  const { appearance } = useAppStore();
  const highContrast = appearance.contrast === 'high';

  return (
    <SafeAreaView style={[styles.safe, highContrast && styles.safeHighContrast]}>
      {scroll ? (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        <View style={styles.content}>{children}</View>
      )}
      {footer}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeHighContrast: {
    backgroundColor: '#eef2f7',
  },
  content: {
    flex: 1,
    padding: 12,
    paddingBottom: 92,
  },
});
