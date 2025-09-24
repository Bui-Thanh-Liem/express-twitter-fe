import { useCallback } from "react";
import { useDebounce } from "~/hooks/useDebounce";
import { useGetMultiForMentions } from "~/hooks/useFetchUser";
import { cn } from "~/lib/utils";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface MentionsProps {
  open: boolean;
  setOpen: (val: boolean) => void;
  className?: string;
  children: React.ReactNode;
  valueSearch: string;
  onSelect: (user: Pick<IUser, "_id" | "name" | "username">) => void;
}

export function Mentions({
  open,
  setOpen,
  children,
  className,
  onSelect,
  valueSearch,
}: MentionsProps) {
  //
  const debouncedValue = useDebounce(valueSearch, 400);

  //
  const { data, isLoading } = useGetMultiForMentions(
    debouncedValue,
    !!debouncedValue && debouncedValue.length > 0
  );
  const mentions = data?.data || [];

  // Memoize onSelect để tránh re-render không cần thiết
  const handleSelect = useCallback(
    (user: Pick<IUser, "_id" | "name" | "username">) => {
      onSelect(user);
      setOpen(false);
    },
    [onSelect, setOpen]
  );

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
                onClick={() => handleSelect(u)}
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
