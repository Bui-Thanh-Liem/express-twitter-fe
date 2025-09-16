import { useMemo } from "react";
import { useGetTopFollowedUsers } from "~/hooks/useFetchUser";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { WhoToFollowItem } from "./who-to-follow-item";

export function WhoToFollowCard() {
  const { data } = useGetTopFollowedUsers({
    page: "1",
    limit: "2",
  });

  const whoToFollows = useMemo(
    () => data?.data?.items || [],
    [data?.data?.items]
  );

  return (
    <Card className="w-full rounded-2xl py-0 pt-2 overflow-hidden gap-2">
      <CardHeader className="flex flex-row items-center justify-between px-4 mb-0">
        <CardTitle className="text-xl">Ai để theo dõi</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        {whoToFollows.map((item) => (
          <WhoToFollowItem key={item._id} item={item} />
        ))}
        <div className="hover:bg-gray-100 px-4 py-3">
          <div>
            <p className="inline-block text-sm leading-snug font-semibold text-[#1d9bf0] cursor-pointer">
              Xem thêm
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
