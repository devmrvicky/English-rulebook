import { create } from "zustand";
import { ensureSeeded } from "@/features/english/services/db";
import { getCategoriesWithStats, type CategoryWithStats } from "@/features/english/services/ruleRepository";

interface CatalogState {
  categories: CategoryWithStats[];
  status: "idle" | "loading" | "ready" | "error";
  error: string | null;
  init: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const useCatalogStore = create<CatalogState>((set, get) => ({
  categories: [],
  status: "idle",
  error: null,

  init: async () => {
    if (get().status === "loading" || get().status === "ready") return;
    set({ status: "loading", error: null });
    try {
      await ensureSeeded();
      const categories = await getCategoriesWithStats();
      set({ categories, status: "ready" });
    } catch (err) {
      set({ status: "error", error: err instanceof Error ? err.message : "Failed to load catalog" });
    }
  },

  refresh: async () => {
    const categories = await getCategoriesWithStats();
    set({ categories });
  },
}));
