import { AuthApple } from "@/components/auth-apple";
import { AuthGoogle } from "@/components/auth-google";
import { ButtonMain } from "@/components/button-main";
import { DialogMain } from "@/components/dialog-main";
import { TypographyH1 } from "@/components/elements/h1";
import { TypographyH2 } from "@/components/elements/h2";
import { TypographyP } from "@/components/elements/p";
import { ConfirmOtpForm } from "@/components/forms/ConfirmOtpForm";
import { ForgotPasswordForm } from "@/components/forms/ForgotPasswordForm";
import { LoginAccountForm } from "@/components/forms/LoginAccountForm";
import { RegisterAccountForm } from "@/components/forms/RegisterAccountForm";
import { Divider } from "@/components/ui/divider";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../components/logo";
import { ResetPasswordForm } from "@/components/forms/ResetPasswordForm";

export function Footer() {
  const links = [
    "Giới thiệu",
    "Tải ứng dụng X xuống",
    "Grok",
    "Trung tâm Trợ giúp",
    "Điều khoản Dịch vụ",
    "Chính sách Riêng tư",
    "Chính sách cookie",
    "Khả năng truy cập",
    "Thông tin quảng cáo",
    "Blog",
    "Nghề nghiệp",
    "Tài nguyên thương hiệu",
    "Quảng cáo",
    "Tiếp thị",
    "X dành cho doanh nghiệp",
    "Nhà phát triển",
    "Danh mục",
    "Cài đặt",
  ];

  return (
    <div className="text-sm text-gray-600  bottom-0 px-4 py-2 w-[1200px]">
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
      <div className="text-center mt-2">© 2025 X Corp.</div>
    </div>
  );
}

export function AuthPage() {
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

  function onClickRegister() {
    setIsOpenLogin(false);
    setIsOpenRegister(true);
  }

  return (
    <div>
      <div className="h-screen flex justify-between items-center">
        <div className="flex-1">
          <Logo size={332} />
        </div>
        <div className="flex-1">
          <TypographyH1 className="text-7xl lg:text-5xl">
            Đang diễn ra ngay bây giờ
          </TypographyH1>
          <TypographyH2 className="mt-12 text-4xl mb-8">
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
          onSuccess={() => setIsOpenConfirmOtp(true)}
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
