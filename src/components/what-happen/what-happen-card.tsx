import { Link } from "react-router-dom";
import { useGetTrending } from "~/hooks/useFetchSearchSuggest";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { WhatHappenItem } from "./what-happen-item";

export function WhatHappenCard() {
  //
  const { data } = useGetTrending({
    page: "1",
    limit: "4",
  });
  console.log("data:::", data?.data?.items);

  //
  return (
    <Card className="w-full rounded-2xl py-0 pt-2 overflow-hidden gap-2">
      <CardHeader className="flex flex-row items-center justify-between px-4 mb-0">
        <CardTitle className="text-xl">Chuyện gì xảy ra</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        {data?.data?.items?.map((item) => (
          <WhatHappenItem key={item._id} item={item} />
        ))}
        <div className="hover:bg-gray-100 px-4 py-3">
          <div>
            <Link to="/explore/#what-happen">
              <p className="inline-block text-sm leading-snug font-semibold text-[#1d9bf0] cursor-pointer">
                Xem thêm
              </p>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
