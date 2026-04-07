import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SyncStatus = 'offline' | 'syncing' | 'synced' | 'error';

interface SyncState {
  status: SyncStatus;
  lastSyncAt: number | null;
  userEmail: string | null;
  userId: string | null;
  error: string | null;
  setStatus: (status: SyncStatus) => void;
  setLastSync: (ts: number) => void;
  setUser: (email: string, id: string) => void;
  clearUser: () => void;
  setError: (msg: string | null) => void;
}

export const useSyncStore = create<SyncState>()(
  persist(
    (set) => ({
      status: 'offline',
      lastSyncAt: null,
      userEmail: null,
      userId: null,
      error: null,
      setStatus: (status) => set({ status, error: status === 'error' ? undefined : null }),
      setLastSync: (ts) => set({ lastSyncAt: ts }),
      setUser: (email, id) => set({ userEmail: email, userId: id }),
      clearUser: () => set({ userEmail: null, userId: null, status: 'offline', lastSyncAt: null }),
      setError: (msg) => set({ error: msg, status: msg ? 'error' : 'synced' }),
    }),
    { name: 'matheheldin-sync' },
  ),
);
