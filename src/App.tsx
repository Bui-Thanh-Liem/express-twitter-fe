import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomeLayout } from "./HomeLayout";
import { AuthPage } from "./pages/AuthPage";
import { ExplorePage } from "./pages/explore/Explore";
import { HomePage } from "./pages/home/HomePage";
import StatusLoginOAuth from "./pages/StatusLoginOAuth";
import RootLayout from "./RootLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import MessagesPage from "./pages/messages/Messages";
import { RedirectIfAuthenticated } from "./components/RedirectIfAuthenticated";

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
      { path: "oauth", element: <StatusLoginOAuth /> },

      // ✅ Bọc các route cần HomeLayout ở đây
      {
        element: <HomeLayout />,
        children: [
          { path: "home", element: <HomePage /> },
          { path: "explore", element: <ExplorePage /> },
          { path: "messages", element: <MessagesPage /> },
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
