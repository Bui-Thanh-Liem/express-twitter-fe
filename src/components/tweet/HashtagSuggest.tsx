import { useEffect, useState, type ReactNode } from "react";
import { useGetMultiHashtags } from "~/hooks/useFetchHashtag";
import { cn } from "~/lib/utils";
import type { IHashtag } from "~/shared/interfaces/schemas/hashtag.interface";
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
  //
  const [debouncedValue, setDebouncedValue] = useState(valueSearch);
  const [hashtags, setHashtags] = useState<IHashtag[]>([]);

  //
  const { data, isLoading, refetch } = useGetMultiHashtags(
    {
      page: "1",
      limit: "20",
      q: debouncedValue.replace("#", ""),
    },
    !!debouncedValue
  );

  useEffect(() => {
    const delay = setTimeout(() => {
      refetch();
    }, 300);
    return () => clearTimeout(delay);
  }, [refetch, valueSearch]);

  //
  useEffect(() => {
    const items = data?.data?.items || [];
    setHashtags(items);
  }, [data]);

  //
  useEffect(() => {
    const delay = setTimeout(() => setDebouncedValue(valueSearch), 300);
    return () => clearTimeout(delay);
  }, [valueSearch]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className={cn(className)}>
        {children}
      </PopoverTrigger>
      <PopoverContent
        className="p-4 bg-white border rounded-2xl shadow-lg max-h-72 overflow-y-auto"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {isLoading ? (
          <ul className="flex flex-col gap-2">
            {Array.from({ length: 5 }).map((_, idx) => (
              <li key={idx} className="p-2">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              </li>
            ))}
          </ul>
        ) : (
          <ul className="flex flex-col gap-2">
            {hashtags.map((h) => (
              <li
                key={h._id}
                className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                onClick={() => {
                  oncSelect(h.name);
                  setOpen(false);
                }}
              >
                #{h.name}
              </li>
            ))}
            {!hashtags.length && (
              <li className="text-gray-500 text-base p-2">Không có kết quả</li>
            )}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
}
