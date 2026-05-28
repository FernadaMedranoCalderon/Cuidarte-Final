import { ActivityEventType } from "@prisma/client";
import { ActivityType } from "@prisma/client";
import { ActivityTypeLabel } from "../entities/enums";
import { ActivityEventTypeLabel } from "../entities/enums";

export class MessageHelper {
  constructor() {}

  buildMessage(
    eventType: ActivityEventType,
    activityType: ActivityType,
    activityName: string,
    elderlyName?: string,
    otherType?: string | null,
  ): string {
    const eventLabel = ActivityEventTypeLabel[eventType];
    const typeLabel = this.getActivityTypeLabel({
      type: activityType,
      otherType,
    });

    const activityLabel = activityName;
    const baseLine = `${eventLabel}\n`;

    switch (eventType) {
      case ActivityEventType.LOCATION_SHARED:
        return elderlyName
          ? `${baseLine}${elderlyName} ha compartido su ubicación.`
          : `${baseLine}Tu ubicación ha sido compartida con tus familiares.`;

      case ActivityEventType.ACTIVITY_RESCHEDULED:
        return elderlyName
          ? `${baseLine}${elderlyName} ha reprogramado la actividad de ${typeLabel} "${activityLabel}" para un nuevo horario.`
          : `${baseLine}La actividad de ${typeLabel} "${activityLabel}" fue reprogramada automáticamente según su configuración.`;

      case ActivityEventType.ACTIVITY_POSTPONED:
        return elderlyName
          ? `${baseLine}${elderlyName} decidió posponer la actividad de ${typeLabel} "${activityLabel}", se realizará en 10 minutos.`
          : `${baseLine}Has pospuesto la actividad de ${typeLabel} "${activityLabel}". Podrás retomarla cuando estés listo.`;

      case ActivityEventType.ACTIVITY_CREATED:
        return elderlyName
          ? `${baseLine}${elderlyName} creó una nueva actividad de ${typeLabel} "${activityLabel}". Ya está disponible en tu agenda.`
          : `${baseLine}Se creó correctamente la actividad de ${typeLabel} "${activityLabel}".`;

      case ActivityEventType.ACTIVITY_REMINDER:
        return elderlyName
          ? `${baseLine}${elderlyName} tiene pendiente la actividad de ${typeLabel} "${activityLabel}". Es momento de realizarla.`
          : `${baseLine}Recordatorio: debes completar la actividad de ${typeLabel} "${activityLabel}".`;

      case ActivityEventType.ACTIVITY_COMPLETED:
        return elderlyName
          ? `${baseLine}${elderlyName} ha completado la actividad de ${typeLabel} "${activityLabel}". Excelente trabajo.`
          : `${baseLine}Has completado correctamente la actividad de ${typeLabel} "${activityLabel}".`;

      case ActivityEventType.ACTIVITY_SKIPPED:
        return elderlyName
          ? `${baseLine}${elderlyName} omitió la actividad de ${typeLabel} "${activityLabel}", no se registró como realizada.`
          : `${baseLine}Omitiste la actividad de ${typeLabel} "${activityLabel}". Quedará registrada como no completada.`;

      case ActivityEventType.ACTIVITY_UPDATED:
        return elderlyName
          ? `${baseLine}${elderlyName} actualizó la actividad de ${typeLabel} "${activityLabel}". Los cambios ya están guardados.`
          : `${baseLine}La actividad de ${typeLabel} "${activityLabel}" fue actualizada correctamente.`;

      case ActivityEventType.ACTIVITY_DELETED:
        return elderlyName
          ? `${baseLine}${elderlyName} eliminó la actividad de ${typeLabel} "${activityLabel}". Ya no estará disponible en el sistema.`
          : `${baseLine}La actividad de ${typeLabel} "${activityLabel}" fue eliminada correctamente.`;

      default:
        return `${baseLine}Se ha registrado un evento relacionado con la actividad "${activityLabel}".`;
    }
  }

  private getActivityTypeLabel(activity: {
    type: ActivityType;
    otherType?: string | null;
  }): string {
    if (activity.type === ActivityType.OTHER && activity.otherType) {
      return activity.otherType.toLowerCase();
    }

    return ActivityTypeLabel[activity.type];
  }
}