import { create } from "zustand";
import type { IResTodayNewsOrOutstanding } from "~/shared/dtos/res/trending.dto";

interface TrendingStore {
  trendingItem?: IResTodayNewsOrOutstanding;
  setTrendingItem: (val?: IResTodayNewsOrOutstanding) => void;
}

export const useTrendingStore = create<TrendingStore>((set) => ({
  trendingItem: undefined,
  setTrendingItem: (val) => set({ trendingItem: val }),
}));
