import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '@/common/components/Card';
import { Screen } from '@/common/components/Screen';
import { colors } from '@/common/styles/theme';
import { OptionPicker } from './shared/OptionPicker';

export function RemindersConfigScreen() {
  const [minutes, setMinutes] = React.useState('15');
  return (
    <Screen>
      <Card style={styles.card}>
        <Text style={styles.title}>Recordatorios</Text>
        <Text style={styles.text}>Configura cuántos minutos antes quieres recibir avisos.</Text>
        <OptionPicker
          label="Tiempo"
          value={minutes}
          onChange={setMinutes}
          options={[
            { value: '5', label: '5 min' },
            { value: '15', label: '15 min' },
            { value: '30', label: '30 min' },
            { value: '60', label: '1 hora' },
          ]}
        />
        <View style={styles.preview}>
          <Text style={styles.previewText}>Aviso activo: {minutes} minutos antes</Text>
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { gap: 12 },
  title: { color: colors.primary, fontSize: 20, fontWeight: '900' },
  text: { color: colors.muted },
  preview: { backgroundColor: 'rgba(69,136,128,0.10)', borderRadius: 12, padding: 12 },
  previewText: { color: colors.primary, fontWeight: '800' },
});
