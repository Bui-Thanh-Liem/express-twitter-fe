import { BadgeCheckIcon, Cctv, ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import { DialogMain } from "~/components/ui/dialog";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "~/components/ui/item";
import { WrapIcon } from "~/components/wrapIcon";
import { useGetMultiActivities } from "~/hooks/useFetchCommunity";
import type { ICommunity } from "~/shared/interfaces/schemas/community.interface";

export function CommunityActivity({ community }: { community: ICommunity }) {
  const [isOpen, setIsOpen] = useState(false);

  //
  const { data } = useGetMultiActivities(community._id, {
    page: "1",
    limit: "50",
  });
  const activities = data?.data?.items || [];

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

  //
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
        <div className="space-y-3">
          {activities.map((ac) => {
            return (
              <Item key={ac._id} variant="outline" size="sm" asChild>
                <a href="#">
                  <ItemMedia>
                    <BadgeCheckIcon className="size-5" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{ac.action}</ItemTitle>
                  </ItemContent>
                  <ItemActions>
                    <ChevronRightIcon className="size-4" />
                  </ItemActions>
                </a>
              </Item>
            );
          })}
        </div>
      </DialogMain>
    </>
  );
}
