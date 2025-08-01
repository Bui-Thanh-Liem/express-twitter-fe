import { Outlet } from "react-router-dom";
import { SidebarLeft } from "./pages/SidebarLeft";
import { SidebarRight } from "./pages/SidebarRight";

export function HomeLayout() {
  return (
    <div className="w-full">
      <div className="mx-auto grid grid-cols-12 h-screen overflow-hidden">
        <aside className="col-span-3 pr-4 h-screen">
          <SidebarLeft />
        </aside>
        <main className="col-span-6 border-r border-l border-gray-200">
          <Outlet />
        </main>
        <aside className="col-span-3 pl-4 h-screen">
          <SidebarRight />
        </aside>
      </div>
    </div>
  );
}
