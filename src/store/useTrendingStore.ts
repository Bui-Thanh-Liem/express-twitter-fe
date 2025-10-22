import { create } from "zustand";
import type { IResTodayNewsOrOutstanding } from "~/shared/dtos/res/trending.dto";

interface State {
  trendingItem?: IResTodayNewsOrOutstanding;
  setTrendingItem: (val?: IResTodayNewsOrOutstanding) => void;
}

export const useTrendingStore = create<State>((set) => ({
  trendingItem: undefined,
  setTrendingItem: (val) => set({ trendingItem: val }),
}));
