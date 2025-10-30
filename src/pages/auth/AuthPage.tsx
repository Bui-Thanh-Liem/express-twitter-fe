import React, { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { AuthApple } from "~/components/auth-apple";
import { AuthGoogle } from "~/components/auth-google";
import { TypographyH1 } from "~/components/elements/h1";
import { TypographyH2 } from "~/components/elements/h2";
import { TypographyP } from "~/components/elements/p";
import { ConfirmOtpForm } from "~/components/forms/ConfirmOtpForm";
import { ForgotPasswordForm } from "~/components/forms/ForgotPasswordForm";
import { LoginAccountForm } from "~/components/forms/LoginAccountForm";
import { RegisterAccountForm } from "~/components/forms/RegisterAccountForm";
import { ResetPasswordForm } from "~/components/forms/ResetPasswordForm";
import { ButtonMain } from "~/components/ui/button";
import { DialogMain } from "~/components/ui/dialog";
import { Divider } from "~/components/ui/divider";
import { useGetMe } from "~/hooks/useFetchAuth";
import { useUserStore } from "~/store/useUserStore";
import { Logo } from "../../components/logo";

export function AuthPage() {
  const getMe = useGetMe();
  const { setUser } = useUserStore();

  // OAUTH
  const [params] = useSearchParams();
  const { hash } = useLocation();
  const status = params.get("s") || "";
  useEffect(() => {
    async function onLoginOAuthSuccess() {
      const access_token = params.get("access_token") || "";
      const refresh_token = params.get("refresh_token") || "";

      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);

      // Nếu đăng nhập thành công thì gọi api getMe lưu vào Store global
      const resGetMe = await getMe.mutateAsync();
      if (resGetMe.statusCode === 200 && resGetMe?.data) {
        setUser(resGetMe.data);
      }
    }
    if (status) onLoginOAuthSuccess();
  }, [getMe, params, setUser, status]);

  //
  const [isOpenRegister, setIsOpenRegister] = useState(false);
  const [isOpenLogin, setIsOpenLogin] = useState(false);
  const [isOpenForgotPass, setIsOpenForgotPass] = useState(false);
  const [isOpenConfirmOtp, setIsOpenConfirmOtp] = useState(false);
  const [isOpenResetPass, setIsOpenResetPass] = useState(false);

  //
  function onClickForgotPassword() {
    setIsOpenLogin(false);
    setIsOpenForgotPass(true);
  }

  //
  function onClickRegister() {
    setIsOpenLogin(false);
    setIsOpenRegister(true);
  }

  //
  useEffect(() => {
    const clearHash = hash.split("?")[0];
    if (clearHash === "#reset-password") {
      setIsOpenResetPass(true);
    }
  }, [hash]);

  return (
    <div className="m-auto w-[700px] md:w-[800px] lg:w-[1200px]">
      <div className="h-screen flex justify-between items-center">
        <div className="flex-1">
          <Logo size={332} className="w-[240px] lg:w-auto" />
        </div>
        <div className="flex-1">
          <TypographyH1 className="text-7xl lg:text-5xl hidden lg:block">
            Đang diễn ra ngay bây giờ
          </TypographyH1>
          <TypographyH2 className="mt-12 text-4xl mb-8 hidden lg:block">
            Tham gia ngay.
          </TypographyH2>
          <div className="space-y-2 w-80">
            <AuthGoogle />
            <AuthApple />
          </div>
          <Divider className="w-80 my-4" />
          <ButtonMain
            size="lg"
            className="w-80 block mb-6"
            onClick={() => setIsOpenRegister(true)}
          >
            Tạo tài khoản
          </ButtonMain>
          <TypographyP className="w-80">
            <span>Khi đăng ký, bạn đã đồng ý với</span>
            <Link to={"/"} className="text-[#1D9BF0]">
              {" "}
              Điều khoảng dịch vụ
            </Link>{" "}
            và
            <Link to={"/"} className="text-[#1D9BF0]">
              {" "}
              Chính sách quyền riêng tư
            </Link>
            , gồm cả
            <Link to={"/"} className="text-[#1D9BF0]">
              {" "}
              Sử dụng Cookie
            </Link>
          </TypographyP>

          <TypographyH2 className="text-xl mt-10">
            Đã có tài khoản ?
          </TypographyH2>
          <ButtonMain
            size="lg"
            className="w-80 block mt-3"
            variant="outline"
            onClick={() => setIsOpenLogin(true)}
          >
            Đăng nhập
          </ButtonMain>
        </div>
      </div>
      <Footer />

      {/*  */}
      <DialogMain
        open={isOpenRegister}
        onOpenChange={setIsOpenRegister}
        textHeader="Tạo tài khoản của bạn"
        textDesc="Vui lòng nhập thông tin để tạo tài khoản mới."
      >
        <RegisterAccountForm setOpenForm={setIsOpenRegister} />
      </DialogMain>

      {/*  */}
      <DialogMain
        open={isOpenLogin}
        onOpenChange={setIsOpenLogin}
        textHeader="Đăng nhập vào X"
        textDesc="Vui lòng nhập thông tin để đăng nhập."
      >
        <LoginAccountForm
          setOpenForm={setIsOpenLogin}
          onClickForgotPass={onClickForgotPassword}
          onClickRegister={onClickRegister}
        />
      </DialogMain>

      {/*  */}
      <DialogMain
        open={isOpenForgotPass}
        onOpenChange={setIsOpenForgotPass}
        textHeader="Tìm tài khoản X của bạn"
        textDesc="Nhập email liên kết với tài khoản để thay đổi mật khẩu của bạn."
      >
        <ForgotPasswordForm
          setOpenForm={setIsOpenForgotPass}
          // onSuccess={() => setIsOpenConfirmOtp(true)}
          onSuccess={() => {}}
        />
      </DialogMain>

      {/*  */}
      <DialogMain
        open={isOpenConfirmOtp}
        onOpenChange={setIsOpenConfirmOtp}
        textHeader="Chúng tôi đã gửi mã cho bạn"
        textDesc="Kiểm tra email của bạn để lấy mã xác nhận. Nếu bạn cần yêu cầu mã mới, quay lại và chọn lại phương thức xác nhận."
      >
        <ConfirmOtpForm
          setOpenForm={setIsOpenConfirmOtp}
          onBack={() => setIsOpenForgotPass(true)}
          onSuccess={() => setIsOpenResetPass(true)}
        />
      </DialogMain>

      {/*  */}
      <DialogMain
        open={isOpenResetPass}
        onOpenChange={setIsOpenResetPass}
        textHeader="Chọn mật khẩu mới"
        textDesc="Đảm bảo mật khẩu mới có 8 ký tự trở lên. Thử bao gồm số, chữ cái và dấu câu để tạo mật khẩu mạnh. "
      >
        <ResetPasswordForm setOpenForm={setIsOpenResetPass} />
      </DialogMain>
    </div>
  );
}

export function Footer() {
  const links = [
    "Giới thiệu",
    "Điều khoản Dịch vụ",
    "Chính sách Riêng tư",
    "Chính sách cookie",
    "Khả năng truy cập",
    "Thông tin quảng cáo",
    "Blog",
    "Tài nguyên thương hiệu",
    "Quảng cáo",
    "Tiếp thị",
    "Nhà phát triển",
    "Danh mục",
    "Cài đặt",
  ];

  return (
    <div className="text-sm text-gray-600 bottom-0 px-4 py-2">
      <div className="flex flex-wrap justify-center text-center gap-x-1 gap-y-1">
        {links.map((label, idx) => (
          <React.Fragment key={idx}>
            <a
              href="#"
              className="hover:underline hover:text-black transition-colors px-1"
            >
              {label}
            </a>
            {idx < links.length - 1 && <span className="text-gray-400">|</span>}
          </React.Fragment>
        ))}
      </div>
      <div className="text-center mt-2">
        © 2025 <strong>Liemdev</strong>.
      </div>
    </div>
  );
}
