import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle, StyleProp, TextStyle } from 'react-native';
import { colors, radius } from '../styles/theme';
import { getTextScale, useAppStore } from '@/store/AppStore';

type AppButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'danger' | 'ghost';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  leftIcon?: React.ReactNode;
};

export function AppButton({ title, onPress, variant = 'primary', disabled, style, leftIcon, textStyle }: AppButtonProps) {
  const { appearance } = useAppStore();
  const scale = getTextScale(appearance.textSize);
  const highContrast = appearance.contrast === 'high';

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        { minHeight: 44 * scale },
        styles[variant],
        highContrast && variant === 'outline' && styles.outlineHighContrast,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      {leftIcon}
      <Text style={[styles.text, { fontSize: 14 * scale }, variant !== 'primary' && variant !== 'danger' && styles.darkText, textStyle]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  outline: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: '#d1d5db',
  },
  outlineHighContrast: {
    borderColor: colors.primary,
    borderWidth: 3,
  },
  danger: {
    backgroundColor: colors.danger,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  text: {
    color: colors.surface,
    fontWeight: '700',
    fontSize: 14,
  },
  darkText: {
    color: colors.text,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
});
