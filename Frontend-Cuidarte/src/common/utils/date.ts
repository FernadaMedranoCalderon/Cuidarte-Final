import { format, isToday, isTomorrow, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatLongDay = (date: Date) => format(date, "EEEE, d 'de' MMMM", { locale: es });
export const formatMonthTitle = (date: Date) => format(date, 'MMMM yyyy', { locale: es });
export const formatDayTitle = (date: Date) => format(date, "d 'de' MMMM", { locale: es });

export const friendlyDate = (date: Date) => {
  if (isToday(date)) return 'Hoy';
  if (isTomorrow(date)) return 'Mañana';
  return format(date, "d MMM", { locale: es });
};

export const sameDay = isSameDay;

export const parseLocalDate = (value: string) => {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
};
