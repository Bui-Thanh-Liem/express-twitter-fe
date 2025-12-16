import { toast } from "sonner";
import type { OkResponse } from "~/shared/classes/response.class";
import { formatDateToDateVN } from "./formatDateToDateVN";

export function handleResponse(
  res: OkResponse<any | boolean>,
  ...callbacks: ((val?: unknown) => void)[]
) {
  const { statusCode, message } = res;

  if (statusCode === 200 || statusCode === 201) {
    callbacks.forEach((fn) => fn());
    toast.success(message, {
      // position: "top-center",
      description: formatDateToDateVN(new Date()),
      richColors: true,
    });
  } else {
    toast.error(message?.replace("Error:", ""), {
      // position: "top-center",
      description: formatDateToDateVN(new Date()),
      richColors: true,
    });
  }
}

export function handleResponseOnlyErr(res: OkResponse<any | boolean>) {
  const { statusCode, message } = res;

  if (statusCode !== 200 && statusCode !== 201) {
    toast.error(message?.replace("Error:", ""), {
      description: formatDateToDateVN(new Date()),
      richColors: true,
    });
    return false;
  }
}
