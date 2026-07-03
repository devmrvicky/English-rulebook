import { create } from "zustand";
import {
  getDashboardStats,
  isBookmarked,
  toggleBookmark as toggleBookmarkInDb,
  setReadStatus,
  type DashboardStats,
} from "@/features/english/services/ruleRepository";
import type { ReadStatus } from "@/features/english/types/rule.types";

interface UserDataState {
  stats: DashboardStats | null;
  bookmarkedIds: Record<string, boolean>;
  refreshStats: () => Promise<void>;
  checkBookmark: (ruleId: string) => Promise<void>;
  toggleBookmark: (ruleId: string) => Promise<void>;
  markStatus: (ruleId: string, status: ReadStatus) => Promise<void>;
}

export const useUserDataStore = create<UserDataState>((set, get) => ({
  stats: null,
  bookmarkedIds: {},

  refreshStats: async () => {
    const stats = await getDashboardStats();
    set({ stats });
  },

  checkBookmark: async (ruleId: string) => {
    const marked = await isBookmarked(ruleId);
    set({ bookmarkedIds: { ...get().bookmarkedIds, [ruleId]: marked } });
  },

  toggleBookmark: async (ruleId: string) => {
    const nowMarked = await toggleBookmarkInDb(ruleId);
    set({ bookmarkedIds: { ...get().bookmarkedIds, [ruleId]: nowMarked } });
    await get().refreshStats();
  },

  markStatus: async (ruleId: string, status: ReadStatus) => {
    await setReadStatus(ruleId, status);
    await get().refreshStats();
  },
}));
