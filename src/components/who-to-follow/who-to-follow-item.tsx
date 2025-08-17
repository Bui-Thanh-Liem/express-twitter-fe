import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import { VerifyIcon } from "../icons/verify";
import { AvatarMain } from "../ui/avatar";
import { ButtonMain } from "../ui/button";

export function WhoToFollowItem({ item }: { item: Partial<IUser> }) {
  return (
    <div key={item._id} className="hover:bg-gray-100 px-4 py-3 cursor-pointer">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <AvatarMain src={item?.avatar} alt={item?.name} />
          <div>
            <p className="text-sm leading-snug font-semibold flex items-center gap-1">
              {item.name}
              <VerifyIcon active={!!item.verify} size={20} />
            </p>
            <p className="text-xs text-muted-foreground">@{item.username}</p>
          </div>
        </div>
        <ButtonMain size="sm">Theo dõi</ButtonMain>
      </div>
    </div>
  );
}
