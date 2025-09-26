import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateTweetDto } from "~/shared/dtos/req/tweet.dto";
import type { ResCreateTweet } from "~/shared/dtos/res/tweet.dto";
import type { EFeedType, ETweetType } from "~/shared/enums/type.enum";
import type { IQuery } from "~/shared/interfaces/common/query.interface";
import type { ITweet } from "~/shared/interfaces/schemas/tweet.interface";
import type { ResMultiType } from "~/shared/types/response.type";
import { buildQueryString } from "~/utils/buildQueryString";
import { apiCall } from "~/utils/callApi.util";

// ➕ POST - Tạo tweet mới
export const useCreateTweet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTweetDto) =>
      apiCall<ResCreateTweet>("/tweets", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      // Invalidate danh sách tweets
      queryClient.invalidateQueries({ queryKey: ["tweets"] });
    },
  });
};

// 📄 GET - Lấy chi tiết 1 tweet
export const useGetDetailTweet = (id: string | number, enabled = true) => {
  return useQuery({
    queryKey: ["tweet", id],
    queryFn: () => apiCall<ITweet>(`/tweets/${id}`),
    enabled: enabled && !!id,
  });
};

// 📄 GET - Lấy tweets mới nhất theo type feed: all - everyone - following
export const useGetNewFeeds = (
  feed_type: EFeedType,
  queries?: IQuery<ITweet>
) => {
  const normalizedQueries = queries ? JSON.stringify(queries) : "";

  return useQuery({
    queryKey: ["tweets/feeds", feed_type, normalizedQueries],
    queryFn: () => {
      // Tạo query string từ queries object
      const queryString = queries ? buildQueryString(queries) : "";
      const url = `/tweets/feeds/${feed_type}${
        queryString ? `?${queryString}` : ""
      }`;
      return apiCall<ResMultiType<ITweet>>(url);
    },

    // Các options bổ sung
    enabled: !!feed_type, // Chỉ chạy query khi có feed_type
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

// 📄 GET - Lấy tweets của chính mình trong profile
export const useGetProfileTweets = (
  tweet_type: ETweetType,
  queries?: IQuery<ITweet> & {
    ishl?: "0" | "1";
  }
) => {
  const normalizedQueries = queries ? JSON.stringify(queries) : "";

  return useQuery({
    queryKey: ["tweets/profile", tweet_type, normalizedQueries],
    queryFn: () => {
      // Tạo query string từ queries object
      const queryString = queries ? buildQueryString(queries) : "";
      const url = `/tweets/profile/${tweet_type}${
        queryString ? `?${queryString}` : ""
      }`;
      return apiCall<ResMultiType<ITweet>>(url);
    },

    // Các options bổ sung
    // enabled: !!tweet_type, // Chỉ chạy query khi có tweet_type
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

// 📄 GET - Lấy tweets con của một tweet
export const useGetTweetChildren = ({
  tweet_id,
  tweet_type,
  queries,
}: {
  tweet_id: string;
  tweet_type: ETweetType;
  queries?: IQuery<ITweet>;
}) => {
  const normalizedQueries = queries ? JSON.stringify(queries) : "";

  return useQuery({
    queryKey: ["tweets/children", tweet_type, normalizedQueries],
    queryFn: () => {
      // Tạo query string từ queries object
      const queryString = queries ? buildQueryString(queries) : "";
      const url = `/tweets/${tweet_id}/${tweet_type}/children${
        queryString ? `?${queryString}` : ""
      }`;
      return apiCall<ResMultiType<ITweet>>(url);
    },

    // Các options bổ sung
    enabled: !!tweet_type, // Chỉ chạy query khi có tweet_type
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

// 📄 GET - Lấy media của chính mình trong profile
export const useGetProfileMedia = (queries?: IQuery<ITweet>) => {
  const normalizedQueries = queries ? JSON.stringify(queries) : "";

  return useQuery({
    queryKey: ["tweets/profile-media", normalizedQueries],
    queryFn: () => {
      // Tạo query string từ queries object
      const queryString = queries ? buildQueryString(queries) : "";
      const url = `/tweets/profile-media/${
        queryString ? `?${queryString}` : ""
      }`;

      return apiCall<ResMultiType<Pick<ITweet, "_id" | "media">>>(url);
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

// 📄 GET - Lấy tweet đã like
export const useGetTweetLiked = (queries?: IQuery<ITweet>) => {
  const normalizedQueries = queries ? JSON.stringify(queries) : "";

  return useQuery({
    queryKey: ["tweets/liked", normalizedQueries],
    queryFn: () => {
      // Tạo query string từ queries object
      const queryString = queries ? buildQueryString(queries) : "";
      const url = `/tweets/liked/${queryString ? `?${queryString}` : ""}`;

      return apiCall<ResMultiType<ITweet>>(url);
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

// 📄 GET - Lấy tweet đã like
export const useGetTweetBookmarked = (queries?: IQuery<ITweet>) => {
  const normalizedQueries = queries ? JSON.stringify(queries) : "";

  return useQuery({
    queryKey: ["tweets/bookmarked", normalizedQueries],
    queryFn: () => {
      // Tạo query string từ queries object
      const queryString = queries ? buildQueryString(queries) : "";
      const url = `/tweets/bookmarked/${queryString ? `?${queryString}` : ""}`;

      return apiCall<ResMultiType<ITweet>>(url);
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
