// useReloadStore.ts
import { create } from "zustand";

interface ReloadStore {
  reloadKey: number;
  triggerReload: () => void;
}

export const useReloadStore = create<ReloadStore>((set) => ({
  reloadKey: 0,
  triggerReload: () =>
    set((state) => ({
      reloadKey: state.reloadKey + 1,
    })),
}));
