import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import type { ITodayNews } from "./today-news-card";

export function TodayNewsItemSkeleton() {
  return (
    <div className="px-4 py-2 cursor-pointer">
      <div className="flex-1 animate-pulse">
        {/* title */}
        <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>

        {/* avatars + info */}
        <div className="flex items-center gap-2 mt-1">
          {/* avatars */}
          <div className="flex -space-x-2">
            <div className="w-6 h-6 rounded-full bg-gray-200"></div>
            <div className="w-6 h-6 rounded-full bg-gray-200"></div>
            <div className="w-6 h-6 rounded-full bg-gray-200"></div>
          </div>

          {/* text */}
          <div className="h-3 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export function TodayNewsItem({ item }: { item: ITodayNews }) {
  return (
    <div key={item.id} className="hover:bg-gray-100 px-4 py-2 cursor-pointer">
      <div className="flex-1">
        <p className="text-sm leading-snug font-semibold line-clamp-1">
          {item.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
            {item.avatars?.map((avatar) => (
              <Avatar key={avatar} className="w-6 h-6">
                <AvatarImage src={avatar} alt={item.title} />
                <AvatarFallback>{item.category}</AvatarFallback>
              </Avatar>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            {item.time} · {item.category} · {item.posts}
          </p>
        </div>
      </div>
    </div>
  );
}
