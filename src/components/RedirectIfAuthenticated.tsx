import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useUserStore } from "~/store/useUserStore";

export function RedirectIfAuthenticated({ children }: { children: ReactNode }) {
  const user = useUserStore((state) => state.user);

  if (user) {
    return <Navigate to="/home" replace />;
  }

  return children;
}
