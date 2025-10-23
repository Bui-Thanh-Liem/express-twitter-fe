import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateCommunityDto } from "~/shared/dtos/req/community.dto";
import type { IQuery } from "~/shared/interfaces/common/query.interface";
import type { ICommunity } from "~/shared/interfaces/schemas/community.interface";
import type { ResMultiType } from "~/shared/types/response.type";
import { buildQueryString } from "~/utils/buildQueryString";
import { apiCall } from "~/utils/callApi.util";

// ➕ POST
export const useCreateCommunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCommunityDto) =>
      apiCall<ICommunity>("/communities", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      // Invalidate danh sách communities
      queryClient.invalidateQueries({ queryKey: ["communities"] });
    },
  });
};

// 📄 GET
export const useGetAllCategories = () => {
  return useQuery({
    queryKey: ["communities", "categories"],
    queryFn: () => {
      const url = `/communities/categories`;
      return apiCall<string[]>(url);
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

// 🚪 GET - Get Community By slug
export const useGetOneCommunityBySlug = (slug: string, enabled = true) => {
  return useQuery({
    queryKey: ["community", slug],
    queryFn: () => apiCall<ICommunity>(`/communities/slug/${slug}`),
    enabled: enabled && !!slug,
  });
};

// 📄 GET
export const useGetMultiCommunities = (queries?: IQuery<ICommunity>) => {
  const normalizedQueries = queries ? JSON.stringify(queries) : "";

  return useQuery({
    queryKey: ["communities", queries?.q, queries?.qe, normalizedQueries],
    queryFn: () => {
      // Tạo query string từ queries object
      const queryString = queries ? buildQueryString(queries) : "";
      const url = `/communities/${queryString ? `?${queryString}` : ""}`;
      return apiCall<ResMultiType<ICommunity>>(url);
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
