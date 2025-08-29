import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";

interface ChatBoxStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  profile: IUser | undefined;
  setProfile: (val: IUser | undefined) => void;
}

export const useChatBoxStore = create<ChatBoxStore>()(
  persist(
    (set) => ({
      profile: undefined,
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      setProfile: (val) => set({ profile: val }),
    }),
    {
      name: "checkbox-storage", // tên key trong localStorage
      partialize: (state) => ({ isOpen: state.isOpen, profile: state.profile }), // chỉ lưu user, không lưu hàm
    }
  )
);
