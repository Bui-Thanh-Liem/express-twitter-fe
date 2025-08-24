import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as React from "react";
import { cn } from "~/lib/utils";

function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    />
  );
}

function AvatarMain({
  src,
  className,
  alt = "avatar",
}: {
  className?: string;
  alt: string | undefined;
  src: string | undefined;
}) {
  return (
    <Avatar className={cn("w-10 h-10", className)}>
      <AvatarImage src={src} alt={alt} className="object-cover" />
      <AvatarFallback>{alt[0]?.toLocaleUpperCase()}</AvatarFallback>
    </Avatar>
  );
}

export { Avatar, AvatarFallback, AvatarImage, AvatarMain };
