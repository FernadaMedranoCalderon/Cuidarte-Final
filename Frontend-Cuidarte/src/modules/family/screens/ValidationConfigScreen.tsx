import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Card } from '@/common/components/Card';
import { Screen } from '@/common/components/Screen';
import { colors } from '@/common/styles/theme';
import { OptionPicker } from '@/modules/senior/screens/shared/OptionPicker';

export function ValidationConfigScreen() {
  const [validation, setValidation] = React.useState('photo');
  return (
    <Screen>
      <Card style={styles.card}>
        <Text style={styles.title}>Validación</Text>
        <OptionPicker
          label="Tipo de validación"
          value={validation}
          onChange={setValidation}
          options={[
            { value: 'photo', label: 'Foto' },
            { value: 'button', label: 'Botón' },
            { value: 'none', label: 'Ninguna' },
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
