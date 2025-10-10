import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { OkResponse } from "~/shared/classes/response.class";
import type { ResToggleLike } from "~/shared/dtos/res/like.dto";
import type { ITweet } from "~/shared/interfaces/schemas/tweet.interface";
import type { ResMultiType } from "~/shared/types/response.type";
import { apiCall } from "~/utils/callApi.util";

//
// export const useLikeTweet = () => {
//   // Lấy instance của React Query client để thao tác với cache
//   const queryClient = useQueryClient();

//   return useMutation({
//     // Function thực hiện call API
//     mutationFn: async (tweetId: string): Promise<OkResponse<ResToggleLike>> => {
//       return apiCall<ResToggleLike>(`/likes/toggle/${tweetId}`, {
//         method: "POST",
//       });
//     },

//     // Chạy TRƯỚC khi gọi API
//     onMutate: async (tweetId: string) => {
//       // Hủy tất cả API calls đang pending liên quan đến feeds
//       await queryClient.cancelQueries({
//         queryKey: ["tweets", "feeds"],
//         exact: false,
//       });

//       // Lưu snapshot của tất cả feeds data hiện tại (dùng cho rollback)
//       const previousFeedsData = queryClient.getQueriesData<
//         OkResponse<ResMultiType<ITweet>>
//       >({
//         queryKey: ["tweets", "feeds"],
//         exact: false,
//       });

//       // Snapshot tweet detail nếu có
//       const previousDetailData = queryClient.getQueryData<OkResponse<ITweet>>([
//         "tweet",
//         tweetId,
//       ]);

//       // Hàm cập nhật like trước khi gọi api
//       const updateTweetInFeeds = (
//         old: OkResponse<ResMultiType<ITweet>> | undefined
//       ) => {
//         if (!old?.data?.items) return old;

//         return {
//           ...old,
//           data: {
//             ...old.data,
//             items: old.data.items.map((tweet: ITweet) => {
//               if (tweet._id === tweetId) {
//                 const isCurrentlyLiked = tweet.isLike ?? false;
//                 const currentCount = tweet.likes_count ?? 0;

//                 return {
//                   ...tweet,
//                   isLike: !isCurrentlyLiked,
//                   likes_count: isCurrentlyLiked
//                     ? Math.max(0, currentCount - 1)
//                     : currentCount + 1,
//                 };
//               }
//               return tweet;
//             }),
//           },
//         };
//       };

//       // Apply hàm trên
//       queryClient.setQueriesData<OkResponse<ResMultiType<ITweet>>>(
//         { queryKey: ["tweets/feeds"], exact: false },
//         updateTweetInFeeds
//       );

//       // Tương tự trên thực hiện cập nhật cache trước khi gọi api (cho Details)
//       queryClient.setQueryData<OkResponse<ITweet>>(
//         ["tweet", tweetId],
//         (old) => {
//           if (!old?.data) return old;

//           const isCurrentlyLiked = old.data.isLike ?? false;
//           const currentCount = old.data.likes_count ?? 0;

//           return {
//             ...old,
//             data: {
//               ...old.data,
//               isLike: !isCurrentlyLiked,
//               likes_count: isCurrentlyLiked
//                 ? Math.max(0, currentCount - 1)
//                 : currentCount + 1,
//             },
//           };
//         }
//       );

//       // ✅ THÊM: Update bookmarked list nếu user đang xem
//       queryClient.setQueriesData<OkResponse<ResMultiType<ITweet>>>(
//         { queryKey: ["tweets", "liked"], exact: false },
//         (old) => {
//           if (!old?.data?.items) return old;

//           const currentlyBookmarked = old.data.items.some(
//             (tweet) => tweet._id === tweetId
//           );

//           if (currentlyBookmarked) {
//             // Remove từ bookmarked list
//             return {
//               ...old,
//               data: {
//                 ...old.data,
//                 items: old.data.items.filter((tweet) => tweet._id !== tweetId),
//                 total: Math.max(0, old.data.total - 1),
//                 total_page: Math.ceil(
//                   Math.max(0, old.data.total - 1) /
//                     (old.data.items.length || 10)
//                 ),
//               },
//             };
//           }

//           return old; // Không thêm vào bookmarked list (cần full tweet data)
//         }
//       );

//       // Return Context cho các phase tiếp theo
//       return { previousFeedsData, previousDetailData, tweetId }; // => trong context error
//     },

//     // Chạy SAU khi gọi api (thất bại)
//     onError: (err, tweetId, context) => {
//       // ✅ Rollback feeds
//       if (context?.previousFeedsData) {
//         context.previousFeedsData.forEach(([queryKey, data]) => {
//           queryClient.setQueryData(queryKey, data);
//         });
//       }

//       // ✅ Rollback detail
//       if (context?.previousDetailData) {
//         queryClient.setQueryData(
//           ["tweet", tweetId],
//           context.previousDetailData
//         );
//       }

//       // ✅ Invalidate liked list để refetch
//       queryClient.invalidateQueries({
//         queryKey: ["tweets", "liked"],
//       });

//       console.error("Like failed:", err);
//     },

//     // Chạy SAU khi gọi api (thành công)
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     onSuccess: (result, tweetId, context) => {
//       const isNowLiked = result.data?.status === "Like";
//       const newLikesCount = result.data?.likes_count;

//       // ✅ Sync chính xác từ server response
//       const syncTweetInFeeds = (
//         old: OkResponse<ResMultiType<ITweet>> | undefined
//       ) => {
//         if (!old?.data?.items) return old;

//         return {
//           ...old,
//           data: {
//             ...old.data,
//             items: old.data.items.map((tweet: ITweet) => {
//               if (tweet._id === tweetId) {
//                 return {
//                   ...tweet,
//                   isLike: isNowLiked,
//                   likes_count: newLikesCount ?? tweet.likes_count,
//                 };
//               }
//               return tweet;
//             }),
//           },
//         };
//       };

//       // Apply sync cho feeds
//       queryClient.setQueriesData<OkResponse<ResMultiType<ITweet>>>(
//         { queryKey: ["tweets", "feeds"], exact: false },
//         syncTweetInFeeds
//       );

//       // Apply sync cho detail
//       queryClient.setQueryData<OkResponse<ITweet>>(
//         ["tweet", tweetId],
//         (old) => {
//           if (!old?.data) return old;

//           return {
//             ...old,
//             data: {
//               ...old.data,
//               isLike: isNowLiked,
//               likes_count: newLikesCount ?? old.data.likes_count,
//             },
//           };
//         }
//       );

//       // ✅ QUAN TRỌNG: Invalidate liked list để refetch fresh data
//       if (isNowLiked) {
//         // Nếu like → cần fresh data cho liked list
//         queryClient.invalidateQueries({
//           queryKey: ["tweets", "liked"],
//         });
//       }
//     },

//     onSettled: () => {
//       // ✅ Optional: Có thể thêm toast notification
//       // toast.success("Like updated!");
//     },
//   });
// };

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
                  isLike: isNowLiked,
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
              isLike: isNowLiked,
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
