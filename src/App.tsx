import { createBrowserRouter, RouterProvider } from "react-router-dom"; // ✅ SỬA Ở ĐÂY
import { HomeLayout } from "./HomeLayout";
import { AuthPage } from "./pages/AuthPage";
import { ExplorePage } from "./pages/explore/Explore";
import { HomePage } from "./pages/home/HomePage";
import StatusLoginOAuth from "./pages/StatusLoginOAuth";
import RootLayout from "./RootLayout";

// Router config
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <AuthPage /> },
      { path: "oauth", element: <StatusLoginOAuth /> },

      // ✅ Bọc các route cần HomeLayout ở đây
      {
        element: <HomeLayout />,
        children: [
          { path: "home", element: <HomePage /> },
          { path: "explore", element: <ExplorePage /> },
        ],
      },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
