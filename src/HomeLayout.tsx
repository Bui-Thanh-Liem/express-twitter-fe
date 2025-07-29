import { Outlet } from "react-router-dom";
import { SidebarLeft } from "./pages/SidebarLeft";
import { SidebarRight } from "./pages/SidebarRight";

export function HomeLayout() {
  return (
    <div className="min-h-screen w-full bg-white">
      <div className="mx-auto grid grid-cols-12 min-h-screen">
        <aside className="col-span-3 pr-4 min-h-screen">
          <SidebarLeft />
        </aside>
        <main className="col-span-6 border-r border-l border-gray-200">
          <Outlet />
        </main>
        <aside className="col-span-3 pl-4 min-h-screen">
          <SidebarRight />
        </aside>
      </div>
    </div>
  );
}
