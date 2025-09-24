import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RedirectIfAuthenticated } from "./components/redirectIf-authenticated";
import { RedirectIfNotAuthenticated } from "./components/redirectIf-not-authenticated";
import { HomeLayout } from "./layouts/home-layout/HomeLayout";
import RootLayout from "./layouts/root-layout/RootLayout";
import { AuthPage } from "./pages/auth/AuthPage";
import { VerifyEmail } from "./pages/auth/VerifyEmail";
import { BookmarkPage } from "./pages/bookmark/BookmarkPage";
import { ExplorePage } from "./pages/explore/ExplorePage";
import { HomePage } from "./pages/home/HomePage";
import { MessagePage } from "./pages/messages/MessagePage";
import { ProfilePage } from "./pages/profile/ProfilePage";

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
          { path: "bookmarks", element: <BookmarkPage /> },
          { path: "explore", element: <ExplorePage /> },
          { path: "messages", element: <MessagePage /> },
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
      {/*  */}
      <RouterProvider router={router} />

      {/* Dev tools chỉ hiện trong development */}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
