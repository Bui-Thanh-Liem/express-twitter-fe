"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useCreateConversation } from "~/hooks/useFetchConversations";
import { useUploadWithValidation } from "~/hooks/useFetchUpload";
import {
  CreateConversationDtoSchema,
  type CreateConversationDto,
} from "~/shared/dtos/req/conversation.dto";
import { EConversationType } from "~/shared/enums/type.enum";
import { handleResponse } from "~/utils/handleResponse";
import { AvatarMain } from "../ui/avatar";
import { ButtonMain } from "../ui/button";
import { InputMain } from "../ui/input";
import { SearchMain } from "../ui/search";
import { WrapIcon } from "../wrapIcon";
import { Divider } from "../ui/divider";

export function CreateConversationForm({
  initialUsers,
  setOpenForm,
}: {
  initialUsers: string[];
  setOpenForm: (open: boolean) => void;
}) {
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [searchVal, setSearchVal] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  //
  const apiCreateConversation = useCreateConversation();
  const apiUploadMedia = useUploadWithValidation();

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
            alt={watch("name")}
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
          <Divider className="w-80" text="Thành viên tham gia" />
        </div>

        <div className="grid grid-cols-12">
          <div className="col-span-7 border-r pr-2 min-h-48">
            <SearchMain
              size="sm"
              value={searchVal}
              onChange={setSearchVal}
              onClear={() => setSearchVal("")}
            />
          </div>
          <div className="col-span-5 pl-2"></div>
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
