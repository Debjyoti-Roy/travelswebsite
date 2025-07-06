import { lazy } from "react";

const HomePage = lazy(() => import("../Pages/HomePage"));
const Profile = lazy(() => import("../Pages/Profile"));
const Partner = lazy(() => import("../Pages/Partner"));
const PartnerDashboard = lazy(() => import("../Pages/PartnerDashboard"));

export const routes = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/partner",
    element: <Partner />,
  },
  {
    path: "/partnerdashboard",
    element: <PartnerDashboard />,
  },
];
