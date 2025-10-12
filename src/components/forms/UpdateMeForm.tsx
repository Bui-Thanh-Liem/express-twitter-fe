"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Globe, MapPin, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

// Assuming you have these hooks and schemas
import { handleResponse } from "~/utils/handleResponse";

// UI components - theo cách import của bạn
import { useNavigate } from "react-router-dom";
import { useUpdateMe } from "~/hooks/useFetchAuth";
import {
  useRemoveImages,
  useUploadWithValidation,
} from "~/hooks/useFetchUpload";
import {
  UpdateMeDtoSchema,
  type UpdateMeDto,
} from "~/shared/dtos/req/auth.dto";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import { useUserStore } from "~/store/useUserStore";
import { toastSimple } from "~/utils/toastSimple.util";
import { AvatarMain } from "../ui/avatar";
import { ButtonMain } from "../ui/button";
import { DatePicker } from "../ui/date-picker";
import { InputMain } from "../ui/input";
import { TextareaMain } from "../ui/textarea";
import { WrapIcon } from "../wrapIcon";

interface UpdateUserFormProps {
  setOpenForm: (open: boolean) => void;
  currentUser?: Pick<
    IUser,
    | "name"
    | "bio"
    | "avatar"
    | "cover_photo"
    | "day_of_birth"
    | "location"
    | "website"
    | "username"
  >;
}

export function UpdateMeForm({
  setOpenForm,
  currentUser,
}: UpdateUserFormProps) {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const usernameRef = useRef(user?.username);
  const apiUpdateMe = useUpdateMe();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(
    currentUser?.avatar || ""
  );
  const [coverPreview, setCoverPreview] = useState<string>(
    currentUser?.cover_photo || ""
  );
  const apiUploadMedia = useUploadWithValidation();
  const apiRemoteImages = useRemoveImages();

  const {
    reset,
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<UpdateMeDto>({
    resolver: zodResolver(UpdateMeDtoSchema),
    defaultValues: {
      name: currentUser?.name || "",
      bio: currentUser?.bio || "",
      avatar: currentUser?.avatar || "",
      cover_photo: currentUser?.cover_photo || "",
      location: currentUser?.location || "",
      username: currentUser?.username || "",
      website: currentUser?.website || "",
      day_of_birth: currentUser?.day_of_birth
        ? new Date(currentUser?.day_of_birth)
        : undefined,
    },
  });

  //
  console.log("errors:::", errors);
  const onSubmit = async (data: UpdateMeDto) => {
    try {
      if (avatarFile) {
        const resRemoteImages = await apiRemoteImages.mutateAsync({
          urls: [getValues("avatar") || ""],
        });

        if (resRemoteImages.statusCode === 200) {
          const resUploadAvatar = await apiUploadMedia.mutateAsync([
            avatarFile,
          ]);
          if (resUploadAvatar.statusCode !== 200 || !resUploadAvatar.data) {
            handleResponse(resUploadAvatar);
            return;
          }
          data.avatar = resUploadAvatar?.data[0];
        }
      }

      if (coverFile) {
        const resRemoteImages = await apiRemoteImages.mutateAsync({
          urls: [getValues("cover_photo") || ""],
        });

        if (resRemoteImages.statusCode === 200) {
          const resUploadCover = await apiUploadMedia.mutateAsync([coverFile]);
          if (resUploadCover.statusCode !== 200 || !resUploadCover.data) {
            handleResponse(resUploadCover);
            return;
          }
          data.cover_photo = resUploadCover?.data[0];
        }
      }

      if (data?.day_of_birth) {
        data.day_of_birth = data.day_of_birth?.toISOString() as unknown as Date;
      }

      console.log("data :::", data);

      const res = await apiUpdateMe.mutateAsync(data);
      handleResponse(res, successForm);
      if (res.data?.username !== usernameRef.current) {
        navigate(`/${res.data?.username}`, { replace: true });
      }
    } catch (error) {
      toastSimple((error as { message: string })?.message, "error");
      console.error("Update failed:", error);
    }
  };

  //
  function successForm() {
    setOpenForm(false);
    reset();
  }

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
  const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const coverUrl = URL.createObjectURL(file);
      setCoverPreview(coverUrl);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-6">
        {/* Cover Photo, avatar Section */}
        <div
          className="relative h-44 w-full bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200 transition-colors"
          style={{
            backgroundImage: coverPreview ? `url(${coverPreview})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverChange}
            className="hidden"
            id="cover-photo-upload"
          />

          {/* Icon upload */}
          <div className="absolute inset-0 flex items-center justify-center">
            <WrapIcon
              onClick={() =>
                document.getElementById("cover-photo-upload")?.click()
              }
            >
              <Upload className="w-5 h-5" />
            </WrapIcon>
          </div>

          {/* Avatar Section */}
          <div className="top-28 left-4 relative w-28 h-28">
            <AvatarMain
              src={avatarPreview}
              alt={watch("name")}
              className="w-28 h-28 border-4 border-white"
            />
            <div className="absolute bottom-0 right-0">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                id="avatar-upload"
              />

              <WrapIcon
                onClick={() =>
                  document.getElementById("avatar-upload")?.click()
                }
              >
                <Upload className="h-4 w-4" />
              </WrapIcon>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="mt-14 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputMain
              id="name"
              name="name"
              label="Họ và tên *"
              placeholder="Nhập họ và tên"
              errors={errors}
              control={control}
              register={register}
              isMaxLength
              maxCountLength={16}
            />

            <InputMain
              id="username"
              name="username"
              label="Tên người dùng"
              placeholder="@username"
              errors={errors}
              control={control}
              register={register}
              isMaxLength
              maxCountLength={20}
            />
          </div>

          <DatePicker
            id="day_of_birth"
            name="day_of_birth"
            label="Ngày sinh"
            placeholder="08 tháng 01, 2000"
            errors={errors}
            control={control}
            register={register}
            setValue={setValue}
          />

          <TextareaMain
            id="bio"
            name="bio"
            label="Tiểu sử"
            errors={errors}
            control={control}
            register={register}
            className="min-h-[100px] resize-none"
            placeholder="Viết một vài dòng về bản thân..."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="relative">
                <MapPin className="absolute left-3 top-10 h-4 w-4 text-gray-400" />
                <InputMain
                  label="Vị trí"
                  id="location"
                  name="location"
                  placeholder="Thành phố, Quốc gia"
                  errors={errors}
                  control={control}
                  register={register}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Globe className="absolute left-3 top-10 h-4 w-4 text-gray-400" />
                <InputMain
                  label="Website"
                  id="website"
                  name="website"
                  placeholder="https://example.com"
                  errors={errors}
                  control={control}
                  register={register}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row gap-3">
          <ButtonMain
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => setOpenForm(false)}
          >
            Hủy bỏ
          </ButtonMain>
          <ButtonMain
            type="submit"
            className="flex-1"
            disabled={apiUpdateMe.isPending}
          >
            {apiUpdateMe.isPending ? "Đang cập nhật..." : "Cập nhật"}
          </ButtonMain>
        </div>
      </div>
    </form>
  );
}
