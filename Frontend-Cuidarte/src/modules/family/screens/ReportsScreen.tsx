import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { ActivityType } from '@/types';
import { Card } from '@/common/components/Card';
import { Screen } from '@/common/components/Screen';
import { activityLabels } from '@/common/utils/constants';
import { colors } from '@/common/styles/theme';
import { useReportsData } from '../hooks/useReportsData';

const typeOrder: ActivityType[] = ['medication', 'appointment', 'exercise', 'social', 'other'];

function getTypeLabel(type: ActivityType) {
  return activityLabels[type] ?? 'Social';
}

export function ReportsScreen() {
  const { weekly, weeklyTypes, monthlyTypes, monthActivities, monthCompleted, monthPending, monthPct } = useReportsData();

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Card style={styles.monthCard}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.sectionTitle}>Resumen mensual</Text>
              <Text style={styles.sectionSubtitle}>Del mes actual</Text>
            </View>
            <View style={styles.monthPctChip}>
              <Text style={styles.monthPctValue}>{monthPct}%</Text>
            </View>
          </View>

          <View style={styles.monthGrid}>
            <View style={styles.monthStat}>
              <Text style={styles.monthStatValue}>{monthActivities.length}</Text>
              <Text style={styles.monthStatLabel}>Actividades</Text>
            </View>
            <View style={styles.monthStat}>
              <Text style={styles.monthStatValue}>{monthCompleted}</Text>
              <Text style={styles.monthStatLabel}>Completadas</Text>
            </View>
            <View style={styles.monthStat}>
              <Text style={styles.monthStatValue}>{monthPending}</Text>
              <Text style={styles.monthStatLabel}>Pendientes</Text>
            </View>
            <View style={styles.monthStat}>
              <Text style={styles.monthStatValue}>{monthActivities.length ? Math.round((monthCompleted / monthActivities.length) * 100) : 0}%</Text>
              <Text style={styles.monthStatLabel}>Cumplimiento</Text>
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${monthPct}%` }]} />
          </View>
        </Card>

        <Card style={styles.sectionCard}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.sectionTitle}>Cumplimiento semanal</Text>
              <Text style={styles.sectionSubtitle}>Porcentaje por día, base 100%</Text>
            </View>
            <Text style={styles.helperText}>Últimos 7 días</Text>
          </View>

          <View style={styles.weekGrid}>
            {weekly.map(day => (
              <View key={day.label + day.date.toISOString()} style={styles.weekItem}>
                <View style={styles.weekBarTrack}>
                  <View style={[styles.weekBarFill, { height: `${Math.max(8, day.pct)}%` }]} />
                </View>
                <Text style={styles.weekPct}>{day.pct}%</Text>
                <Text style={styles.weekLabel}>{day.label}</Text>
              </View>
            ))}
          </View>
        </Card>

        <Card style={styles.sectionCard}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.sectionTitle}>Actividades por tipo</Text>
              <Text style={styles.sectionSubtitle}>Últimos 7 días</Text>
            </View>
            <Text style={styles.helperText}>Semana</Text>
          </View>

          <View style={styles.typeList}>
            {typeOrder.map(type => {
              const count = weeklyTypes[type] ?? 0;
              const total = Math.max(1, Math.max(...typeOrder.map(item => weeklyTypes[item] ?? 0)));
              const width = `${(count / total) * 100}%`;
              return (
                <View key={`week-${type}`} style={styles.typeRow}>
                  <Text style={styles.typeLabel}>{getTypeLabel(type)}</Text>
                  <View style={styles.typeBarTrack}>
                    <View style={[styles.typeBarFill, { width: width as any }]} />
                  </View>
                  <Text style={styles.typeCount}>{count}</Text>
                </View>
              );
            })}
          </View>
        </Card>

        <Card style={styles.sectionCard}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.sectionTitle}>Actividades por tipo</Text>
              <Text style={styles.sectionSubtitle}>Mes actual</Text>
            </View>
            <Text style={styles.helperText}>Mensual</Text>
          </View>

          <View style={styles.typeList}>
            {typeOrder.map(type => {
              const count = monthlyTypes[type] ?? 0;
              const total = Math.max(1, Math.max(...typeOrder.map(item => monthlyTypes[item] ?? 0)));
              const width = `${(count / total) * 100}%`;
              return (
                <View key={`month-${type}`} style={styles.typeRow}>
                  <Text style={styles.typeLabel}>{getTypeLabel(type)}</Text>
                  <View style={styles.typeBarTrack}>
                    <View style={[styles.typeBarFill, { width: width as any }]} />
                  </View>
                  <Text style={styles.typeCount}>{count}</Text>
                </View>
              );
            })}
          </View>
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 12,
    paddingBottom: 20,
  },
  heroCard: {
    gap: 8,
    backgroundColor: '#1f5a4e',
    borderWidth: 0,
  },
  kicker: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '900',
  },
  heroText: {
    color: 'rgba(255,255,255,0.92)',
    lineHeight: 20,
    fontSize: 14,
  },
  monthCard: {
    gap: 12,
  },
  sectionCard: {
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  sectionTitle: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: '900',
  },
  sectionSubtitle: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 2,
  },
  helperText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  monthPctChip: {
    minWidth: 66,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(31,90,78,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  monthPctValue: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '900',
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  monthStat: {
    width: '48%',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  monthStatValue: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: '900',
  },
  monthStatLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '700',
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: '#e5e7eb',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  weekGrid: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingTop: 6,
  },
  weekItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  weekBarTrack: {
    height: 110,
    width: '100%',
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    justifyContent: 'flex-end',
    overflow: 'hidden',
    padding: 4,
  },
  weekBarFill: {
    width: '100%',
    borderRadius: 12,
    backgroundColor: '#1f5a4e',
  },
  weekPct: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '900',
  },
  weekLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '700',
  },
  typeList: {
    gap: 12,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeLabel: {
    width: 88,
    color: colors.text,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  typeBarTrack: {
    flex: 1,
    height: 12,
    borderRadius: 999,
    backgroundColor: '#f3f4f6',
    overflow: 'hidden',
  },
  typeBarFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  typeCount: {
    width: 28,
    textAlign: 'right',
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800',
  },
});
