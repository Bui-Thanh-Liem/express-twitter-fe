import { useQuery } from "@tanstack/react-query";
import type { ResSearchPending } from "~/shared/dtos/res/search.dto";
import type { IQuery } from "~/shared/interfaces/common/query.interface";
import type { ITrending } from "~/shared/interfaces/schemas/trending.interface";
import type { ITweet } from "~/shared/interfaces/schemas/tweet.interface";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import type { ResMultiType } from "~/shared/types/response.type";
import { buildQueryString } from "~/utils/buildQueryString";
import { apiCall } from "~/utils/callApi.util";

// 📄 GET - dùng trong gợi ý khi gõ trong input search
export const useSearchPending = (
  queries?: IQuery<ITrending>,
  enabled = true
) => {
  const normalizedQueries = queries ? JSON.stringify(queries) : "";

  return useQuery({
    queryKey: ["search", "pending", normalizedQueries],
    queryFn: () => {
      // Tạo query string từ queries object
      const queryString = queries ? buildQueryString(queries) : "";
      const url = `/search/pending/${queryString ? `?${queryString}` : ""}`;
      return apiCall<ResSearchPending>(url);
    },

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

// 📄 GET
export const useSearchTweets = (queries?: IQuery<ITweet>) => {
  const normalizedQueries = queries ? JSON.stringify(queries) : "";

  return useQuery({
    queryKey: [
      "search",
      "tweets",
      queries?.q,
      queries?.pf,
      queries?.f,
      normalizedQueries,
    ],
    queryFn: () => {
      // Tạo query string từ queries object
      const queryString = queries ? buildQueryString(queries) : "";
      const url = `/search/tweets/${queryString ? `?${queryString}` : ""}`;
      return apiCall<ResMultiType<ITweet>>(url);
    },

    // Lên getNewFeeds đọc giải thích
    enabled: !!queries?.q,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
    refetchOnReconnect: false,
    refetchInterval: false,
    networkMode: "online",
  });
};

// 📄 GET
export const useSearchUsers = (queries?: IQuery<IUser>) => {
  const normalizedQueries = queries ? JSON.stringify(queries) : "";

  return useQuery({
    queryKey: ["search", "users", queries?.q, queries?.pf, normalizedQueries],
    queryFn: () => {
      // Tạo query string từ queries object
      const queryString = queries ? buildQueryString(queries) : "";
      const url = `/search/users${queryString ? `?${queryString}` : ""}`;
      return apiCall<ResMultiType<IUser>>(url);
    },

    // Lên getNewFeeds đọc giải thích
    enabled: !!queries?.q,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
    refetchOnReconnect: false,
    refetchInterval: false,
    networkMode: "online",
  });
};
