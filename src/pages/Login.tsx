import { TypographyH1 } from "@/components/elements/h1";
import { TypographyH2 } from "@/components/elements/h2";
import { TypographyP } from "@/components/elements/p";
import { AppleIcon } from "@/components/icons/apple";
import { GoogleIcon } from "@/components/icons/google";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import type { ReactNode } from "react";
import React from "react";
import { Link } from "react-router";
import { Logo } from "../components/logo";

function RegisterItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`w-80 h-11 border border-gray-300 rounded-full flex justify-center items-center gap-4 ${className}`}
    >
      {children}
    </div>
  );
}

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
    <div className="text-sm text-gray-600 fixed bottom-0 px-4 py-2 w-[1200px]">
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

export default function Login() {
  //
  function getGoogleAuthUrl() {
    const { VITE_GOOGLE_CLIENT_ID, VITE_GOOGLE_REDIRECT_URIS } = import.meta
      .env;

    const url = `https://accounts.google.com/o/oauth2/v2/auth`;
    const query = {
      client_id: VITE_GOOGLE_CLIENT_ID,
      redirect_uri: VITE_GOOGLE_REDIRECT_URIS,
      response_type: "code",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ].join(" "),
      prompt: "consent",
      access_type: "offline",
    };

    const queryString = new URLSearchParams(query).toString();
    console.log(queryString);

    return `${url}?${queryString}`;
  }

  //
  const googleOAuthUrl = getGoogleAuthUrl();

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <Logo size={332} />
        </div>
        <div className="flex-1">
          <TypographyH1 className="text-7xl">
            Đang diễn ra ngay bây giờ
          </TypographyH1>
          <TypographyH2 className="mt-12 text-4xl mb-8">
            Tham gia ngay.
          </TypographyH2>
          <Link to={googleOAuthUrl}>
            <RegisterItem>
              <GoogleIcon /> <span>Đăng kí với Google</span>
            </RegisterItem>
          </Link>
          <RegisterItem className="mt-4">
            <AppleIcon /> <span>Đăng kí với Apple</span>
          </RegisterItem>
          <Divider className="w-80" />
          <Button className="w-80 block mb-6">Tạo tài khoản</Button>
          <TypographyP className="text-[16px] w-80">
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
            Đã có tài khoản?
          </TypographyH2>
          <Button className="w-80 block mt-3" variant={"outline"}>
            Tạo tài khoản
          </Button>
        </div>
      </div>
      <Footer />
    </>
  );
}
