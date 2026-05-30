import { graphqlFetch } from './api';
import { localStorageService } from './storage';

type BackendRole = 'ELDERLY' | 'FAMILY';

type BackendUser = {
  id: number;
  role: BackendRole;
  name?: string;
  email?: string;
  createdAt?: string;
};

function cacheKey(userId: string | number, role: BackendRole) {
  return `${role.toLowerCase()}EntityId:${userId}`;
}

export async function resolveRoleEntityId(userId: string | number, role: BackendRole, token?: string) {
  const normalizedUserId = Number(userId);
  if (!Number.isFinite(normalizedUserId)) return undefined;

  const cached = await localStorageService.getItem(cacheKey(normalizedUserId, role));
  if (cached && Number.isFinite(Number(cached))) return Number(cached);

  try {
    const query = `query UsersForEntityId { users { id role createdAt } }`;
    const data = await graphqlFetch<{ users: BackendUser[] }>(query, undefined, token);
    const sameRoleUsers = (data.users ?? [])
      .filter(user => user.role === role)
      .sort((a, b) => a.id - b.id);
    const index = sameRoleUsers.findIndex(user => Number(user.id) === normalizedUserId);
    if (index >= 0) {
      const entityId = index + 1;
      await localStorageService.setItem(cacheKey(normalizedUserId, role), String(entityId));
      return entityId;
    }
  } catch {
    // Fallback below keeps the app usable with older or restricted backends.
  }

  return normalizedUserId;
}

export async function resolveVisibleSeniorCode(code: string, token?: string) {
  const trimmedCode = code.trim();
  const numericCode = Number(trimmedCode);
  if (!Number.isFinite(numericCode)) return undefined;

  try {
    const query = `query UsersForSeniorCode { users { id name email role createdAt } }`;
    const data = await graphqlFetch<{ users: BackendUser[] }>(query, undefined, token);
    const elderlyUsers = (data.users ?? [])
      .filter(user => user.role === 'ELDERLY')
      .sort((a, b) => a.id - b.id);
    const index = elderlyUsers.findIndex(user => Number(user.id) === numericCode);
    if (index >= 0) {
      const matched = elderlyUsers[index];
      return {
        elderlyId: index + 1,
        userId: matched.id,
        name: matched.name,
        email: matched.email,
      };
    }
  } catch {
    // Numeric fallback keeps local linking available if the users query is unavailable.
  }

  return {
    elderlyId: numericCode,
    userId: numericCode,
  };
}
