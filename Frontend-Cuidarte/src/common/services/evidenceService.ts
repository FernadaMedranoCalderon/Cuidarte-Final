import type { Activity } from '@/types';
import { localStorageService } from './storage';

export type StoredEvidence = {
  completed?: boolean;
  evidencePhoto?: string;
  evidenceLocation?: Activity['evidenceLocation'];
};

const key = (activityId: string | number) => `activityEvidence:${activityId}`;

export async function getStoredEvidence(activityId: string | number): Promise<StoredEvidence | null> {
  const raw = await localStorageService.getItem(key(activityId));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredEvidence;
  } catch {
    return null;
  }
}

export async function setStoredEvidence(activityId: string | number, evidence: StoredEvidence) {
  const current = (await getStoredEvidence(activityId)) ?? {};
  await localStorageService.setItem(key(activityId), JSON.stringify({ ...current, ...evidence }));
}
