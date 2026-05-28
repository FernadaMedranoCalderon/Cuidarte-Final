import { registerEnumType } from '@nestjs/graphql';
import {
  UserRole,
  ActivityType,
  ActivityEventType,
  EvidenceType,
  RepeatType,
  ActivityStatus,
  SkipReasonType,
  NotificationStatus,
} from '@prisma/client';

registerEnumType(UserRole, { name: 'UserRole' });
registerEnumType(ActivityType, { name: 'ActivityType' });
registerEnumType(ActivityEventType, { name: 'ActivityEventType' });
registerEnumType(EvidenceType, { name: 'EvidenceType' });
registerEnumType(RepeatType, { name: 'RepeatType' });
registerEnumType(ActivityStatus, { name: 'ActivityStatus' });
registerEnumType(SkipReasonType, { name: 'SkipReasonType' });
registerEnumType(NotificationStatus, { name: 'NotificationStatus' });

export {
  UserRole,
  ActivityType,
  ActivityEventType,
  EvidenceType,
  RepeatType,
  ActivityStatus,
  SkipReasonType,
  NotificationStatus,
};


export const ActivityEventTypeLabel: Record<ActivityEventType, string> = {
  [ActivityEventType.ACTIVITY_REMINDER]: 'Recordatorio',
  [ActivityEventType.ACTIVITY_COMPLETED]: 'Completada',
  [ActivityEventType.ACTIVITY_CREATED]: 'Creada',
  [ActivityEventType.ACTIVITY_SKIPPED]: 'Omitida',
  [ActivityEventType.ACTIVITY_UPDATED]: 'Actualizada',
  [ActivityEventType.ACTIVITY_DELETED]: 'Eliminada',
  [ActivityEventType.ACTIVITY_RESCHEDULED]: 'Reprogramada',
  [ActivityEventType.ACTIVITY_POSTPONED]: 'Pospuesta',
  [ActivityEventType.LOCATION_SHARED]: 'Ubicación compartida',
};

export const ActivityTypeLabel: Record<ActivityType, string> = {
  [ActivityType.MEDICATION]: 'medicación',
  [ActivityType.EXERCISE]: 'ejercicio',
  [ActivityType.MEDICAL_APPOINTMENT]: 'cita médica',
  [ActivityType.OTHER]: 'actividad',
};