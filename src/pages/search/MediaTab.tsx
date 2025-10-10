import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MediaContent } from "~/components/list-tweets/item-tweet";
import { ButtonMain } from "~/components/ui/button";
import { useSearchTweets } from "~/hooks/useFetchSearch";
import { EMediaType } from "~/shared/enums/type.enum";
import type { ITweet } from "~/shared/interfaces/schemas/tweet.interface";

export function MediaTab() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q");
  const pf = searchParams.get("pf");
  const f = searchParams.get("f");

  // State để quản lý pagination và data
  const [page, setPage] = useState(1);
  const [allTweets, setAllTweets] = useState<ITweet[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Ref để theo dõi element cuối cùng
  const observerRef = useRef<HTMLDivElement>(null);
  const observerInstanceRef = useRef<IntersectionObserver | null>(null);

  const { data, isLoading, error, refetch, isFetching } = useSearchTweets({
    limit: "12",
    q: q ?? "",
    pf: pf ?? "",
    f: (f as "media") ?? "media",
    page: page.toString(),
  });

  //
  useEffect(() => {
    setAllTweets([]);
    setPage(1);
    refetch();
  }, [q, pf, f]);

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
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (
        entry.isIntersecting &&
        hasMore &&
        !isLoading &&
        !isLoadingMore &&
        allTweets.length > 0
      ) {
        setIsLoadingMore(true);
        setPage((prev) => prev + 1);
      }
    },
    [allTweets.length, hasMore, isLoading, isLoadingMore]
  );

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
  }, []);

  //
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setIsLoadingMore(false);
  }, [q]);

  const loading = isLoading || isFetching;

  return (
    <div className="max-h-[calc(100vh-(150px))] overflow-y-auto">
      {/* Loading state cho lần load đầu tiên */}
      {loading && page === 1 && (
        <div className="py-4">
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`loading-${index}`}
                className="aspect-square bg-gray-200 animate-pulse rounded-lg"
              />
            ))}
          </div>
        </div>
      )}

      {/* Tweets list */}
      {allTweets.length > 0 && (
        <div className="grid grid-cols-3 gap-x-6 gap-y-0">
          {allTweets.map((m, index) => (
            <div
              key={m.media?.url || `media-${index}`}
              className="aspect-square"
            >
              <MediaContent
                tweet={m}
                type={m.media?.type || EMediaType.Image}
                url={m.media?.url || ""}
              />
            </div>
          ))}
        </div>
      )}

      {/* Loading more indicator */}
      {isLoadingMore && (
        <div className="py-4">
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`loading-${index}`}
                className="aspect-square bg-gray-200 animate-pulse rounded-lg"
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty state - chưa có data nhưng không phải total = 0 */}
      {!loading && allTweets.length === 0 && page === 1 && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg mb-2">
            Không có hình ảnh hoặc video nào phù hợp với <strong>"{q}"</strong>
          </p>
        </div>
      )}

      {/* Observer element - invisible trigger cho infinite scroll */}
      <div ref={observerRef} className="h-10 w-full" />

      {/* End of content indicator */}
      {!hasMore && allTweets.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">
            🎉 Bạn đã xem hết tất cả tweet đã đánh dấu!
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">❌ Có lỗi xảy ra khi tải dữ liệu</p>
          <ButtonMain
            onClick={() => {
              setPage(1);
              setAllTweets([]);
              setHasMore(true);
            }}
          >
            Thử lại
          </ButtonMain>
        </div>
      )}
    </div>
  );
}
