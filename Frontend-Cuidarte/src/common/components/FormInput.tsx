import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../styles/theme';
import { getTextScale, useAppStore } from '@/store/AppStore';

type FormInputProps = TextInputProps & {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
};

export function FormInput({ label, icon, style, ...props }: FormInputProps) {
  const { appearance } = useAppStore();
  const scale = getTextScale(appearance.textSize);
  const highContrast = appearance.contrast === 'high';

  return (
    <View style={styles.group}>
      <Text style={[styles.label, { fontSize: 14 * scale }]}>{label}</Text>
      <View style={styles.inputWrap}>
        {icon ? <Ionicons name={icon} size={20 * scale} color={highContrast ? colors.primary : '#9ca3af'} style={styles.icon} /> : null}
        <TextInput
          placeholderTextColor="#9ca3af"
          style={[
            styles.input,
            { fontSize: 16 * scale, minHeight: 52 * scale },
            highContrast && styles.inputHighContrast,
            icon ? styles.inputWithIcon : null,
            style,
          ]}
          {...props}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: 8,
  },
  inputHighContrast: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  label: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '700',
  },
  inputWrap: {
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    left: 14,
    top: 16,
    zIndex: 2,
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: radius.md,
    paddingHorizontal: 14,
    color: colors.text,
    backgroundColor: colors.surface,
    fontSize: 16,
  },
  inputWithIcon: {
    paddingLeft: 44,
  },
});
