import { Search, X } from "lucide-react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDebounce } from "~/hooks/useDebounce";
import { useSearchPending } from "~/hooks/useFetchSearch";
import { cn } from "~/lib/utils";
import { VerifyIcon } from "./icons/verify";
import { AvatarMain } from "./ui/avatar";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

type SearchSize = "sm" | "md" | "lg";

const sizeStyles: Record<SearchSize, string> = {
  sm: "h-8 text-sm pl-8 pr-3",
  md: "h-10 text-base pl-9 pr-4",
  lg: "h-12 text-lg pl-10 pr-5",
};

interface SearchBarProps {
  size?: SearchSize;
  className?: string;
  placeholder?: string;
  onChange?: (val: string) => void;
}

export function SearchAdvanced({
  onChange,
  className,
  size = "md",
  placeholder = "Tìm kiếm",
}: SearchBarProps) {
  //
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q");

  //
  const [open, setOpen] = useState(false);
  const [searchVal, setSearchVal] = useState(q ?? "");
  const debouncedValue = useDebounce(searchVal, 500);

  //
  const { data } = useSearchPending(
    {
      page: "1",
      limit: "10",
      q: debouncedValue,
    },
    !!debouncedValue && debouncedValue.length > 0
  );

  const users = data?.data?.users || [];
  const trending = data?.data?.trending || [];

  //
  function onChangeSearch(val: string) {
    setSearchVal(val);
    if (onChange) onChange(val);
  }

  //
  function onKeydown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.code === "Enter") {
      console.log("Search button enter");
      if (searchVal) navigate(`/search?q=${searchVal}`);
    }
  }

  //
  function onClear() {
    setSearchVal("");
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative w-full">
          {/* Icon search bên trái */}
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

          {/* Input */}
          <Input
            type="text"
            value={searchVal}
            placeholder={placeholder}
            onChange={(e) => onChangeSearch(e.target.value)}
            onKeyDown={onKeydown}
            className={cn("rounded-full", sizeStyles[size])}
          />

          {/* Nút clear */}
          {searchVal && (
            <X
              onClick={onClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground"
            />
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "bg-white border rounded-2xl shadow-lg z-[4000]",
          className
        )}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="max-h-[60vh] overflow-y-auto">
          {searchVal && (
            <>
              {/*  */}
              {!!trending?.length && (
                <ul>
                  {trending.map((tr) => (
                    <li
                      key={tr._id}
                      className="cursor-pointer hover:bg-gray-100 p-2 rounded flex items-center gap-1"
                    >
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <h3 className="ml-4 text-md font-semibold">{tr.topic}</h3>
                    </li>
                  ))}
                </ul>
              )}

              {trending.length > 0 && users.length > 0 && (
                <hr className="my-2" />
              )}

              {/*  */}
              {!!users?.length && (
                <ul>
                  {users.map((u) => (
                    <li
                      key={u._id}
                      className="cursor-pointer hover:bg-gray-100 p-2 rounded flex items-center gap-1"
                    >
                      <AvatarMain
                        src={u.avatar}
                        alt={u.name}
                        className="mr-3"
                      />
                      <div>
                        <span className="flex items-center gap-2">
                          <h3 className="text-md font-semibold">{u.name}</h3>
                          <VerifyIcon active={!!u.verify} size={20} />
                        </span>
                        <p className="text-[14px] text-gray-400">
                          {u.username}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>

        {/*  */}
        <p className="text-gray-500 text-base p-2 pt-3">
          Tìm kiếm mọi thứ bạn muốn{" "}
          {searchVal && <strong>"{searchVal}"</strong>}
        </p>
      </PopoverContent>
    </Popover>
  );
}
