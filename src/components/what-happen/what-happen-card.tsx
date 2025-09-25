import { Link, useLocation } from "react-router-dom";
import { useGetTrending } from "~/hooks/useFetchExplore";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { WhatHappenItem, WhatHappenItemSkeleton } from "./what-happen-item";
import { useEffect, useMemo, useState } from "react";
import { cn } from "~/lib/utils";

export function WhatHappenCard() {
  //
  const { data, isLoading } = useGetTrending({
    page: "1",
    limit: "4",
  });

  const location = useLocation();
  const [open, setOpen] = useState(false);

  const trending = useMemo(() => data?.data?.items || [], [data?.data?.items]);

  useEffect(() => {
    setOpen(window.location.hash !== "#what-happen");
  }, [location.hash]);

  //
  return (
    <Card
      className={cn(
        "w-full rounded-2xl py-0 pt-2 overflow-hidden gap-2",
        open ? "" : "hidden"
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between px-4 mb-0">
        <CardTitle className="text-xl">Chuyện gì đang xảy ra</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        {/*  */}
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <WhatHappenItemSkeleton key={`more-${i}`} />
            ))
          : trending?.map((item) => (
              <WhatHappenItem key={item._id} item={item} />
            ))}

        {/*  */}
        {trending.length > 0 && (
          <div className="hover:bg-gray-100 px-4 py-3">
            <Link to="/explore#what-happen">
              <p className="inline-block text-sm leading-snug font-semibold text-[#1d9bf0] cursor-pointer">
                Xem thêm
              </p>
            </Link>
          </div>
        )}

        {/*  */}
        {!trending.length && (
          <div className="pb-4 pl-4">
            <p className="text-gray-400">Chưa có gì nổi bật</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
