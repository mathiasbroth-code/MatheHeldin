import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SchwierigkeitOverride {
  /** Adaptivität aktiviert (true = automatisch, false = fixiert) */
  adaptiv: boolean;
  /** Fixiertes Level (nur relevant wenn adaptiv === false) */
  fixedLevel: number;
}

/** Key-Format: "profileId:stufeId" */
type OverrideKey = string;

function key(profileId: number, stufeId: string): OverrideKey {
  return `${profileId}:${stufeId}`;
}

interface SchwierigkeitState {
  overrides: Record<OverrideKey, SchwierigkeitOverride>;
  getOverride: (profileId: number, stufeId: string) => SchwierigkeitOverride | undefined;
  setOverride: (profileId: number, stufeId: string, override: SchwierigkeitOverride) => void;
  removeOverride: (profileId: number, stufeId: string) => void;
}

export const useSchwierigkeitStore = create<SchwierigkeitState>()(
  persist(
    (set, get) => ({
      overrides: {},
      getOverride: (profileId, stufeId) => get().overrides[key(profileId, stufeId)],
      setOverride: (profileId, stufeId, override) =>
        set((state) => ({
          overrides: { ...state.overrides, [key(profileId, stufeId)]: override },
        })),
      removeOverride: (profileId, stufeId) =>
        set((state) => {
          const next = { ...state.overrides };
          delete next[key(profileId, stufeId)];
          return { overrides: next };
        }),
    }),
    { name: 'matheheldin-schwierigkeit' },
  ),
);
