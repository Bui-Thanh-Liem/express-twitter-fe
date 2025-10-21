"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useCreateConversation } from "~/hooks/useFetchConversations";
import { useUploadWithValidation } from "~/hooks/useFetchUpload";
import { useGetFollowedById } from "~/hooks/useFetchUser";
import {
  CreateConversationDtoSchema,
  type CreateConversationDto,
} from "~/shared/dtos/req/conversation.dto";
import { EConversationType } from "~/shared/enums/type.enum";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import { handleResponse } from "~/utils/handleResponse";
import { CloseIcon } from "../icons/close";
import { AvatarMain } from "../ui/avatar";
import { ButtonMain } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Divider } from "../ui/divider";
import { InputMain } from "../ui/input";
import { Label } from "../ui/label";
import { WrapIcon } from "../wrapIcon";
import { useUserStore } from "~/store/useUserStore";

export function UserSelected({
  user,
  onCancel,
}: {
  user: IUser;
  onCancel: () => void;
}) {
  return (
    <div className="rounded-2xl p-1 border border-blue-100 bg-blue-50 flex items-center gap-3">
      <AvatarMain src={user.avatar} alt={user.name} className="w-6 h-6" />
      <p className="text-xs max-w-28 line-clamp-1">{user.name}</p>

      <div className="ml-auto p-1 cursor-pointer" onClick={onCancel}>
        <CloseIcon color="red" size={16} />
      </div>
    </div>
  );
}

export function UserFollower({
  user,
  isCheck,
  onCheck,
}: {
  user: IUser;
  isCheck: boolean;
  onCheck: () => void;
}) {
  return (
    <Label
      htmlFor={user._id}
      className="flex items-center gap-3 hover:bg-gray-100 py-1 px-2 rounded-sm cursor-pointer"
    >
      <Checkbox
        id={user._id}
        checked={isCheck}
        className="rounded-full data-[state=checked]:border-0 data-[state=checked]:bg-blue-400 data-[state=checked]:text-primary-foreground"
        onCheckedChange={() => {
          onCheck();
        }}
      />
      <AvatarMain src={user.avatar} alt={user.name} className="w-10 h-10" />
      <p className="max-w-28 line-clamp-1">{user.name}</p>
    </Label>
  );
}

export function CreateConversationForm({
  initialUserIds,
  setOpenForm,
}: {
  initialUserIds: string[];
  setOpenForm: (open: boolean) => void;
}) {
  const { user } = useUserStore();
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [userSelected, setUserSelected] = useState<IUser[]>([]);

  //
  const apiCreateConversation = useCreateConversation();
  const apiUploadMedia = useUploadWithValidation();

  const { data } = useGetFollowedById(user!._id!, {
    page: "1",
    limit: "100",
  });
  const followers = useMemo(() => data?.data?.items || [], [data?.data?.items]);

  //
  useEffect(() => {
    if (initialUserIds?.length) {
      const initSelected = followers.filter((user) =>
        initialUserIds.includes(user._id)
      );

      setUserSelected((prev) => [...prev, ...initSelected]);
    }

    return () => setUserSelected([]);
  }, [followers, initialUserIds]);

  //
  const {
    watch,
    reset,
    control,
    register,
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
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const avatarUrl = URL.createObjectURL(file);
      setAvatarPreview(avatarUrl);
    }
  };

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
    if (avatarFile) {
      const resUploadAvatar = await apiUploadMedia.mutateAsync([avatarFile]);

      if (resUploadAvatar.statusCode !== 200 || !resUploadAvatar.data) {
        handleResponse(resUploadAvatar);
        return;
      }

      data.avatar = resUploadAvatar?.data[0].url;
    }

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
        <div className="relative mb-4 h-28 w-28 mx-auto">
          <AvatarMain
            src={avatarPreview}
            alt={watch("name") || "G"}
            className="w-28 h-28 border-4 border-white rounded-full object-cover"
          />

          {/* Overlay nút upload */}
          <div className="absolute right-0 top-[70px]">
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
              id="avatar-upload"
            />

            <WrapIcon
              onClick={() => document.getElementById("avatar-upload")?.click()}
              className="bg-black/50 p-2 rounded-full cursor-pointer hover:bg-black/70"
            >
              <Upload className="h-4 w-4 text-white" />
            </WrapIcon>
          </div>
        </div>

        <InputMain
          id="name"
          name="name"
          sizeInput="lg"
          label="Tên nhóm"
          errors={errors}
          control={control}
          register={register}
          placeholder="Nhóm Developer"
          isMaxLength
          maxCountLength={16}
        />

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
