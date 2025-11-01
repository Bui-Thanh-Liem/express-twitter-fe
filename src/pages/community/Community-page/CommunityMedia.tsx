import { useEffect, useRef, useState } from "react";
import { MediaContent } from "~/components/list-tweets/item-tweet";
import { useGetCommunityTweets } from "~/hooks/useFetchTweet";
import { EMediaType } from "~/shared/enums/type.enum";
import type { ITweet } from "~/shared/interfaces/schemas/tweet.interface";

export function CommunityMedia({ community_id }: { community_id: string }) {
  // State để quản lý pagination và data
  const [page, setPage] = useState(1);
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Ref để theo dõi element cuối cùng
  const observerRef = useRef<HTMLDivElement>(null);
  const observerInstanceRef = useRef<IntersectionObserver | null>(null);

  const { data, isLoading, error } = useGetCommunityTweets({
    limit: "10",
    page: page.toString(),
    community_id: community_id,
  });

  // Effect để xử lý khi có data mới
  useEffect(() => {
    if (data?.data?.items) {
      const newMedia = data.data.items;
      if (page === 1) {
        // Nếu là trang đầu tiên, replace toàn bộ
        setTweets(() => {
          return newMedia;
        });
      } else {
        // Nếu là trang tiếp theo, append vào cuối
        setTweets((prev) => {
          // Loại bỏ duplicate media dựa trên url (hoặc _id nếu có)
          const existingUrls = new Set(prev.map((media) => media.media?.url));
          const filteredNewMedia = newMedia.filter(
            (media) => !existingUrls.has(media.media?.url)
          );
          return [...prev, ...filteredNewMedia];
        });
      }

      // Kiểm tra xem còn data để load không
      if (newMedia.length < 10) {
        // Nếu số media trả về ít hơn limit
        setHasMore(false);
      }

      setIsLoadingMore(false);
    }
  }, [data, page, community_id]);

  // Callback khi element cuối cùng xuất hiện trên viewport
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleObserver = (entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (
      entry.isIntersecting &&
      hasMore &&
      !isLoading &&
      !isLoadingMore &&
      tweets.length > 0
    ) {
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
    // setAllMedia([]);
    setHasMore(true);
    setIsLoadingMore(false);

    // Scroll lên đầu trang khi thay đổi profile
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [community_id]);

  // Error state
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">
          ❌ Có lỗi xảy ra khi tải hình ảnh/video
        </p>
        <button
          onClick={() => {
            setPage(1);
            setTweets([]);
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

  return (
    <div className="px-4">
      {/* Media grid */}
      {tweets.length > 0 && (
        <div className="grid grid-cols-3 gap-x-6 gap-y-0">
          {tweets.map((m, index) => (
            <div
              key={m.media?.url || `media-${index}`}
              className="aspect-square"
            >
              <MediaContent
                tweet={m}
                url={m.media?.url || ""}
                type={m.media?.type || EMediaType.Image}
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
      {!isLoading && tweets.length === 0 && page === 1 && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg mb-2">📷 Chưa có media nào</p>
          <p className="text-gray-400">Chưa đăng bài viết</p>
        </div>
      )}

      {/* Observer element - invisible trigger cho infinite scroll */}
      <div ref={observerRef} className="h-1 w-full" />

      {/* End of content indicator */}
      {!hasMore && tweets.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">
            🎉 Bạn đã xem hết tất cả hình ảnh/video!
          </p>
        </div>
      )}
    </div>
  );
}
