import { toast } from "sonner";
import { formatDateToDateVN } from "./formatDateToDateVN";

type ToastType = "success" | "error" | "warning" | "info";

export function toastSimple(mess: string, type: ToastType = "info") {
  toast[type](mess, {
    // position: "top-center",
    description: formatDateToDateVN(new Date()),
    richColors: true,
  });
}

export function toastSimpleVerify() {
  toast["warning"](
    "Tài khoản của bạn chưa được xác minh, xác minh ở trang cá nhân của bạn.",
    {
      // position: "top-center",
      description: formatDateToDateVN(new Date()),
      richColors: true,
    }
  );
}
