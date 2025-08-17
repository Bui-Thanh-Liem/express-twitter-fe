import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import type { ITodayNews } from "./today-news-card";

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
