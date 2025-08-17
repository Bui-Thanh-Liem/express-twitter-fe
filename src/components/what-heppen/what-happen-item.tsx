import { Ellipsis } from "lucide-react";
import type { IWhatHappen } from "./what-happen-card";
import { WrapIcon } from "../wrapIcon";

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
        <WrapIcon>
          <Ellipsis size={20} />
        </WrapIcon>
      </div>
    </div>
  );
}
