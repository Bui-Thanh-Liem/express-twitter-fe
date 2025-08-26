"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  ResetPasswordDtoSchema,
  type ResetPasswordDto,
} from "~/shared/dtos/req/auth.dto";
import { ButtonMain } from "../ui/button";
import { InputMain } from "../ui/input";

export function ResetPasswordForm({
  setOpenForm,
}: {
  setOpenForm: (open: boolean) => void;
}) {
  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordDto>({
    resolver: zodResolver(ResetPasswordDtoSchema),
    defaultValues: {
      password: "",
      confirm_password: "",
      forgot_password_token: "",
    },
  });

  //
  function onCancel(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setOpenForm(false);
  }

  //
  const onSubmit = (data: ResetPasswordDto) => {
    logger.info("✅ Dữ liệu ResetPasswordForm :", data);
    setOpenForm(false);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center justify-center"
    >
      <div className="mt-4 space-y-6 min-w-[460px]">
        <InputMain
          id="password"
          name="password"
          sizeInput="lg"
          label="Mật khẩu mới"
          errors={errors}
          type="password"
          control={control}
          register={register}
          placeholder="Nhập mật khẩu của bạn"
        />

        <InputMain
          id="confirm_password"
          name="confirm_password"
          sizeInput="lg"
          label="Xác nhận mật khẩu mới"
          errors={errors}
          type="password"
          control={control}
          register={register}
          placeholder="Xác nhận mật khẩu của bạn"
        />

        <div className="flex gap-4 mt-12">
          <ButtonMain
            size="lg"
            type="button"
            className="flex-1"
            variant="outline"
            onClick={onCancel}
          >
            Hủy
          </ButtonMain>
          <ButtonMain size="lg" className="flex-1">
            Thay đổi mật khẩu
          </ButtonMain>
        </div>
      </div>
    </form>
  );
}
