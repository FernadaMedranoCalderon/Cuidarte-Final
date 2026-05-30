import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Card } from '@/common/components/Card';
import { Screen } from '@/common/components/Screen';
import { colors } from '@/common/styles/theme';
import { OptionPicker } from '@/modules/senior/screens/shared/OptionPicker';

export function AlertRulesScreen() {
  const [graceTime, setGraceTime] = React.useState('15');
  return (
    <Screen>
      <Card style={styles.card}>
        <Text style={styles.title}>Reglas de alerta</Text>
        <OptionPicker
          label="Tiempo de gracia"
          value={graceTime}
          onChange={setGraceTime}
          options={[
            { value: '0', label: 'Inmediato' },
            { value: '15', label: '15 min' },
            { value: '30', label: '30 min' },
            { value: '60', label: '1 hora' },
          ]}
        />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { gap: 12 },
  title: { color: colors.primary, fontSize: 20, fontWeight: '900' },
});
