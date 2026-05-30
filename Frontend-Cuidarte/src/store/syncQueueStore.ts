export type SyncQueueItem = {
  id: string;
  entity: 'activity' | 'evidence' | 'notification';
  operation: 'create' | 'update' | 'delete';
  payload: unknown;
  createdAt: string;
};

export const syncQueue: SyncQueueItem[] = [];
