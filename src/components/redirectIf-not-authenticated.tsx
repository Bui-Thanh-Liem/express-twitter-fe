import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useUserStore } from "~/store/useUserStore";

export function RedirectIfNotAuthenticated({
  children,
}: {
  children: ReactNode;
}) {
  const user = useUserStore((state) => state.user);

  console.log("RedirectIfNotAuthenticated - user :::", user);
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
}
