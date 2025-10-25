import { UserPlus } from "lucide-react";
import { useState } from "react";
import { InviteCommunityForm } from "~/components/forms/InviteCommunityForm";
import { DialogMain } from "~/components/ui/dialog";
import { WrapIcon } from "~/components/wrapIcon";
import type { ICommunity } from "~/shared/interfaces/schemas/community.interface";

export function CommunityInvite({ community }: { community: ICommunity }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <WrapIcon className="border" onClick={() => setIsOpen(true)}>
        <UserPlus size={18} />
      </WrapIcon>

      <DialogMain
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
