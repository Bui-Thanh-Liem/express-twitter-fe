import { Cctv } from "lucide-react";
import { useState } from "react";
import { DialogMain } from "~/components/ui/dialog";
import { WrapIcon } from "~/components/wrapIcon";
import type { ICommunity } from "~/shared/interfaces/schemas/community.interface";

export function CommunityActivity({ community }: { community: ICommunity }) {
  const [isOpen, setIsOpen] = useState(false);

  //
  if (!community.isJoined) return null;
  if (!community.isAdmin) {
    if (
      (community.isMentor && !community.showLogForMentor) ||
      (community.isMember && !community.showLogForMember)
    ) {
      return null;
    }
  }

  return (
    <>
      <WrapIcon className="border" onClick={() => setIsOpen(true)}>
        <Cctv size={18} />
      </WrapIcon>

      <DialogMain
        textHeader="Hoạt động"
        textDesc="Tất cả những hoạt động của cộng đồng sẽ được ghi lại ở đây."
        isLogo={false}
        open={isOpen}
        onOpenChange={setIsOpen}
        width="xl"
      >
        <div></div>
      </DialogMain>
    </>
  );
}
