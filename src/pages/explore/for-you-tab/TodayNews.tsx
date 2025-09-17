import { initial_news } from "~/components/today-news/today-news-card";
import { TodayNewsItem } from "~/components/today-news/today-news-item";

export function TodayNews() {
  return (
    <>
      <p className="text-xl font-bold py-2 bg-gray-50 sticky top-16 z-20">
        Tin tức hôm nay
      </p>
      <div>
        {initial_news.map((item) => (
          <TodayNewsItem key={item.id} item={item} />
        ))}
      </div>
    </>
  );
}
