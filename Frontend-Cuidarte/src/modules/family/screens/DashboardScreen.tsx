import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import type { Activity } from '@/types';
import { AppButton } from '@/common/components/AppButton';
import { AppModal } from '@/common/components/AppModal';
import { Card } from '@/common/components/Card';
import { EmptyState } from '@/common/components/EmptyState';
import { Screen } from '@/common/components/Screen';
import { colors } from '@/common/styles/theme';
import { SimpleActivityCard } from '@/modules/senior/components/SimpleActivityCard';
import { useSeniorActivities } from '@/modules/senior/hooks/useSeniorActivities';
import { useSeniorSync } from '../hooks/useSeniorSync';

type DashboardScreenProps = {
  onCreate: (activity?: Activity) => void;
  onNotifications: () => void;
};

export function DashboardScreen({ onCreate, onNotifications }: DashboardScreenProps) {
  const { activities, todayActivities, completedToday, totalToday, completionRate } = useSeniorSync();
  const { setActivities, deleteActivity } = useSeniorActivities();
  const [activityView, setActivityView] = React.useState<'pending' | 'rejected' | 'completed'>('pending');
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [evidenceActivity, setEvidenceActivity] = React.useState<Activity | null>(null);

  const visibleActivities = React.useMemo(() => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    return [...activities]
      .filter(activity => activity.date >= startOfToday || activity.completed || activity.justification)
      .sort((a, b) => a.date.getTime() - b.date.getTime() || a.time.localeCompare(b.time));
  }, [activities]);
  const pendingActivities = visibleActivities.filter(activity => !activity.completed && !activity.justification);
  const rejectedActivities = visibleActivities.filter(activity => !activity.completed && Boolean(activity.justification));
  const completedActivities = visibleActivities.filter(activity => activity.completed);
  const notCompletedToday = todayActivities.filter(activity => !activity.completed);
  const activityTabs = [
    { key: 'pending' as const, label: 'Pendientes', count: pendingActivities.length },
    { key: 'rejected' as const, label: 'No realizadas', count: rejectedActivities.length },
    { key: 'completed' as const, label: 'Realizadas', count: completedActivities.length },
  ];
  const selectedActivities = activityView === 'pending' ? pendingActivities : activityView === 'rejected' ? rejectedActivities : completedActivities;

  return (
    <Screen scroll={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Panel Familiar</Text>
          <Text style={styles.subtitle}>Seguimiento de Adulto mayor</Text>
        </View>
        <Pressable onPress={onNotifications} style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={28} color={colors.primary} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} style={styles.scroll}>
        <Card style={styles.progressCard}>
          <Text style={styles.progressTitle}>Progreso de hoy</Text>
          <View style={styles.progressRow}>
            <Text style={styles.progressValue}>{completionRate}%</Text>
            <Text style={styles.progressMeta}>
              {completedToday} de {totalToday}
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${completionRate}%` }]} />
          </View>
          <Text style={styles.progressNote}>Llevas el control del día con un vistazo rápido.</Text>
        </Card>

        <Card style={styles.summary}>
          <Text style={styles.sectionTitle}>Resumen de hoy</Text>
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{completedToday}</Text>
              <Text style={styles.statLabel}>Completadas</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{totalToday - completedToday}</Text>
              <Text style={styles.statLabel}>Pendientes</Text>
            </View>
            <View style={[styles.stat, styles.statDanger]}>
              <Text style={[styles.statNumber, styles.statDangerNumber]}>{notCompletedToday.length}</Text>
              <Text style={[styles.statLabel, styles.statDangerLabel]}>No realizadas</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{totalToday}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
          </View>
        </Card>

        <Card style={styles.stack}>
          <Text style={styles.sectionTitle}>Actividades</Text>
          <View style={styles.toggleBar}>
            {activityTabs.map(item => {
              const active = activityView === item.key;
              return (
                <Pressable key={item.key} onPress={() => setActivityView(item.key)} style={[styles.toggleChip, active && styles.toggleChipActive]}>
                  <Text style={[styles.toggleChipText, active && styles.toggleChipTextActive]}>{item.label}</Text>
                  <View style={[styles.toggleCount, active && styles.toggleCountActive]}>
                    <Text style={[styles.toggleCountText, active && styles.toggleCountTextActive]}>{item.count}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          {selectedActivities.length === 0 ? (
            <EmptyState
              text={
                activityView === 'pending'
                  ? 'No hay actividades pendientes'
                  : activityView === 'rejected'
                    ? 'No hay actividades no realizadas'
                    : 'No hay actividades realizadas'
              }
            />
          ) : (
            selectedActivities.map(activity => {
              const isPending = activityView === 'pending';
              const canOpenEvidence = activityView === 'completed' && (activity.evidenceRequired === 'photo' || activity.evidenceRequired === 'location');
              return (
                <SimpleActivityCard
                  key={activity.id}
                  activity={activity}
                  showStatusBadge={false}
                  showEvidenceIcon={activityView === 'completed'}
                  onPress={canOpenEvidence ? () => setEvidenceActivity(activity) : undefined}
                  onEdit={isPending ? () => onCreate(activity) : undefined}
                  onDelete={isPending ? () => setDeleteId(activity.id) : undefined}
                  showJustificationReason={activityView === 'rejected'}
                />
              );
            })
          )}
        </Card>
      </ScrollView>

      <Pressable onPress={() => onCreate()} style={styles.fab}>
        <Ionicons name="add" size={28} color="#fff" />
      </Pressable>

      <AppModal visible={Boolean(deleteId)} onClose={() => setDeleteId(null)}>
        <Card style={styles.deleteCard}>
          <View style={styles.deleteIcon}>
            <Ionicons name="trash-outline" size={36} color={colors.danger} />
          </View>
          <Text style={styles.deleteTitle}>¿Eliminar actividad?</Text>
          <Text style={styles.deleteText}>Esta acción no se puede deshacer.</Text>
          <View style={styles.quickRow}>
            <AppButton
              title="Eliminar"
              variant="danger"
              onPress={() => {
                if (deleteId) deleteActivity(deleteId);
                setDeleteId(null);
              }}
              style={styles.quickButton}
            />
            <AppButton title="Cancelar" variant="outline" onPress={() => setDeleteId(null)} style={styles.quickButton} />
          </View>
        </Card>
      </AppModal>

      <AppModal visible={Boolean(evidenceActivity)} onClose={() => setEvidenceActivity(null)}>
        {evidenceActivity ? (
          <Card style={styles.evidenceCard}>
            <View style={styles.evidenceIcon}>
              <Ionicons
                name={evidenceActivity.evidenceRequired === 'photo' ? 'camera-outline' : 'location-outline'}
                size={36}
                color={colors.primary}
              />
            </View>
            <Text style={styles.evidenceTitle}>Evidencia de la actividad</Text>
            <Text style={styles.evidenceActivityName}>{evidenceActivity.title}</Text>
            <Text style={styles.evidenceText}>
              {evidenceActivity.evidenceRequired === 'photo'
                ? 'La actividad se completó con evidencia de foto.'
                : 'La actividad se completó con evidencia de ubicación.'}
            </Text>
            <View style={styles.evidencePreview}>
              {evidenceActivity.evidenceRequired === 'photo' ? (
                <>
                  {evidenceActivity.evidencePhoto && evidenceActivity.evidencePhoto !== 'photo-saved' ? (
                    <Image source={{ uri: evidenceActivity.evidencePhoto }} style={styles.evidenceImage} />
                  ) : (
                    <Ionicons name="image-outline" size={42} color={colors.primary} />
                  )}
                  <Text style={styles.evidencePreviewText}>Foto registrada</Text>
                  <Text style={styles.evidencePreviewMeta}>{evidenceActivity.evidencePhoto ? 'Evidencia capturada' : 'Sin imagen disponible'}</Text>
                </>
              ) : (
                <>
                  {evidenceActivity.evidenceLocation ? (
                    <MapView
                      style={styles.evidenceMap}
                      initialRegion={{
                        latitude: evidenceActivity.evidenceLocation.latitude,
                        longitude: evidenceActivity.evidenceLocation.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                      }}
                    >
                      <Marker
                        coordinate={{
                          latitude: evidenceActivity.evidenceLocation.latitude,
                          longitude: evidenceActivity.evidenceLocation.longitude,
                        }}
                        title="Ubicación registrada"
                        description={evidenceActivity.evidenceLocation.label}
                      />
                    </MapView>
                  ) : (
                    <Ionicons name="map-outline" size={42} color={colors.primary} />
                  )}
                  <Text style={styles.evidencePreviewText}>Ubicación compartida</Text>
                  <Text style={styles.evidencePreviewMeta}>
                    {evidenceActivity.evidenceLocation?.label ??
                      (evidenceActivity.evidenceLocation
                        ? `${evidenceActivity.evidenceLocation.latitude.toFixed(5)}, ${evidenceActivity.evidenceLocation.longitude.toFixed(5)}`
                        : 'Sin coordenadas disponibles')}
                  </Text>
                </>
              )}
            </View>
            <AppButton title="Cerrar" onPress={() => setEvidenceActivity(null)} />
          </Card>
        ) : null}
      </AppModal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.surface,
    marginHorizontal: -12,
    marginTop: -12,
    marginBottom: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { color: colors.primary, fontSize: 20, fontWeight: '900' },
  subtitle: { color: colors.muted, fontSize: 12, marginTop: 2 },
  notificationButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    gap: 10,
    paddingBottom: 12,
  },
  progressCard: {
    gap: 8,
    backgroundColor: '#1f5a4e',
    borderWidth: 0,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  progressTitle: { color: '#fff', fontSize: 16, fontWeight: '900' },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 8,
  },
  progressValue: { color: '#fff', fontSize: 22, fontWeight: '900' },
  progressMeta: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    fontWeight: '700',
  },
  progressTrack: { height: 8, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.18)', overflow: 'hidden' },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#ffffff',
  },
  progressNote: { color: '#f3fdfb', fontSize: 12, fontWeight: '700' },
  summary: { gap: 10 },
  sectionTitle: { color: colors.primary, fontSize: 16, fontWeight: '900' },
  stats: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  stat: { minWidth: '48%', flex: 1, alignItems: 'center', backgroundColor: '#f9fafb', borderRadius: 10, padding: 8 },
  statNumber: { color: colors.primary, fontSize: 18, fontWeight: '900' },
  statLabel: { color: colors.muted, fontSize: 10, marginTop: 3 },
  statDanger: { backgroundColor: '#fef2f2' },
  statDangerNumber: { color: colors.danger },
  statDangerLabel: { color: colors.danger },
  stack: { gap: 10 },
  toggleBar: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  toggleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  toggleChipActive: { backgroundColor: '#1f5a4e', borderColor: '#1f5a4e' },
  toggleChipText: { color: colors.text, fontSize: 11, fontWeight: '800' },
  toggleChipTextActive: { color: '#fff' },
  toggleCount: { minWidth: 18, height: 18, borderRadius: 9, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  toggleCountActive: { backgroundColor: 'rgba(255,255,255,0.16)' },
  toggleCountText: { color: colors.primary, fontSize: 10, fontWeight: '900' },
  toggleCountTextActive: { color: '#fff' },
  fab: {
    position: 'absolute',
    right: 18,
    bottom: 108,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#1f5a4e',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 14,
    zIndex: 50,
  },
  deleteCard: { gap: 12, alignItems: 'stretch' },
  deleteIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  deleteTitle: { color: colors.primary, fontSize: 18, fontWeight: '900', textAlign: 'center' },
  deleteText: { color: colors.text, fontSize: 14, textAlign: 'center' },
  quickRow: { flexDirection: 'row', gap: 8, marginTop: 8, width: '100%' },
  quickButton: { flex: 1 },
  evidenceCard: { gap: 12, alignItems: 'stretch' },
  evidenceIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(69,136,128,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  evidenceTitle: { color: colors.primary, fontSize: 18, fontWeight: '900', textAlign: 'center' },
  evidenceActivityName: { color: colors.text, fontSize: 15, fontWeight: '800', textAlign: 'center' },
  evidenceText: { color: colors.text, fontSize: 14, textAlign: 'center', lineHeight: 20 },
  evidencePreview: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#f9fafb',
    padding: 16,
    alignItems: 'center',
    gap: 6,
  },
  evidencePreviewText: { color: colors.primary, fontSize: 15, fontWeight: '900' },
  evidencePreviewMeta: { color: colors.muted, fontSize: 12, fontWeight: '700' },
  evidenceImage: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    backgroundColor: '#e5e7eb',
  },
  evidenceMap: {
    width: '100%',
    height: 220,
    borderRadius: 12,
  },
});
