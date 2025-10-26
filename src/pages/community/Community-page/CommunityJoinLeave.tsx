import { LogOut } from "lucide-react";
import { useState } from "react";
import { ButtonMain } from "~/components/ui/button";
import { WrapIcon } from "~/components/wrapIcon";
import { useJoinCommunity, useLeaveCommunity } from "~/hooks/useFetchCommunity";
import { EMembershipType } from "~/shared/enums/type.enum";
import type { ICommunity } from "~/shared/interfaces/schemas/community.interface";
import { handleResponse } from "~/utils/handleResponse";

export function CommunityJoinLeave({ community }: { community: ICommunity }) {
  const [isJoined, setIsJoined] = useState(community.isJoined);

  //
  const apiJoinCommunity = useJoinCommunity();
  const apiLeaveCommunity = useLeaveCommunity();

  //
  async function handleJoin() {
    const res = await apiJoinCommunity.mutateAsync({
      community_id: community?._id || "",
    });
    handleResponse(res, () => {
      setIsJoined(true);
    });
  }

  //
  async function handleLeave() {
    const res = await apiLeaveCommunity.mutateAsync({
      community_id: community?._id || "",
    });
    handleResponse(res, () => {
      setIsJoined(false);
    });
  }

  return (
    <>
      {isJoined
        ? !community.isAdmin && (
            <WrapIcon className="border border-red-100" onClick={handleLeave}>
              <LogOut size={18} color="#fb2c36" />
            </WrapIcon>
          )
        : community?.membershipType === EMembershipType.Open && (
            <ButtonMain size="sm" onClick={handleJoin}>
              Tham gia
            </ButtonMain>
          )}
    </>
  );
}
