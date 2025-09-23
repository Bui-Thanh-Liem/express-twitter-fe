import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useGetTrending } from "~/hooks/useFetchExplore";
import { cn } from "~/lib/utils";
import type { ITrending } from "~/shared/interfaces/schemas/trending.interface";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import type { IHashtag } from "~/shared/interfaces/schemas/hashtag.interface";

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
  const [trending, setTrending] = useState<ITrending[]>([]);

  const { data, isLoading, refetch } = useGetTrending({
    page: "1",
    limit: "20",
    q: valueSearch,
  });

  const _trending = useMemo(() => data?.data?.items || [], [data?.data?.items]);

  useEffect(() => {
    setTrending(_trending);
  }, [_trending]);

  useEffect(() => {
    refetch();
  }, [refetch, valueSearch]);

  console.log("valueSearch::", valueSearch);
  console.log("_trending::", _trending);

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
          {trending?.map((t) => (
            <li
              key={t._id}
              className="cursor-pointer hover:bg-gray-100 p-2 rounded"
              onClick={() => {
                const hn = (t.hashtag as IHashtag)?.name;
                oncSelect(hn);
                setOpen(false); // đóng khi chọn
              }}
            >
              {(t.hashtag as IHashtag)?.name}
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
