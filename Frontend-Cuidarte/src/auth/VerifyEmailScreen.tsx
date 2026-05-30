import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppButton } from '@/common/components/AppButton';
import { Card } from '@/common/components/Card';
import { colors } from '@/common/styles/theme';

export function VerifyEmailScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <View style={styles.screen}>
      <Card>
        <Text style={styles.title}>Verifica tu correo</Text>
        <Text style={styles.text}>Te enviaremos un enlace de confirmación cuando el backend esté conectado.</Text>
        <AppButton title="Continuar" onPress={onContinue} />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: colors.background,
  },
  title: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },
  text: {
    color: colors.muted,
    marginBottom: 16,
  },
});
