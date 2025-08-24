import { useEffect, useRef, useState } from "react";
import { MediaContent } from "~/components/list-tweets/item-tweet";
import { useGetProfileMedia } from "~/hooks/useFetchTweet";
import { EMediaType } from "~/shared/enums/type.enum";

// Type cho media item (adjust theo interface thực tế của bạn)
interface IMediaItem {
  _id?: string;
  media?: {
    url: string;
    type: EMediaType;
  };
  // Thêm các field khác nếu cần
}

export function ProfileMedia({ profile_id }: { profile_id: string }) {
  // State để quản lý pagination và data
  const [page, setPage] = useState(1);
  const [allMedia, setAllMedia] = useState<IMediaItem[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Ref để theo dõi element cuối cùng
  const observerRef = useRef<HTMLDivElement>(null);
  const observerInstanceRef = useRef<IntersectionObserver | null>(null);

  const { data, isLoading, error } = useGetProfileMedia({
    limit: "20",
    profile_id,
    page: page.toString(),
  });

  // Effect để xử lý khi có data mới
  useEffect(() => {
    if (data?.data?.items) {
      const newMedia = data.data.items as IMediaItem[];
      if (page === 1) {
        // Nếu là trang đầu tiên, replace toàn bộ
        setAllMedia(() => {
          console.log("Setting initial media for profile:", profile_id);
          console.log("New media:", newMedia);
          return newMedia;
        });
      } else {
        // Nếu là trang tiếp theo, append vào cuối
        setAllMedia((prev) => {
          // Loại bỏ duplicate media dựa trên url (hoặc _id nếu có)
          const existingUrls = new Set(prev.map((media) => media.media?.url));
          const filteredNewMedia = newMedia.filter(
            (media) => !existingUrls.has(media.media?.url)
          );
          return [...prev, ...filteredNewMedia];
        });
      }

      // Kiểm tra xem còn data để load không
      if (newMedia.length < 20) {
        // Nếu số media trả về ít hơn limit
        setHasMore(false);
      }

      setIsLoadingMore(false);
    }
  }, [data, page, profile_id]);

  console.log("allMedia:", allMedia);

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
    // setAllMedia([]);
    setHasMore(true);
    setIsLoadingMore(false);

    // Scroll lên đầu trang khi thay đổi profile
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [profile_id]);

  // Loading skeleton cho grid layout
  const MediaSkeleton = () => (
    <div className="grid grid-cols-3 gap-4">
      {Array.from({ length: 9 }).map((_, index) => (
        <div
          key={index}
          className="aspect-square bg-gray-200 animate-pulse rounded-lg"
        />
      ))}
    </div>
  );

  // Loading state cho lần load đầu tiên
  if (isLoading && page === 1) {
    return <MediaSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">❌ Có lỗi xảy ra khi tải media</p>
        <button
          onClick={() => {
            setPage(1);
            setAllMedia([]);
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
  if (!isLoading && allMedia.length === 0 && page === 1) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-lg mb-2">📷 Chưa có media nào</p>
        <p className="text-gray-400">
          Hãy đăng ảnh hoặc video để chúng xuất hiện ở đây!
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Media grid */}
      {allMedia.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {allMedia.map((m, index) => (
            <div key={m.media?.url || `media-${index}`} className="-mb-6">
              <MediaContent
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

      {/* Observer element - invisible trigger cho infinite scroll */}
      <div
        ref={observerRef}
        className="h-10 w-full"
        // style={{ visibility: "hidden" }}
      />

      {/* End of content indicator */}
      {!hasMore && allMedia.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">🎉 Bạn đã xem hết tất cả media!</p>
        </div>
      )}
    </div>
  );
}
