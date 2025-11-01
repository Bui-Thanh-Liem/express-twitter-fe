import { useCallback, useEffect, useRef, useState } from "react";
import { useGetNewFeeds } from "~/hooks/useFetchTweet";
import { CommunityCard } from "~/pages/community/CommunityCard";
import { EFeedType, ETweetType } from "~/shared/enums/type.enum";
import type { ICommunity } from "~/shared/interfaces/schemas/community.interface";
import type { ITweet } from "~/shared/interfaces/schemas/tweet.interface";
import { useUserStore } from "~/store/useUserStore";
import { ErrorProcess } from "../error-process";
import { SkeletonTweet, TweetItem } from "./item-tweet";
import { Link } from "react-router-dom";

export const ListTweets = ({ feedType }: { feedType: EFeedType }) => {
  const { user } = useUserStore();

  // State để quản lý pagination và data
  const [page, setPage] = useState(1);
  const [feeds, setFeeds] = useState<ITweet[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Ref để theo dõi element cuối cùng
  const observerRef = useRef<HTMLDivElement>(null);
  const observerInstanceRef = useRef<IntersectionObserver | null>(null);

  const { data, isLoading, error } = useGetNewFeeds(feedType, {
    page: page.toString(),
    limit: "10", // Giảm limit để load nhanh hơn
  });

  // Effect để xử lý khi có data mới
  useEffect(() => {
    if (data?.data?.items) {
      const newTweets = data.data.items as ITweet[];

      // Chèn cộng đồng vào newFeeds
      const extraType = data.data.extra?.type;
      const newCommunities = data.data.extra?.items as ICommunity[];
      const _newCommunities = { type: extraType, extra: newCommunities } as any;

      if (page === 1) {
        // Nếu là trang đầu tiên, replace toàn bộ
        setFeeds(newTweets);
      } else {
        // Nếu là trang tiếp theo, append vào cuối
        setFeeds((prev) => {
          // Loại bỏ duplicate tweets dựa trên _id
          const existingIds = new Set(prev.map((tweet) => tweet._id));
          const filteredNewTweets = newTweets.filter(
            (tweet) => !existingIds.has(tweet._id)
          );
          return [...prev, _newCommunities, ...filteredNewTweets];
        });
      }

      // Kiểm tra xem còn data để load không
      if (newTweets.length < 10) {
        // Nếu số tweets trả về ít hơn limit
        setHasMore(false);
      }

      setIsLoadingMore(false);
    }
  }, [data, page]);

  // Callback khi element cuối cùng xuất hiện trên viewport
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      console.log("Observer triggered, isIntersecting:", entry.isIntersecting);
      if (
        entry.isIntersecting &&
        hasMore &&
        !isLoading &&
        !isLoadingMore &&
        feeds.length > 0
      ) {
        console.log("Loading more tweets...");
        setIsLoadingMore(true);
        setPage((prev) => prev + 1);
      }
    },
    [feeds?.length, hasMore, isLoading, isLoadingMore]
  );

  // Setup Intersection Observer
  useEffect(() => {
    const element = observerRef.current;
    if (!element) {
      console.error("observerRef is null, check if element is rendered");
      return;
    }

    // Cleanup previous observer
    if (observerInstanceRef.current) {
      observerInstanceRef.current.disconnect();
    }

    // Create new observer
    observerInstanceRef.current = new IntersectionObserver(handleObserver, {
      threshold: 0, // Trigger when 0% of element is visible
      rootMargin: "0px", // Start loading 0px before element comes into view
    });

    observerInstanceRef.current.observe(element);

    // Cleanup function
    return () => {
      if (observerInstanceRef.current) {
        observerInstanceRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  // Reset khi feedType thay đổi
  useEffect(() => {
    setPage(1);
    // setAllTweets([]);
    setHasMore(true);
    setIsLoadingMore(false);

    // Scroll lên đầu trang khi thay đổi feedType
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [feedType]);

  // Verify
  if (!user?.verify) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-lg mb-2">
          📝 Bạn chưa xác minh tài khoản
        </p>
        <p className="text-gray-400">
          Hãy vào trang cá nhân xác minh tài khoản của bạn.
        </p>
      </div>
    );
  }

  // Thực hiện khi xoá bài viết thành công ở BE
  function onSuccessDel(id: string) {
    setFeeds((prev) => prev.filter((tw) => tw._id !== id));
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Loading state cho lần load đầu tiên */}
      {isLoading && page === 1 && <SkeletonTweet />}

      {/* Error state */}
      {error && (
        <ErrorProcess
          onClick={() => {
            setPage(1);
            setFeeds([]);
            setHasMore(true);
            window.location.reload();
          }}
        />
      )}

      {/* Empty state */}
      {!isLoading && !error && feeds.length === 0 && page === 1 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-2">📭 Chưa có nội dung nào</p>
          <p className="text-gray-400">
            Hãy theo dõi thêm người dùng để xem nội dung của họ!
          </p>
        </div>
      )}

      {/* Tweets list */}
      {feeds.length > 0 && (
        <div className="space-y-6">
          {feeds.map((item, index: number) => {
            const isTweet = Object.values(ETweetType).includes(item?.type);
            const communities = isTweet
              ? []
              : (item as unknown as { extra: ICommunity[] })?.extra;

            return isTweet ? (
              <span key={item._id}>
                <TweetItem
                  tweet={item}
                  key={item._id}
                  onSuccessDel={onSuccessDel}
                />
                {index < feeds.length - 1 && <hr className="border-gray-200" />}
              </span>
            ) : (
              !!communities.length && (
                <div className="m-4 grid grid-cols-3 items-center gap-x-3">
                  {communities.map((com) => (
                    <CommunityCard community={com} />
                  ))}
                  <Link
                    to={"/communities/t/explore"}
                    className="text-center text-gray-400 font-medium cursor-pointer p-2 hover:underline"
                  >
                    Xem thêm
                  </Link>
                </div>
              )
            );
          })}
        </div>
      )}

      {/* Loading more indicator */}
      {isLoadingMore && (
        <div className="py-4">
          <SkeletonTweet count={2} />
        </div>
      )}

      {/* Observer element - invisible trigger cho infinite scroll */}
      <div ref={observerRef} className="h-10 w-full" />

      {/* End of content indicator */}
      {!hasMore && feeds.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">🎉 Bạn đã xem hết tất cả nội dung!</p>
        </div>
      )}
    </div>
  );
};
