import { lazy } from "react";

const User = lazy(() => import("../pages/user"));
const Atlas = lazy(() => import("../pages/atlas"));
const Types = lazy(() => import("../pages/types"));
const AtlasRequest = lazy(() => import("../pages/atlas-request"));

export const privateRoutes = [
  {
    path: "/user",
    component: <User />,
  },
  {
    path: "/atlas",
    component: <Atlas />,
  },
  {
    path: "/types",
    component: <Types />,
  },
  {
    path: "/atlas-request",
    component: <AtlasRequest />,
  },
];

