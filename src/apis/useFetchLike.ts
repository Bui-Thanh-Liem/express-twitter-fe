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
      // ✅ Cancel tất cả queries liên quan
      await queryClient.cancelQueries({
        queryKey: ["tweets", "feeds"],
        exact: false,
      });

      // ✅ Snapshot TẤT CẢ queries có chứa feeds
      const previousFeedsData = queryClient.getQueriesData<
        OkResponse<ResMultiType<ITweet>>
      >({
        queryKey: ["tweets", "feeds"],
        exact: false,
      });

      const previousDetailData = queryClient.getQueryData<OkResponse<ITweet>>([
        "tweet",
        tweetId,
      ]);

      // ✅ QUAN TRỌNG: Update function sẽ tìm và update tweet ở BẤT KỲ page nào
      const updateTweetInFeeds = (
        old: OkResponse<ResMultiType<ITweet>> | undefined
      ) => {
        if (!old?.data?.items) return old;

        // Tìm tweet trong page này
        const tweetIndex = old.data.items.findIndex(
          (tweet) => tweet._id === tweetId
        );

        if (tweetIndex === -1) {
          // Tweet không có trong page này → return nguyên vẹn
          return old;
        }

        // Tweet có trong page này → update
        return {
          ...old,
          data: {
            ...old.data,
            items: old.data.items.map((tweet: ITweet) => {
              if (tweet._id === tweetId) {
                const isCurrentlyLiked = tweet.is_like ?? false;
                const currentCount = tweet.likes_count ?? 0;

                return {
                  ...tweet,
                  is_like: !isCurrentlyLiked,
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

      // ✅ Apply cho TẤT CẢ feeds pages
      queryClient.setQueriesData<OkResponse<ResMultiType<ITweet>>>(
        { queryKey: ["tweets", "feeds"], exact: false },
        updateTweetInFeeds
      );

      // ✅ Update profile tweets nếu có
      queryClient.setQueriesData<OkResponse<ResMultiType<ITweet>>>(
        { queryKey: ["tweets", "profile"], exact: false },
        updateTweetInFeeds
      );

      // ✅ Update tweet children nếu có
      queryClient.setQueriesData<OkResponse<ResMultiType<ITweet>>>(
        { queryKey: ["tweets", "children"], exact: false },
        updateTweetInFeeds
      );

      // ✅ Update detail
      queryClient.setQueryData<OkResponse<ITweet>>(
        ["tweet", tweetId],
        (old) => {
          if (!old?.data) return old;

          const isCurrentlyLiked = old.data.is_like ?? false;
          const currentCount = old.data.likes_count ?? 0;

          return {
            ...old,
            data: {
              ...old.data,
              is_like: !isCurrentlyLiked,
              likes_count: isCurrentlyLiked
                ? Math.max(0, currentCount - 1)
                : currentCount + 1,
            },
          };
        }
      );

      // ✅ Update liked list
      queryClient.setQueriesData<OkResponse<ResMultiType<ITweet>>>(
        { queryKey: ["tweets", "liked"], exact: false },
        (old) => {
          if (!old?.data?.items) return old;

          const tweetIndex = old.data.items.findIndex(
            (tweet) => tweet._id === tweetId
          );

          if (tweetIndex !== -1) {
            // Remove từ liked list khi unlike
            return {
              ...old,
              data: {
                ...old.data,
                items: old.data.items.filter((tweet) => tweet._id !== tweetId),
                total: Math.max(0, old.data.total - 1),
              },
            };
          }

          return old;
        }
      );

      return { previousFeedsData, previousDetailData, tweetId };
    },

    onError: (err, tweetId, context) => {
      // ✅ Rollback TẤT CẢ changes
      if (context?.previousFeedsData) {
        context.previousFeedsData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      if (context?.previousDetailData) {
        queryClient.setQueryData(
          ["tweet", tweetId],
          context.previousDetailData
        );
      }

      // Force refetch để đảm bảo consistency
      queryClient.invalidateQueries({
        queryKey: ["tweets"],
      });

      console.error("Like failed:", err);
    },

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSuccess: (result, tweetId) => {
      const isNowLiked = result.data?.status === "Like";
      const newLikesCount = result.data?.likes_count;

      // ✅ Sync từ server cho TẤT CẢ pages
      const syncTweetInFeeds = (
        old: OkResponse<ResMultiType<ITweet>> | undefined
      ) => {
        if (!old?.data?.items) return old;

        const tweetIndex = old.data.items.findIndex(
          (tweet) => tweet._id === tweetId
        );

        if (tweetIndex === -1) return old;

        return {
          ...old,
          data: {
            ...old.data,
            items: old.data.items.map((tweet: ITweet) => {
              if (tweet._id === tweetId) {
                return {
                  ...tweet,
                  is_like: isNowLiked,
                  likes_count: newLikesCount ?? tweet.likes_count,
                };
              }
              return tweet;
            }),
          },
        };
      };

      // Apply sync cho tất cả
      queryClient.setQueriesData<OkResponse<ResMultiType<ITweet>>>(
        { queryKey: ["tweets", "feeds"], exact: false },
        syncTweetInFeeds
      );

      queryClient.setQueriesData<OkResponse<ResMultiType<ITweet>>>(
        { queryKey: ["tweets", "profile"], exact: false },
        syncTweetInFeeds
      );

      queryClient.setQueriesData<OkResponse<ResMultiType<ITweet>>>(
        { queryKey: ["tweets", "children"], exact: false },
        syncTweetInFeeds
      );

      // Sync detail
      queryClient.setQueryData<OkResponse<ITweet>>(
        ["tweet", tweetId],
        (old) => {
          if (!old?.data) return old;

          return {
            ...old,
            data: {
              ...old.data,
              is_like: isNowLiked,
              likes_count: newLikesCount ?? old.data.likes_count,
            },
          };
        }
      );

      // Invalidate liked list nếu cần
      if (isNowLiked) {
        queryClient.invalidateQueries({
          queryKey: ["tweets", "liked"],
        });
      }
    },
  });
};
