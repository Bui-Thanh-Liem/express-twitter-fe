import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { TweetDetailDrawer } from "~/components/list-tweets/tweet-detail-drawer";
import { cn } from "~/lib/utils";
import ChatBox from "~/pages/messages/ChatBox";
import { CONSTANT_EVENT_NAMES } from "~/shared/constants";
import { useNotificationSocket } from "~/socket/hooks/useNotificationSocket";
import { socket } from "~/socket/socket";
import { useChatBoxStore } from "~/store/useChatBoxStore";
import { useUnreadNotiStore } from "~/store/useUnreadNotiStore";
import { useUserStore } from "~/store/useUserStore";
import { SidebarLeft } from "./SidebarLeft";
import { SidebarRight } from "./SidebarRight";
import { useDetailTweetStore } from "~/store/useDetailTweetStore";

export function HomeLayout() {
  const { isOpen } = useChatBoxStore();
  const { isOpen: isOpenDT } = useDetailTweetStore();
  const { user } = useUserStore();
  const { setUnread, setUnreadByType } = useUnreadNotiStore();
  const { pathname } = useLocation();
  const isMessage = pathname === "/messages";

  // Một kết nối socket duy nhất cho toàn ứng dụng
  useEffect(() => {
    socket.connect();
    console.log("mounted HomeLayout");

    socket.emit(CONSTANT_EVENT_NAMES.JOIN_CONVERSATION, user?._id);
    console.log("Join the room to receive notifications");

    return () => {
      socket.disconnect();
      console.log("unmounted HomeLayout");
    };
  }, []);

  //
  useNotificationSocket(() => {}, setUnread, setUnreadByType);

  //
  return (
    <div className="w-full">
      <div className="mx-auto flex h-screen overflow-hidden">
        <aside className="w-[8%] lg:w-[22%] pr-4 h-screen">
          <SidebarLeft />
        </aside>

        <main
          className={cn(
            "w-[64%] lg:w-[50%] col-span-6 border-r border-l border-gray-200",
            isMessage && "w-[90%] lg:w-[78%]"
          )}
        >
          <Outlet />
        </main>

        {/* Trường hơp đặt biệt trang message */}
        {!isMessage ? (
          <aside className="flex-1 h-screen">
            <SidebarRight />
          </aside>
        ) : null}
      </div>
      {isOpen && <ChatBox />}
      {isOpenDT && <TweetDetailDrawer />}
    </div>
  );
}
