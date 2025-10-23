import type { CarouselApi } from "@/components/ui/carousel";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "~/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import { SearchMain } from "~/components/ui/search";
import { useDebounce } from "~/hooks/useDebounce";
import { useGetMultiCommunities } from "~/hooks/useFetchCommunity";
import { cn } from "~/lib/utils";
import { EMembershipType, EVisibilityType } from "~/shared/enums/type.enum";
import type { ICommunity } from "~/shared/interfaces/schemas/community.interface";
import { JoinedCard, JoinedCardSkeleton } from "./JoinedCard";

const carouselItems = [
  "Tất cả",
  ...Object.values(EVisibilityType),
  ...Object.values(EMembershipType),
];

export function JoinedTab() {
  const [page, setPage] = useState(1);
  const [allCommunities, setAllCommunities] = useState<ICommunity[]>([]);
  const total_page_ref = useRef(0);

  // Search, Carousel
  const [searchVal, setSearchVal] = useState("");
  const debouncedSearchVal = useDebounce(searchVal, 500);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const debouncedCarouselVal = useDebounce(
    carouselItems[current] === "Tất cả" ? "" : carouselItems[current],
    1000
  );

  //
  useEffect(() => {
    if (!api) return;

    // Lấy index hiện tại khi carousel được khởi tạo
    setCurrent(api.selectedScrollSnap());

    // Lắng nghe sự kiện khi carousel scroll
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const { data, isLoading } = useGetMultiCommunities({
    limit: "10",
    qe: debouncedCarouselVal,
    page: page.toString(),
    q: debouncedSearchVal,
  });

  // Mỗi lần fetch API xong thì merge vào state (loại bỏ duplicate)
  useEffect(() => {
    const items = data?.data?.items || [];
    const total_page = data?.data?.total_page;
    total_page_ref.current = total_page || 0;

    if (page === 1 && (debouncedSearchVal || debouncedCarouselVal)) {
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
  }, [debouncedCarouselVal, data, debouncedSearchVal, page]);

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
      <div className="mb-4 px-4 flex items-center gap-4">
        <div className="mr-12 flex-1">
          <SearchMain
            size="md"
            value={searchVal}
            onClear={() => setSearchVal("")}
            onChange={setSearchVal}
          />
        </div>
        <Carousel className="w-[40%] ml-auto mr-14" setApi={setApi}>
          <CarouselContent className="-ml-1 px-6">
            {carouselItems.map((_) => (
              <CarouselItem key={_} className="pl-1 md:basis-1/1 lg:basis-1/1">
                <Card className="py-1 rounded-2xl">
                  <CardContent className="flex items-center justify-center">
                    <span className="text-[15px] font-medium">{_}</span>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      <div className="overflow-y-auto h-[calc(100vh-180px)] px-4">
        {/*  */}
        {!isLoading && allCommunities.length === 0 && page === 1 && (
          <p className="mt-24 p-4 text-center text-gray-500">
            Bạn chưa tham gia vào bất kỳ cộng đồng nào.
          </p>
        )}

        {/* Loading lần đầu */}
        {isLoading && page === 1 && (
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
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
        {isLoading && page > 1 ? (
          <div className="grid grid-cols-3 gap-3 mt-3">
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
