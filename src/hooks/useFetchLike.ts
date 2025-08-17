import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { OkResponse } from "~/shared/classes/response.class";
import type { ResToggleLike } from "~/shared/dtos/res/like.dto";
import type { ITweet } from "~/shared/interfaces/schemas/tweet.interface";
import type { ResMultiType } from "~/shared/types/response.type";
import { apiCall } from "~/utils/callApi.util";

//
export const useLikeTweet = () => {
  // Lấy instance của React Query client để thao tác với cache
  const queryClient = useQueryClient();

  return useMutation({
    // Function thực hiện call API
    mutationFn: async (tweetId: string): Promise<OkResponse<ResToggleLike>> => {
      return apiCall<ResToggleLike>(`/likes/toggle/${tweetId}`, {
        method: "POST",
      });
    },

    // Chạy TRƯỚC khi gọi API
    onMutate: async (tweetId: string) => {
      // Hủy tất cả API calls đang pending liên quan đến feeds
      await queryClient.cancelQueries({
        queryKey: ["tweets/feeds"],
        exact: false,
      });

      // Lưu snapshot của tất cả feeds data hiện tại (dùng cho rollback)
      const previousData = queryClient.getQueriesData<
        OkResponse<ResMultiType<ITweet>>
      >({
        queryKey: ["tweets/feeds"],
        exact: false,
      });

      // Hàm cập nhật like trước khi gọi api
      const updateTweetInData = (
        old: OkResponse<ResMultiType<ITweet>> | undefined
      ) => {
        if (!old?.data?.items) return old;

        return {
          ...old,
          data: {
            ...old.data,
            items: old.data.items.map((tweet: ITweet) => {
              if (tweet._id === tweetId) {
                const isCurrentlyLiked = tweet.isLike ?? false;
                const currentCount = tweet.likes_count ?? 0;

                return {
                  ...tweet,
                  isLike: !isCurrentlyLiked,
                  likes_count: isCurrentlyLiked
                    ? Math.max(0, currentCount - 1)
                    : currentCount + 1,
                };
              }
              return tweet;
            }),
          },
        };
      };

      // Apply hàm trên
      queryClient.setQueriesData<OkResponse<ResMultiType<ITweet>>>(
        { queryKey: ["tweets/feeds"], exact: false },
        (old) => {
          console.log("old:::", old);
          return updateTweetInData(old);
        }
      );
      

      // Tương tự trên thực hiện cập nhật cache trước khi gọi api (cho Details)
      queryClient.setQueryData<OkResponse<ITweet>>(
        ["tweet", tweetId],
        (old) => {
          if (!old?.data) return old;

          const isCurrentlyLiked = old.data.isLike ?? false;
          const currentCount = old.data.likes_count ?? 0;

          return {
            ...old,
            data: {
              ...old.data,
              isLike: !isCurrentlyLiked,
              likes_count: isCurrentlyLiked
                ? Math.max(0, currentCount - 1)
                : currentCount + 1,
            },
          };
        }
      );

      // Return Context cho các phase tiếp theo
      return { previousData, tweetId }; // => trong context error
    },

    // Chạy SAU khi gọi api (thất bại)
    onError: (err, tweetId, context) => {
      // Rollback khi API thất bại
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      // để force refetch từ server
      queryClient.invalidateQueries({
        queryKey: ["tweet", tweetId],
      });
    },

    // Chạy SAU khi gọi api (thành công)
    onSuccess: (result, tweetId) => {
      // Cập nhật kết quả chính xác từ api trả về
      const syncTweetInData = (
        old: OkResponse<ResMultiType<ITweet>> | undefined
      ) => {
        if (!old?.data?.items) return old;

        return {
          ...old,
          data: {
            ...old.data,
            items: old.data.items.map((tweet: ITweet) => {
              if (tweet._id === tweetId) {
                return {
                  ...tweet,
                  isLike: result.data?.status === "Like",
                  likes_count: result.data?.likes_count ?? tweet.likes_count,
                };
              }
              return tweet;
            }),
          },
        };
      };

      // Apply hàm trên
      queryClient.setQueriesData<OkResponse<ResMultiType<ITweet>>>(
        { queryKey: ["tweets/feeds"], exact: false },
        syncTweetInData
      );

      // Apply Sync cho Detail Tweet
      queryClient.setQueryData<OkResponse<ITweet>>(
        ["tweet", tweetId],
        (old) => {
          if (!old?.data) return old;

          return {
            ...old,
            data: {
              ...old.data,
              isLike: result.data?.status === "Like",
              likes_count: result.data?.likes_count ?? old.data.likes_count,
            },
          };
        }
      );
    },
  });
};
