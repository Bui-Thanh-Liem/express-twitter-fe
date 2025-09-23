import type { IResTodayNews } from "~/shared/dtos/res/explore.dto";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatTimeAgo } from "~/utils/formatTimeAgo";
import { MediaContent } from "../list-tweets/item-tweet";
import { cn } from "~/lib/utils";

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

export function TodayNewsItem({
  item,
  isMedia = false,
}: {
  item: IResTodayNews;
  isMedia?: boolean;
}) {
  return (
    <div
      key={item.id}
      className="hover:bg-gray-100 px-4 py-2 cursor-pointer flex justify-between gap-3"
    >
      <div className="flex-1">
        <p
          className={cn(
            "text-sm leading-snug font-semibold",
            !isMedia ? "line-clamp-1" : "line-clamp-3"
          )}
        >
          {item.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2">
            {item.avatars?.map((avatar, i) => (
              <Avatar key={`${avatar}-${i}`} className="w-6 h-6">
                <AvatarImage src={avatar} alt={item.title} />
                <AvatarFallback>{item.category}</AvatarFallback>
              </Avatar>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            {formatTimeAgo(item.time as unknown as string)} · {item.category} ·{" "}
            {item.posts} bài đăng
          </p>
        </div>
      </div>
      {isMedia && (
        <div className="w-32 h-20">
          <MediaContent type={item.media?.type} url={item.media?.url} />
        </div>
      )}
    </div>
  );
}
