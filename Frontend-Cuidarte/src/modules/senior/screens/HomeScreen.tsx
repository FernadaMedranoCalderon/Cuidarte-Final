import React, { useState } from 'react';
import { Image, Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import type { Activity, Contact } from '@/types';
import { AppButton } from '@/common/components/AppButton';
import { AppModal } from '@/common/components/AppModal';
import { Card } from '@/common/components/Card';
import { EmptyState } from '@/common/components/EmptyState';
import { FormInput } from '@/common/components/FormInput';
import { Screen } from '@/common/components/Screen';
import { colors } from '@/common/styles/theme';
import { formatLongDay } from '@/common/utils/date';
import { AlarmPopup } from '../components/AlarmPopup';
import { SimpleActivityCard } from '../components/SimpleActivityCard';
import { useReminders } from '../hooks/useReminders';
import { useSeniorActivities } from '../hooks/useSeniorActivities';
import { EvidencePhotoScreen } from './EvidenceCameraScreen';
import { EvidenceLocationScreen } from './EvidenceLocationScreen';
import { getTextScale, useAppStore } from '@/store/AppStore';

type HomeScreenProps = {
  contacts: Contact[];
  onCreate: (activity?: Activity) => void;
  onEvidenceVisibleChange?: (visible: boolean) => void;
};

export function HomeScreen({ contacts, onCreate, onEvidenceVisibleChange }: HomeScreenProps) {
  const { appearance } = useAppStore();
  const scale = getTextScale(appearance.textSize);

  const { todayActivities, completeActivity, justifyActivity, activities, setActivities, deleteActivity } = useSeniorActivities();
  const { activeReminderId, showReminder, dismissReminder } = useReminders();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [justifyActivityId, setJustifyActivityId] = useState<string | null>(null);
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [showContactChoice, setShowContactChoice] = useState(false);
  const [showJustificationSent, setShowJustificationSent] = useState(false);
  const [pendingEvidenceActivityId, setPendingEvidenceActivityId] = useState<string | null>(null);
  const [evidenceActivity, setEvidenceActivity] = useState<Activity | null>(null);
  const [showCompletionSent, setShowCompletionSent] = useState(false);
  const reminderActivity = activities.find(item => item.id === activeReminderId);
  const activityToJustify = activities.find(item => item.id === justifyActivityId);
  const pendingEvidenceActivity = activities.find(item => item.id === pendingEvidenceActivityId);
  const visibleActivities = React.useMemo(() => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    return [...activities]
      .filter(activity => activity.date >= startOfToday || activity.completed || activity.justification)
      .sort((a, b) => a.date.getTime() - b.date.getTime() || a.time.localeCompare(b.time));
  }, [activities]);

  const resetJustification = () => {
    setJustifyActivityId(null);
    setSelectedReason('');
    setCustomReason('');
    setShowContactChoice(false);
  };

  const selectedFinalReason = selectedReason === 'Otra razón' ? customReason.trim() : selectedReason;

  const openContactChoice = (reason: string) => {
    setSelectedReason(reason);
    if (reason !== 'Otra razón') {
      setShowContactChoice(true);
    }
  };

  const finishJustification = () => {
    if (!justifyActivityId || !selectedFinalReason) return;
    justifyActivity(justifyActivityId, selectedFinalReason);
    resetJustification();
    setShowJustificationSent(true);
  };

  const callContact = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
    finishJustification();
  };

  const requestCompletion = (activity: Activity) => {
    if (activity.evidenceRequired === 'photo' || activity.evidenceRequired === 'location') {
      setPendingEvidenceActivityId(activity.id);
      onEvidenceVisibleChange?.(true);
      return;
    }

    completeActivity(activity.id, activity.evidenceRequired);
    setShowCompletionSent(true);
  };

  const finishEvidence = (evidence?: { photoUri?: string; location?: Activity['evidenceLocation'] }) => {
    if (!pendingEvidenceActivity) return;
    completeActivity(pendingEvidenceActivity.id, pendingEvidenceActivity.evidenceRequired, evidence);
    setPendingEvidenceActivityId(null);
    onEvidenceVisibleChange?.(false);
    setShowCompletionSent(true);
  };

  const cancelEvidence = () => {
    setPendingEvidenceActivityId(null);
    onEvidenceVisibleChange?.(false);
  };

  if (pendingEvidenceActivity?.evidenceRequired === 'photo') {
    return <EvidencePhotoScreen activity={pendingEvidenceActivity} onCancel={cancelEvidence} onDone={finishEvidence} />;
  }

  if (pendingEvidenceActivity?.evidenceRequired === 'location') {
    return <EvidenceLocationScreen activity={pendingEvidenceActivity} onCancel={cancelEvidence} onDone={finishEvidence} />;
  }

  return (
    <>
      <Screen scroll={false}>
        <View style={styles.page}>
          <View>
            <View style={styles.header}>
              <Text style={[styles.headerTitle, { fontSize: 28 * scale }]}>Cuidamos de ti</Text>
              <Text style={[styles.headerDate, { fontSize: 18 * scale }]}>{formatLongDay(new Date())}</Text>
            </View>

            <AppButton
              title="Nueva actividad"
              onPress={() => onCreate()}
              leftIcon={<Ionicons name="add-circle-outline" size={24} color="#fff" />}
              style={styles.newActivityButton}
            />
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <Card style={styles.stack}>
              <Text style={[styles.sectionTitle, { fontSize: 20 * scale }]}>Actividades</Text>
              {visibleActivities.length === 0 ? (
                <EmptyState text="No tienes actividades pendientes" />
              ) : (
                visibleActivities.map(activity => (
                  <View key={activity.id}>
                    <SimpleActivityCard
                      activity={activity}
                      large
                      onPress={
                        activity.completed && (activity.evidenceRequired === 'photo' || activity.evidenceRequired === 'location')
                          ? () => setEvidenceActivity(activity)
                          : undefined
                      }
                      onComplete={() => showReminder(activity.id)}
                      onEdit={() => onCreate(activity)}
                      onDelete={() => setDeleteId(activity.id)}
                      showEvidenceIcon
                    />
                    <View style={styles.reminderButton}>
                      {!activity.completed ? (
                        <AppButton
                          title="Simular recordatorio"
                          variant="ghost"
                          onPress={() => showReminder(activity.id)}
                          leftIcon={<Ionicons name="notifications-outline" size={18} color={colors.warning} />}
                        />
                      ) : null}
                    </View>
                  </View>
                ))
              )}
            </Card>

            <AlarmPopup
              activity={reminderActivity}
              onClose={dismissReminder}
              onComplete={() => {
                if (reminderActivity) requestCompletion(reminderActivity);
                dismissReminder();
              }}
              onJustify={() => {
                if (activeReminderId) setJustifyActivityId(activeReminderId);
                dismissReminder();
              }}
            />

            <AppModal visible={Boolean(activityToJustify) && !showContactChoice} onClose={resetJustification}>
          <Card style={styles.justifyCard}>
            <View style={styles.justifyIcon}>
              <Ionicons name="alert-circle-outline" size={36} color={colors.warning} />
            </View>
            <Text style={styles.justifyTitle}>¿Por qué no puedes realizarla?</Text>
            <Text style={styles.justifyActivityName}>{activityToJustify?.title}</Text>
            <View style={styles.reasonList}>
              {['No me siento bien', 'No tengo los medicamentos', 'Necesito ayuda', 'No puedo moverme', 'Olvidé la cita', 'Otra razón'].map(reason => {
                const selected = selectedReason === reason;
                return (
                  <AppButton
                    key={reason}
                    title={reason}
                    variant={selected ? 'primary' : 'outline'}
                    onPress={() => openContactChoice(reason)}
                  />
                );
              })}
            </View>
            {selectedReason === 'Otra razón' ? (
              <>
                <FormInput
                  label="Escribe la razón"
                  value={customReason}
                  onChangeText={setCustomReason}
                  placeholder="Cuéntanos qué pasó"
                  multiline
                />
                <AppButton title="Continuar" onPress={() => setShowContactChoice(true)} disabled={!customReason.trim()} />
              </>
            ) : null}
            <AppButton title="Cancelar" variant="primary" onPress={resetJustification} style={styles.cancelJustificationButton} />
          </Card>
            </AppModal>

            <AppModal visible={Boolean(activityToJustify) && showContactChoice} onClose={resetJustification}>
          <Card style={styles.justifyCard}>
            <View style={styles.contactIcon}>
              <Ionicons name="call-outline" size={36} color={colors.primary} />
            </View>
            <Text style={styles.justifyTitle}>¿Quieres contactar a alguien?</Text>
            <Text style={styles.justifyText}>Puedes llamar a una persona de confianza antes de enviar el aviso.</Text>
            <View style={styles.reasonList}>
              {contacts.length === 0 ? (
                <Text style={styles.justifyText}>No tienes contactos guardados.</Text>
              ) : (
                contacts.map(contact => (
                  <Card key={contact.id} style={styles.contactCard}>
                    <Text style={styles.contactName}>{contact.name}</Text>
                    <Text style={styles.contactMeta}>{contact.relationship} · {contact.phone}</Text>
                    <AppButton
                      title="Llamar"
                      onPress={() => callContact(contact.phone)}
                      leftIcon={<Ionicons name="call-outline" size={20} color="#fff" />}
                    />
                  </Card>
                ))
              )}
            </View>
            <AppButton title="No contactar a nadie" variant="outline" onPress={finishJustification} />
            <AppButton title="Volver" variant="ghost" onPress={() => setShowContactChoice(false)} />
          </Card>
            </AppModal>

            <AppModal visible={showJustificationSent} onClose={() => setShowJustificationSent(false)}>
          <Card style={styles.justifyCard}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark-circle-outline" size={40} color={colors.success} />
            </View>
            <Text style={styles.justifyTitle}>Aviso enviado</Text>
            <Text style={styles.justifyText}>
              Tu familiar recibirá una notificación con la razón que seleccionaste.
            </Text>
            <AppButton title="Entendido" onPress={() => setShowJustificationSent(false)} />
          </Card>
            </AppModal>

            <AppModal visible={showCompletionSent} onClose={() => setShowCompletionSent(false)}>
          <Card style={styles.justifyCard}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark-circle-outline" size={40} color={colors.success} />
            </View>
            <Text style={styles.justifyTitle}>Evidencia enviada</Text>
            <Text style={styles.justifyText}>
              Tu familiar o familiares recibieron la notificación de que la actividad fue completada.
            </Text>
            <AppButton title="Entendido" onPress={() => setShowCompletionSent(false)} />
          </Card>
            </AppModal>

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
              <View style={styles.successIcon}>
                <Ionicons name={evidenceActivity.evidenceRequired === 'photo' ? 'camera-outline' : 'location-outline'} size={36} color={colors.success} />
              </View>
              <Text style={styles.justifyTitle}>Evidencia registrada</Text>
              <Text style={styles.justifyActivityName}>{evidenceActivity.title}</Text>
              <View style={styles.evidencePreview}>
                {evidenceActivity.evidenceRequired === 'photo' ? (
                  <>
                    {evidenceActivity.evidencePhoto && evidenceActivity.evidencePhoto !== 'photo-saved' ? (
                      <Image source={{ uri: evidenceActivity.evidencePhoto }} style={styles.evidenceImage} />
                    ) : (
                      <Ionicons name="image-outline" size={42} color={colors.primary} />
                    )}
                    <Text style={styles.evidencePreviewText}>{evidenceActivity.evidencePhoto ? 'Foto capturada' : 'Sin imagen disponible'}</Text>
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
                    <Text style={styles.evidencePreviewText}>
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
    fontSize: 20,
    fontWeight: '900',
  },
  headerDate: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
  page: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 12,
  },
  justifyCard: {
    gap: 12,
    alignItems: 'stretch',
  },
  justifyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  contactIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(69,136,128,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  justifyTitle: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
  },
  justifyActivityName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
  },
  justifyText: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 21,
    textAlign: 'center',
  },
  cancelJustificationButton: {
    backgroundColor: '#1f4d45',
  },
  reasonList: {
    gap: 8,
  },
  contactCard: {
    gap: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(69,136,128,0.16)',
  },
  contactName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
  },
  contactMeta: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  stack: {
    gap: 12,
    marginBottom: 88,
  },
  newActivityButton: {
    minHeight: 58,
    borderRadius: 18,
    marginBottom: 12,
  },
  sectionTitle: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 6,
  },
  reminderButton: {
    alignItems: 'flex-start',
  },
  quickRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  quickButton: {
    flex: 1,
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
  muted: {
    color: colors.muted,
    fontSize: 13,
  },
  deleteTitle: {
    color: colors.danger,
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
  },
  deleteText: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 21,
    textAlign: 'center',
  },
  evidenceCard: {
    gap: 12,
    alignItems: 'stretch',
  },
  evidencePreview: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#f9fafb',
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
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
  evidencePreviewText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '900',
    textAlign: 'center',
  },
});
