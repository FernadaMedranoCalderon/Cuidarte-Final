import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '@/common/components/AppButton';
import { AppModal } from '@/common/components/AppModal';
import { Card } from '@/common/components/Card';
import { EmptyState } from '@/common/components/EmptyState';
import { Screen } from '@/common/components/Screen';
import { colors } from '@/common/styles/theme';
import { useFamilyNotifications } from '../hooks/useFamilyNotifications';

type NotificationsScreenProps = {
  onBack: () => void;
};

export function NotificationsScreen({ onBack }: NotificationsScreenProps) {
  const { notifications, markNotificationRead, markAllNotificationsRead, deleteNotification } = useFamilyNotifications();
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const notificationToDelete = notifications.find(item => item.id === deleteId);

  return (
    <Screen>
      <Card style={styles.card}>
        <View style={styles.row}>
          <Pressable onPress={onBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={18} color={colors.primary} />
            <Text style={styles.backText}>Regresar</Text>
          </Pressable>
          <AppButton title="Leer todas" variant="ghost" onPress={markAllNotificationsRead} />
        </View>
        {notifications.length === 0 ? (
          <EmptyState text="No hay notificaciones disponibles" />
        ) : (
          notifications.map(item => {
            const isRead = item.read;
            return (
              <View key={item.id} style={styles.notification}>
                <Pressable onPress={() => markNotificationRead(item.id)} style={styles.notificationContent}>
                  <View style={styles.iconWrap}>
                    <Ionicons
                      name={item.type === 'success' ? 'checkmark-circle-outline' : item.type === 'alert' ? 'alert-circle-outline' : 'notifications-outline'}
                      size={22}
                      color={item.type === 'success' ? colors.success : item.type === 'alert' ? colors.warning : colors.primary}
                    />
                  </View>
                  <View style={styles.body}>
                    <Text style={styles.message}>{item.message}</Text>
                    <Text style={styles.time}>{item.time}</Text>
                  </View>
                  <View style={styles.stateWrap}>
                    <Ionicons
                      name={isRead ? 'checkmark-circle' : 'radio-button-off-outline'}
                      size={20}
                      color={isRead ? colors.primary : colors.muted}
                    />
                  </View>
                </Pressable>
                <Pressable onPress={() => setDeleteId(item.id)} style={styles.deleteButton} accessibilityLabel={`Eliminar notificación ${item.message}`}>
                  <Ionicons name="trash-outline" size={18} color={colors.danger} />
                </Pressable>
              </View>
            );
          })
        )}
      </Card>

      <AppModal visible={Boolean(deleteId)} onClose={() => setDeleteId(null)}>
        <Card style={styles.deleteCard}>
          <View style={styles.deleteIcon}>
            <Ionicons name="trash-outline" size={36} color={colors.danger} />
          </View>
          <Text style={styles.deleteTitle}>¿Eliminar notificación?</Text>
          <Text style={styles.deleteText}>{notificationToDelete?.message ?? 'Esta acción no se puede deshacer.'}</Text>
          <View style={styles.deleteActions}>
            <AppButton
              title="Eliminar"
              variant="danger"
              onPress={() => {
                if (deleteId) deleteNotification(deleteId);
                setDeleteId(null);
              }}
              style={styles.deleteActionButton}
            />
            <AppButton title="Cancelar" variant="outline" onPress={() => setDeleteId(null)} style={styles.deleteActionButton} />
          </View>
        </Card>
      </AppModal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { gap: 10 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backText: { color: colors.primary, fontSize: 13, fontWeight: '800' },
  title: { color: colors.primary, fontSize: 20, fontWeight: '900' },
  notification: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 12, backgroundColor: '#f9fafb', padding: 12 },
  notificationContent: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  body: { flex: 1 },
  message: { color: colors.text, fontWeight: '800', fontSize: 13 },
  time: { color: colors.muted, fontSize: 11, marginTop: 3 },
  stateWrap: {
    width: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fee2e2',
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
  deleteActions: { flexDirection: 'row', gap: 8, marginTop: 8 },
  deleteActionButton: { flex: 1 },
});
