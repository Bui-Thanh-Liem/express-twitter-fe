import type { ReactNode } from "react";

type PropWrapIconType = {
  children: ReactNode;
};

export function WrapIon({ children }: PropWrapIconType) {
  return (
    <div className="p-2 rounded-full bg-white hover:bg-gray-100 inline-block transition-all cursor-pointer">
      {children}
    </div>
  );
}
