"use client";

import { ButtonMain } from "@/components/button-main";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { InputMain } from "../input-main";

const FormSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
});

type FormValues = z.infer<typeof FormSchema>;

export function ForgotPasswordForm({
  setOpenForm,
  onSuccess,
}: {
  setOpenForm: (open: boolean) => void;
  onSuccess: () => void;
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
    },
  });

  //
  function onCancel(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setOpenForm(false);
  }

  //
  const onSubmit = (data: FormValues) => {
    console.log("✅ Dữ liệu ForgotPasswordForm :", data);
    setOpenForm(false);
    onSuccess();
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center justify-center"
    >
      <div className="mt-4 space-y-6 min-w-[460px]">
        <div>
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

          <div className="flex gap-4 mt-12">
            <ButtonMain
              size="lg"
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onCancel}
            >
              Hủy
            </ButtonMain>
            <ButtonMain size="lg" className="flex-1">
              Gửi
            </ButtonMain>
          </div>
        </div>
      </div>
    </form>
  );
}
