import type { ReactNode } from "react";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { TypographyP } from "~/components/elements/p";
import { BookmarkIcon } from "~/components/icons/bookmark";
import { CommunityIcon } from "~/components/icons/communities";
import { DotIcon } from "~/components/icons/dot";
import { ExploreIcon } from "~/components/icons/explore";
import { HomeIcon } from "~/components/icons/home";
import { MessageIcon } from "~/components/icons/messages";
import { NotificationIcon } from "~/components/icons/notifications";
import { ProfileIcon } from "~/components/icons/profile";
import { AvatarMain } from "~/components/ui/avatar";
import { ButtonMain } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useLogout } from "~/hooks/useFetchAuth";
import { cn } from "~/lib/utils";
import { useUserStore } from "~/store/useUserStore";
import { Logo } from "../../components/logo";
import { WrapIcon } from "../../components/wrapIcon";
import { useConversationSocket } from "~/socket/hooks/useConversationSocket";
import { Badge } from "~/components/ui/badge";

type NavItem = {
  name: string;
  icon: ReactNode;
  path: string;
};

export function SidebarLeft() {
  const { pathname } = useLocation();
  const { user } = useUserStore();
  const logout = useLogout();

  //
  const [unreadCountNoti, setUnreadCountNoti] = useState(0);

  //
  useConversationSocket(
    () => {},
    (unreadCount: number) => {
      setUnreadCountNoti(unreadCount);
      console.log("Nhận từ server (socket) unreadCount:::", unreadCount);
    }
  );

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
      path: user?.username ? `/${user.username}` : "/profile",
    },
  ];

  //
  async function onLogout() {
    await logout.mutateAsync();
  }

  return (
    <div className="relative h-full pt-1">
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
                  {unreadCountNoti && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 rounded-full px-1.5 py-0 text-[10px] leading-none"
                    >
                      {unreadCountNoti}
                    </Badge>
                  )}
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
        <AvatarMain src={user?.avatar} alt={user?.name} />
        <div>
          <span className="block font-bold">{user?.name}</span>
          <span className="text-sm text-gray-400">{user?.username}</span>
        </div>

        <div className="absolute right-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="outline-0 outline-transparent">
                <WrapIcon>
                  <DotIcon />
                </WrapIcon>
              </button>
            </DropdownMenuTrigger>

            {/*  */}
            <DropdownMenuContent
              side="right"
              align="end"
              className="rounded-2xl w-60 px-0 py-2"
            >
              <DropdownMenuItem
                className="cursor-pointer h-10 px-4 font-semibold"
                onClick={onLogout}
              >
                <span className="text-red-500">Đăng xuất {user?.username}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
