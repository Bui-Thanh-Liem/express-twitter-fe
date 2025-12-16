import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
  backUrl: string | null;
  setBackUrl: (backUrl: string) => void;
  clearBackUrl: () => void;
}

export const useBackUrlStore = create<State>()(
  persist(
    (set) => ({
      backUrl: null,
      setBackUrl: (backUrl) => set({ backUrl }),
      clearBackUrl: () => set({ backUrl: null }),
    }),
    {
      name: "backUrl_storage", // tên key trong localStorage
      partialize: (state) => ({ backUrl: state.backUrl }), // chỉ lưu backUrl, không lưu hàm
    }
  )
);
