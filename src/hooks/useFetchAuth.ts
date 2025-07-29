import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { LoginUserDto, RegisterUserDto } from "~/shared/dtos/req/auth.dto";
import type { ResLoginUser } from "~/shared/dtos/res/auth.dto";
import { apiCall } from "~/utils/callApi.util";

// 🔐 POST - Register
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: RegisterUserDto) =>
      apiCall("/auth/register", {
        method: "POST",
        body: JSON.stringify(credentials),
      }),
    onSuccess: () => {
      // Invalidate user data để refetch
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

// 🔐 POST - Login
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginUserDto) =>
      apiCall<ResLoginUser>("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      }),
    onSuccess: (data) => {
      // Lưu token
      localStorage.setItem("access_token", data.data?.access_token || "");
      localStorage.setItem("refresh_token", data.data?.refresh_token || "");
      // Invalidate user data để refetch
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

// 🚪 POST - Logout
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiCall("/auth/logout", { method: "POST" }),
    onSuccess: () => {
      // Xóa token
      localStorage.removeItem("token");
      // Clear toàn bộ cache
      queryClient.clear();
    },
  });
};
