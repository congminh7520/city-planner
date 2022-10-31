import { lazy } from "react";

const Login = lazy(() => import("../pages/login"));
const Register = lazy(() => import("../pages/register"));

export const publicRoutes = [
  {
    path: "/",
    component: <Login />,
  },
  {
    path: "/register",
    component: <Register />,
  },
];
