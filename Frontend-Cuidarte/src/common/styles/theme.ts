export const colors = {
  primary: '#458880',
  primaryLight: '#66b9ac',
  sky: '#7ed0eb',
  background: '#f9fafb',
  surface: '#ffffff',
  text: '#111827',
  muted: '#6b7280',
  border: '#e5e7eb',
  danger: '#d4183d',
  success: '#16a34a',
  warning: '#d97706',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
};

export const shadow = {
  shadowColor: '#000',
  shadowOpacity: 0.08,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  elevation: 3,
};

export const gradientColors = [colors.primary, colors.primaryLight, colors.sky] as const;
