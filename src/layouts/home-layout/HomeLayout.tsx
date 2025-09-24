import { Outlet, useLocation } from "react-router-dom";
import { cn } from "~/lib/utils";
import { useChatBoxStore } from "~/store/useChatBoxStore";
import { SidebarLeft } from "./SidebarLeft";
import { SidebarRight } from "./SidebarRight";
import ChatBox from "~/pages/messages/ChatBox";
import { useEffect } from "react";
import { socket } from "~/socket/socket";

export function HomeLayout() {
  const { isOpen } = useChatBoxStore();
  const { pathname } = useLocation();
  const isMessage = pathname === "/messages";

  // Một kết nối duy nhất cho toàn ứng dụng
  useEffect(() => {
    socket.connect();
    console.log("mounted HomeLayout");

    return () => {
      socket.disconnect();
      console.log("unmounted HomeLayout");
    };
  }, []);

  return (
    <div className="w-full">
      <div className="mx-auto flex h-screen overflow-hidden">
        <aside className="w-[22%] pr-4 h-screen">
          <SidebarLeft />
        </aside>
        <main
          className={cn(
            "w-[50%] col-span-6 border-r border-l border-gray-200",
            isMessage && "w-[78%]"
          )}
        >
          <Outlet />
        </main>

        {/* Trường hơp đặt biệt trang message */}
        {!isMessage ? (
          <aside className="flex-1 pl-4 h-screen">
            <SidebarRight />
          </aside>
        ) : null}
      </div>

      {isOpen && <ChatBox />}
    </div>
  );
}
