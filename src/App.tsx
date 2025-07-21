import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import { Loading } from "./components/loading";

// Lazy-loaded components
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const RootLayout = lazy(() => import("./RootLayout"));
const StatusLoginOAuth = lazy(() => import("./pages/StatusLoginOAuth"));

// Router config
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />, // layout bọc tất cả
    children: [
      { path: "", element: <Login /> },
      { path: "home", element: <Home /> },
      { path: "oauth", element: <StatusLoginOAuth /> },
    ],
  },
]);

export function App() {
  return (
    <Suspense fallback={<Loading />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
