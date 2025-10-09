import { useMutation, useQuery } from "@tanstack/react-query";
import type { ReportTrendingDto } from "~/shared/dtos/req/trending.dto";
import type { IResTodayNews } from "~/shared/dtos/res/trending.dto";
import type { IQuery } from "~/shared/interfaces/common/query.interface";
import type { ITrending } from "~/shared/interfaces/schemas/trending.interface";
import type { ResMultiType } from "~/shared/types/response.type";
import { buildQueryString } from "~/utils/buildQueryString";
import { apiCall } from "~/utils/callApi.util";

// 📄 GET
export const useGetTrending = (queries?: IQuery<ITrending>) => {
  const normalizedQueries = queries ? JSON.stringify(queries) : "";

  return useQuery({
    queryKey: ["trending", "trending", normalizedQueries],
    queryFn: () => {
      // Tạo query string từ queries object
      const queryString = queries ? buildQueryString(queries) : "";
      const url = `/trending/${queryString ? `?${queryString}` : ""}`;
      return apiCall<ResMultiType<ITrending>>(url);
    },

    // Các options bổ sung
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

// 📄 GET
export const useGetTodayNews = (
  queries?: IQuery<ITrending>,
  enabled = true
) => {
  const normalizedQueries = queries ? JSON.stringify(queries) : "";

  return useQuery({
    queryKey: ["trending", "today-news", normalizedQueries],
    queryFn: () => {
      // Tạo query string từ queries object
      const queryString = queries ? buildQueryString(queries) : "";
      const url = `/trending/today-news/${
        queryString ? `?${queryString}` : ""
      }`;
      return apiCall<IResTodayNews[]>(url);
    },

    // Các options bổ sung
    enabled,
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

// 📄 GET
export const useGetOutstandingThisWeek = (
  queries?: IQuery<ITrending>,
  enabled = true
) => {
  const normalizedQueries = queries ? JSON.stringify(queries) : "";

  return useQuery({
    queryKey: ["trending", "outstanding-this-week", normalizedQueries],
    queryFn: () => {
      // Tạo query string từ queries object
      const queryString = queries ? buildQueryString(queries) : "";
      const url = `/trending/outstanding-this-week/${
        queryString ? `?${queryString}` : ""
      }`;
      return apiCall<IResTodayNews[]>(url);
    },

    // Các options bổ sung
    enabled,
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

// 🔐 PATCH - report trending
export const useReportTrending = () => {
  return useMutation({
    mutationFn: ({ trending_id }: ReportTrendingDto) =>
      apiCall<boolean>(`/trending/report/${trending_id}`, {
        method: "PATCH",
      }),
    onSuccess: () => {},
  });
};
