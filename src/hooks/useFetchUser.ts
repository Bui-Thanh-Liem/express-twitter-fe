import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { verifyEmailDto } from "~/shared/dtos/req/user.dto";
import type { IQuery } from "~/shared/interfaces/common/query.interface";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import type { ResMultiType } from "~/shared/types/response.type";
import { buildQueryString } from "~/utils/buildQueryString";
import { apiCall } from "~/utils/callApi.util";
import { useGetMe } from "./useFetchAuth";
import { useUserStore } from "~/store/useUserStore";

// 🚪 GET - Get User By username
export const useGetOneByUsername = (username: string, enabled = true) => {
  return useQuery({
    queryKey: ["user", username],
    queryFn: () => apiCall<IUser>(`/users/username/${username}`),
    enabled: enabled && !!username,
  });
};

// 🔐 POST - Verify email
export const useVerifyEmail = () => {
  const navigate = useNavigate();
  const getMe = useGetMe();
  const { setUser } = useUserStore();

  return useMutation({
    mutationFn: (credentials: verifyEmailDto) =>
      apiCall<IUser>("/users/verify-email", {
        method: "POST",
        body: JSON.stringify(credentials),
      }),
    onSuccess: (res) => {
      if (res.statusCode === 200) {
        console.log("useVerifyEmail - res :::", res);

        (async () => {
          const resGetMe = await getMe.mutateAsync();
          if (resGetMe.statusCode === 200 && resGetMe?.data) {
            setUser(resGetMe.data);
          }
        })();

        //
        navigate("/home");
      }
    },
  });
};

// 🔐 POST - Resend verify email
export const useResendVerifyEmail = () => {
  return useMutation({
    mutationFn: () =>
      apiCall<boolean>("/users/resend-verify-email", {
        method: "POST",
      }),
    onSuccess: (res) => {
      if (res.statusCode === 200) {
        console.log("useResendVerifyEmail - res :::", res);
      }
    },
  });
};

// 📄 GET - Lấy user followed
export const useGetFollowed = (queries?: IQuery<IUser>) => {
  const normalizedQueries = queries ? JSON.stringify(queries) : "";

  return useQuery({
    queryKey: ["users/followed", "followed", normalizedQueries],
    queryFn: () => {
      // Tạo query string từ queries object
      const queryString = queries ? buildQueryString(queries) : "";
      const url = `/users/followed${queryString ? `?${queryString}` : ""}`;
      return apiCall<ResMultiType<IUser>>(url);
    },

    // Các options bổ sung
    enabled: !!normalizedQueries,
    staleTime: 10000, // ✅ QUAN TRỌNG: Tăng lên 10 giây để tránh refetch ngay lập tức
    refetchOnWindowFocus: false, // ✅ Tắt refetch khi focus để tránh ghi đè optimistic update
    refetchOnMount: false, // ✅ Tắt refetch khi mount

    // 🔥 THÊM CẤU HÌNH NÀY:
    refetchOnReconnect: false,
    refetchInterval: false,
    // Quan trọng: Đảm bảo không conflict với optimistic update
    networkMode: "online",
  });
};

// 📄 GET - Lấy user followed
export const useGetTopFollowedUsers = (queries?: IQuery<IUser>) => {
  const normalizedQueries = queries ? JSON.stringify(queries) : "";

  return useQuery({
    queryKey: ["users/top-followed", "followed", normalizedQueries],
    queryFn: () => {
      // Tạo query string từ queries object
      const queryString = queries ? buildQueryString(queries) : "";
      const url = `/users/top-followed${queryString ? `?${queryString}` : ""}`;
      return apiCall<ResMultiType<IUser>>(url);
    },

    // Các options bổ sung
    enabled: !!normalizedQueries,
    staleTime: 10000, // ✅ QUAN TRỌNG: Tăng lên 10 giây để tránh refetch ngay lập tức
    refetchOnWindowFocus: false, // ✅ Tắt refetch khi focus để tránh ghi đè optimistic update
    refetchOnMount: false, // ✅ Tắt refetch khi mount

    // 🔥 THÊM CẤU HÌNH NÀY:
    refetchOnReconnect: false,
    refetchInterval: false,
    // Quan trọng: Đảm bảo không conflict với optimistic update
    networkMode: "online",
  });
};
