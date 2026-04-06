import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProfileState {
  activeProfileId: number | null;
  activeProfileName: string | null;
  setActiveProfile: (id: number, name: string) => void;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      activeProfileId: null,
      activeProfileName: null,
      setActiveProfile: (id, name) => set({ activeProfileId: id, activeProfileName: name }),
      clearProfile: () => set({ activeProfileId: null, activeProfileName: null }),
    }),
    { name: 'matheheldin-profile' },
  ),
);
