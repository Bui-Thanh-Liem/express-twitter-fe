import { Link } from "react-router-dom";
import { AppleIcon } from "./icons/apple";

export function AuthApple() {
  return (
    <Link to={"/"} className="inline-block w-full">
      <div
        className={`h-12 border border-gray-300 hover:bg-gray-100 rounded-full flex justify-center items-center gap-4`}
      >
        <AppleIcon /> <span>Đăng kí với Apple</span>
      </div>
    </Link>
  );
}
