import { Info } from "lucide-react";
import { useState } from "react";
import { DialogMain } from "~/components/ui/dialog";
import {
  UserToFollowItem,
  UserToFollowItemSkeleton,
} from "~/components/who-to-follow/who-to-follow-item";
import { WrapIcon } from "~/components/wrapIcon";
import { useGetMMCommunityById } from "~/hooks/useFetchCommunity";
import { EMembershipType, EVisibilityType } from "~/shared/enums/type.enum";
import type { ICommunity } from "~/shared/interfaces/schemas/community.interface";
import { CommunityTag } from "../CommunityCard";

const infoMap = {
  [EMembershipType.Open]:
    "Tất cả người dùng đều có thể tự tham gia vào cộng đồng.",
  [EMembershipType.Invite_only]:
    "Chỉ những người được quản trị viên mời mới có thể tham gia.",
  [EVisibilityType.Public]:
    "Tất cả người dùng đều có thể xem bài viết trong cộng đồng.",
  [EVisibilityType.Private]:
    "Chỉ thành viên mới có thể xem bài viết trong cộng đồng.",
} as const;

export function CommunityInfo({ community }: { community: ICommunity }) {
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading } = useGetMMCommunityById(community._id!, isOpen);
  const communityDetail = data?.data;

  const renderUserList = (title: string, users?: any[]) => (
    <div>
      <p className="font-medium pb-3">{title}</p>
      {isLoading ? (
        <UserToFollowItemSkeleton />
      ) : users?.length ? (
        <div className="space-y-2">
          {users.map((u) => (
            <UserToFollowItem key={u._id} user={u} />
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-sm">Chưa có người dùng</p>
      )}
    </div>
  );

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
          {/* Thông tin chung */}
          <section>
            <p className="font-medium pb-3">Thông tin</p>
            <div className="pl-4 space-y-2">
              {[community.membershipType, community.visibilityType].map(
                (type) => (
                  <div key={type} className="flex items-start gap-3">
                    <CommunityTag
                      text={type}
                      classNameWrap="p-1 px-2"
                      classNameText="text-[14px]"
                    />
                    <p className="text-gray-500 text-[14px] leading-snug">
                      {infoMap[type]}
                    </p>
                  </div>
                )
              )}
            </div>
          </section>

          {/* Admin */}
          <section>
            <p className="font-medium pb-3">Quản trị viên / Chủ sở hữu</p>
            <UserToFollowItem user={community?.admin} />
          </section>

          {/* Mentors */}
          {renderUserList("Điều hành viên", communityDetail?.mentors)}

          {/* Members */}
          {renderUserList("Thành viên", communityDetail?.members)}
        </div>
      </DialogMain>
    </>
  );
}
