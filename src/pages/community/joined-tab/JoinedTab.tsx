import { useEffect, useRef, useState } from "react";
import { SearchMain } from "~/components/ui/search";
import { useDebounce } from "~/hooks/useDebounce";
import { useGetMultiCommunities } from "~/hooks/useFetchCommunity";
import { cn } from "~/lib/utils";
import type { ICommunity } from "~/shared/interfaces/schemas/community.interface";
import { JoinedCard, JoinedCardSkeleton } from "./JoinedCard";

export function JoinedTab() {
  const [page, setPage] = useState(1);
  const [allCommunities, setAllCommunities] = useState<ICommunity[]>([]);
  const total_page_ref = useRef(0);

  // Search
  const [searchVal, setSearchVal] = useState("");
  const debouncedSearchVal = useDebounce(searchVal, 500);

  const { data, isLoading } = useGetMultiCommunities({
    page: page.toString(),
    limit: "10",
    q: debouncedSearchVal,
  });

  // Mỗi lần fetch API xong thì merge vào state (loại bỏ duplicate)
  useEffect(() => {
    const items = data?.data?.items || [];
    const total_page = data?.data?.total_page;
    total_page_ref.current = total_page || 0;

    if (page === 1 && debouncedSearchVal) {
      setAllCommunities(items);
    } else {
      setAllCommunities((prev) => {
        const existIds = new Set(prev.map((c) => c._id.toString()));
        const newItems = items.filter(
          (item) => !existIds.has(item._id.toString())
        );
        return [...newItems, ...prev];
      });
    }
  }, [data]);

  //
  useEffect(() => {
    return () => {
      setPage(1);
      setAllCommunities([]);
    };
  }, []);

  //
  function onSeeMore() {
    setPage((prev) => prev + 1);
  }

  return (
    <div>
      {/*  */}
      <div className="mb-4 px-4">
        <SearchMain
          size="md"
          value={searchVal}
          onClear={() => setSearchVal("")}
          onChange={setSearchVal}
        />
      </div>

      <div className="overflow-y-auto h-[calc(100vh-180px)] px-4">
        {/*  */}
        {!isLoading && allCommunities.length === 0 && page === 1 && (
          <p className="p-4 text-center text-gray-500">
            Bạn chưa tham gia vào bất kỳ cộng đồng nào.
          </p>
        )}

        {/* Loading lần đầu */}
        {isLoading && page === 1 && (
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <JoinedCardSkeleton key={`more-${i}`} />
            ))}
          </div>
        )}

        {/*  */}
        {allCommunities.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {allCommunities.map((community) => (
              <JoinedCard key={community._id} community={community} />
            ))}
          </div>
        )}

        {/* Loading khi load thêm */}
        {isLoading ? (
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <JoinedCardSkeleton key={`more-${i}`} />
            ))}
          </div>
        ) : (
          !!allCommunities.length && (
            <div className="px-4 py-3">
              <p
                className={cn(
                  "inline-block text-sm leading-snug font-semibold text-[#1d9bf0] cursor-pointer",
                  total_page_ref.current <= page
                    ? "text-gray-300 pointer-events-none cursor-default"
                    : ""
                )}
                onClick={onSeeMore}
              >
                Xem thêm
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
