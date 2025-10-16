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
import { NotificationPage } from "./pages/notification/NotificationPage";
import { ProfilePage } from "./pages/profile/ProfilePage";
import { SearchPage } from "./pages/search/SearchPage";
import { TweetDetailPage } from "./pages/tweet-detail/TweetDetailPage";
import { TrendingPage } from "./pages/trending/TrendingPage";
import { CommunityPage } from "./pages/community/CommunityPage";

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
          { path: "notifications", element: <NotificationPage /> },
          { path: "messages", element: <MessagePage /> },
          { path: "search", element: <SearchPage /> },
          { path: "communities", element: <CommunityPage /> },
          { path: "trending", element: <TrendingPage /> },
          { path: "tweet/:tweet_id", element: <TweetDetailPage /> },
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
  // useEffect(() => {
  //   const handleVisibility = () => {
  //     if (document.hidden) {
  //       socket.disconnect(); // user rời tab
  //     } else {
  //       socket.connect(); // user quay lại tab
  //     }
  //   };

  //   document.addEventListener("visibilitychange", handleVisibility);

  //   return () => {
  //     document.removeEventListener("visibilitychange", handleVisibility);
  //   };
  // }, []);

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
