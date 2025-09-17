import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { WhatHappenItem } from "./what-happen-item";
import { Link } from "react-router-dom";

export interface IWhatHappen {
  id: number;
  title: string;
  desc: string;
}

// eslint-disable-next-line react-refresh/only-export-components
export const initial_happens: IWhatHappen[] = [
  {
    id: 1,
    title: "tod too",
    desc: "Trending in Vietnam",
  },
  {
    id: 2,
    title: "setsuko tun",
    desc: "Trending in Vietnam",
  },
  {
    id: 3,
    title: "man phyfe",
    desc: "Trending in Vietnam",
  },
  {
    id: 4,
    title: "reynaldo kennon",
    desc: "Trending in Vietnam",
  },
];

export function WhatHappenCard() {
  return (
    <Card className="w-full rounded-2xl py-0 pt-2 overflow-hidden gap-2">
      <CardHeader className="flex flex-row items-center justify-between px-4 mb-0">
        <CardTitle className="text-xl">Chuyện gì xảy ra</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        {initial_happens.map((item) => (
          <WhatHappenItem key={item.id} item={item} />
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
