import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AvatarConfig } from '@/db/schema';

const DEFAULT_AVATAR_CONFIG: AvatarConfig = {
  tier: 'fuchs',
  farbe: 'teal',
  accessoire: 'none',
  name: 'Mia',
};

interface ProfileState {
  activeProfileId: number | null;
  activeProfileName: string | null;
  activeProfileAvatar: string | null;
  activeAvatarConfig: AvatarConfig;
  elternPin: string | null;
  setActiveProfile: (id: number, name: string, avatar: string, avatarConfig?: AvatarConfig) => void;
  setAvatarConfig: (config: AvatarConfig) => void;
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
      activeAvatarConfig: DEFAULT_AVATAR_CONFIG,
      elternPin: null,
      setActiveProfile: (id, name, avatar, avatarConfig) =>
        set({
          activeProfileId: id,
          activeProfileName: name,
          activeProfileAvatar: avatar,
          activeAvatarConfig: avatarConfig ?? DEFAULT_AVATAR_CONFIG,
        }),
      setAvatarConfig: (config) => set({ activeAvatarConfig: config }),
      clearProfile: () =>
        set({
          activeProfileId: null,
          activeProfileName: null,
          activeProfileAvatar: null,
          activeAvatarConfig: DEFAULT_AVATAR_CONFIG,
        }),
      setElternPin: (pin) => set({ elternPin: pin }),
      clearElternPin: () => set({ elternPin: null }),
    }),
    { name: 'matheheldin-profile' },
  ),
);
