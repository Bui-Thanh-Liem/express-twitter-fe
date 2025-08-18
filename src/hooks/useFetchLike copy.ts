import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { OkResponse } from "~/shared/classes/response.class";
import type { ResToggleLike } from "~/shared/dtos/res/like.dto";
import type { ITweet } from "~/shared/interfaces/schemas/tweet.interface";
import type { ResMultiType } from "~/shared/types/response.type";
import { apiCall } from "~/utils/callApi.util";

export const useLikeTweet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tweetId: string): Promise<OkResponse<ResToggleLike>> => {
      return apiCall<ResToggleLike>(`/likes/toggle/${tweetId}`, {
        method: "POST",
      });
    },

    onMutate: async (tweetId: string) => {
      // 🔥 FIX 1: Cancel ALL queries có chứa tweet này
      await queryClient.cancelQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          // Cancel feeds queries và single tweet query
          return (
            Array.isArray(queryKey) &&
            (queryKey[0] === "tweets/feeds" ||
              (queryKey[0] === "tweet" && queryKey[1] === tweetId))
          );
        },
      });

      // Lưu snapshot của ALL data có thể bị ảnh hưởng
      const previousFeedsData = queryClient.getQueriesData<
        OkResponse<ResMultiType<ITweet>>
      >({
        queryKey: ["tweets/feeds"],
        exact: false,
      });

      const previousTweetData = queryClient.getQueryData<OkResponse<ITweet>>([
        "tweet",
        tweetId,
      ]);

      // 🔥 FIX 2: Hàm update chính xác hơn
      const updateTweetInFeedsData = (
        old: OkResponse<ResMultiType<ITweet>> | undefined
      ) => {
        if (!old?.data?.items) return old;

        const updatedItems = old.data.items.map((tweet: ITweet) => {
          if (tweet._id === tweetId) {
            const isCurrentlyLiked = Boolean(tweet.isLike);
            const currentCount = Number(tweet.likes_count || 0);

            return {
              ...tweet,
              isLike: !isCurrentlyLiked,
              likes_count: isCurrentlyLiked
                ? Math.max(0, currentCount - 1)
                : currentCount + 1,
            };
          }
          return tweet;
        });

        return {
          ...old,
          data: {
            ...old.data,
            items: updatedItems,
          },
        };
      };

      // 🔥 FIX 3: Update TẤT CẢ feeds queries (không chỉ exact match)
      const feedsQueries = queryClient.getQueriesData({
        queryKey: ["tweets/feeds"],
        exact: false,
      });

      feedsQueries.forEach(([queryKey]) => {
        queryClient.setQueryData(queryKey, updateTweetInFeedsData);
      });

      // Update single tweet query
      if (previousTweetData) {
        queryClient.setQueryData<OkResponse<ITweet>>(
          ["tweet", tweetId],
          (old) => {
            if (!old?.data) return old;

            const isCurrentlyLiked = Boolean(old.data.isLike);
            const currentCount = Number(old.data.likes_count || 0);

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
      }

      return { previousFeedsData, previousTweetData, tweetId };
    },

    onError: (err, tweetId, context) => {
      console.error("Like tweet failed:", err);

      // 🔥 FIX 4: Rollback chính xác hơn
      if (context?.previousFeedsData) {
        context.previousFeedsData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      if (context?.previousTweetData) {
        queryClient.setQueryData(["tweet", tweetId], context.previousTweetData);
      }

      // 🔥 FIX 5: Invalidate để force refetch từ server
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          return (
            Array.isArray(queryKey) &&
            (queryKey[0] === "tweets/feeds" ||
              (queryKey[0] === "tweet" && queryKey[1] === tweetId))
          );
        },
      });
    },

    onSuccess: (result, tweetId) => {
      // 🔥 FIX 6: Sync data chính xác từ server response
      const syncTweetInFeedsData = (
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

      // Sync TẤT CẢ feeds queries
      const feedsQueries = queryClient.getQueriesData({
        queryKey: ["tweets/feeds"],
        exact: false,
      });

      feedsQueries.forEach(([queryKey]) => {
        queryClient.setQueryData(queryKey, syncTweetInFeedsData);
      });

      // Sync single tweet
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

      // 🔥 FIX 7: Optional - có thể bỏ comment nếu muốn đảm bảo data fresh
      // queryClient.invalidateQueries({
      //   queryKey: ["tweets/feeds"],
      //   exact: false,
      // });
    },
  });
};
