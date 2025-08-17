import { X } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { WrapIcon } from "../wrapIcon";
import { TodayNewsItem } from "./today-news-item";

export interface ITodayNews {
  id: number;
  title: string;
  time: string;
  category: string;
  posts: string;
  avatars: string[];
}

//
// eslint-disable-next-line react-refresh/only-export-components
export const initial_news: ITodayNews[] = [
  {
    id: 1,
    title: "Bessent Urges Fed for Rate Reduction in September",
    time: "19 hours ago",
    category: "News",
    posts: "14.3K posts",
    avatars: [
      "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/87.jpg",
      "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/87.jpg",
      "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/87.jpg",
    ],
  },
  {
    id: 2,
    title: "Texas GOP Senate Primary: Cornyn vs. Paxton",
    time: "2 hours ago",
    category: "News",
    posts: "1,406 posts",
    avatars: [
      "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/76.jpg",
      "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/76.jpg",
    ],
  },
  {
    id: 3,
    title: "Starlink Launches in Kazakhstan",
    time: "10 hours ago",
    category: "News",
    posts: "12.8K posts",
    avatars: [
      "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/44.jpg",
    ],
  },
];

export function TodayNewsCard() {
  const [isHidden, setIsHidden] = useState(false);

  return (
    <Card
      hidden={isHidden}
      className="w-full rounded-2xl py-0 pt-2 overflow-hidden gap-2"
    >
      <CardHeader className="flex flex-row items-center justify-between px-4 mb-0">
        <CardTitle className="text-xl">Tin tức hôm nay</CardTitle>
        <WrapIcon>
          <X
            className="h-4 w-4 cursor-pointer"
            onClick={() => setIsHidden(true)}
          />
        </WrapIcon>
      </CardHeader>
      <CardContent className="px-0">
        {initial_news.map((item) => (
          <TodayNewsItem key={item.id} item={item} />
        ))}
      </CardContent>
    </Card>
  );
}
