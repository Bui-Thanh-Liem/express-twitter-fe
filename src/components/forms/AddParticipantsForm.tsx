"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useCreateConversation } from "~/hooks/useFetchConversations";
import { useGetFollowed } from "~/hooks/useFetchUser";
import {
  CreateConversationDtoSchema,
  type CreateConversationDto,
} from "~/shared/dtos/req/conversation.dto";
import { EConversationType } from "~/shared/enums/type.enum";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import { handleResponse } from "~/utils/handleResponse";
import { ButtonMain } from "../ui/button";
import { Divider } from "../ui/divider";
import { UserFollower, UserSelected } from "./CreateConversationForm";

export function AddParticipantsForm({
  setOpenForm,
}: {
  setOpenForm: (open: boolean) => void;
}) {
  const [userSelected, setUserSelected] = useState<IUser[]>([]);

  //
  const apiCreateConversation = useCreateConversation();

  const { data } = useGetFollowed({
    page: "1",
    limit: "100",
  });
  const followers = useMemo(() => data?.data?.items || [], [data?.data?.items]);

  //
  const {
    reset,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateConversationDto>({
    resolver: zodResolver(CreateConversationDtoSchema),
    defaultValues: {
      name: "",
      avatar: "",
      type: EConversationType.Group,
      participants: [],
    },
  });

  //
  function handleToggleUserFollower(val: IUser) {
    setUserSelected((prev) => {
      const exists = prev.some((u) => u._id === val._id);
      let res = [...prev];

      if (exists) {
        // Nếu đã có thì filter bỏ đi
        res = prev.filter((u) => u._id !== val._id);
      } else {
        // Nếu chưa có thì thêm vào
        res = [...prev, val];
      }

      setValue(
        "participants",
        res.map((user) => user._id)
      );
      return res;
    });
  }

  //
  const onSubmit = async (data: CreateConversationDto) => {
    const res = await apiCreateConversation.mutateAsync(data);
    handleResponse(res, successForm);
  };

  //
  function successForm() {
    setOpenForm(false);
    reset();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center justify-center"
    >
      <div className="mt-4 space-y-6 min-w-[460px]">
        <div className="flex flex-col items-center justify-center">
          <Divider className="w-80" text="Những người dùng đang theo dõi bạn" />
          <p className="text-xs text-red-400">
            {errors && errors?.participants
              ? errors.participants?.message
              : null}
          </p>
        </div>

        <div className="grid grid-cols-12">
          <div className="col-span-7 border-r pr-4 min-h-48">
            <div className="space-y-2 max-h-96 overflow-auto">
              {followers?.map((user) => (
                <UserFollower
                  isCheck={userSelected.some((_) => _._id === user._id)}
                  user={user}
                  key={user._id}
                  onCheck={() => handleToggleUserFollower(user)}
                />
              ))}
            </div>
            {!followers.length && (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm text-gray-400">
                  Chưa có người dùng theo dõi bạn.
                </p>
              </div>
            )}
          </div>
          <div className="col-span-5 px-2 space-y-2 max-h-96 overflow-auto">
            {userSelected?.map((user) => (
              <UserSelected
                user={user}
                key={user._id}
                onCancel={() => handleToggleUserFollower(user)}
              />
            ))}
            {!userSelected.length && (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm text-gray-400">Bạn chưa chọn.</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <ButtonMain
            size="lg"
            type="button"
            className="flex-1"
            variant="outline"
            onClick={() => setOpenForm(false)}
          >
            Hủy
          </ButtonMain>
          <ButtonMain size="lg" className="w-1/2">
            Tiếp theo
          </ButtonMain>
        </div>
      </div>
    </form>
  );
}
