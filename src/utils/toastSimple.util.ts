import { toast } from "sonner";

type ToastType = "success" | "error" | "warning" | "info";

export function toastSimple(mess: string, type: ToastType = "info") {
  toast[type](mess, {
    // position: "top-center",
    description: new Date().toJSON(),
    richColors: true,
  });
}
