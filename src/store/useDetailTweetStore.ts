import { create } from "zustand";
import type { ITweet } from "~/shared/interfaces/schemas/tweet.interface";

interface DetailTweetStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  prevTweet?: ITweet;
  setPrevTweet: (val?: ITweet) => void;

  tweet?: ITweet;
  setTweet: (val?: ITweet) => void;
}

export const useDetailTweetStore = create<DetailTweetStore>((set) => ({
  isOpen: false,
  tweet: undefined,
  prevTweet: undefined,

  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false, tweet: undefined, prevTweet: undefined }),
  setTweet: (val) =>
    set((state) => {
      const update: Partial<DetailTweetStore> = { tweet: val };
      if (!state.prevTweet && state.tweet) {
        update.prevTweet = state.tweet;
      }
      return update;
    }),
  setPrevTweet: (val) => set({ prevTweet: val }),
}));
