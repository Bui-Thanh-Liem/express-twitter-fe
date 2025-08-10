import { useQuery } from "@tanstack/react-query";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";
import { apiCall } from "~/utils/callApi.util";

// 🚪 GET - Get User By username
export const useGetOneByUsername = (username: string, enabled = true) => {
  return useQuery({
    queryKey: ["users", username],
    queryFn: () => apiCall<IUser>(`/users/username/${username}`),
    enabled: enabled && !!username,
  });
};
