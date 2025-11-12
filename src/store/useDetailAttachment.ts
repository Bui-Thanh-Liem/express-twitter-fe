import { create } from "zustand";
import type { IMedia } from "~/shared/interfaces/common/media.interface";

interface State {
  convId?: string;
  mediaSelected?: IMedia;

  setMediaSelected: (m?: IMedia) => void;
  setConvId: (id?: string) => void;
}

export const useDetailAttachment = create<State>((set) => ({
  convId: undefined,
  mediaSelected: undefined,

  setConvId: (val) => set({ convId: val }),
  setMediaSelected: (val) => set({ mediaSelected: val }),
}));
