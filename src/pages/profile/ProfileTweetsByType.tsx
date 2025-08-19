import { useState } from "react";
import { TweetItem } from "~/components/list-tweets/item-tweet";
import { useGetProfileTweetsByType } from "~/hooks/useFetchTweet";
import { ETweetType } from "~/shared/enums/type.enum";

export function ProfileTweetsByType({
  tweetType,
  user_owner_tweet_id,
}: {
  tweetType: ETweetType;
  user_owner_tweet_id: string;
}) {
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useGetProfileTweetsByType(tweetType, {
    page: page.toString(),
    limit: "20",
    user_owner_tweet_id,
  });

  console.log("ProfileTweetsByType :::", data);
  console.log("ProfileTweetsByType - isLoading :::", isLoading);
  console.log("ProfileTweetsByType - error :::", error);

  return (
    <div>
      {data?.data?.items?.map((tweet) => {
        return <TweetItem key={tweet._id} tweet={tweet} />;
      })}
    </div>
  );
}
