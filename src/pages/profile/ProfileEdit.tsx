import { useState } from "react";
import { UpdateUserForm } from "~/components/forms/UpdateAccountForm";
import { ButtonMain } from "~/components/ui/button";
import { DialogMain } from "~/components/ui/dialog";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";

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
        <UpdateUserForm setOpenForm={setIsOpen} currentUser={currentUser} />
      </DialogMain>
    </>
  );
}
