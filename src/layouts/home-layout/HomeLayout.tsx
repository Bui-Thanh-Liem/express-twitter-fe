import { Outlet } from "react-router-dom";
import { SidebarLeft } from "./SidebarLeft";
import { SidebarRight } from "./SidebarRight";

export function HomeLayout() {
  return (
    <div className="w-full">
      <div className="mx-auto flex h-screen overflow-hidden">
        <aside className="w-[22%] pr-4 h-screen">
          <SidebarLeft />
        </aside>
        <main className="w-[50%] col-span-6 border-r border-l border-gray-200">
          <Outlet />
        </main>
        <aside className="flex-1 pl-4 h-screen">
          <SidebarRight />
        </aside>
      </div>
    </div>
  );
}
