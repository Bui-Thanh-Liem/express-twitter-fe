import { Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { WrapIcon } from "~/components/wrapIcon";
import type { IHashtag } from "~/shared/interfaces/schemas/hashtag.interface";
import type { ITrending } from "~/shared/interfaces/schemas/trending.interface";

export function TrendingItemSkeleton() {
  return (
    <div className="px-4 py-2 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          {/* Hashtag giả */}
          <div className="h-3 w-16 bg-gray-200 rounded" />
          {/* Text giả */}
          <div className="h-4 w-40 bg-gray-200 rounded" />
        </div>

        {/* Icon giả */}
        <div className="h-8 w-8 bg-gray-200 rounded-full" />
      </div>
    </div>
  );
}

export function TrendingItem({ item, idx }: { item: ITrending; idx: number }) {
  return (
    <div key={item._id} className="hover:bg-gray-100 px-4 py-2 cursor-pointer">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-muted-foreground">
            {`${idx} `}. {(item.hashtag as IHashtag)?.name}
          </p>
          <p className="text-sm leading-snug font-semibold line-clamp-1">
            {item.topic}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="outline-0 outline-transparent">
              <WrapIcon>
                <Ellipsis size={20} />
              </WrapIcon>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side="right"
            align="end"
            className="rounded-2xl py-2"
          >
            <DropdownMenuItem className="cursor-pointer px-4 font-semibold">
              Quan tâm
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer px-4 font-semibold">
              Bỏ qua
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
