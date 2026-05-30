import { graphqlFetch } from './api';
import { localStorageService } from './storage';

export type LinkedSeniorAccount = {
  id: string;
  name: string;
  email: string;
  code: string;
  elderlyId?: number;
  familyLinkId?: number;
  isActive?: boolean;
};

function cacheKey(userId: string | number) {
  return `linkedSeniors:${userId}`;
}

export async function createFamilyLink(familyId: number, linkCode: string, token?: string) {
  const query = `mutation CreateFamilyLink($familyId: Int!, $linkCode: String!) { createFamilyLink(familyId: $familyId, linkCode: $linkCode) { id isActive familyId elderlyId createdAt } }`;
  return graphqlFetch<{ createFamilyLink: any }>(query, { familyId, linkCode }, token);
}

export async function getFamilyLinks(familyId: number, token?: string) {
  const query = `query FamilyLinks($familyId: Int!) { familyLinks(familyId: $familyId) { id isActive familyId elderlyId createdAt } }`;
  return graphqlFetch<{ familyLinks: any[] }>(query, { familyId }, token);
}

export async function deactivateFamilyLink(id: number, token?: string) {
  const query = `mutation DeactivateFamilyLink($id: Int!) { deactivateFamilyLink(id: $id) }`;
  return graphqlFetch<{ deactivateFamilyLink: boolean }>(query, { id }, token);
}

export async function getCachedLinkedSeniors(userId: string | number): Promise<LinkedSeniorAccount[]> {
  const raw = await localStorageService.getItem(cacheKey(userId));
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function setCachedLinkedSeniors(userId: string | number, accounts: LinkedSeniorAccount[]) {
  await localStorageService.setItem(cacheKey(userId), JSON.stringify(accounts));
}

export function mergeLinkedSeniors(a: LinkedSeniorAccount[], b: LinkedSeniorAccount[]) {
  const byKey = new Map<string, LinkedSeniorAccount>();
  [...a, ...b].forEach(item => {
    const key = item.familyLinkId ? `link-${item.familyLinkId}` : item.elderlyId ? `elderly-${item.elderlyId}` : `code-${item.code}`;
    byKey.set(key, { ...(byKey.get(key) ?? {}), ...item });
  });
  return [...byKey.values()].filter(item => item.isActive !== false);
}
