import { ButtonMain } from "./ui/button";

export function ErrorProcess({ onClick }: { onClick: () => void }) {
  return (
    <div className="text-center py-8">
      <p className="text-red-500 mb-2">❌ Có lỗi xảy ra khi tải dữ liệu</p>
      <ButtonMain onClick={() => onClick()}>Thử lại</ButtonMain>
    </div>
  );
}
