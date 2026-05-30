import type { SyncQueueItem } from '@/store/syncQueueStore';

export async function enqueueSync(item: SyncQueueItem) {
  return item;
}

export async function flushSyncQueue() {
  return { synced: true };
}
