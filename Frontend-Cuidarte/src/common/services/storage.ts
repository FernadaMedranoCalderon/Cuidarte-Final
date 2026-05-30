const memoryStorage = new Map<string, string>();

function getWebStorage() {
  if (typeof globalThis === 'undefined') return null;
  const storage = (globalThis as any).localStorage;
  return storage && typeof storage.getItem === 'function' ? storage : null;
}

export const localStorageService = {
  async getItem(key: string) {
    const webStorage = getWebStorage();
    if (webStorage) return webStorage.getItem(key);
    return memoryStorage.get(key) ?? null;
  },
  async setItem(key: string, value: string) {
    const webStorage = getWebStorage();
    if (webStorage) {
      webStorage.setItem(key, value);
      return;
    }
    memoryStorage.set(key, value);
  },
  async removeItem(key: string) {
    const webStorage = getWebStorage();
    if (webStorage) {
      webStorage.removeItem(key);
      return;
    }
    memoryStorage.delete(key);
  },
};
