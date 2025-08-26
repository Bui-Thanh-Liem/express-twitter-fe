import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { verifyEmailDto } from "~/shared/dtos/req/user.dto";
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

// 🔐 POST - Verify email
export const useVerifyEmail = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: verifyEmailDto) =>
      apiCall<IUser>("/users/verify-email", {
        method: "POST",
        body: JSON.stringify(credentials),
      }),
    onSuccess: (res) => {
      if (res.statusCode === 200) {
        logger.info("useVerifyEmail - res :::", res);

        //
        navigate("/home");
      }
    },
  });
};

// 🔐 POST - Resend verify email
export const useResendVerifyEmail = () => {
  return useMutation({
    mutationFn: () =>
      apiCall<boolean>("/users/resend-verify-email", {
        method: "POST",
      }),
    onSuccess: (res) => {
      if (res.statusCode === 200) {
        logger.info("useResendVerifyEmail - res :::", res);
      }
    },
  });
};
