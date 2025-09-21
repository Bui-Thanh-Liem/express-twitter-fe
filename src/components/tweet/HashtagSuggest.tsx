import type { ReactNode } from "react";
import { cn } from "~/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export function HashtagSuggest({
  open,
  setOpen,
  children,
  className,
  oncSelect,
  valueSearch,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
  className?: string;
  children: ReactNode;
  valueSearch: string;
  oncSelect: (hashtag: string) => void;
}) {
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className={cn(className)}>
        {children}
      </PopoverTrigger>
      <PopoverContent
        className="p-4 bg-white border rounded-2xl shadow-lg max-h-72 overflow-y-auto"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <ul className="flex flex-col gap-2">
          {Array.from({ length: 10 }, (_, i) => (
            <li
              key={i}
              className="cursor-pointer hover:bg-gray-100 p-2 rounded"
              onClick={() => {
                oncSelect(`#hashtag_${i}`);
                setOpen(false); // đóng khi chọn
              }}
            >
              #hashtag_{i}
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
