import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as React from "react";
import { cn } from "~/lib/utils";

type GroupAvatarMainProps = {
  srcs: string[];
  max?: number; // số avatar hiển thị tối đa
  className?: string;
};

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

function GroupAvatarMain({ srcs, max = 3, className }: GroupAvatarMainProps) {
  const visibleUsers = srcs.slice(0, max);
  const extraCount = srcs.length - max;

  return (
    <div className={cn("flex -space-x-2", className)}>
      {visibleUsers.map((src) => (
        <AvatarMain
          key={src}
          src={src}
          alt={src}
          className="w-8 h-8 border-2 border-white"
        />
      ))}

      {extraCount > 0 && (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-300 text-xs font-medium border-2 border-white">
          +{extraCount}
        </div>
      )}
    </div>
  );
}

export { Avatar, AvatarFallback, AvatarImage, AvatarMain, GroupAvatarMain };

