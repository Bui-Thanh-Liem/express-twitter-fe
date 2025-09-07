import { useQuery } from "@tanstack/react-query";
import type { IQuery } from "~/shared/interfaces/common/query.interface";
import type { IMessage } from "~/shared/interfaces/schemas/message.interface";
import type { ResMultiType } from "~/shared/types/response.type";
import { buildQueryString } from "~/utils/buildQueryString";
import { apiCall } from "~/utils/callApi.util";

// 📄 GET
export const useGetMultiMessages = (
  conversation_id: string,
  queries?: IQuery<IMessage>
) => {
  const normalizedQueries = queries ? JSON.stringify(queries) : "";

  return useQuery({
    queryKey: ["messages", conversation_id, normalizedQueries],
    queryFn: () => {
      console.log("co lien tu goi api hay khong");

      // Tạo query string từ queries object
      const queryString = queries ? buildQueryString(queries) : "";
      const url = `/messages/${conversation_id}/${
        queryString ? `?${queryString}` : ""
      }`;
      return apiCall<ResMultiType<IMessage>>(url);
    },

    // Các options bổ sung
    enabled: !!conversation_id, // Chỉ chạy query khi có conversation_id
    staleTime: 10000, // ✅ QUAN TRỌNG: Tăng lên 10 giây để tránh refetch ngay lập tức
    refetchOnWindowFocus: false, // ✅ Tắt refetch khi focus để tránh ghi đè optimistic update
    refetchOnMount: false, // ✅ Tắt refetch khi mount

    // 🔥 THÊM CẤU HÌNH NÀY:
    refetchOnReconnect: false,
    refetchInterval: false,
    // Quan trọng: Đảm bảo không conflict với optimistic update
    networkMode: "online",
  });
};
