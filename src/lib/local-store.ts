// Generic localStorage read/write for the private tool pages (/lift,
// /meal) — no backend, no sync, just this browser. Every call is
// wrapped since localStorage can throw (private browsing, quota, a
// browser with storage disabled).
export const localStore = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  },
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage full or unavailable — the UI surfaces this itself
      // where it matters (export/import, save actions)
    }
  },
};
