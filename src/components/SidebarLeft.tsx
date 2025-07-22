import { Logo } from "./logo";
import { WrapIon } from "./wrapIcon";

export function SidebarLeft() {
  return (
    <aside className="col-span-2 p-4 hidden md:block">
      <h2 className="text-lg font-semibold mb-4">
        <WrapIon>
          <Logo size={32} />
        </WrapIon>
      </h2>
      <ul className="space-y-3 text-sm text-gray-700">
        <li className="hover:text-black cursor-pointer">Trang chủ</li>
        <li className="hover:text-black cursor-pointer">Khám phá</li>
        <li className="hover:text-black cursor-pointer">Thông báo</li>
        <li className="hover:text-black cursor-pointer">Cài đặt</li>
      </ul>
    </aside>
  );
}
