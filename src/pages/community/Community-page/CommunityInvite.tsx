import { UserPlus } from "lucide-react";
import { useState } from "react";
import { InviteCommunityForm } from "~/components/forms/InviteCommunityForm";
import { DialogMain } from "~/components/ui/dialog";
import { WrapIcon } from "~/components/wrapIcon";
import { EMembershipType } from "~/shared/enums/type.enum";
import type { ICommunity } from "~/shared/interfaces/schemas/community.interface";

export function CommunityInvite({ community }: { community: ICommunity }) {
  const [isOpen, setIsOpen] = useState(false);

  if (
    community.membershipType === EMembershipType.Invite_only &&
    !community.isAdmin &&
    !community.isMentor
  )
    return null;

  return (
    <>
      <WrapIcon className="border" onClick={() => setIsOpen(true)}>
        <UserPlus size={18} />
      </WrapIcon>

      <DialogMain
        textHeader="Gửi lời mời"
        textDesc="Chỉ được mời những người dùng đang theo dõi bạn"
        isLogo={false}
        open={isOpen}
        onOpenChange={setIsOpen}
        width="xl"
      >
        <InviteCommunityForm setOpenForm={setIsOpen} community={community} />
      </DialogMain>
    </>
  );
}
