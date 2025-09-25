import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useGetTopFollowedUsers } from "~/hooks/useFetchUser";
import { cn } from "~/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { WhoToFollowItem, WhoToFollowItemSkeleton } from "./who-to-follow-item";

export function WhoToFollowCard() {
  const { data, isLoading } = useGetTopFollowedUsers({
    page: "1",
    limit: "2",
  });
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const whoToFollows = useMemo(
    () => data?.data?.items || [],
    [data?.data?.items]
  );

  useEffect(() => {
    setOpen(window.location.hash !== "#who-to-follow");
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
        <CardTitle className="text-xl">Ai để theo dõi</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        {/*  */}
        {isLoading
          ? Array.from({ length: 2 }).map((_, i) => (
              <WhoToFollowItemSkeleton key={`more-${i}`} />
            ))
          : whoToFollows.map((item) => (
              <WhoToFollowItem key={item._id} user={item} />
            ))}

        {/*  */}
        {whoToFollows.length > 0 && (
          <div className="hover:bg-gray-100 px-4 py-3">
            <div>
              <Link to="/explore#who-to-follow">
                <p className="inline-block text-sm leading-snug font-semibold text-[#1d9bf0] cursor-pointer">
                  Xem thêm
                </p>
              </Link>
            </div>
          </div>
        )}

        {/*  */}
        {!whoToFollows.length && (
          <div className="flex justify-center items-center h-20">
            <p className="text-gray-400">Chưa có người dùng nổi bật</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
