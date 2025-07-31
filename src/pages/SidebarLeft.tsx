import { TypographyP } from "~/components/elements/p";
import { BookmarkIcon } from "~/components/icons/bookmark";
import { CommunityIcon } from "~/components/icons/communities";
import { ExploreIcon } from "~/components/icons/explore";
import { HomeIcon } from "~/components/icons/home";
import { MessageIcon } from "~/components/icons/messages";
import { NotificationIcon } from "~/components/icons/notifications";
import { ProfileIcon } from "~/components/icons/profile";
import { cn } from "~/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import type { ReactNode } from "react";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Logo } from "../components/logo";
import { WrapIcon } from "../components/wrapIcon";
import { DotIcon } from "~/components/icons/dot";
import { ButtonMain } from "~/components/button-main";

type NavItem = {
  name: string;
  icon: ReactNode;
  path: string;
};

const navs: NavItem[] = [
  {
    name: "Trang chủ",
    icon: <HomeIcon />,
    path: "/home",
  },
  {
    name: "Khám phá",
    icon: <ExploreIcon />,
    path: "/explore",
  },
  {
    name: "Dấu trang",
    icon: <BookmarkIcon />,
    path: "/bookmarks",
  },
  {
    name: "Thông báo",
    icon: <NotificationIcon />,
    path: "/notifications",
  },
  {
    name: "Tin nhắn",
    icon: <MessageIcon />,
    path: "/messages",
  },
  {
    name: "Cộng đồng",
    icon: <CommunityIcon />,
    path: "/communities",
  },
  {
    name: "Hồ sơ",
    icon: <ProfileIcon />,
    path: "/Bui_Thanh_Liem",
  },
];

export function SidebarLeft() {
  const { pathname } = useLocation();

  return (
    <div className="relative h-full">
      <h2 className="text-lg font-semibold mb-4">
        <WrapIcon>
          <Logo size={30} />
        </WrapIcon>
      </h2>
      <ul className="space-y-3 text-sm text-gray-700">
        {navs.map((x) => {
          const isActive = pathname === x.path;
          return (
            <li key={x.name} className="cursor-pointer group">
              <Link to={x.path}>
                <TypographyP
                  className={cn(
                    "text-[22px] p-3 group-hover:bg-gray-100 rounded-3xl flex items-center gap-3",
                    isActive ? "font-semibold" : ""
                  )}
                >
                  {React.isValidElement(x.icon) &&
                  typeof x.icon.type === "function"
                    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      React.cloneElement(x.icon, { active: isActive } as any)
                    : x.icon}

                  <span className="line-clamp-1">{x.name}</span>
                </TypographyP>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="absolute w-full bottom-28">
        <ButtonMain size="lg" className="w-full bg-black hover:bg-[#333]">
          Đăng Bài
        </ButtonMain>
      </div>

      <div className="absolute w-full bottom-3 p-2 px-3 rounded-4xl hover:bg-gray-100 cursor-pointer flex items-center gap-3">
        <Avatar>
          <AvatarImage
            className="w-11 h-11 rounded-full"
            src="https://github.com/shadcn.png"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <span className="block font-bold">Bui Thanh liem</span>
          <span className="text-sm text-gray-400">@Bui_Thanh_Liem</span>
        </div>

        <div className="absolute right-4">
          <WrapIcon>
            <DotIcon />
          </WrapIcon>
        </div>
      </div>
    </div>
  );
}
