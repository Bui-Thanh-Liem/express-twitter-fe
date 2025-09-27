import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { verifyEmailDto } from "~/shared/dtos/req/user.dto";
import type { EUserVerifyStatus } from "~/shared/enums/status.enum";
import type { IQuery } from "~/shared/interfaces/common/query.interface";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import type { ResMultiType } from "~/shared/types/response.type";
import { useUserStore } from "~/store/useUserStore";
import { buildQueryString } from "~/utils/buildQueryString";
import { apiCall } from "~/utils/callApi.util";

// 🚪 GET - Get User By username
export const useGetOneByUsername = (username: string, enabled = true) => {
  return useQuery({
    queryKey: ["user", username],
    queryFn: () => apiCall<IUser>(`/users/username/${username}`),
    enabled: enabled && !!username,
  });
};

// 🚪 GET - Get Users By username
export const useGetMultiForMentions = (username: string, enabled = true) => {
  return useQuery({
    queryKey: ["users", "mentions", username],
    queryFn: () => {
      // Tạo query string từ queries object
      const url = `/users/mentions/${username}`;
      return apiCall<Pick<IUser, "_id" | "name" | "username">[]>(url);
    },

    //
    enabled,
    // Lên getNewFeeds đọc giải thích
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
    refetchOnReconnect: false,
    refetchInterval: false,
    networkMode: "online",
  });
};

// 🔐 POST - Verify email
export const useVerifyEmail = () => {
  const navigate = useNavigate();
  const { setUser, user } = useUserStore();

  return useMutation({
    mutationFn: (credentials: verifyEmailDto) =>
      apiCall<EUserVerifyStatus>("/users/verify-email", {
        method: "POST",
        body: JSON.stringify(credentials),
      }),
    onSuccess: (res) => {
      if (res.statusCode === 200 && res.data) {
        setUser({ ...user, verify: res.data } as IUser);
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
    queryKey: ["users", "followed", normalizedQueries],
    queryFn: () => {
      // Tạo query string từ queries object
      const queryString = queries ? buildQueryString(queries) : "";
      const url = `/users/followed${queryString ? `?${queryString}` : ""}`;
      return apiCall<ResMultiType<IUser>>(url);
    },

    // Lên getNewFeeds đọc giải thích
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
    refetchOnReconnect: false,
    refetchInterval: false,
    networkMode: "online",
  });
};

// 📄 GET - Lấy user mà mình chưa theo dõi và có nhiều người theo dõi
export const useGetTopFollowedUsers = (queries?: IQuery<IUser>) => {
  const normalizedQueries = queries ? JSON.stringify(queries) : "";

  return useQuery({
    queryKey: ["top-followed", normalizedQueries],
    queryFn: () => {
      // Tạo query string từ queries object
      const queryString = queries ? buildQueryString(queries) : "";
      const url = `/users/top-followed${queryString ? `?${queryString}` : ""}`;
      return apiCall<ResMultiType<IUser>>(url);
    },

    // Lên getNewFeeds đọc giải thích
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
    refetchOnReconnect: false,
    refetchInterval: false,
    networkMode: "online",
  });
};
