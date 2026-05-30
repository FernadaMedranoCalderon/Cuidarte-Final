import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { addMonths, eachDayOfInterval, endOfMonth, format, isSameDay, isToday, startOfMonth, subMonths } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import type { Activity } from '@/types';
import { AppButton } from '@/common/components/AppButton';
import { AppModal } from '@/common/components/AppModal';
import { Card } from '@/common/components/Card';
import { EmptyState } from '@/common/components/EmptyState';
import { Screen } from '@/common/components/Screen';
import { colors } from '@/common/styles/theme';
import { activityColors, weekDayLabels } from '@/common/utils/constants';
import { formatDayTitle, formatMonthTitle } from '@/common/utils/date';
import { SimpleActivityCard } from '../components/SimpleActivityCard';
import { useSeniorActivities } from '../hooks/useSeniorActivities';

type CalendarScreenProps = {
  onCreate?: (activity?: Activity) => void;
};

export function CalendarScreen({ onCreate }: CalendarScreenProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activityToDelete, setActivityToDelete] = useState<Activity | null>(null);
  const { activitiesForDate, setActivities, deleteActivity } = useSeniorActivities();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const emptyDays = Array.from({ length: monthStart.getDay() });
  const selectedActivities = activitiesForDate(selectedDate);

  return (
    <>
      <Screen scroll={false}>
        <View style={styles.page}>
          <View>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Calendario</Text>
              <Text style={styles.headerText}>Toca un día para ver sus actividades.</Text>
            </View>

            {onCreate ? (
              <AppButton
                title="Nueva actividad"
                onPress={() => onCreate()}
                leftIcon={<Ionicons name="add-circle-outline" size={24} color="#fff" />}
                style={styles.newActivityButton}
              />
            ) : null}
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <Card style={styles.calendar}>
              <View style={styles.monthRow}>
                <Pressable onPress={() => setCurrentMonth(subMonths(currentMonth, 1))} style={styles.arrow}>
                  <Ionicons name="chevron-back" size={34} color={colors.primary} />
                </Pressable>
                <Text style={styles.monthTitle}>{formatMonthTitle(currentMonth)}</Text>
                <Pressable onPress={() => setCurrentMonth(addMonths(currentMonth, 1))} style={styles.arrow}>
                  <Ionicons name="chevron-forward" size={34} color={colors.primary} />
                </Pressable>
              </View>

              <View style={styles.weekGrid}>
                {weekDayLabels.map((label, index) => (
                  <Text key={`${label}-${index}`} style={styles.weekLabel}>{label}</Text>
                ))}
              </View>

              <View style={styles.grid}>
                {emptyDays.map((_, index) => <View key={`empty-${index}`} style={styles.dayCell} />)}
                {days.map(day => {
                  const dayActivities = activitiesForDate(day);
                  const selected = isSameDay(day, selectedDate);
                  const today = isToday(day);
                  return (
                    <Pressable
                      key={day.toISOString()}
                      onPress={() => setSelectedDate(day)}
                      style={[styles.dayCell, styles.dayButton, selected && styles.daySelected, today && !selected && styles.todayCell]}
                    >
                      <Text style={[styles.dayText, selected && styles.daySelectedText]}>{format(day, 'd')}</Text>
                      {dayActivities.length > 0 ? (
                        <View style={styles.activityMarker}>
                          <View style={[styles.countBubble, selected && styles.countBubbleSelected]}>
                            <Text style={[styles.countText, selected && styles.countTextSelected]}>{dayActivities.length}</Text>
                          </View>
                        </View>
                      ) : null}
                    </Pressable>
                  );
                })}
              </View>
            </Card>

            <Card style={styles.list}>
              <Text style={styles.sectionTitle}>{formatDayTitle(selectedDate)}</Text>
              {selectedActivities.length === 0 ? (
                <EmptyState text="No hay actividades para esta fecha" />
              ) : (
                selectedActivities.map(activity => (
                  <SimpleActivityCard
                      key={activity.id}
                      activity={activity}
                      onEdit={() => onCreate?.(activity)}
                      onDelete={() => setActivityToDelete(activity)}
                    />
                ))
              )}
            </Card>

            <AppModal visible={Boolean(activityToDelete)} onClose={() => setActivityToDelete(null)}>
          <Card style={styles.deleteCard}>
            <View style={styles.deleteIcon}>
              <Ionicons name="trash-outline" size={36} color={colors.danger} />
            </View>
            <Text style={styles.deleteTitle}>¿Eliminar actividad?</Text>
            <Text style={styles.deleteText}>Esta acción no se puede deshacer.</Text>
            <View style={styles.deleteActions}>
                <AppButton
                title="Eliminar"
                variant="danger"
                onPress={() => {
                  if (activityToDelete) {
                    deleteActivity(activityToDelete.id);
                  }
                  setActivityToDelete(null);
                }}
                style={styles.deleteActionButton}
              />
              <AppButton title="Cancelar" variant="outline" onPress={() => setActivityToDelete(null)} style={styles.deleteActionButton} />
            </View>
          </Card>
            </AppModal>
          </ScrollView>
        </View>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.surface,
    marginHorizontal: -12,
    marginTop: -12,
    marginBottom: 12,
    padding: 16,
  },
  headerTitle: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: '900',
  },
  headerText: {
    color: colors.muted,
    fontSize: 15,
    marginTop: 4,
  },
  page: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 12,
  },
  calendar: {
    marginBottom: 14,
    padding: 12,
  },
  newActivityButton: {
    minHeight: 58,
    borderRadius: 18,
    marginBottom: 12,
  },
  monthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  arrow: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(69,136,128,0.10)',
  },
  monthTitle: {
    flex: 1,
    color: colors.primary,
    fontSize: 21,
    fontWeight: '900',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  weekGrid: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekLabel: {
    flex: 1,
    textAlign: 'center',
    color: colors.muted,
    fontSize: 15,
    fontWeight: '900',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 6,
  },
  dayCell: {
    width: `${100 / 7}%`,
    minHeight: 66,
  },
  dayButton: {
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#eef2f7',
  },
  daySelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  todayCell: {
    backgroundColor: 'rgba(69,136,128,0.14)',
    borderColor: colors.primary,
  },
  dayText: {
    color: colors.text,
    fontSize: 21,
    fontWeight: '900',
  },
  daySelectedText: {
    color: colors.surface,
  },
  activityMarker: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 22,
    marginTop: 6,
  },
  countBubble: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1f5a4e',
  },
  countBubbleSelected: {
    backgroundColor: '#1f5a4e',
  },
  countText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: '900',
  },
  countTextSelected: {
    color: colors.surface,
  },
  list: {
    gap: 10,
    marginBottom: 88,
  },
  deleteCard: {
    alignItems: 'center',
    gap: 12,
  },
  deleteIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteTitle: {
    color: colors.danger,
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
  },
  deleteText: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 21,
    textAlign: 'center',
  },
  deleteActions: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  deleteActionButton: {
    flex: 1,
  },
  sectionTitle: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: '900',
    textTransform: 'capitalize',
  },
});
