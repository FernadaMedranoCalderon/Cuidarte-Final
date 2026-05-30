import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/common/components/Card';
import { Screen } from '@/common/components/Screen';
import { colors } from '@/common/styles/theme';

export function TutorialScreen({ onBack }: { onBack?: () => void }) {
  return (
    <Screen>
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
          <Text style={styles.backText}>Perfil</Text>
        </Pressable>
        <Text style={styles.title}>Guía inicial</Text>
      </View>

      <Card style={styles.card}>
        <Ionicons name="help-circle-outline" size={48} color={colors.primary} />
        <Text style={styles.cardTitle}>Guía completa próximamente</Text>
        <Text style={styles.text}>
          Aquí pondremos, al final, la explicación completa de todo lo que puede hacer el adulto mayor dentro de Cuidarte.
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.surface,
    marginHorizontal: -12,
    marginTop: -12,
    marginBottom: 12,
    padding: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 2,
    marginBottom: 12,
  },
  backText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '900',
  },
  title: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: '900',
  },
  card: {
    alignItems: 'center',
    gap: 12,
  },
  cardTitle: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
  },
  text: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 23,
    textAlign: 'center',
  },
});
