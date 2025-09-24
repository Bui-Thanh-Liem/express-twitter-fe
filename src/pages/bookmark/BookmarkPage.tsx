import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "~/components/icons/arrow-left";
import { TweetItem } from "~/components/list-tweets/item-tweet";
import { SkeletonTweet } from "~/components/list-tweets/list-tweets";
import { SearchMain } from "~/components/ui/search";
import { WrapIcon } from "~/components/wrapIcon";
import { useDebounce } from "~/hooks/useDebounce";
import { useGetTweetBookmarked } from "~/hooks/useFetchTweet";
import type { ITweet } from "~/shared/interfaces/schemas/tweet.interface";
import { useUserStore } from "~/store/useUserStore";

export function BookmarkPage() {
  // State để quản lý pagination và data
  const { user } = useUserStore();
  const [page, setPage] = useState(1);
  const [allTweets, setAllTweets] = useState<ITweet[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const navigate = useNavigate();

  // Search
  const [searchVal, setSearchVal] = useState("");
  const debouncedSearchVal = useDebounce(searchVal, 400);

  // Ref để theo dõi element cuối cùng
  const observerRef = useRef<HTMLDivElement>(null);
  const observerInstanceRef = useRef<IntersectionObserver | null>(null);

  const { data, isLoading, error } = useGetTweetBookmarked({
    limit: "10",
    q: debouncedSearchVal,
    user_id: user?._id,
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
    [hasMore, isLoading, isLoadingMore]
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
  }, [user?._id]);

  //
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setIsLoadingMore(false);
  }, [debouncedSearchVal]);

  console.log("allTweets", allTweets);
  console.log("page", page);
  console.log("searchVal", searchVal);

  return (
    <div>
      {/* Header */}
      <div className="px-3 flex justify-between items-center border border-gray-100">
        <div className="flex h-12 items-center gap-6 ">
          <WrapIcon onClick={() => navigate(-1)} aria-label="Quay lại">
            <ArrowLeftIcon />
          </WrapIcon>
          <p className="font-semibold text-[20px]">Bookmarks</p>
        </div>
      </div>

      {/* Search */}
      <div className="p-4">
        <SearchMain
          size="lg"
          value={searchVal}
          onClear={() => setSearchVal("")}
          onChange={setSearchVal}
        />
      </div>

      <div className="max-h-[calc(100vh-(48px))] overflow-y-auto">
        {/* Loading state cho lần load đầu tiên */}
        {isLoading && page === 1 && <SkeletonTweet />}

        {/* Tweets list */}
        {allTweets.length > 0 && (
          <div className="space-y-6">
            {allTweets.map((tweet, index: number) => (
              <span key={tweet._id}>
                <TweetItem tweet={tweet} />
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

        {/* Empty state - chưa có data nhưng không phải total = 0 */}
        {!isLoading && allTweets.length === 0 && page === 1 && !searchVal && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg mb-2">
              ❤️ Chưa có tweet nào được thích
            </p>
            <p className="text-gray-400">
              Hãy thích một số tweet để chúng xuất hiện ở đây!
            </p>
          </div>
        )}

        {!isLoading && allTweets.length === 0 && page === 1 && searchVal && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg mb-2">
              Không tìm thấy tweet nào khớp với "{searchVal}"
            </p>
            <p className="text-gray-400">Hãy thử từ khóa khác!</p>
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
            <p className="text-red-500 mb-4">
              ❌ Có lỗi xảy ra khi tải dữ liệu
            </p>
            <button
              onClick={() => {
                setPage(1);
                setAllTweets([]);
                setHasMore(true);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Thử lại
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
