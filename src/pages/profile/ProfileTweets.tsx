import { useEffect, useRef, useState } from "react";
import { ErrorProcess } from "~/components/error-process";
import { TweetItem } from "~/components/list-tweets/item-tweet";
import { SkeletonTweet } from "~/components/list-tweets/list-tweets";
import { NotFoundTweet } from "~/components/list-tweets/not-found-tweet";
import { useGetProfileTweets } from "~/hooks/useFetchTweet";
import { ETweetType } from "~/shared/enums/type.enum";
import type { ITweet } from "~/shared/interfaces/schemas/tweet.interface";

export function ProfileTweets({
  ishl = "0",
  tweetType,
  profile_id,
}: {
  ishl?: "1" | "0";
  tweetType: ETweetType;
  profile_id: string;
}) {
  // State để quản lý pagination và data
  const [page, setPage] = useState(1);
  const [allTweets, setAllTweets] = useState<ITweet[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Ref để theo dõi element cuối cùng
  const observerRef = useRef<HTMLDivElement>(null);
  const observerInstanceRef = useRef<IntersectionObserver | null>(null);

  const { data, isLoading, error } = useGetProfileTweets(tweetType, {
    limit: "20",
    ishl: ishl,
    profile_id,
    page: page.toString(),
  });

  // Effect để xử lý khi có data mới
  useEffect(() => {
    if (data?.data?.items) {
      const newTweets = data.data.items as ITweet[];
      if (page === 1) {
        // Nếu là trang đầu tiên, replace toàn bộ
        setAllTweets(() => {
          return newTweets;
        });
      } else {
        // Nếu là trang tiếp theo, append vào cuối
        setAllTweets((prev) => {
          // Loại bỏ duplicate tweets dựa trên _id
          const existingIds = new Set(prev.map((tweet) => tweet._id));
          const filteredNewTweets = newTweets.filter(
            (tweet) => !existingIds.has(tweet._id)
          );
          return [...prev, ...filteredNewTweets];
        });
      }

      // Kiểm tra xem còn data để load không
      if (newTweets.length < 20) {
        // Nếu số tweets trả về ít hơn limit
        setHasMore(false);
      }

      setIsLoadingMore(false);
    }
  }, [data, page, profile_id]);

  // Callback khi element cuối cùng xuất hiện trên viewport
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleObserver = (entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting && hasMore && !isLoading && !isLoadingMore) {
      setIsLoadingMore(true);
      setPage((prev) => prev + 1);
    }
  };

  // Setup Intersection Observer
  useEffect(() => {
    const element = observerRef.current;
    if (!element) return;

    // Cleanup previous observer
    if (observerInstanceRef.current) {
      observerInstanceRef.current.disconnect();
    }

    // Create new observer
    observerInstanceRef.current = new IntersectionObserver(handleObserver, {
      threshold: 0.1, // Trigger when 10% of element is visible
      rootMargin: "100px", // Start loading 100px before element comes into view
    });

    observerInstanceRef.current.observe(element);

    // Cleanup function
    return () => {
      if (observerInstanceRef.current) {
        observerInstanceRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  // Reset khi profile_id hoặc tweetType thay đổi
  useEffect(() => {
    setPage(1);
    // setAllTweets([]);
    setHasMore(true);
    setIsLoadingMore(false);

    // Scroll lên đầu trang khi thay đổi
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [profile_id, tweetType]);

  // Empty state - chưa có data nhưng không phải total = 0
  if (!isLoading && allTweets.length === 0 && page === 1) {
    return <NotFoundTweet />;
  }

  return (
    <div>
      {/* Loading state cho lần load đầu tiên */}
      {isLoading && page === 1 && <SkeletonTweet />}

      {/* Tweets list */}
      {allTweets.length > 0 && (
        <div className="space-y-6">
          {allTweets.map((tweet, index: number) => (
            <span key={tweet._id}>
              <TweetItem
                key={tweet._id || `${tweet._id}-${index}`}
                tweet={tweet}
              />
              {index < allTweets.length - 1 && (
                <hr className="border-gray-200" />
              )}
            </span>
          ))}
        </div>
      )}

      {/* Error state */}
      {error && (
        <ErrorProcess
          onClick={() => {
            setPage(1);
            setAllTweets([]);
            setHasMore(true);
            window.location.reload();
          }}
        />
      )}

      {/* Loading more indicator */}
      {isLoadingMore && (
        <div className="py-4">
          <SkeletonTweet count={2} />
        </div>
      )}

      {/* Observer element - invisible trigger cho infinite scroll */}
      <div
        ref={observerRef}
        className="h-10 w-full"
        // style={{ visibility: "hidden" }}
      />

      {/* End of content indicator */}
      {!hasMore && allTweets.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">🎉 Bạn đã xem hết tất cả tweet!</p>
        </div>
      )}
    </div>
  );
}
