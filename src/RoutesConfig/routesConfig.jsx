import { lazy } from "react";
import ProtectedRoute, { AuthProtectedRoute } from "../Components/ProtectedRoute";
import AdminProtectedRoute from "../Components/AdminProtectedRoute";
import { InfinitySpin } from "react-loader-spinner";
// import ManagePartners from "../Pages/AdminComponents/ManagePartners";

const HomePage = lazy(() => import("../Pages/HomePage"));
const Profile = lazy(() => import("../Pages/Profile"));
const Partner = lazy(() => import("../Pages/Partner"));
const PartnerDashboard = lazy(() => import("../Pages/PartnerDashboard"));
const HotelSearchResult = lazy(() => import("../Pages/HotelSearchResult"));
const HotelDetails = lazy(() => import("../Pages/HotelDetails"));
const MyBookings = lazy(() => import("../Pages/MyBookings"));
const Admin = lazy(() => import("../Pages/Admin"));
const ManageHotelBooking = lazy(() => import("../Pages/AdminComponents/ManageHotelBooking"))
const ManageCarPackage = lazy(() => import("../Pages/AdminComponents/ManageCarPackage"))
const ManageTourPackage = lazy(() => import("../Pages/AdminComponents/ManageTourPackage"))
const ManageTourBookings = lazy(() => import("../Pages/AdminComponents/ManageTourBookings"))
const PaymentPage = lazy(() => import("../Pages/PaymentPage"));
const CarPackageSearchResults = lazy(() => import("../Pages/CarPackageSearchResults"))
const CarPackageDetails = lazy(() => import("../Pages/CarPackageDetails"))
const ManageCarBookings = lazy(() => import("../Pages/AdminComponents/ManageCarBookings"))
const PackageSearchResults = lazy(() => import("../Pages/PackageSearchResults"))
const TourDetails = lazy(() => import("../Pages/TourDetails"))
const ManagePartners = lazy(() => import("../Pages/AdminComponents/ManagePartners"))
const CarRoutes = lazy(() => import("../Pages/AdminComponents/CarRoutes"))
const DriveMode = lazy(() => import("../Pages/DriveMode"))
const CarPickupBookings = lazy(() => import("../Pages/AdminComponents/CarPickupBookings"))
const FindPickupDriver = lazy(() => import("../Pages/AdminComponents/FindPickupDriver"))

export const routes = [
  {
    path: "/",
    element: <HomePage />,
    fallback: <div className="min-h-screen w-full flex items-center justify-center">
      <InfinitySpin width="200" color="#2563eb" />
    </div>,
  },
  {
    path: "/profile",
    element: (
      <AuthProtectedRoute>
        <Profile />
      </AuthProtectedRoute>
    ),
    fallback: <div className="min-h-screen w-full flex items-center justify-center">
      <InfinitySpin width="200" color="#2563eb" />
    </div>,
  },
  {
    path: "/partner",
    element: <Partner />,
    fallback: <div className="min-h-screen w-full flex items-center justify-center">
      <InfinitySpin width="200" color="#2563eb" />
    </div>,
  },
  {
    path: "/partnerdashboard",
    element: (
      <ProtectedRoute>
        <PartnerDashboard />
      </ProtectedRoute>
    ),
    fallback: <div className="min-h-screen w-full flex items-center justify-center">
      <InfinitySpin width="200" color="#2563eb" />
    </div>,
  },
  {
    path: "/admin",
    // element:<Admin/>,
    element: (
      <AdminProtectedRoute>
        <Admin />
      </AdminProtectedRoute>
    ),
    fallback: <div className="min-h-screen w-full flex items-center justify-center">
      <InfinitySpin width="200" color="#2563eb" />
    </div>,
  },
  {
    path: "/admin/managehotelbooking",
    // element:<Admin/>,
    element: (
      <AdminProtectedRoute>
        <ManageHotelBooking />
      </AdminProtectedRoute>
    ),
    fallback: <div className="min-h-screen w-full flex items-center justify-center">
      <InfinitySpin width="200" color="#2563eb" />
    </div>,
  },
  {
    path: "/admin/managecarbookings",
    // element:<Admin/>,
    element: (
      <AdminProtectedRoute>
        <ManageCarBookings />
      </AdminProtectedRoute>
    ),
    fallback: <div className="min-h-screen w-full flex items-center justify-center">
      <InfinitySpin width="200" color="#2563eb" />
    </div>,
  },
  {
    path: "/admin/managecarpackage",
    // element:<Admin/>,
    element: (
      <AdminProtectedRoute>
        <ManageCarPackage />
      </AdminProtectedRoute>
    ),
    fallback: <div className="min-h-screen w-full flex items-center justify-center">
      <InfinitySpin width="200" color="#2563eb" />
    </div>,
  },
  {
    path: "/admin/managetourpackage",
    // element:<Admin/>,
    element: (
      <AdminProtectedRoute>
        <ManageTourPackage />
      </AdminProtectedRoute>
    ),
    fallback: <div className="min-h-screen w-full flex items-center justify-center">
      <InfinitySpin width="200" color="#2563eb" />
    </div>,
  },
  {
    path: "/admin/managetourbookings",
    // element:<Admin/>,
    element: (
      <AdminProtectedRoute>
        <ManageTourBookings />
      </AdminProtectedRoute>
    ),
    fallback: <div className="min-h-screen w-full flex items-center justify-center">
      <InfinitySpin width="200" color="#2563eb" />
    </div>,
  },
  {
    path: "/admin/managepartners",
    element: (
      <AdminProtectedRoute>
        <ManagePartners />
      </AdminProtectedRoute>
    ),
    fallback: <div className="min-h-screen w-full flex items-center justify-center">
    <InfinitySpin width="200" color="#2563eb" />
  </div>,
  },
  {
    path: "/admin/carroutes",
    element: (
      <AdminProtectedRoute>
        <CarRoutes />
      </AdminProtectedRoute>
    ),
    fallback: <div className="min-h-screen w-full flex items-center justify-center">
    <InfinitySpin width="200" color="#2563eb" />
  </div>,
  },
  {
    path: "/admin/carpickupbookings",
    element: (
      <AdminProtectedRoute>
        <CarPickupBookings />
      </AdminProtectedRoute>
    ),
    fallback: <div className="min-h-screen w-full flex items-center justify-center">
    <InfinitySpin width="200" color="#2563eb" />
  </div>,
  },
  {
    path: "/admin/carpickupbookings/findpickupdriver",
    element: (
      <AdminProtectedRoute>
        <FindPickupDriver />
      </AdminProtectedRoute>
    ),
    fallback: <div className="min-h-screen w-full flex items-center justify-center">
    <InfinitySpin width="200" color="#2563eb" />
  </div>,
  },
  {
    path: "/hotelsearch",
    element: <HotelSearchResult />,
    // fallback: <div>Searching Hotels...</div>,
    fallback: <div className="min-h-screen w-full flex items-center justify-center">
    <InfinitySpin width="200" color="#2563eb" />
  </div>
  },
  {
    path: "/carpackagesearch",
    element: <CarPackageSearchResults />,
    fallback: <div className="min-h-screen w-full flex items-center justify-center">
      <InfinitySpin width="200" color="#2563eb" />
    </div>,
  },
  {
    path: "/tourpackagesearch",
    element: <PackageSearchResults />,
    // fallback: <div className="min-h-screen">Loading Admin Dashboard...</div>,
    fallback: <div className="min-h-screen w-full flex items-center justify-center">
    <InfinitySpin width="200" color="#2563eb" />
  </div>
  },
  {
    path: "/details",
    element: <HotelDetails />,
    fallback: <div className="min-h-screen w-full flex items-center justify-center">
    <InfinitySpin width="200" color="#2563eb" />
  </div>,
  },
  {
    path: "/mybookings",
    element: (
      <AuthProtectedRoute>
        <MyBookings />
      </AuthProtectedRoute>
    ),
    fallback: <div className="min-h-screen w-full flex items-center justify-center">
      <InfinitySpin width="200" color="#2563eb" />
    </div>,
  },
  {
    path: "/pay-bookings",
    element: <PaymentPage />,
    fallback: <div className="min-h-screen w-full flex items-center justify-center">
      <InfinitySpin width="200" color="#2563eb" />
    </div>,
  },
  {
    path: "/carpackagedetails",
    element: <CarPackageDetails />,
    fallback: <div className="min-h-screen w-full flex items-center justify-center">
    <InfinitySpin width="200" color="#2563eb" />
  </div>,
  },
  {
    path: "/tourdetails",
    element: <TourDetails />,
    fallback: <div className="min-h-screen w-full flex items-center justify-center">
    <InfinitySpin width="200" color="#2563eb" />
  </div>,
  },
  {
    path: "/drivemode/:carId",
    element: (
      <ProtectedRoute>
        <DriveMode />
      </ProtectedRoute>
    ),
    fallback: <div className="min-h-screen w-full flex items-center justify-center">
      <InfinitySpin width="200" color="#2563eb" />
    </div>,
  },
];