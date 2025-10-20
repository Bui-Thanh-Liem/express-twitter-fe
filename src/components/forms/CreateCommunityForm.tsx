"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  useCreateCommunity,
  useGetAllCategories,
} from "~/hooks/useFetchCommunity";
import { useUploadWithValidation } from "~/hooks/useFetchUpload";
import { useGetFollowed } from "~/hooks/useFetchUser";
import {
  CreateCommunityDtoSchema,
  type CreateCommunityDto,
} from "~/shared/dtos/req/community.dto";
import { EMembershipType, EVisibilityType } from "~/shared/enums/type.enum";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import { handleResponse } from "~/utils/handleResponse";
import { toastSimple } from "~/utils/toastSimple.util";
import { CloseIcon } from "../icons/close";
import { AvatarMain } from "../ui/avatar";
import { ButtonMain } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { CircularProgress } from "../ui/circular-progress";
import { Divider } from "../ui/divider";
import { Input, InputMain } from "../ui/input";
import { Label } from "../ui/label";
import { SelectMain } from "../ui/select";
import { TextareaMain } from "../ui/textarea";
import { WrapIcon } from "../wrapIcon";

function UserSelected({
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

function UserFollower({
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

export function CreateCommunityForm({
  setOpenForm,
}: {
  setOpenForm: (open: boolean) => void;
}) {
  const [categoryText, setCategoryText] = useState("");
  const [coverPreview, setCoverPreview] = useState<string>("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [userSelected, setUserSelected] = useState<IUser[]>([]);
  const [userInvited, setUserInvited] = useState<string[]>([]);

  //
  const apiCreateCommunity = useCreateCommunity();
  const apiUploadMedia = useUploadWithValidation();

  //
  const { data: cates } = useGetAllCategories();
  const { data } = useGetFollowed({
    page: "1",
    limit: "100",
  });
  const followers = useMemo(() => data?.data?.items || [], [data?.data?.items]);

  //
  const {
    watch,
    reset,
    control,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCommunityDto>({
    resolver: zodResolver(CreateCommunityDtoSchema),
    defaultValues: {
      name: "",
      bio: "",
      cover: "",
      category: "",
      membershipType: EMembershipType.Open,
      visibilityType: EVisibilityType.Public,
    },
  });
  const categories = cates?.data || [];
  const valBio = watch("bio");

  //
  const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const coverUrl = URL.createObjectURL(file);
      setCoverPreview(coverUrl);
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

      setUserInvited(res.map((user) => user._id));
      return res;
    });
  }

  //
  const onSubmit = async (data: CreateCommunityDto) => {
    if (!data.category && !categoryText) {
      toastSimple(
        "Danh mục / dịch vụ không được để trống, bạn có thể tạo mới hoặc chọn mục đã có sẵn.",
        "error"
      );
      return;
    }

    if (coverFile) {
      const resUploadCover = await apiUploadMedia.mutateAsync([coverFile]);
      if (resUploadCover.statusCode !== 200 || !resUploadCover.data) {
        handleResponse(resUploadCover);
        return;
      }
      data.cover = resUploadCover?.data[0].url;
    }

    const res = await apiCreateCommunity.mutateAsync({
      ...data,
      category: categoryText || data.category,
    });

    
    
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
        <div className="relative mb-4">
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
          </div>
        </div>

        <InputMain
          id="name"
          name="name"
          sizeInput="lg"
          label="Tên cộng đồng"
          errors={errors}
          control={control}
          register={register}
          placeholder="Cộng động Developer"
          required
          isMaxLength
          maxCountLength={16}
        />

        <div className="relative">
          <TextareaMain
            id="bio"
            name="bio"
            label="Tiểu sử"
            errors={errors}
            control={control}
            register={register}
            className="min-h-[100px] resize-none"
            placeholder="Viết một vài dòng về cộng động của bạn"
            maxCountLength={200}
          />
          <div className="absolute right-1 bottom-1">
            <CircularProgress
              value={!valBio?.length ? 0 : valBio?.length}
              max={200}
              size={20}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Lĩnh vực / Danh mục</Label>
            <Input
              className="mt-2 h-12 px-6 text-lg px-3"
              id="category"
              value={categoryText}
              placeholder="Tạo mới (ưu tiên)"
              onChange={(e) => setCategoryText(e.target.value)}
            />
          </div>
          <SelectMain
            control={control}
            options={categories?.map((item) => ({
              label: item,
              value: item,
            }))}
            id="suggest"
            errors={errors}
            name="category"
            size="lg"
            placeholder="Lĩnh vực / Danh mục"
            label="Cộng đồng khác đã dùng"
            classname="mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <SelectMain
            control={control}
            options={Object.values(EVisibilityType).map((val) => ({
              label: val,
              value: val,
            }))}
            placeholder="Chế độ xem"
            errors={errors}
            id="visibilityType"
            name="visibilityType"
            label="Chế độ xem"
            size="lg"
          />
          <SelectMain
            control={control}
            options={Object.values(EMembershipType).map((val) => ({
              label: val,
              value: val,
            }))}
            size="lg"
            placeholder="Cài đặt tham gia"
            errors={errors}
            id="membershipType"
            name="membershipType"
            label="Cài đặt tham gia"
          />
        </div>

        <div className="flex flex-col items-center justify-center">
          <Divider
            className="w-80"
            text="Mời những người dùng đang theo dõi bạn"
          />
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
                <p className="text-sm text-gray-400">Bạn chưa mời.</p>
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
