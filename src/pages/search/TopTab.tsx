import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SkeletonTweet, TweetItem } from "~/components/list-tweets/item-tweet";
import {
  UserToFollowItem,
  UserToFollowItemSkeleton,
} from "~/components/who-to-follow/who-to-follow-item";
import { useSearchTweets, useSearchUsers } from "~/hooks/useFetchSearch";
import { cn } from "~/lib/utils";
import type { ITweet } from "~/shared/interfaces/schemas/tweet.interface";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";

export function TopTab() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q");
  const pf = searchParams.get("pf");
  const f = searchParams.get("f");
  const top = searchParams.get("top");

  const [pageUser, setPageUser] = useState(1);
  const [users, setUsers] = useState<IUser[]>([]);

  const [pageTweet, setPageTweet] = useState(1);
  const [tweets, setTweets] = useState<ITweet[]>([]);

  const total_page_user_ref = useRef(0);
  const { data, isLoading, refetch } = useSearchUsers({
    page: pageUser.toString(),
    limit: "4",
    q: q ?? "",
    pf: pf ?? "",
    top: top ?? "",
  });

  const total_page_tweet_ref = useRef(0);
  const {
    data: dataTweets,
    isLoading: isLoadingTweets,
    refetch: refetchTweets,
    isFetching: isFetchingTweets,
  } = useSearchTweets({
    limit: "10",
    q: q ?? "",
    pf: pf ?? "",
    page: pageTweet.toString(),
  });

  //
  useEffect(() => {
    setUsers([]);
    setTweets([]);
    setPageUser(1);
    setPageTweet(1);
    refetch();
    refetchTweets();
  }, [q, pf, f]);

  // Mỗi lần fetch xong thì append thêm vào state
  useEffect(() => {
    const items = data?.data?.items || [];
    const total_page = data?.data?.total_page;
    total_page_user_ref.current = total_page || 0;

    if (items) {
      setUsers((prev) => {
        // Loại bỏ duplicate tweets dựa trên _id
        const existingIds = new Set(prev.map((u) => u._id));
        const filteredNewUsers = items.filter(
          (tweet) => !existingIds.has(tweet._id)
        );
        return [...prev, ...filteredNewUsers];
      });
    }
  }, [data?.data]);

  useEffect(() => {
    const items = dataTweets?.data?.items || [];
    const total_page = dataTweets?.data?.total_page;
    total_page_tweet_ref.current = total_page || 0;

    if (items) {
      setTweets((prev) => {
        // Loại bỏ duplicate tweets dựa trên _id
        const existingIds = new Set(prev.map((tweet) => tweet._id));

        const filteredNewTweets = items.filter(
          (tweet) => !existingIds.has(tweet._id)
        );

        return [...prev, ...filteredNewTweets];
      });
    }
  }, [dataTweets?.data]);

  //
  useEffect(() => {
    return () => {
      setUsers([]);
      setTweets([]);
      setPageUser(1);
      setPageTweet(1);
    };
  }, []);

  //
  function onSeeMoreUser() {
    setPageUser((prev) => prev + 1);
  }

  //
  function onSeeMoreTweet() {
    setPageTweet((prev) => prev + 1);
  }

  function onDel(id: string) {
    setTweets((prev) => prev.filter((tw) => tw._id !== id));
  }

  const loadingTweet = isFetchingTweets || isLoadingTweets;

  return (
    <div className="max-h-[calc(100vh-(150px))] overflow-y-auto">
      <div>
        {/*  */}
        <div>
          {users.map((item) => (
            <UserToFollowItem key={item._id} user={item} />
          ))}
        </div>

        {/*  */}
        {isLoading
          ? Array.from({ length: 2 }).map((_, i) => (
              <UserToFollowItemSkeleton key={`more-${i}`} />
            ))
          : !!users.length && (
              <div className="px-4 py-3">
                <p
                  className={cn(
                    "inline-block text-sm leading-snug font-semibold text-[#1d9bf0] cursor-pointer",
                    total_page_user_ref.current <= pageUser
                      ? "text-gray-300 pointer-events-none cursor-default"
                      : ""
                  )}
                  onClick={onSeeMoreUser}
                >
                  Xem thêm
                </p>
              </div>
            )}

        {/*  */}
        {!users.length && !isLoading && (
          <div className="flex justify-center items-center h-20">
            <p className="text-gray-500 text-lg">
              Không có người dùng nào phù hợp với <strong>"{q}"</strong>
            </p>
          </div>
        )}
      </div>
      <hr className="my-4" />
      <div>
        {/* Tweets list */}
        {tweets.length > 0 && (
          <div className="space-y-6">
            {tweets.map((tweet, index: number) => (
              <span key={tweet._id}>
                <TweetItem tweet={tweet} onSuccessDel={onDel} />
                {index < tweets.length - 1 && (
                  <hr className="border-gray-200" />
                )}
              </span>
            ))}
          </div>
        )}

        {/*  */}
        {loadingTweet
          ? Array.from({ length: 2 }).map((_, i) => (
              <SkeletonTweet key={`more-${i}`} />
            ))
          : !!tweets.length && (
              <div className="px-4 py-3">
                <p
                  className={cn(
                    "inline-block text-sm leading-snug font-semibold text-[#1d9bf0] cursor-pointer",
                    total_page_tweet_ref.current <= pageTweet
                      ? "text-gray-300 pointer-events-none cursor-default"
                      : ""
                  )}
                  onClick={onSeeMoreTweet}
                >
                  Xem thêm
                </p>
              </div>
            )}

        {/*  */}
        {!tweets.length && !loadingTweet && (
          <div className="flex justify-center items-center h-20">
            <p className="text-gray-500 text-lg">
              Không có bài viết nào phù hợp với <strong>"{q}"</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
