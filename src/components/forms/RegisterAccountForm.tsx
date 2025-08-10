"use client";

import { Label } from "~/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ButtonMain } from "../ui/button";
import { InputMain } from "../ui/input";
import { SelectMain } from "../ui/select";

const FormSchema = z
  .object({
    name: z
      .string()
      .min(1, "Vui lòng nhập tên")
      .min(5, "Tối thiểu 5 kí tự")
      .max(50, "Tối đa 50 kí tự"),
    email: z.string().email("Email không hợp lệ"),
    day: z.string().min(1, "Chọn ngày"),
    month: z.string().min(1, "Chọn tháng"),
    year: z.string().min(1, "Chọn năm"),
    password: z
      .string()
      .trim()
      .min(1, "Vui lòng nhập mật khẩu")
      .min(8, "Tối thiểu 8 kí tự"),
    confirmPassword: z.string().trim().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof FormSchema>;

export function RegisterAccountForm({
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
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      day: "",
      month: "",
      year: "",
      password: "",
      confirmPassword: "",
    },
  });

  //
  const onSubmit = (data: FormValues) => {
    console.log("✅ Dữ liệu RegisterAccountForm :", data);
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
          id="name"
          isMaxLength
          sizeInput="lg"
          name="name"
          label="Tên"
          errors={errors}
          control={control}
          register={register}
          maxCountLength={50}
          placeholder="Nhập tên của bạn"
        />

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

        <div>
          <div className="flex gap-2 mt-2">
            <SelectMain
              options={Array.from({ length: 31 }, (_, i) => ({
                label: `Ngày ${i + 1}`,
                value: `${i + 1}`,
              }))}
              size="lg"
              id="day"
              name="day"
              label="Ngày"
              errors={errors}
              control={control}
              classname="flex-1"
              placeholder="Chọn ngày"
            />

            <SelectMain
              options={Array.from({ length: 12 }, (_, i) => ({
                label: `Tháng ${i + 1}`,
                value: `${i + 1}`,
              }))}
              size="lg"
              id="month"
              name="month"
              label="Tháng"
              errors={errors}
              control={control}
              classname="flex-1"
              placeholder="Chọn tháng"
            />

            <SelectMain
              options={Array.from({ length: 2025 - 1950 + 1 }, (_, i) => {
                const year = 1950 + i;
                return {
                  label: `${year}`,
                  value: `${year}`,
                };
              })}
              size="lg"
              id="year"
              name="year"
              label="Năm"
              errors={errors}
              control={control}
              classname="flex-1"
              placeholder="Chọn năm"
            />
          </div>

          <div className="mt-3">
            <Label>Ngày sinh</Label>
            <p className="text-sm text-muted-foreground">
              Điều này sẽ không được hiển thị công khai. Xác nhận tuổi của bạn,
              ngay cả khi tài khoản này dành cho doanh nghiệp, thú cưng hoặc thứ
              gì khác.
            </p>
          </div>
        </div>

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

        <InputMain
          id="confirmPassword"
          name="confirmPassword"
          sizeInput="lg"
          label="Xác nhận mật khẩu"
          errors={errors}
          type="password"
          control={control}
          register={register}
          placeholder="Xác nhận mật khẩu của bạn"
        />

        <ButtonMain size="lg" className="w-full">
          Tiếp theo
        </ButtonMain>
      </div>
    </form>
  );
}
