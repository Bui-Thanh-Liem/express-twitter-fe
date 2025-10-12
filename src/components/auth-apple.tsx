import { toastSimple } from "~/utils/toastSimple.util";
import { AppleIcon } from "./icons/apple";

export function AuthApple() {
  function handleClick() {
    toastSimple(
      "Thiết bị của bạn không được hỗ trợ phương thức đăng nhập này, vui lòng chọn cách khách."
    );
  }

  return (
    <div className="inline-block w-full" onClick={handleClick}>
      <div
        className={`h-12 border border-gray-300 hover:bg-gray-100 rounded-full flex justify-center items-center gap-4`}
      >
        <AppleIcon /> <span>Đăng kí với Apple</span>
      </div>
    </div>
  );
}
