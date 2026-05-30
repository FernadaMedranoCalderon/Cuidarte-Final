import { useState } from 'react';

export function useSync() {
  const [syncing, setSyncing] = useState(false);
  return {
    syncing,
    async syncNow() {
      setSyncing(true);
      setTimeout(() => setSyncing(false), 400);
    },
  };
}
