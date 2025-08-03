import {
  useMutation,
  useQuery,
  useQueryClient
} from "@tanstack/react-query";
import type { CreateTweetDto } from "~/shared/dtos/req/tweet.dto";
import type { ResCreateTweet } from "~/shared/dtos/res/tweet.dto";
import { apiCall } from "~/utils/callApi.util";

// ➕ POST - Tạo tweet mới
export const useCreateTweet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productData: CreateTweetDto) =>
      apiCall<ResCreateTweet>("/tweets", {
        method: "POST",
        body: JSON.stringify(productData),
      }),
    onSuccess: () => {
      // Invalidate danh sách products
      queryClient.invalidateQueries({ queryKey: ["tweets"] });
    },
  });
};

// 📄 GET - Lấy chi tiết 1 tweet
export const useGetDetailTweet = (id: string | number, enabled = true) => {
  return useQuery({
    queryKey: ["tweets", id],
    queryFn: () => apiCall(`/tweets/${id}`),
    enabled: enabled && !!id,
  });
};
