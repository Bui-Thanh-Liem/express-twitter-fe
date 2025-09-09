import { UserPlus } from "lucide-react";
import { useState } from "react";
import { CreateConversationForm } from "~/components/forms/CreateConversationForm";
import { DialogMain } from "~/components/ui/dialog";
import { WrapIcon } from "~/components/wrapIcon";

export function CreateConversation({
  initialUserIds,
}: {
  initialUserIds: string[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <WrapIcon onClick={() => setIsOpen(true)}>
        <UserPlus className="h-[18px] w-[18px]" />
      </WrapIcon>

      {/*  */}
      <DialogMain
        isLogo={false}
        open={isOpen}
        onOpenChange={setIsOpen}
        textHeader="Tạo nhóm"
        textDesc="Một nhóm yêu cầu 3 thành viên trở lên."
        width="xl"
      >
        <CreateConversationForm
          setOpenForm={setIsOpen}
          initialUserIds={initialUserIds}
        />
      </DialogMain>
    </>
  );
}
