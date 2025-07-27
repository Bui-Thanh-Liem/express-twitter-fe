import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function StatusLoginOAuth() {
  const [params] = useSearchParams();
  let status = "";

  useEffect(() => {
    const access_token = params.get("access_token") || "";
    const refresh_token = params.get("refresh_token") || "";
    status = params.get("s") || "";

    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
  }, [status]);

  return <div>Login oauth page {status}</div>;
}
