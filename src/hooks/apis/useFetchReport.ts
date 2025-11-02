import { useMutation } from "@tanstack/react-query";
import { apiCall } from "~/utils/callApi.util";

// ❌ POST - Báo cáo tweet
export const useReportTweet = () => {
  return useMutation({
    mutationFn: (tweet_id: string) =>
      apiCall<boolean>(`/report-tweet/${tweet_id}`, {
        method: "POST",
      }),
  });
};
