import { X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useGetTodayNews } from "~/hooks/useFetchExplore";
import { cn } from "~/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { WrapIcon } from "../wrapIcon";
import { TodayNewsItem, TodayNewsItemSkeleton } from "./today-news-item";

export function TodayNewsCard() {
  //
  const { data, isLoading } = useGetTodayNews({
    page: "1",
    limit: "4",
  });

  const location = useLocation();
  const [open, setOpen] = useState(false);

  const news = useMemo(() => data?.data?.slice(0, 3) || [], [data?.data]);

  useEffect(() => {
    setOpen(location.pathname !== "/trending-today");
  }, [location]);

  //
  // if (!news?.length) return null;

  return (
    <Card
      className={cn(
        "w-full rounded-2xl py-0 pt-2 overflow-hidden gap-2",
        open ? "" : "hidden"
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between px-4 mb-0">
        <CardTitle className="text-xl">Tin tức hôm nay</CardTitle>
        <WrapIcon>
          <X className="h-4 w-4" onClick={() => setOpen(true)} />
        </WrapIcon>
      </CardHeader>
      <CardContent className="px-0">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <TodayNewsItemSkeleton key={`more-${i}`} />
            ))
          : news.map((item) => <TodayNewsItem key={item.id} item={item} />)}

        {!news.length && (
          <div className="pb-4 pl-4">
            <p className="text-gray-400">Chưa có gì nổi bật hôm nay</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
