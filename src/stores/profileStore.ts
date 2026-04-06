import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProfileState {
  activeProfileId: number | null;
  activeProfileName: string | null;
  activeProfileAvatar: string | null;
  elternPin: string | null;
  setActiveProfile: (id: number, name: string, avatar: string) => void;
  clearProfile: () => void;
  setElternPin: (pin: string) => void;
  clearElternPin: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      activeProfileId: null,
      activeProfileName: null,
      activeProfileAvatar: null,
      elternPin: null,
      setActiveProfile: (id, name, avatar) =>
        set({ activeProfileId: id, activeProfileName: name, activeProfileAvatar: avatar }),
      clearProfile: () =>
        set({ activeProfileId: null, activeProfileName: null, activeProfileAvatar: null }),
      setElternPin: (pin) => set({ elternPin: pin }),
      clearElternPin: () => set({ elternPin: null }),
    }),
    { name: 'matheheldin-profile' },
  ),
);
