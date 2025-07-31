import type { OkResponse } from "~/shared/classes/response.class";

const apiUrl = import.meta.env.VITE_API_URL;

export const apiCall = async <T>(
  endpoint: string,
  options: any = {}
): Promise<OkResponse<T>> => {
  const token = localStorage.getItem("access_token");

  // Tạo headers object
  const headers: HeadersInit = {
    Authorization: token ? `Bearer ${token}` : "",
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

  //
  const response = await fetch(`${apiUrl}${endpoint}`, config);
  return response.json();
};
