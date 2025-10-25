import { Info } from "lucide-react";
import { useState } from "react";
import { DialogMain } from "~/components/ui/dialog";
import { UserToFollowItem } from "~/components/who-to-follow/who-to-follow-item";
import { WrapIcon } from "~/components/wrapIcon";
import { EMembershipType, EVisibilityType } from "~/shared/enums/type.enum";
import type { ICommunity } from "~/shared/interfaces/schemas/community.interface";
import { useUserStore } from "~/store/useUserStore";
import { CommunityTag } from "../CommunityCard";

const info = {
  [EMembershipType.Open]:
    "Tất cả người dùng đều có thể tự tham gia vào cộng đồng.",
  [EMembershipType.Invite_only]:
    "Chỉ những người dùng được quản trị viên mời thì mới được tham gia vào cộng đồng.",
  [EVisibilityType.Public]:
    "Tất cả người dùng đều có thể xem bài viết trong cộng đồng.",
  [EVisibilityType.Private]:
    "Chỉ những thành viên mới có thể xem bài viết trong cộng đồng.",
} as const;

export function CommunityInfo({ community }: { community: ICommunity }) {
  const { user } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <WrapIcon className="border" onClick={() => setIsOpen(true)}>
        <Info size={18} />
      </WrapIcon>

      <DialogMain
        isLogo={false}
        open={isOpen}
        onOpenChange={setIsOpen}
        width="xl"
      >
        <div className="space-y-8">
          <div className="">
            <p className="font-medium pb-3">Thông tin</p>
            <div className="pl-4 space-y-1">
              {[
                {
                  label: community.membershipType,
                  description: info[community.membershipType],
                },
                {
                  label: community.visibilityType,
                  description: info[community.visibilityType],
                },
              ].map((item) => (
                <div key={item.label} className="flex items-center">
                  <div className="w-32">
                    <CommunityTag
                      text={item.label}
                      classNameWrap="p-1 px-2"
                      classNameText="text-[14px]"
                    />
                  </div>
                  <p className="text-gray-500 mt-1 flex-1 text-[14px]">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="font-medium pb-3">Quản trị viên / chủ sở hữu</p>
            <div className="pl-4">
              {user?._id === community.admin._id ? (
                <p className="text-gray-400">
                  Bạn là Quản trị viên / chủ sở hữu cộng đồng này.
                </p>
              ) : (
                <UserToFollowItem user={community.admin} />
              )}
            </div>
          </div>
          <div>
            <p className="font-medium pb-3">Điều hành viên</p>
            <div className="pl-4">
              <p>Quản trị viên / chủ sở hữu</p>
            </div>
          </div>
          <div>
            <p className="font-medium pb-3">Thành viên</p>
            <div className="pl-4">
              <p>Quản trị viên / chủ sở hữu</p>
            </div>
          </div>
        </div>
      </DialogMain>
    </>
  );
}
