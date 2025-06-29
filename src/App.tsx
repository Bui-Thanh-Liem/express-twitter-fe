import { createBrowserRouter, RouterProvider } from "react-router";
import { Home } from "./Home";
import { Login } from "./Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login/oauth",
    element: <Login />,
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
