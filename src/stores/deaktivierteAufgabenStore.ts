import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DeaktivierteAufgabenState {
  /** Set deaktivierter _poolIds. */
  deaktiviert: string[];
  /** Einzelne Aufgabe (de)aktivieren. */
  toggle: (poolId: string) => void;
  /** Mehrere Aufgaben auf einmal deaktivieren. */
  deaktiviereMehrere: (poolIds: string[]) => void;
  /** Mehrere Aufgaben auf einmal aktivieren. */
  aktiviereMehrere: (poolIds: string[]) => void;
  /** Prüfen ob eine Aufgabe deaktiviert ist. */
  isDeaktiviert: (poolId: string) => boolean;
}

export const useDeaktivierteAufgaben = create<DeaktivierteAufgabenState>()(
  persist(
    (set, get) => ({
      deaktiviert: [],
      toggle: (poolId) =>
        set((s) => ({
          deaktiviert: s.deaktiviert.includes(poolId)
            ? s.deaktiviert.filter((id) => id !== poolId)
            : [...s.deaktiviert, poolId],
        })),
      deaktiviereMehrere: (poolIds) =>
        set((s) => ({
          deaktiviert: [...new Set([...s.deaktiviert, ...poolIds])],
        })),
      aktiviereMehrere: (poolIds) =>
        set((s) => ({
          deaktiviert: s.deaktiviert.filter((id) => !poolIds.includes(id)),
        })),
      isDeaktiviert: (poolId) => get().deaktiviert.includes(poolId),
    }),
    { name: 'matheheldin-deaktivierte-aufgaben' },
  ),
);
