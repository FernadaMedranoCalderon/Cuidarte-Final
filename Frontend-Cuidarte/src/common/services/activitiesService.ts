import { graphqlFetch } from './api';
import { getStoredEvidence } from './evidenceService';
import type { Activity as FrontActivity } from '@/types';

async function mapBackendActivity(a: any, logs: any[] = []): Promise<FrontActivity> {
  const mapType: Record<string, FrontActivity['type']> = {
    MEDICATION: 'medication',
    EXERCISE: 'exercise',
    MEDICAL_APPOINTMENT: 'appointment',
    OTHER: 'other',
  } as const;
  const mapEvidence: Record<string, FrontActivity['evidenceRequired']> = {
    MARK: 'button',
    PHOTO: 'photo',
    LOCATION: 'location',
  } as const;
  const mapRepeat: Record<string, FrontActivity['repeat']> = {
    NONE: 'none',
    DAILY: 'daily',
    WEEKLY: 'weekly',
    MONTHLY: 'monthly',
  } as const;

  const scheduled = new Date(a.scheduledAt);
  const hh = scheduled.getHours().toString().padStart(2, '0');
  const mm = scheduled.getMinutes().toString().padStart(2, '0');
  const latestLog = [...logs].sort((aLog, bLog) => new Date(bLog.createdAt).getTime() - new Date(aLog.createdAt).getTime())[0];
  const storedEvidence = await getStoredEvidence(a.id);

  return {
    id: String(a.id),
    title: a.name,
    description: a.otherType ?? undefined,
    date: scheduled,
    time: `${hh}:${mm}`,
    type: mapType[a.type] ?? 'other',
    completed: storedEvidence?.completed ?? latestLog?.status === 'COMPLETED',
    evidenceRequired: mapEvidence[a.evidenceType] ?? 'button',
    evidencePhoto: storedEvidence?.evidencePhoto ?? (latestLog?.status === 'COMPLETED' && a.evidenceType === 'PHOTO' ? 'photo-saved' : undefined),
    evidenceLocation: storedEvidence?.evidenceLocation,
    justification: latestLog?.status === 'SKIPPED' ? 'No realizada' : undefined,
    repeat: mapRepeat[a.repeat] ?? 'none',
    repeatDays: a.repeatDays ? a.repeatDays.split(',') : undefined,
  };
}

export async function fetchActivitiesByElderly(elderlyId: number, token?: string) {
  const query = `query ActivitiesByElderly($elderlyId: Int!) { activitiesByElderly(elderlyId: $elderlyId) { id name type evidenceType repeat repeatDays scheduledAt elderlyId createdAt updatedAt } }`;
  const data = await graphqlFetch<{ activitiesByElderly: any[] }>(query, { elderlyId }, token);
  const activities = data.activitiesByElderly ?? [];
  const logsByActivity = await Promise.all(
    activities.map(async activity => {
      try {
        const logs = await fetchActivityLogsByActivity(Number(activity.id), token);
        return [Number(activity.id), logs] as const;
      } catch {
        return [Number(activity.id), [] as any[]] as const;
      }
    }),
  );
  const logsMap = new Map(logsByActivity);
  return Promise.all(activities.map(activity => mapBackendActivity(activity, logsMap.get(Number(activity.id)) ?? [])));
}

export async function createActivity(dto: {
  name: string;
  type: string;
  evidenceType: string;
  repeat: string;
  repeatDays?: string | null;
  date: string;
  time: string;
  elderlyId: number;
}, token?: string) {
  const mutation = `mutation CreateActivity($dto: CreateActivityDTO!) { createActivity(dto: $dto) { id name type evidenceType repeat repeatDays scheduledAt elderlyId createdAt updatedAt } }`;
  const data = await graphqlFetch<{ createActivity: any }>(mutation, { dto }, token);
  return mapBackendActivity(data.createActivity);
}

export async function updateActivity(dto: any, token?: string) {
  const mutation = `mutation UpdateActivity($dto: UpdateActivityDTO!) { updateActivity(dto: $dto) { id name type evidenceType repeat repeatDays scheduledAt elderlyId createdAt updatedAt } }`;
  const data = await graphqlFetch<{ updateActivity: any }>(mutation, { dto }, token);
  return mapBackendActivity(data.updateActivity);
}

export async function deleteActivity(id: number, token?: string) {
  const mutation = `mutation DeleteActivity($id: Int!) { deleteActivity(id: $id) }`;
  await graphqlFetch(mutation, { id }, token);
  return true;
}

export async function createActivityLog(dto: any, token?: string) {
  const mutation = `mutation CreateActivityLog($dto: CreateActivityLogDTO!) { createActivityLog(dto: $dto) { __typename } }`;
  const data = await graphqlFetch<{ createActivityLog: any }>(mutation, { dto }, token);
  return data.createActivityLog;
}

export async function fetchActivityLogsByActivity(activityId: number, token?: string) {
  const query = `query ActivityLogsByActivity($activityId: Int!) { activityLogsByActivity(activityId: $activityId) { id scheduledAt status activityId createdAt } }`;
  const data = await graphqlFetch<{ activityLogsByActivity: any[] }>(query, { activityId }, token);
  return data.activityLogsByActivity ?? [];
}
