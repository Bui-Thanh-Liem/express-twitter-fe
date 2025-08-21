"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Globe, MapPin, Upload } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

// Assuming you have these hooks and schemas
import {
  UpdateMeDtoSchema,
  type UpdateMeDto,
} from "~/shared/dtos/req/user.dto";
import { handleResponse } from "~/utils/handleResponse";

// UI components - theo cách import của bạn
import { useUpdateMe } from "~/hooks/useFetchAuth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ButtonMain } from "../ui/button";
import { Calendar as CalendarComponent } from "../ui/calendar";
import { InputMain } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { TextareaMain } from "../ui/textarea";

interface UpdateUserFormProps {
  setOpenForm: (open: boolean) => void;
  currentUser?: {
    name?: string;
    bio?: string;
    avatar?: string;
    cover_photo?: string;
    day_of_birth?: Date;
    location?: string;
    username?: string;
    website?: string;
  };
}

export function UpdateUserForm({
  setOpenForm,
  currentUser,
}: UpdateUserFormProps) {
  const [avatarPreview, setAvatarPreview] = useState<string>(
    currentUser?.avatar || ""
  );
  const [coverPreview, setCoverPreview] = useState<string>(
    currentUser?.cover_photo || ""
  );

  const apiUpdateMe = useUpdateMe();

  console.log("currentUser:::", currentUser);

  const {
    reset,
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UpdateMeDto>({
    resolver: zodResolver(UpdateMeDtoSchema) as any,
    defaultValues: {
      name: currentUser?.name || "",
      bio: currentUser?.bio || "",
      avatar: currentUser?.avatar || "",
      cover_photo: currentUser?.cover_photo || "",
      location: currentUser?.location || "",
      username: currentUser?.username || "",
      website: currentUser?.website || "",
      day_of_birth: new Date(currentUser?.day_of_birth || ""),
    },
  });

  const onSubmit = async (data: UpdateMeDto) => {
    try {
      const res = await apiUpdateMe.mutateAsync(data);
      handleResponse(res, successForm);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  function successForm() {
    setOpenForm(false);
    reset();
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setAvatarPreview(result);
        setValue("avatar", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCoverPreview(result);
        setValue("cover_photo", result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-6">
        {/* Cover Photo Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Ảnh bìa</label>
          <div
            className="relative h-32 w-full bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-200 transition-colors"
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
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black bg-opacity-50 rounded-full p-3">
                <Upload className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Avatar Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Ảnh đại diện</label>
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={avatarPreview} />
              <AvatarFallback>
                {watch("name")?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                id="avatar-upload"
              />
              <ButtonMain
                type="button"
                variant="outline"
                onClick={() =>
                  document.getElementById("avatar-upload")?.click()
                }
                className="flex items-center space-x-2"
              >
                <Upload className="h-4 w-4" />
                <span>Thay đổi ảnh</span>
              </ButtonMain>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Họ và tên *</label>
            <InputMain
              id="name"
              name="name"
              placeholder="Nhập họ và tên"
              errors={errors}
              control={control}
              register={register}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tên người dùng</label>
            <InputMain
              id="username"
              name="username"
              placeholder="@username"
              errors={errors}
              control={control}
              register={register}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Tiểu sử</label>
          <TextareaMain
            id="bio"
            name="bio"
            placeholder="Viết một vài dòng về bản thân..."
            errors={errors}
            control={control}
            register={register}
            className="min-h-[100px] resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Vị trí</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <InputMain
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
            <label className="text-sm font-medium">Website</label>
            <div className="relative">
              <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <InputMain
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

        <div className="space-y-2">
          <label className="text-sm font-medium">Ngày sinh</label>
          <Popover>
            <PopoverTrigger asChild>
              <ButtonMain
                type="button"
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <Calendar className="mr-2 h-4 w-4" />
                {/* {watch("day_of_birth") ? (
                  format(watch("day_of_birth"), "dd/MM/yyyy")
                ) : (
                  <span>Chọn ngày sinh</span>
                )} */}
              </ButtonMain>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={watch("day_of_birth")}
                onSelect={(date) =>
                  setValue("day_of_birth", date || new Date())
                }
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
              />
            </PopoverContent>
          </Popover>
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
