import { useLocation, useNavigate } from "react-router-dom";
import { BookmarkIcon } from "~/components/icons/bookmark";
import { CommunityIcon } from "~/components/icons/communities";
import { ExploreIcon } from "~/components/icons/explore";
import { HomeIcon } from "~/components/icons/home";
import { MessageIcon } from "~/components/icons/messages";
import { NotificationIcon } from "~/components/icons/notifications";
import { ProfileIcon } from "~/components/icons/profile";
import type { NavItem } from "~/layouts/home-layout/SidebarLeft";
import { useReloadStore } from "~/store/useReloadStore";
import { useUserStore } from "~/store/useUserStore";
import { WrapIcon } from "./wrapIcon";
import React from "react";

export function NavForMobile() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  //
  const { triggerReload } = useReloadStore();
  const { user } = useUserStore();

  const navs: NavItem[] = [
    {
      name: "Khám phá",
      icon: <ExploreIcon />,
      path: "/explore",
    },
    {
      name: "Cộng đồng",
      icon: <CommunityIcon />,
      path: "/communities",
    },

    {
      name: "Thông báo",
      icon: <NotificationIcon />,
      path: "/notifications",
      countNoti: 0,
    },
    // {
    //   name: "Đăng bài",
    //   icon: (
    //     <WrapIcon
    //       // onClick={handleOpenPost}
    //       className="bg-black hover:bg-[#333] ml-1 lg:hidden"
    //     >
    //       <Plus size={24} color="#fff" />
    //     </WrapIcon>
    //   ),
    // },
    {
      name: "Trang chủ",
      icon: <HomeIcon />,
      path: "/home",
    },
    {
      name: "Dấu trang",
      icon: <BookmarkIcon />,
      path: "/bookmarks",
    },

    {
      name: "Tin nhắn",
      icon: <MessageIcon />,
      path: "/messages",
      countNoti: 0,
    },

    {
      name: "Hồ sơ",
      icon: <ProfileIcon />,
      path: user?.username ? `/${user.username}` : "/profile",
    },
  ];

  //
  function onClickNav(path: string, name: string) {
    if (path !== "/home") document.title = name;
    triggerReload();
    navigate(path);
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between bg-white border-t border-gray-200 px-4 lg:hidden">
      {navs.map((nav) => {
        const isActive = pathname.startsWith(nav?.path || "");
        return (
          <WrapIcon
            key={nav.name}
            onClick={() => onClickNav(nav.path || "", nav.name)}
          >
            {React.cloneElement(
              nav.icon as React.ReactElement,
              {
                active: isActive,
              } as any
            )}
          </WrapIcon>
        );
      })}
    </div>
  );
}
