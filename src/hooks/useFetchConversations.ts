import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  AddParticipantsBodyDto,
  CreateConversationDto,
  DeleteConversationDto,
  ReadConversationDto,
} from "~/shared/dtos/req/conversation.dto";
import type { IQuery } from "~/shared/interfaces/common/query.interface";
import type { IConversation } from "~/shared/interfaces/schemas/conversation.interface";
import type { ResMultiType } from "~/shared/types/response.type";
import { buildQueryString } from "~/utils/buildQueryString";
import { apiCall } from "~/utils/callApi.util";

// ➕ POST
export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateConversationDto) =>
      apiCall<IConversation>("/conversations", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      // Invalidate danh sách conversations
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};

// ➕ POST
export const useAddParticipants = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      conv_id,
      payload,
    }: {
      conv_id: string;
      payload: AddParticipantsBodyDto;
    }) =>
      apiCall<IConversation>(`/conversations/add-participants/${conv_id}`, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      // Invalidate danh sách conversations
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};

// ➕ PATCH
export const useReadConversation = () => {
  return useMutation({
    mutationFn: (payload: ReadConversationDto) =>
      apiCall<IConversation>(`/conversations/read/${payload.conversation_id}`, {
        method: "PATCH",
      }),
    onSuccess: () => {},
  });
};

// ➕ PATCH
export const useTogglePinConversation = () => {
  return useMutation({
    mutationFn: (payload: ReadConversationDto) =>
      apiCall<IConversation>(
        `/conversations/toggle-pin/${payload.conversation_id}`,
        {
          method: "PATCH",
        }
      ),
    onSuccess: () => {},
  });
};

// ➕ DELETE
export const useDeleteConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DeleteConversationDto) =>
      apiCall<IConversation>(`/conversations/${payload.conversation_id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      // Invalidate danh sách conversations
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};

// 📄 GET
export const useGetMultiConversations = (queries?: IQuery<IConversation>) => {
  const normalizedQueries = queries ? JSON.stringify(queries) : "";

  return useQuery({
    queryKey: ["conversations", queries?.q, normalizedQueries],
    queryFn: () => {
      // Tạo query string từ queries object
      const queryString = queries ? buildQueryString(queries) : "";
      const url = `/conversations/${queryString ? `?${queryString}` : ""}`;
      return apiCall<ResMultiType<IConversation>>(url);
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
