import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfileSummary, Platform, ListEntry } from "@/types";

interface ListStore {
  entries: ListEntry[];
  addToList: (profile: UserProfileSummary, platform: Platform) => void;
  removeFromList: (userId: string) => void;
  isInList: (userId: string) => boolean;
  clearList: () => void;
}

export const useListStore = create<ListStore>()(
  persist(
    (set, get) => ({
      entries: [],

      addToList: (profile, platform) => {
        // Prevent duplicate entries
        if (get().isInList(profile.user_id)) return;
        set((state) => ({
          entries: [
            ...state.entries,
            { profile, platform, addedAt: Date.now() },
          ],
        }));
      },

      removeFromList: (userId) => {
        set((state) => ({
          entries: state.entries.filter((e) => e.profile.user_id !== userId),
        }));
      },

      isInList: (userId) => {
        return get().entries.some((e) => e.profile.user_id === userId);
      },

      clearList: () => set({ entries: [] }),
    }),
    {
      name: "wobb-influencer-list", // localStorage key
    }
  )
);
