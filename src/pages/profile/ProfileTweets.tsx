import { useState } from "react";
import { TweetItem } from "~/components/list-tweets/item-tweet";
import { useGetProfileTweets } from "~/hooks/useFetchTweet";
import { ETweetType } from "~/shared/enums/type.enum";
import { NotFountProfileTweet } from "./not-found";

export function ProfileTweets({
  ishl = "0",
  tweetType,
  profile_id,
}: {
  ishl?: "1" | "0";
  tweetType: ETweetType;
  profile_id: string;
}) {
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useGetProfileTweets(tweetType, {
    limit: "20",
    ishl,
    profile_id,
    page: page.toString(),
  });

  if (data?.data?.total === 0) {
    return <NotFountProfileTweet />;
  }

  return (
    <div>
      {data?.data?.items?.map((tweet) => {
        return <TweetItem key={tweet._id} tweet={tweet} />;
      })}
    </div>
  );
}
