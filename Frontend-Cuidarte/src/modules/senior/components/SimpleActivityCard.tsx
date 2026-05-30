import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Activity } from '@/types';
import { AppButton } from '@/common/components/AppButton';
import { activityColors } from '@/common/utils/constants';
import { colors, radius } from '@/common/styles/theme';
import { getTextScale, useAppStore } from '@/store/AppStore';
import { VerificationBadge } from './VerificationBadge';

type Props = {
  activity: Activity;
  large?: boolean;
  onPress?: () => void;
  onComplete?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showStatusBadge?: boolean;
  showEvidenceIcon?: boolean;
  showJustificationReason?: boolean;
};

export function SimpleActivityCard({ activity, large, onPress, onComplete, onEdit, onDelete, showStatusBadge = true, showEvidenceIcon = false, showJustificationReason = false }: Props) {
  const { appearance } = useAppStore();
  const scale = getTextScale(appearance.textSize);
  const color = activityColors[activity.type];
  const icon = activity.type === 'medication' ? 'medkit-outline' : activity.type === 'appointment' ? 'calendar-outline' : 'walk-outline';
  const evidenceIcon = activity.evidenceRequired === 'photo' ? 'camera-outline' : activity.evidenceRequired === 'location' ? 'location-outline' : 'checkmark-done-outline';
  const rejected = Boolean(activity.justification) && !activity.completed;
  const borderColor = activity.completed ? '#d1d5db' : rejected ? colors.danger : color;
  const hasActions = Boolean(onEdit || onDelete);

  const Container = onPress ? Pressable : View;

  return (
    <Container
      onPress={onPress}
      style={[
        styles.card,
        { borderColor },
        appearance.contrast === 'high' && styles.highContrast,
        onPress && styles.cardPressable,
      ]}
    >
      <View style={styles.actions}>
        {onEdit ? (
          <Pressable onPress={onEdit} style={[styles.iconButton, styles.editButton]}>
            <Ionicons name="create-outline" size={22} color={colors.primary} />
          </Pressable>
        ) : null}
        {onDelete ? (
          <Pressable onPress={onDelete} style={[styles.iconButton, styles.deleteButton]}>
            <Ionicons name="trash-outline" size={22} color={colors.danger} />
          </Pressable>
        ) : null}
      </View>
      <View style={[styles.row, !hasActions && styles.rowNoActions]}>
        <View style={[styles.iconBox, { backgroundColor: `${color}22` }]}>
          <Ionicons name={icon} size={large ? 30 : 24} color={color} />
        </View>
        <View style={styles.body}>
          <Text numberOfLines={1} style={[styles.title, { fontSize: (large ? 18 : 16) * scale }]}>{activity.title}</Text>
          {showJustificationReason && activity.justification ? (
            <Text numberOfLines={2} style={[styles.description, { fontSize: 13 * scale }]}>{activity.justification}</Text>
          ) : (
            activity.description ? (
              <Text numberOfLines={1} style={[styles.description, { fontSize: 13 * scale }]}>{activity.description}</Text>
            ) : null
          )}
          {!showJustificationReason && (
            <Text style={[styles.time, { fontSize: 13 * scale }]}>Hora: {activity.time}</Text>
          )}
        </View>
        {showEvidenceIcon && activity.completed ? (
          <View style={styles.evidenceIconWrap}>
            <Ionicons name={evidenceIcon as keyof typeof Ionicons.glyphMap} size={18} color={color} />
          </View>
        ) : null}
      </View>
      {showStatusBadge ? (
        activity.completed ? (
          <VerificationBadge status="completed" />
        ) : rejected ? (
          <VerificationBadge status="rejected" />
        ) : (
          <VerificationBadge status="pending" />
        )
      ) : null}
      {onComplete && !activity.completed && !rejected ? <AppButton title="Completar" onPress={onComplete} style={styles.completeButton} /> : null}
    </Container>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    borderRadius: radius.lg,
    padding: 14,
    backgroundColor: colors.surface,
    gap: 12,
  },
  highContrast: {
    borderWidth: 3,
  },
  cardPressable: {
    opacity: 0.98,
  },
  actions: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 2,
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  editButton: {
    backgroundColor: 'rgba(69,136,128,0.12)',
    borderColor: 'rgba(69,136,128,0.18)',
  },
  deleteButton: {
    backgroundColor: '#fee2e2',
    borderColor: '#fecaca',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    paddingRight: 104,
  },
  rowNoActions: {
    paddingRight: 0,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  description: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 2,
  },
  time: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 4,
  },
  evidenceIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    alignSelf: 'center',
  },
  completeButton: {
    marginTop: 2,
  },
});
