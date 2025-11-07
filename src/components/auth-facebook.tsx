import { toastSimple } from "~/utils/toastSimple.util";
import { FacebookIcon } from "./icons/facebook";

export function AuthFacebook() {
  function handleClick() {
    toastSimple(
      "Tính năng đang được cập nhật, vui lòng chọn phương thức khác."
    );
  }

  return (
    <div className="inline-block w-full" onClick={handleClick}>
      <div
        className={`h-12 border border-gray-300 hover:bg-gray-100 rounded-full flex justify-center items-center gap-4`}
      >
        <FacebookIcon /> <span>Đăng kí với Facebook</span>
      </div>
    </div>
  );
}
