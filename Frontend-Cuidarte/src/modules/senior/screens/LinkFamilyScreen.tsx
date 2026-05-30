import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Card } from '@/common/components/Card';
import { Screen } from '@/common/components/Screen';
import { colors } from '@/common/styles/theme';
import { useAppStore } from '@/store/AppStore';

export function LinkFamilyScreen() {
  const { user } = useAppStore();
  return (
    <Screen>
      <Card>
        <Text style={styles.title}>Vincular familiar</Text>
        <Text style={styles.text}>Comparte este ID con tu familiar.</Text>
        <Text style={styles.code}>{user?.id ?? '1234567890'}</Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.primary, fontSize: 20, fontWeight: '900' },
  text: { color: colors.muted, marginTop: 8 },
  code: { color: colors.primary, fontSize: 34, fontWeight: '900', textAlign: 'center', marginTop: 18 },
});
