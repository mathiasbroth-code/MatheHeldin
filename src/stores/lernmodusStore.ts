import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/** Lernmodus bestimmt wie stark die App das Lernen lenkt. */
export type Lernmodus = 'frei' | 'sanft' | 'gezielt';

/** Key-Format: "profileId" als String */
type ProfileKey = string;

interface LernmodusState {
  modi: Record<ProfileKey, Lernmodus>;
  zerlegungshilfe: Record<ProfileKey, boolean>;
  getLernmodus: (profileId: number) => Lernmodus;
  setLernmodus: (profileId: number, modus: Lernmodus) => void;
  getZerlegungshilfe: (profileId: number) => boolean;
  setZerlegungshilfe: (profileId: number, aktiv: boolean) => void;
}

export const useLernmodusStore = create<LernmodusState>()(
  persist(
    (set, get) => ({
      modi: {},
      zerlegungshilfe: {},
      getLernmodus: (profileId) => get().modi[String(profileId)] ?? 'frei',
      setLernmodus: (profileId, modus) =>
        set((state) => ({
          modi: { ...state.modi, [String(profileId)]: modus },
        })),
      getZerlegungshilfe: (profileId) => get().zerlegungshilfe[String(profileId)] ?? true,
      setZerlegungshilfe: (profileId, aktiv) =>
        set((state) => ({
          zerlegungshilfe: { ...state.zerlegungshilfe, [String(profileId)]: aktiv },
        })),
    }),
    { name: 'matheheldin-lernmodus' },
  ),
);
