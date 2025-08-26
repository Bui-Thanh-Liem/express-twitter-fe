import { useEffect, useRef, useState } from "react";
import { TweetItem } from "~/components/list-tweets/item-tweet";
import { SkeletonTweet } from "~/components/list-tweets/list-tweets";
import { useGetProfileTweetLiked } from "~/hooks/useFetchTweet";
import type { ITweet } from "~/shared/interfaces/schemas/tweet.interface";

export function ProfileLiked({ profile_id }: { profile_id: string }) {
  // State để quản lý pagination và data
  const [page, setPage] = useState(1);
  const [allTweets, setAllTweets] = useState<ITweet[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Ref để theo dõi element cuối cùng
  const observerRef = useRef<HTMLDivElement>(null);
  const observerInstanceRef = useRef<IntersectionObserver | null>(null);

  const { data, isLoading, error } = useGetProfileTweetLiked({
    limit: "10",
    page: page.toString(),
    profile_id,
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
      if (newTweets.length < 10) {
        // Nếu số tweets trả về ít hơn limit
        setHasMore(false);
      }

      setIsLoadingMore(false);
    }
  }, [data, page]);

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

  // Reset khi profile_id thay đổi
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
  }, [profile_id]);

  // Loading state cho lần load đầu tiên
  if (isLoading && page === 1) {
    return <SkeletonTweet />;
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">❌ Có lỗi xảy ra khi tải dữ liệu</p>
        <button
          onClick={() => {
            setPage(1);
            setAllTweets([]);
            setHasMore(true);
            window.location.reload();
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  // Empty state - chưa có data nhưng không phải total = 0
  if (!isLoading && allTweets.length === 0 && page === 1) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-lg mb-2">
          ❤️ Chưa có tweet nào được thích
        </p>
        <p className="text-gray-400">
          Hãy thích một số tweet để chúng xuất hiện ở đây!
        </p>
      </div>
    );
  }

  return (
    <div>
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
          <p className="text-gray-500">
            🎉 Bạn đã xem hết tất cả tweet đã thích!
          </p>
        </div>
      )}
    </div>
  );
}
