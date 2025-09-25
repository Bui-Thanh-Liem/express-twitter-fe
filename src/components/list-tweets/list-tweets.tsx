import { useCallback, useEffect, useRef, useState } from "react";
import { useGetNewFeeds } from "~/hooks/useFetchTweet";
import { EFeedType } from "~/shared/enums/type.enum";
import type { ITweet } from "~/shared/interfaces/schemas/tweet.interface";
import { useUserStore } from "~/store/useUserStore";
import { ErrorProcess } from "../error-process";
import { TweetItem } from "./item-tweet";

// Loading skeleton component
export const SkeletonTweet = ({ count = 1 }: { count?: number }) => {
  return (
    <div className="animate-pulse px-4 py-2">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="mb-6">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-full my-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4 my-3"></div>
          <div className="w-full aspect-video bg-gray-200 rounded-lg mb-4"></div>
          <div className="flex space-x-6">
            <div className="h-3 bg-gray-200 rounded w-12"></div>
            <div className="h-3 bg-gray-200 rounded w-12"></div>
            <div className="h-3 bg-gray-200 rounded w-12"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const ListTweets = ({ feedType }: { feedType: EFeedType }) => {
  const { user } = useUserStore();

  // State để quản lý pagination và data
  const [page, setPage] = useState(1);
  const [allTweets, setAllTweets] = useState<ITweet[]>([]);
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

      if (page === 1) {
        // Nếu là trang đầu tiên, replace toàn bộ
        setAllTweets(newTweets);
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
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      console.log("Observer triggered, isIntersecting:", entry.isIntersecting);
      if (
        entry.isIntersecting &&
        hasMore &&
        !isLoading &&
        !isLoadingMore &&
        allTweets.length > 0
      ) {
        console.log("Loading more tweets...");
        setIsLoadingMore(true);
        setPage((prev) => prev + 1);
      }
    },
    [allTweets?.length, hasMore, isLoading, isLoadingMore]
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
    setAllTweets([]);
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

  return (
    <div className="max-w-2xl mx-auto">
      {/* Loading state cho lần load đầu tiên */}
      {isLoading && page === 1 && <SkeletonTweet />}

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

      {/* Empty state */}
      {!isLoading && !error && allTweets.length === 0 && page === 1 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-2">📭 Chưa có nội dung nào</p>
          <p className="text-gray-400">
            Hãy theo dõi thêm người dùng để xem nội dung của họ!
          </p>
        </div>
      )}

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
      <div ref={observerRef} className="h-10 w-full" />

      {/* End of content indicator */}
      {!hasMore && allTweets.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">🎉 Bạn đã xem hết tất cả nội dung!</p>
        </div>
      )}
    </div>
  );
};
