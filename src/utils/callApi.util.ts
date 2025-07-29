import type { OkResponse } from "~/shared/classes/response.class";

const apiUrl = import.meta.env.VITE_API_URL;
const API_BASE_URL = apiUrl;

export const apiCall = async <T>(
  endpoint: string,
  options: any = {}
): Promise<OkResponse<T>> => {
  const token = localStorage.getItem("access_token");

  const config = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  // if (!response.ok) {
  //   throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  // }

  return response.json();
};
