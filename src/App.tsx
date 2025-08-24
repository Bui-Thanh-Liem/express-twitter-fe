import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RedirectIfAuthenticated } from "./components/redirectIf-authenticated";
import { RedirectIfNotAuthenticated } from "./components/redirectIf-not-authenticated";
import { AuthPage } from "./layouts/AuthPage";
import { VerifyEmail } from "./layouts/VerifyEmail";
import { HomeLayout } from "./layouts/home-layout/HomeLayout";
import RootLayout from "./layouts/root-layout/RootLayout";
import { ExplorePage } from "./pages/explore/Explore";
import { HomePage } from "./pages/home/HomePage";
import MessagesPage from "./pages/messages/Messages";
import { ProfilePage } from "./pages/profile/Profile";

// Router config
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <RedirectIfAuthenticated>
            <AuthPage />
          </RedirectIfAuthenticated>
        ),
      },
      { path: "verify", element: <VerifyEmail /> },

      // ✅ Bọc các route cần HomeLayout ở đây
      {
        element: (
          <RedirectIfNotAuthenticated>
            <HomeLayout />
          </RedirectIfNotAuthenticated>
        ),
        children: [
          { path: "home", element: <HomePage /> },
          { path: "explore", element: <ExplorePage /> },
          { path: "messages", element: <MessagesPage /> },
          { path: ":username", element: <ProfilePage /> },
        ],
      },
    ],
  },
]);

// Tạo Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Retry 1 lần nếu fail
      refetchOnWindowFocus: false, // Không refetch khi focus lại window
      staleTime: 5 * 60 * 1000, // Data được coi là fresh trong 5 phút
    },
    mutations: {
      retry: 0, // Không retry mutations
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      {/* Dev tools chỉ hiện trong development */}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
