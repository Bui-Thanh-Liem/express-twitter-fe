import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateConversationDto } from "~/shared/dtos/req/conversation.dto";
import type { IConversation } from "~/shared/interfaces/schemas/conversation.interface";
import { apiCall } from "~/utils/callApi.util";

//
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
