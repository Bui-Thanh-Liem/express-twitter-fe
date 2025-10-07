import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useFollowUser } from "~/hooks/useFetchFollow";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import { VerifyIcon } from "../icons/verify";
import { ShortInfoProfile } from "../ShortInfoProfile";
import { AvatarMain } from "../ui/avatar";
import { ButtonMain } from "../ui/button";

export function UserToFollowItemSkeleton() {
  return (
    <div className="px-4 py-3 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {/* Avatar giả */}
          <div className="h-10 w-10 rounded-full bg-gray-200" />

          <div className="space-y-1">
            {/* Tên user */}
            <div className="h-4 w-28 bg-gray-200 rounded" />
            {/* Username */}
            <div className="h-3 w-20 bg-gray-200 rounded" />
          </div>
        </div>

        {/* Nút Follow giả */}
        <div className="h-7 w-20 rounded-full bg-gray-200" />
      </div>
    </div>
  );
}

export function UserToFollowItem({ user }: { user: Partial<IUser> }) {
  const [followed, setFollowed] = useState(user?.isFollow);

  //
  const { mutate, isError } = useFollowUser();

  //
  useEffect(() => {
    if (isError) setFollowed(!followed);
  }, [isError]);

  //
  return (
    <div key={user._id} className="hover:bg-gray-100 px-4 py-3 cursor-pointer">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <AvatarMain src={user?.avatar} alt={user?.name} />
          <div>
            <ShortInfoProfile profile={user as IUser}>
              <Link
                to={`/${user?.username}`}
                className="flex items-center gap-2"
              >
                <p className="text-sm leading-snug font-semibold flex items-center gap-1 hover:underline hover:cursor-pointer">
                  {user.name}
                  <VerifyIcon active={!!user.verify} size={20} />
                </p>
              </Link>
            </ShortInfoProfile>
            <p className="text-xs text-muted-foreground">{user.username}</p>
            {user.bio && <p>{user.bio}</p>}
          </div>
        </div>
        <ButtonMain
          size="sm"
          onClick={() => {
            setFollowed(!followed);
            mutate({
              user_id: user._id,
              username: user.username || "",
            });
          }}
        >
          {!followed ? "Theo dõi" : "Bỏ theo dõi"}
        </ButtonMain>
      </div>
    </div>
  );
}
