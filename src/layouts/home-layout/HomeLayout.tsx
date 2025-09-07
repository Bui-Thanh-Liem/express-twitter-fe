import { Outlet, useLocation } from "react-router-dom";
import { cn } from "~/lib/utils";
import ChatBox from "~/pages/profile/ProfileAction";
import { useChatBoxStore } from "~/store/useChatBoxStore";
import { SidebarLeft } from "./SidebarLeft";
import { SidebarRight } from "./SidebarRight";

export function HomeLayout() {
  const { isOpen } = useChatBoxStore();
  const { pathname } = useLocation();
  const isMessage = pathname === "/messages";

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
