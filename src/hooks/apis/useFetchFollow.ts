import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { OkResponse } from "~/shared/classes/response.class";
import type { ResToggleFollow } from "~/shared/dtos/res/follow.dto";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import { apiCall } from "~/utils/callApi.util";

//
export const useFollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // Function thực hiện call API
    mutationFn: async ({
      user_id,
    }: {
      user_id: string;
      username: string; // dùng để cập nhật lại cache của @tanstack/react-query
    }): Promise<OkResponse<ResToggleFollow>> => {
      return apiCall<ResToggleFollow>(`/follows/toggle/${user_id}`, {
        method: "POST",
      });
    },

    // Chạy SAU khi gọi api (thành công)
    onSuccess: (result, { username }) => {
      const isFollow = result.data?.status === "Follow";

      queryClient.setQueryData<OkResponse<IUser>>(
        ["user", username],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: {
              ...oldData.data,
              isFollow,
              follower_count:
                (oldData?.data?.follower_count || 0) + (isFollow ? 1 : -1),
            } as IUser,
          };
        }
      );
    },
  });
};
