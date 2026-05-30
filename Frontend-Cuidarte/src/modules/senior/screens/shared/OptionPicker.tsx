import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '@/common/styles/theme';
import { getTextScale, useAppStore } from '@/store/AppStore';

type Option = {
  value: string;
  label: string;
};

export function OptionPicker({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
}) {
  const { appearance } = useAppStore();
  const scale = getTextScale(appearance.textSize);
  const highContrast = appearance.contrast === 'high';

  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { fontSize: 14 * scale }]}>{label}</Text>
      <View style={styles.options}>
        {options.map(option => {
          const selected = option.value === value;
          return (
            <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              style={[styles.option, highContrast && styles.optionHighContrast, selected && styles.selected]}
            >
              <Text style={[styles.optionText, { fontSize: 14 * scale }, selected && styles.selectedText]}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 8,
  },
  optionHighContrast: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  label: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '800',
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  selected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  selectedText: {
    color: colors.surface,
  },
});
