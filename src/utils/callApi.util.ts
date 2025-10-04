import type { OkResponse } from "~/shared/classes/response.class";
import type { ResLoginUser } from "~/shared/dtos/res/auth.dto";

const apiUrl = import.meta.env.VITE_SERVER_URL;

export const apiCall = async <T>(
  endpoint: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: any = {}
): Promise<OkResponse<T>> => {
  console.log("Đang gọi api::");

  const access_token = localStorage.getItem("access_token");

  // Tạo headers object
  const headers: HeadersInit = {
    Authorization: access_token ? `Bearer ${access_token}` : "",
  };

  // CHỈ set Content-Type cho non-FormData requests
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  // Nếu là FormData, để browser tự động set Content-Type với boundary

  const config = {
    method: "GET",
    ...options, // Spread options trước
    headers: {
      ...headers,
      ...options.headers, // Allow override từ options
    },
  };

  // Initial API call
  let response = await fetch(`${apiUrl}${endpoint}`, config);
  console.log("Đang gọi api::", `${apiUrl}${endpoint}`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let result = (await response.json()) as OkResponse<any>;

  // Tại đây kiểm tra xem có hết hạn access_token không, có thì refresh lại access_token
  if (
    result.statusCode === 401 &&
    result.message === "TokenExpiredError: jwt expired"
  ) {
    console.log("Token đã hết hạn tiến hành refresh");

    // Fix: Get refresh_token, not access_token again
    const refresh_token = localStorage.getItem("refresh_token") || "";

    // Fix: Proper fetch call with headers
    const refreshResponse = await fetch(`${apiUrl}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token }),
    });

    const resRefreshToken =
      (await refreshResponse.json()) as OkResponse<ResLoginUser>;

    if (resRefreshToken.statusCode === 200) {
      localStorage.setItem(
        "access_token",
        resRefreshToken.data?.access_token || ""
      );
      localStorage.setItem(
        "refresh_token",
        resRefreshToken.data?.refresh_token || ""
      );

      // Update the Authorization header with new token
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${resRefreshToken.data?.access_token}`,
      };

      // Retry the original request with new token
      response = await fetch(`${apiUrl}${endpoint}`, config);
      result = await response.json();
    } else {
      // If refresh fails, redirect to login or handle accordingly
      // localStorage.removeItem("access_token");
      // localStorage.removeItem("refresh_token");

      // You might want to redirect to login page here
      console.log("Lỗi khi gọi api refresh token:::", resRefreshToken);
      window.location.href = "/";
    }
  }

  return result;
};
