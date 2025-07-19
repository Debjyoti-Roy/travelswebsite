import { lazy } from "react";
import ProtectedRoute from "../Components/ProtectedRoute";

const HomePage = lazy(() => import("../Pages/HomePage"));
const Profile = lazy(() => import("../Pages/Profile"));
const Partner = lazy(() => import("../Pages/Partner"));
const PartnerDashboard = lazy(() => import("../Pages/PartnerDashboard"));
const HotelSearchResult = lazy(() => import("../Pages/HotelSearchResult"));
const HotelDetails = lazy(() => import("../Pages/HotelDetails"));
const MyBookings = lazy(() => import("../Pages/MyBookings"));

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
    element: (
      <ProtectedRoute>
        <PartnerDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/hotelsearch",
    element: <HotelSearchResult />,
  },
  {
    path: "/details",
    element: <HotelDetails />,
  },
  {
    path: "/mybookings",
    element: <MyBookings />,
  },
];
