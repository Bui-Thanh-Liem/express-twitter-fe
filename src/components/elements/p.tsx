import type { ReactNode } from "react";

export function TypographyP({
  children,
  className,
  onClick,
}: {
  children: string | ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <p className={`text-[16px] ${className} `} onClick={onClick}>
      {children}
    </p>
  );
}
