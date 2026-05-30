import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/theme';
import { getTextScale, useAppStore } from '@/store/AppStore';

export type TabItem<T extends string> = {
  key: T;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

type BottomTabsProps<T extends string> = {
  items: TabItem<T>[];
  active: T;
  onChange: (key: T) => void;
};

export function BottomTabs<T extends string>({ items, active, onChange }: BottomTabsProps<T>) {
  const { appearance } = useAppStore();
  const scale = getTextScale(appearance.textSize);
  const highContrast = appearance.contrast === 'high';

  return (
    <View style={[styles.wrap, highContrast && styles.wrapHighContrast]}>
      {items.map(item => {
        const selected = item.key === active;
        return (
          <Pressable
            key={item.key}
            onPress={() => onChange(item.key)}
            style={[styles.tab, selected && styles.activeTab, highContrast && selected && styles.activeTabHighContrast]}
          >
            <View style={[styles.iconCircle, selected && styles.iconCircleActive]}>
              <Ionicons name={item.icon} size={24 * scale} color={selected ? colors.surface : colors.muted} />
            </View>
            <Text style={[styles.label, { fontSize: 12 * scale }, selected && styles.activeLabel]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 16,
  },
  wrapHighContrast: {
    borderTopColor: colors.primary,
    borderTopWidth: 2,
  },
  tab: {
    minWidth: 66,
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 16,
  },
  activeTab: {
    backgroundColor: 'rgba(69,136,128,0.14)',
  },
  activeTabHighContrast: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(17,24,39,0.04)',
  },
  iconCircleActive: {
    backgroundColor: colors.primary,
  },
  label: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800',
  },
  activeLabel: {
    color: colors.primary,
  },
});
