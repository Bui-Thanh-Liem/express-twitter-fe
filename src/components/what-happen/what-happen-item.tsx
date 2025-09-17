import { Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { WrapIcon } from "../wrapIcon";
import type { IWhatHappen } from "./what-happen-card";

export function WhatHappenItem({ item }: { item: IWhatHappen }) {
  return (
    <div key={item.id} className="hover:bg-gray-100 px-4 py-2 cursor-pointer">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-muted-foreground">{item.desc}</p>
          <p className="text-sm leading-snug font-semibold line-clamp-1">
            {item.title}
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
