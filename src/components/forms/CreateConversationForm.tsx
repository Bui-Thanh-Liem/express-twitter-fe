"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useCreateConversation } from "~/hooks/useFetchConversations";
import { useUploadWithValidation } from "~/hooks/useFetchUpload";
import { useGetFollowed } from "~/hooks/useFetchUser";
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

function UserSelected({ user }: { user: IUser }) {
  return (
    <div className="rounded-2xl p-1 border border-blue-100 bg-blue-50 flex items-center gap-3">
      <AvatarMain src={user.avatar} alt={user.name} className="w-6 h-6" />
      <p className="text-xs max-w-28 line-clamp-1">{user.name}</p>

      <div className="ml-auto p-1 cursor-pointer">
        <CloseIcon color="red" size={16} />
      </div>
    </div>
  );
}

function UserFollower({
  user,
  onCheck,
}: {
  user: IUser;
  onCheck: (user: IUser) => void;
}) {
  return (
    <Label
      htmlFor={user._id}
      className="flex items-center gap-3 hover:bg-gray-100 py-1 px-2 rounded-sm cursor-pointer"
    >
      <Checkbox
        id={user._id}
        className="rounded-full data-[state=checked]:border-0 data-[state=checked]:bg-blue-400 data-[state=checked]:text-primary-foreground"
        onCheckedChange={(checked) => {
          if (checked) onCheck(user);
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
  console.log("CreateConversationForm");

  const [avatarPreview, setAvatarPreview] = useState<string>("");
  // const [searchVal, setSearchVal] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [userSelected, setUserSelected] = useState<IUser[]>([]);

  //
  const apiCreateConversation = useCreateConversation();
  const apiUploadMedia = useUploadWithValidation();

  const { data, isLoading, error } = useGetFollowed({
    page: "1",
    limit: "100",
  });
  const followers = useMemo(() => data?.data?.items || [], [data?.data?.items]);

  //
  useEffect(() => {
    if (initialUserIds.length) {
      const initSelected = followers.filter((user) =>
        initialUserIds.includes(user._id)
      );
      setUserSelected((prev) => [...prev, ...initSelected]);
    }
  }, [followers, initialUserIds]);

  //
  const {
    watch,
    reset,
    control,
    register,
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
  const onSubmit = async (data: CreateConversationDto) => {
    if (avatarFile) {
      const resUploadAvatar = await apiUploadMedia.mutateAsync([avatarFile]);

      if (resUploadAvatar.statusCode !== 200 || !resUploadAvatar.data) {
        handleResponse(resUploadAvatar);
        return;
      }

      data.avatar = resUploadAvatar?.data[0];
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
        />

        <div className="flex justify-center">
          <Divider className="w-80" text="Những người dùng đã theo dõi bạn" />
        </div>

        <div className="grid grid-cols-12">
          <div className="col-span-7 border-r pr-4 min-h-48">
            {/* <SearchMain
              size="sm"
              value={searchVal}
              onChange={setSearchVal}
              onClear={() => setSearchVal("")}
            /> */}
            <div className="space-y-2 max-h-96 overflow-auto">
              {followers?.map((user) => (
                <UserFollower
                  key={user._id}
                  user={user}
                  onCheck={(val) => setUserSelected((prev) => [...prev, val])}
                />
              ))}
            </div>
          </div>
          <div className="col-span-5 px-2 space-y-2 max-h-96 overflow-auto">
            {userSelected?.map((user) => (
              <UserSelected user={user} key={user._id} />
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <ButtonMain
            size="lg"
            type="button"
            className="flex-1"
            variant="outline"
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
