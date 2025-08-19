import { Bookmark } from "lucide-react";
import { useBookmarkTweet } from "~/hooks/useFetchBookmark";
import type { ITweet } from "~/shared/interfaces/schemas/tweet.interface";

export function ActionBookmarkTweet({ tweet }: { tweet: ITweet }) {
  const { mutate: toggleBookmark } = useBookmarkTweet();

  return (
    <button
      className={`p-2 rounded-full transition-colors cursor-pointer ${
        tweet.isBookmark
          ? "text-blue-500"
          : "text-gray-500 hover:text-blue-500 hover:bg-blue-50"
      }`}
      onClick={() => toggleBookmark(tweet._id)}
    >
      <Bookmark size={18} fill={tweet.isBookmark ? "currentColor" : "none"} />
    </button>
  );
}
