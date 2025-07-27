"use client";

import { ButtonMain } from "@/components/button-main";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AuthApple } from "../auth-apple";
import { AuthGoogle } from "../auth-google";
import { InputMain } from "../input-main";
import { Divider } from "../ui/divider";
import { TypographyP } from "../elements/p";

const FormSchema = z.object({
  password: z.string().trim().min(1, "Vui lòng nhập mật khẩu"),
  email: z.string().email("Email không hợp lệ"),
});

type FormValues = z.infer<typeof FormSchema>;

export function LoginAccountForm({
  setOpenForm,
  onClickRegister,
  onClickForgotPass,
}: {
  setOpenForm: (open: boolean) => void;
  onClickForgotPass: () => void;
  onClickRegister: () => void;
}) {
  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  //
  const onSubmit = (data: FormValues) => {
    console.log("✅ Dữ liệu LoginAccountForm :", data);
    setOpenForm(false);
    reset();
  };

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
