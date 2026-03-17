'use client';
import { create } from 'zustand';
import type { AppSettings } from '@/types/settings.types';
import { getSettings, saveSettings } from '@/lib/db/settings';

interface SettingsStore {
  settings: AppSettings | null;
  loadSettings: () => Promise<void>;
  updateSettings: (data: Partial<AppSettings>) => Promise<void>;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: null,

  loadSettings: async () => {
    const settings = await getSettings();
    set({ settings });
  },

  updateSettings: async (data) => {
    await saveSettings(data);
    const settings = get().settings;
    if (settings) {
      set({ settings: { ...settings, ...data } });
    }
  },
}));
