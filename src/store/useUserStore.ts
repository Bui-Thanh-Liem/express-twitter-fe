import { create } from "zustand";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import { persist } from "zustand/middleware";

interface UserState {
  user: IUser | null;
  setUser: (user: IUser) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "user-storage", // tên key trong localStorage
      partialize: (state) => ({ user: state.user }), // chỉ lưu user, không lưu hàm
    }
  )
);
