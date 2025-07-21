import Home from "./pages/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom"; // ✅ SỬA Ở ĐÂY
import Login from "./pages/Login";
import StatusLoginOAuth from "./pages/StatusLoginOAuth";
import RootLayout from "./RootLayout";

// Router config
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "", element: <Login /> },
      { path: "home", element: <Home /> },
      { path: "oauth", element: <StatusLoginOAuth /> },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
