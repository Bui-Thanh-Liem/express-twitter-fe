import { Heart } from "lucide-react";
import { useLikeTweet } from "~/hooks/useFetchLike";
import type { ITweet } from "~/shared/interfaces/schemas/tweet.interface";

export function ActionLikeTweet({ tweet }: { tweet: ITweet }) {
  const { mutate: toggleLike } = useLikeTweet();

  return (
    <button
      className={`flex items-center space-x-2 transition-colors group cursor-pointer ${
        tweet.isLike ? "text-pink-500" : "hover:text-pink-500"
      }`}
      onClick={() => toggleLike(tweet._id)}
    >
      <div className="p-2 rounded-full group-hover:bg-red-50 transition-colors">
        <Heart size={18} fill={tweet.isLike ? "currentColor" : "none"} />
      </div>
      <span className="text-sm">{tweet.likes_count || 0}</span>
    </button>
  );
}
