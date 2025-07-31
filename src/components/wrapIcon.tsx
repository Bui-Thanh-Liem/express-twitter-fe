import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

type PropWrapIconType = {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
};

export function WrapIcon({ onClick, children, className }: PropWrapIconType) {
  return (
    <div
      className={cn(
        `p-2 rounded-full bg-white hover:bg-gray-100 inline-block transition-all cursor-pointer ${className}`
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
