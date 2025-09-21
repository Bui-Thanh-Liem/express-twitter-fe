import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useVerifyEmail } from "~/hooks/useFetchUser";
import { handleResponse } from "~/utils/handleResponse";

export function VerifyEmail() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const apiVerifyEmail = useVerifyEmail();

  useEffect(() => {
    if (token) {
      (async () => {
        const res = await apiVerifyEmail.mutateAsync({
          email_verify_token: token,
        });
        console.log("VerifyEmail - res:::", res);
        handleResponse(res);
      })();
    }
  }, []);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    </div>
  );
}
