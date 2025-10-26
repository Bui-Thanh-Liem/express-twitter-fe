import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CreateCommunityDto,
  InvitationMembersDto,
  JoinLeaveCommunityDto,
  PinCommunityDto,
} from "~/shared/dtos/req/community.dto";
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

// ➕ POST
export const useInviteCommunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: InvitationMembersDto) =>
      apiCall<ICommunity>("/communities/invite-members", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      // Invalidate danh sách communities
      queryClient.invalidateQueries({ queryKey: ["communities"] });
    },
  });
};

// ➕ POST
export const useJoinCommunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: JoinLeaveCommunityDto) =>
      apiCall<boolean>(`/communities/join/${payload.community_id}`, {
        method: "POST",
      }),
    onSuccess: () => {
      // Invalidate danh sách communities
      queryClient.invalidateQueries({ queryKey: ["communities", "community"] });
    },
  });
};

// ➕ POST
export const useLeaveCommunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: JoinLeaveCommunityDto) =>
      apiCall<boolean>(`/communities/leave/${payload.community_id}`, {
        method: "POST",
      }),
    onSuccess: () => {
      // Invalidate danh sách communities
      queryClient.invalidateQueries({ queryKey: ["communities", "community"] });
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

// 🚪 GET - Get bare Community By slug
export const useGetOneCommunityBySlug = (slug: string, enabled = true) => {
  return useQuery({
    queryKey: ["community", slug],
    queryFn: () => apiCall<ICommunity>(`/communities/slug/${slug}`),
    enabled: enabled && !!slug,
  });
};

// 🚪 GET - Get members mentors Community By id
export const useGetMMCommunityById = (
  id: string,
  queries: IQuery<ICommunity>,
  enabled = true
) => {
  const normalizedQueries = queries ? JSON.stringify(queries) : "";
  const queryString = queries ? buildQueryString(queries) : "";

  return useQuery({
    queryKey: ["community", id, queries.q, normalizedQueries],
    queryFn: () =>
      apiCall<ICommunity>(
        `/communities/mm/${id}${queryString ? `?${queryString}` : ""}`
      ),
    enabled: enabled && !!id,
  });
};

// 📄 GET
export const useGetMultiCommunitiesOwner = (queries?: IQuery<ICommunity>) => {
  const normalizedQueries = queries ? JSON.stringify(queries) : "";

  return useQuery({
    queryKey: [
      "communities",
      "owner",
      queries?.q,
      queries?.qe,
      normalizedQueries,
    ],
    queryFn: () => {
      // Tạo query string từ queries object
      const queryString = queries ? buildQueryString(queries) : "";
      const url = `/communities/owner/${queryString ? `?${queryString}` : ""}`;
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

// 📄 GET
export const useGetMultiCommunitiesJoined = (queries?: IQuery<ICommunity>) => {
  const normalizedQueries = queries ? JSON.stringify(queries) : "";

  return useQuery({
    queryKey: [
      "communities",
      "joined",
      queries?.q,
      queries?.qe,
      normalizedQueries,
    ],
    queryFn: () => {
      // Tạo query string từ queries object
      const queryString = queries ? buildQueryString(queries) : "";
      const url = `/communities/joined/${queryString ? `?${queryString}` : ""}`;
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

// ➕ PATCH
export const useTogglePinCommunity = () => {
  return useMutation({
    mutationFn: (payload: PinCommunityDto) =>
      apiCall<ICommunity>(`/communities/toggle-pin/${payload.community_id}`, {
        method: "PATCH",
      }),
    onSuccess: () => {},
  });
};
