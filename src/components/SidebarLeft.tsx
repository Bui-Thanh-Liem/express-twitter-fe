import { Logo } from "./logo";

export function SidebarLeft() {
  return (
    <aside className="col-span-2 border-r border-gray-200 p-4 hidden md:block">
      <h2 className="text-lg font-semibold mb-4">
        <Logo size={32} />
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
