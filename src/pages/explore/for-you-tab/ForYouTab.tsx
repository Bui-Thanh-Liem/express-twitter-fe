import { initial_news } from "~/components/today-news/today-news-card";
import { TodayNewsItem } from "~/components/today-news/today-news-item";
import { TabsContent } from "~/components/ui/tabs";
import { initial_happens } from "~/components/what-heppen/what-happen-card";
import { WhatHappenItem } from "~/components/what-heppen/what-happen-item";
import { WhoToFollows } from "./whoToFollows";

export function ForYouTab() {
  return (
    <TabsContent value="for-you" className="px-0 pb-4">
      {/*  */}
      <p className="text-xl font-bold">Tin tức hôm nay</p>
      <div>
        {initial_news.map((item) => (
          <TodayNewsItem key={item.id} item={item} />
        ))}
      </div>

      {/*  */}
      <p className="text-xl font-bold mt-4">Chuyện gì xảy ra</p>
      <div>
        {initial_happens.map((item) => (
          <WhatHappenItem key={item.id} item={item} />
        ))}
      </div>

      {/*  */}
      <WhoToFollows />
    </TabsContent>
  );
}
