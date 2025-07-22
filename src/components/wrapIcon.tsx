import type { IPropWrapIcon } from "@/interfaces/props-component";

export function WrapIon({ children }: IPropWrapIcon) {
  return (
    <div className="p-3 rounded-full bg-white hover:bg-gray-100 inline-block transition-all">
      {children}
    </div>
  );
}
