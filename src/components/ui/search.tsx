import { Search, X } from "lucide-react";
import { Input } from "./input";
import { cn } from "~/lib/utils";

type SearchSize = "sm" | "md" | "lg";

const sizeStyles: Record<SearchSize, string> = {
  sm: "h-8 text-sm pl-8 pr-3",
  md: "h-10 text-base pl-9 pr-4",
  lg: "h-12 text-lg pl-10 pr-5",
};

interface Suggestion {
  id: string | number;
  label: string;
}

interface SearchBarProps {
  size?: SearchSize;
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  suggestions?: Suggestion[];
  onSelectSuggestion?: (item: Suggestion) => void;
}

export function SearchMain({
  value,
  onChange,
  onClear,
  size = "md",
  suggestions = [],
  onSelectSuggestion,
}: SearchBarProps) {
  return (
    <div className="relative w-full">
      {/* Icon search bên trái */}
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

      {/* Input */}
      <Input
        type="text"
        placeholder="Tìm kiếm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn("rounded-full", sizeStyles[size])}
      />

      {/* Nút clear */}
      {value && (
        <X
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground"
        />
      )}

      {/* Dropdown gợi ý */}
      {suggestions.length > 0 && (
        <div className="absolute w-[98%] left-1/2 -translate-x-1/2 mt-1 z-50 rounded-md border bg-background shadow-lg">
          {suggestions?.map((item) => (
            <div
              key={item.id}
              className="cursor-pointer px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
              onClick={() => onSelectSuggestion?.(item)}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
