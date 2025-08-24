import { toast } from "sonner";
import type { OkResponse } from "~/shared/classes/response.class";

export function handleResponse(
  res: OkResponse<object | boolean>,
  ...callbacks: (() => void)[]
) {
  const { statusCode, message } = res;

  if (statusCode === 200 || statusCode === 201) {
    callbacks.forEach((fn) => fn());
    toast.success(message, {
      // position: "top-center",
      description: new Date().toJSON(),
      richColors: true,
    });
  } else {
    toast.error(message, {
      // position: "top-center",
      description: new Date().toJSON(),
      richColors: true,
    });
  }
}
