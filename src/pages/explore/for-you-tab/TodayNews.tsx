import { useEffect, useState } from "react";
import {
  TodayNewsItem,
  TodayNewsItemSkeleton,
} from "~/components/today-news/today-news-item";
import { useGetTodayNews } from "~/hooks/useFetchExplore";
import type { IResTodayNews } from "~/shared/dtos/res/explore.dto";

export function TodayNews() {
  const [news, setNews] = useState<IResTodayNews[]>([]);
  const [limit, setLimit] = useState(4);

  //
  const { data, isLoading } = useGetTodayNews({
    page: "1",
    limit: limit.toString(),
  });

  // Mỗi lần fetch xong thì append thêm vào state
  useEffect(() => {
    const items = data?.data || [];
    if (items) {
      setNews((prev) => [...prev, ...items]);
    }
  }, [data]);

  //
  function onSeeMore() {
    setLimit((prev) => prev + 20);
  }

  //
  useEffect(() => {
    return () => {
      setLimit(4);
      setNews([]);
    };
  }, []);

  //
  if (!news?.length) return null;

  return (
    <>
      <p className="text-xl font-bold py-2 bg-gray-50 sticky top-16 z-20">
        Tin tức hôm nay
      </p>
      <div>
        {news.map((item) => (
          <TodayNewsItem key={item.id} item={item} isMedia />
        ))}
        {isLoading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <TodayNewsItemSkeleton key={`more-${i}`} />
          ))
        ) : (
          <div className="px-4 py-3">
            <p
              className={
                "inline-block text-sm leading-snug font-semibold text-[#1d9bf0] cursor-pointer"
              }
              onClick={onSeeMore}
            >
              Xem thêm
            </p>
          </div>
        )}
      </div>
    </>
  );
}
