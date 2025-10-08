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
