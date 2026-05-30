import type { ActivityType } from '@/types';
import { colors } from '../styles/theme';

export const activityLabels: Record<ActivityType, string> = {
  medication: 'Medicamento',
  appointment: 'Cita',
  exercise: 'Actividad',
  social: 'Social',
  other: 'Otra',
};

export const activityColors: Record<ActivityType, string> = {
  medication: colors.primary,
  appointment: colors.primaryLight,
  exercise: colors.sky,
  social: colors.sky,
  other: colors.primary,
};

export const weekDayLabels = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
