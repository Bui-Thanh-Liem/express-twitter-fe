import { useEffect, useState, type ReactNode } from "react";
import { useGetMultiForMentions } from "~/hooks/useFetchUser";
import { cn } from "~/lib/utils";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export function Mentions({
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
  oncSelect: (user: Pick<IUser, "_id" | "name" | "username">) => void;
}) {
  //
  const [debouncedValue, setDebouncedValue] = useState(valueSearch);
  const [mentions, setMentions] = useState<
    Pick<IUser, "_id" | "name" | "username">[]
  >([]);

  //
  const { data, isLoading, refetch } = useGetMultiForMentions(
    debouncedValue,
    !!debouncedValue
  );

  //
  useEffect(() => {
    const delay = setTimeout(() => {
      refetch();
    }, 300);
    return () => clearTimeout(delay);
  }, [refetch, valueSearch]);

  //
  useEffect(() => {
    const items = data?.data || [];
    setMentions(items);
  }, [data]);

  //
  useEffect(() => {
    const delay = setTimeout(() => setDebouncedValue(valueSearch), 300);
    return () => clearTimeout(delay);
  }, [valueSearch]);

  //
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
            {mentions.map((u) => (
              <li
                key={u._id}
                className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                onClick={() => {
                  oncSelect(u);
                  setOpen(false);
                }}
              >
                {u.username}
              </li>
            ))}
            {!mentions.length && (
              <li className="text-gray-500 text-base p-2">Không có kết quả</li>
            )}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
}
