import { ChevronsUp, LogOut, Users } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { AvatarMain } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { DialogMain } from "~/components/ui/dialog";
import { WrapIcon } from "~/components/wrapIcon";
import type { IConversation } from "~/shared/interfaces/schemas/conversation.interface";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import { useUserStore } from "~/store/useUserStore";

export function ParticipantList({
  conversation,
}: {
  conversation: IConversation;
}) {
  const { user } = useUserStore();
  const { participants, mentors } = conversation;
  const [isOpen, setIsOpen] = useState(false);

  //
  const findMentor = (_user: IUser) =>
    (mentors as unknown as IUser[])?.map((u) => u._id).includes(_user!._id);

  //
  function leaveConversation(participant: IUser) {
    if (participant._id === user?._id) {
      console.log("Chính mình thoát khỏi nhóm.");
    } else {
      console.log("Đá thành viên khác khỏi nhóm.");
    }
  }

  return (
    <>
      <WrapIcon onClick={() => setIsOpen(true)}>
        <Users size={18} color="#000" />
      </WrapIcon>

      {/*  */}
      <DialogMain
        isLogo={false}
        open={isOpen}
        onOpenChange={setIsOpen}
        textHeader="Danh sách thành viên "
        textDesc="Tất cả thành viên trong nhóm."
        width="md"
      >
        <div className="space-y-2.5">
          {(participants as unknown as IUser[]).map((u) => (
            <div
              key={u._id}
              className="flex items-center justify-between hover:bg-gray-100 p-2 rounded-sm group"
            >
              <Link
                to={`/${u.username}`}
                className="flex items-center gap-3 cursor-pointer"
              >
                <AvatarMain src={u.avatar} alt={u.name} className="w-10 h-10" />
                <p className="max-w-28 line-clamp-1">{u.name}</p>
                {findMentor(u) && (
                  <Badge
                    variant="outline"
                    className="text-sky-500 border-sky-500"
                  >
                    nhóm trưởng
                  </Badge>
                )}
              </Link>

              {(findMentor(user!) || user?._id === u._id) && (
                <div className="flex items-center gap-x-3">
                  {!findMentor(u!) && (
                    <WrapIcon>
                      <ChevronsUp size={18} color="#666" />
                    </WrapIcon>
                  )}
                  <WrapIcon
                    className="p-1.5 hidden group-hover:block"
                    onClick={() => leaveConversation(u)}
                  >
                    <LogOut size={18} color="#fb2c36" />
                  </WrapIcon>
                </div>
              )}
            </div>
          ))}
        </div>
      </DialogMain>
    </>
  );
}
