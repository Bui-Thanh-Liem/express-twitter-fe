import type { ReactNode } from "react";

export function TypographyP({
  children,
  className,
}: {
  children: string | ReactNode;
  className?: string;
}) {
  return (
    <p className={`leading-7 [&:not(:first-child)]:mt-6 ${className}`}>
      {children}
    </p>
  );
}
