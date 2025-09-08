import { useState } from "react";
import { UpdateMeForm } from "~/components/forms/UpdateMeForm";
import { MessageIcon } from "~/components/icons/messages";
import { ButtonMain } from "~/components/ui/button";
import { DialogMain } from "~/components/ui/dialog";
import { WrapIcon } from "~/components/wrapIcon";
import { useCreateConversation } from "~/hooks/useFetchConversations";
import { useFollowUser } from "~/hooks/useFetchFollow";
import { EConversationType } from "~/shared/enums/type.enum";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import { useChatBoxStore } from "~/store/useChatBoxStore";

interface IProfileActiveProps {
  isOwnProfile: boolean;
  profile: IUser;
}

// Edit profile
export function ProfileEdit({ currentUser }: { currentUser: IUser }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ButtonMain
        variant="outline"
        className="mt-20"
        onClick={() => setIsOpen(true)}
      >
        Chỉnh sửa hồ sơ
      </ButtonMain>

      {/*  */}
      <DialogMain
        open={isOpen}
        onOpenChange={setIsOpen}
        textHeader="Chỉnh sửa hồ sơ"
        textDesc=""
        isLogo={false}
      >
        <UpdateMeForm setOpenForm={setIsOpen} currentUser={currentUser} />
      </DialogMain>
    </>
  );
}

//
export function ProfileAction({ profile, isOwnProfile }: IProfileActiveProps) {
  const { mutate } = useFollowUser();
  const { open, setConversation } = useChatBoxStore();
  const apiCreateConversation = useCreateConversation();

  async function handleOpenCheckBox() {
    const res = await apiCreateConversation.mutateAsync({
      type: EConversationType.Private,
      participants: [profile?._id],
    });
    if (res.statusCode === 200 && res?.data) {
      setConversation(res?.data);
      open();
    }
  }

  return (
    <>
      {isOwnProfile ? (
        <ProfileEdit currentUser={profile as IUser} />
      ) : (
        <div className="flex items-center gap-x-3 mt-20">
          <WrapIcon className="border" onClick={handleOpenCheckBox}>
            <MessageIcon size={18} />
          </WrapIcon>
          {
            <ButtonMain
              size="sm"
              onClick={() => {
                mutate({
                  user_id: profile._id,
                  username: profile.username || "",
                });
              }}
            >
              {!profile?.isFollow ? "Theo dõi" : "Bỏ theo dõi"}
            </ButtonMain>
          }
        </div>
      )}
    </>
  );
}
