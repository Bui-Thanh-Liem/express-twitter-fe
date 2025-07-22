import { SidebarLeft } from "../components/SidebarLeft";
import { SidebarRight } from "../components/SidebarRight";
import { MainContent } from "../components/MainContent";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-white">
      <div className="max-w-[1200px] mx-auto grid grid-cols-12 min-h-screen">
        <SidebarLeft />
        <MainContent />
        <SidebarRight />
      </div>
    </div>
  );
}
