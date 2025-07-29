"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ButtonMain } from "~/components/button-main";
import { useLogin } from "~/hooks/useFetchAuth";
import {
  LoginUserDtoSchema,
  type LoginUserDto,
} from "~/shared/dtos/req/auth.dto";
import { handleResponse } from "~/utils/handleResponse";
import { AuthApple } from "../auth-apple";
import { AuthGoogle } from "../auth-google";
import { TypographyP } from "../elements/p";
import { InputMain } from "../input-main";
import { Divider } from "../ui/divider";

export function LoginAccountForm({
  setOpenForm,
  onClickRegister,
  onClickForgotPass,
}: {
  setOpenForm: (open: boolean) => void;
  onClickForgotPass: () => void;
  onClickRegister: () => void;
}) {
  //
  const navigate = useNavigate();
  const apiLogin = useLogin();

  //
  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginUserDto>({
    resolver: zodResolver(LoginUserDtoSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  //
  const onSubmit = async (data: LoginUserDto) => {
    const res = await apiLogin.mutateAsync(data);
    handleResponse(res, successForm);
  };

  //
  function successForm() {
    setOpenForm(false);
    navigate("/home");
    reset();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center justify-center"
    >
      <div className="mt-4 space-y-6 min-w-[460px]">
        <AuthGoogle />
        <AuthApple />

        <div className="flex justify-center">
          <Divider className="w-80" />
        </div>

        <InputMain
          id="email"
          name="email"
          sizeInput="lg"
          label="Email"
          errors={errors}
          control={control}
          register={register}
          placeholder="example@gmail.com"
        />

        <InputMain
          id="password"
          name="password"
          sizeInput="lg"
          label="Mật khẩu"
          errors={errors}
          type="password"
          control={control}
          register={register}
          placeholder="Nhập mật khẩu của bạn"
        />

        <ButtonMain size="lg" className="w-full">
          Tiếp theo
        </ButtonMain>
        <ButtonMain
          size="lg"
          className="w-full"
          variant="outline"
          onClick={() => onClickForgotPass()}
        >
          Quên mật khẩu ?
        </ButtonMain>
        <div className="text-center">
          <TypographyP>
            Không có tài khoản ?
            <span
              className="cursor-pointer text-[#1D9BF0]"
              onClick={() => onClickRegister()}
            >
              {" "}
              Đăng ký
            </span>
          </TypographyP>
        </div>
      </div>
    </form>
  );
}
