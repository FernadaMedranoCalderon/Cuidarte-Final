import React from 'react';
import { Text, TextProps } from 'react-native';

export function LargeText({ style, ...props }: TextProps) {
  return <Text {...props} style={[{ fontSize: 18, lineHeight: 25, fontWeight: '700' }, style]} />;
}
