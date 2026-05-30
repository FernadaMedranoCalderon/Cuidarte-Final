import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../styles/theme';

export function EmptyState({ text }: { text: string }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  text: {
    color: colors.muted,
    fontSize: 15,
    textAlign: 'center',
  },
});
