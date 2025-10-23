import { Pin } from "lucide-react";
import { Link } from "react-router-dom";
import { VerifyIcon } from "~/components/icons/verify";
import { Logo } from "~/components/logo";
import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { WrapIcon } from "~/components/wrapIcon";
import { cn } from "~/lib/utils";
import { EMembershipType, EVisibilityType } from "~/shared/enums/type.enum";
import type { ICommunity } from "~/shared/interfaces/schemas/community.interface";

export function JoinedCard({ community }: { community: ICommunity }) {
  return (
    <Link to={`/communities/${community?.slug}`}>
      <Card className="p-0 overflow-hidden cursor-pointer hover:shadow relative group">
        <div className="w-full h-24 border-b">
          {community.cover ? (
            <img
              alt={community.name}
              className="h-full w-full object-cover"
              src={community.cover}
            />
          ) : (
            <div className="bg-gray-300 w-full h-full flex justify-center pt-4">
              <Logo className="text-gray-200" size={42} />
            </div>
          )}
        </div>
        <CardHeader className="p-0 px-3 mb-3">
          <CardTitle className="flex items-center gap-1">
            <p className="max-w-[90%] line-clamp-1">{community.name}</p>
            <VerifyIcon active={!!community.verify} size={20} color="orange" />
          </CardTitle>

          <WrapIcon
            className="opacity-0 transition-all duration-200 ease-out
           group-hover:opacity-100 absolute -top-1 -right-1 bg-white rounded-none rounded-bl-xl p-1.5"
          >
            <Pin size={18} className="rotate-45" />
          </WrapIcon>
        </CardHeader>
        <div className="absolute top-[72px] left-2 flex gap-2 items-center">
          <CommunityTag text={community.visibilityType} />
          <CommunityTag text={community.membershipType} />
        </div>
      </Card>
    </Link>
  );
}

export function JoinedCardSkeleton() {
  return (
    <Card className="p-0 overflow-hidden relative animate-pulse">
      {/* Cover image skeleton */}
      <div className="w-full h-24 bg-gray-200 relative">
        <div className="absolute bottom-2 left-2 flex gap-2">
          <div className="h-4 w-10 bg-gray-300 rounded-2xl" />
          <div className="h-4 w-10 bg-gray-300 rounded-2xl" />
        </div>
      </div>

      {/* Content skeleton */}
      <CardHeader className="p-0 px-3 mb-3">
        {/* Title */}
        <div className="flex items-center gap-1">
          <div className="h-4 w-3/4 bg-gray-300 rounded" />
          <div className="h-4 w-4 bg-gray-300 rounded-full" />
        </div>

        {/* Pin icon placeholder */}
        <div
          className="absolute -top-1 -right-1 bg-gray-200 rounded-none
          rounded-bl-xl p-2 h-6 w-6"
        />
      </CardHeader>
    </Card>
  );
}

export function CommunityTag({
  text,
}: {
  text: EVisibilityType | EMembershipType;
}) {
  let _private = false;
  if (
    text === EVisibilityType.Private ||
    text === EMembershipType.Invite_only
  ) {
    _private = true;
  }

  return (
    <div
      className={cn(
        "px-1 bg-gray-50/85 border inline-block rounded-2xl",
        _private ? "border-orange-400" : "border-green-400"
      )}
    >
      <p
        className={cn(
          "text-[10px] font-medium",
          _private ? "text-orange-400" : "text-green-400"
        )}
      >
        {text}
      </p>
    </div>
  );
}
