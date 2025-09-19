import { Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { WrapIcon } from "../wrapIcon";
import type { ISearchSuggest } from "~/shared/interfaces/schemas/searchSuggest.interface";
import type { IHashtag } from "~/shared/interfaces/schemas/hashtag.interface";

export function WhatHappenItemSkeleton() {
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
        <div className="h-5 w-5 bg-gray-200 rounded-full" />
      </div>
    </div>
  );
}

export function WhatHappenItem({ item }: { item: ISearchSuggest }) {
  return (
    <div key={item._id} className="hover:bg-gray-100 px-4 py-2 cursor-pointer">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-muted-foreground">
            {(item.hashtag as IHashtag)?.name}
          </p>
          <p className="text-sm leading-snug font-semibold line-clamp-1">
            {item.text}
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
