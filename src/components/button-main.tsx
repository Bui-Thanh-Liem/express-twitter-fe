import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import * as React from "react";

type ButtonSize = "sm" | "md" | "lg";

type ButtonMainProps = React.ComponentProps<typeof Button> & {
  fullWidth?: boolean;
  size?: ButtonSize;
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-base",
  lg: "h-13 px-6 text-lg",
};

export function ButtonMain({
  className,
  fullWidth,
  size = "md",
  variant,
  ...props
}: ButtonMainProps) {
  const classes = variant
    ? ""
    : "bg-black hover:bg-[#333] text-white rounded-full shadow  cursor-pointer";

  return (
    <Button
      variant={variant}
      className={cn(
        classes,
        sizeStyles[size],
        fullWidth && "w-full",
        className
      )}
      {...props}
    />
  );
}
