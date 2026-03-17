'use client';
import { create } from 'zustand';
import type { BusinessProfile } from '@/types/profile.types';
import { getBusinessProfile, saveBusinessProfile } from '@/lib/db/businessProfile';

interface ProfileStore {
  profile: BusinessProfile | null;
  loading: boolean;
  loadProfile: () => Promise<void>;
  saveProfile: (profile: BusinessProfile) => Promise<void>;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: null,
  loading: false,

  loadProfile: async () => {
    set({ loading: true });
    const profile = await getBusinessProfile();
    set({ profile: profile ?? null, loading: false });
  },

  saveProfile: async (profile) => {
    await saveBusinessProfile(profile);
    set({ profile });
  },
}));
