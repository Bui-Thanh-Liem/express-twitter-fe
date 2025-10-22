import type { ReactNode } from "react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TypographyP } from "~/components/elements/p";
import { BookmarkIcon } from "~/components/icons/bookmark";
import { CommunityIcon } from "~/components/icons/communities";
import { DotIcon } from "~/components/icons/dot";
import { ExploreIcon } from "~/components/icons/explore";
import { HomeIcon } from "~/components/icons/home";
import { MessageIcon } from "~/components/icons/messages";
import { NotificationIcon } from "~/components/icons/notifications";
import { ProfileIcon } from "~/components/icons/profile";
import { Tweet } from "~/components/tweet/Tweet";
import { AvatarMain } from "~/components/ui/avatar";
import { ButtonMain } from "~/components/ui/button";
import { DialogMain } from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useLogout } from "~/hooks/useFetchAuth";
import { cn } from "~/lib/utils";
import { CONSTANT_DEFAULT_TITLE_DOCUMENT } from "~/shared/constants/default-title-document";
import { ETweetType } from "~/shared/enums/type.enum";
import { useConversationSocket } from "~/socket/hooks/useConversationSocket";
import { useReloadStore } from "~/store/useReloadStore";
import { useUnreadNotiStore } from "~/store/useUnreadNotiStore";
import { useUserStore } from "~/store/useUserStore";
import { playNotificationSound } from "~/utils/notificationSound";
import { Logo } from "../../components/logo";
import { WrapIcon } from "../../components/wrapIcon";

type NavItem = {
  name: string;
  icon: ReactNode;
  path: string;
  countNoti?: number;
};

export function SidebarLeft() {
  //
  const { pathname } = useLocation();
  const navigate = useNavigate();

  //
  const { user } = useUserStore();
  const { unread } = useUnreadNotiStore();

  const logout = useLogout();
  const { triggerReload } = useReloadStore();

  //
  const [unreadCountNoti, setUnreadCountNoti] = useState(0);
  const [unreadCountConv, setUnreadCountConv] = useState(0);
  const [isOpenPost, setIsOpenPost] = useState(false);

  //
  function onClickNav(path: string, name: string) {
    if (path !== "/home") document.title = name;
    triggerReload();
    navigate(path);
  }

  //
  useEffect(() => {
    //
    if (unreadCountNoti < unread) {
      playNotificationSound();
    }

    //
    document.title =
      unread > 0
        ? `(${unread}) thông báo chưa đọc`
        : CONSTANT_DEFAULT_TITLE_DOCUMENT;

    const oldLinks = document.querySelectorAll(
      'link[rel="icon"], link[rel="shortcut icon"]'
    );

    oldLinks.forEach((link) => link.remove());

    // Tạo favicon mới
    const link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/svg+xml";
    link.href = unread > 0 ? "/favicon-noti.svg" : "/favicon.svg";
    document.head.appendChild(link);
    setUnreadCountNoti(unread);
  }, [unread]);

  //
  useConversationSocket(
    () => {},
    (_unread) => {
      //
      if (unreadCountConv < _unread) {
        playNotificationSound();
      }

      //
      document.title =
        _unread > 0
          ? `(${_unread}) tin nhắn chưa đọc`
          : CONSTANT_DEFAULT_TITLE_DOCUMENT;

      const oldLinks = document.querySelectorAll(
        'link[rel="icon"], link[rel="shortcut icon"]'
      );
      oldLinks.forEach((link) => link.remove());

      // Tạo favicon mới
      const link = document.createElement("link");
      link.rel = "icon";
      link.type = "image/svg+xml";
      link.href = _unread > 0 ? "/favicon-noti.svg" : "/favicon.svg";
      document.head.appendChild(link);
      setUnreadCountConv(_unread);
    },
    () => {}
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
      name: "Cộng đồng",
      icon: <CommunityIcon />,
      path: "/communities",
    },
    {
      name: "Thông báo",
      icon: <NotificationIcon />,
      path: "/notifications",
      countNoti: unreadCountNoti,
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
      countNoti: unreadCountConv,
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

  //
  function onSuccessComment() {}

  return (
    <>
      <div className="relative h-full pt-1 ml-4 lg:ml-0">
        <h2 className="text-lg font-semibold">
          <WrapIcon>
            <Logo size={40} />
          </WrapIcon>
        </h2>
        <ul className="space-y-3 text-sm text-gray-700">
          {navs.map((x) => {
            const isActive = pathname === x.path;
            return (
              <li key={x.name} className="cursor-pointer group relative">
                <div onClick={() => onClickNav(x.path, x.name)}>
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
                    <span className="line-clamp-1 hidden lg:block">
                      {x.name}{" "}
                    </span>
                    {!!x?.countNoti && (
                      <span className="absolute top-2 left-6 flex items-center justify-center w-5 h-5 bg-sky-400 text-white rounded-full text-[10px] border-2 border-white">
                        {x?.countNoti}
                      </span>
                    )}
                  </TypographyP>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="absolute w-full bottom-20 lg:bottom-28">
          <ButtonMain
            size="lg"
            onClick={() => setIsOpenPost(true)}
            className="w-full bg-black hover:bg-[#333] hidden lg:block"
          >
            Đăng Bài
          </ButtonMain>
          <ButtonMain
            size="lg"
            onClick={() => setIsOpenPost(true)}
            className="w-full bg-black hover:bg-[#333] text-md lg:hidden"
          >
            Đăng
          </ButtonMain>
        </div>

        <div className="absolute w-full bottom-6 lg:bottom-3 p-2 px-3 rounded-4xl hover:bg-gray-100 cursor-pointer flex items-center gap-3">
          <AvatarMain
            src={user?.avatar}
            alt={user?.name}
            className="hidden lg:block"
          />
          <div className="hidden lg:block">
            <span className="block font-bold">{user?.name}</span>
            <span className="text-sm text-gray-400">{user?.username}</span>
          </div>

          <div className="absolute right-1 lg:right-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="outline-0 outline-transparent">
                  <WrapIcon className="hidden lg:block">
                    <DotIcon />
                  </WrapIcon>
                  <AvatarMain
                    src={user?.avatar}
                    alt={user?.name}
                    className="lg:hidden"
                  />
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
                  <span className="text-red-500">
                    Đăng xuất {user?.username}
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <DialogMain isLogo={false} open={isOpenPost} onOpenChange={setIsOpenPost}>
        <Tweet
          contentBtn="Đăng bài"
          tweetType={ETweetType.Tweet}
          placeholder="Có chuyện gì thế ?"
          onSuccess={onSuccessComment}
        />
      </DialogMain>
    </>
  );
}
