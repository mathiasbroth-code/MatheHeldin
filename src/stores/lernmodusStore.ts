import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/** Lernmodus bestimmt wie stark die App das Lernen lenkt. */
export type Lernmodus = 'frei' | 'sanft' | 'gezielt';

/** Key-Format: "profileId" als String */
type ProfileKey = string;

interface LernmodusState {
  modi: Record<ProfileKey, Lernmodus>;
  getLernmodus: (profileId: number) => Lernmodus;
  setLernmodus: (profileId: number, modus: Lernmodus) => void;
}

export const useLernmodusStore = create<LernmodusState>()(
  persist(
    (set, get) => ({
      modi: {},
      getLernmodus: (profileId) => get().modi[String(profileId)] ?? 'frei',
      setLernmodus: (profileId, modus) =>
        set((state) => ({
          modi: { ...state.modi, [String(profileId)]: modus },
        })),
    }),
    { name: 'matheheldin-lernmodus' },
  ),
);
