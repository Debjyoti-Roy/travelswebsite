// import { lazy } from "react";
// import ProtectedRoute, { AuthProtectedRoute } from "../Components/ProtectedRoute";

// const HomePage = lazy(() => import("../Pages/HomePage"));
// const Profile = lazy(() => import("../Pages/Profile"));
// const Partner = lazy(() => import("../Pages/Partner"));
// const PartnerDashboard = lazy(() => import("../Pages/PartnerDashboard"));
// const HotelSearchResult = lazy(() => import("../Pages/HotelSearchResult"));
// const HotelDetails = lazy(() => import("../Pages/HotelDetails"));
// const MyBookings = lazy(() => import("../Pages/MyBookings"));

// export const routes = [
//   {
//     path: "/",
//     element: <HomePage />,
//   },
//   {
//     path: "/profile",
//     element: (
//       <AuthProtectedRoute>
//         <Profile />
//       </AuthProtectedRoute>
//     ),
//   },
//   {
//     path: "/partner",
//     element: <Partner />,
//   },
//   {
//     path: "/partnerdashboard",
//     element: (
//       <ProtectedRoute>
//         <PartnerDashboard />
//       </ProtectedRoute>
//     ),
//   },
//   {
//     path: "/hotelsearch",
//     element: <HotelSearchResult />,
//   },
//   {
//     path: "/details",
//     element: <HotelDetails />,
//   },
//   {
//     path: "/mybookings",
//     element: (
//       <AuthProtectedRoute>
//         <MyBookings />
//       </AuthProtectedRoute>
//     ),
//   },
// ];
import { lazy } from "react";
import ProtectedRoute, { AuthProtectedRoute } from "../Components/ProtectedRoute";
import { Skeleton } from "@mui/material";
import { FaFilter } from "react-icons/fa";
import AdminProtectedRoute from "../Components/AdminProtectedRoute";

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
const PaymentPage = lazy(() => import("../Pages/PaymentPage"));
const CarPackageSearchResults = lazy(() => import("../Pages/CarPackageSearchResults"))
const CarPackageDetails=lazy(()=>import("../Pages/CarPackageDetails"))
const ManageCarBookings=lazy(()=>import("../Pages/AdminComponents/ManageCarBookings"))



export const routes = [
  {
    path: "/",
    element: <HomePage />,
    fallback: <div>Loading Home...</div>,
  },
  {
    path: "/profile",
    element: (
      <AuthProtectedRoute>
        <Profile />
      </AuthProtectedRoute>
    ),
    fallback: <div>Loading Profile...</div>,
  },
  {
    path: "/partner",
    element: <Partner />,
    fallback: <div>Loading Partner Page...</div>,
  },
  {
    path: "/partnerdashboard",
    element: (
      <ProtectedRoute>
        <PartnerDashboard />
      </ProtectedRoute>
    ),
    fallback: <div>Loading Partner Dashboard...</div>,
  },
  {
    path: "/admin",
    // element:<Admin/>,
    element: (
      <AdminProtectedRoute>
        <Admin />
      </AdminProtectedRoute>
    ),
    fallback: <div className="min-h-screen">Loading Admin Dashboard...</div>,
  },
  {
    path: "/admin/managehotelbooking",
    // element:<Admin/>,
    element: (
      <AdminProtectedRoute>
        <ManageHotelBooking />
      </AdminProtectedRoute>
    ),
    fallback: <div className="min-h-screen">Loading Admin Dashboard...</div>,
  },
  {
    path: "/admin/managecarbookings",
    // element:<Admin/>,
    element: (
      <AdminProtectedRoute>
        <ManageCarBookings />
      </AdminProtectedRoute>
    ),
    fallback: <div className="min-h-screen">Loading Admin Dashboard...</div>,
  },
  {
    path: "/admin/managecarpackage",
    // element:<Admin/>,
    element: (
      <AdminProtectedRoute>
        <ManageCarPackage />
      </AdminProtectedRoute>
    ),
    fallback: <div className="min-h-screen">Loading Admin Dashboard...</div>,
  },
  {
    path: "/hotelsearch",
    element: <HotelSearchResult />,
    // fallback: <div>Searching Hotels...</div>,
    fallback: <div className="min-h-screen w-full bg-[#f2f2f2]">
      {/* Mobile Filter Bar */}
      <div className="md:hidden fixed left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <FaFilter className="text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Filters</span>
            {/* <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              ...
            </span> */}
          </div>
          <Skeleton variant="circular" width={32} height={32} />
        </div>
      </div>

      {/* Search Container */}
      <div className="w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex justify-center relative pt-10 md:pt-0">
        {/* Banner */}
        <div className="h-[10vh] w-full bg-gradient-to-r from-[#2589f3] via-[#4ea3f8] to-[#5dacf2] flex justify-center items-center text-center px-4 relative" />

        {/* Form container */}
        <div className="flex flex-col md:flex-row lg:w-[70%] w-full md:justify-center px-6 lg:px-0 pt-20 md:pt-4 gap-6 absolute top-[-5vh] md:top-0 z-10">
          <div className="package-search-container w-full pt-10 md:pt-0">
            <div className="bg-white rounded-2xl p-6 border border-blue-100 backdrop-blur-sm relative overflow-hidden">
              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-200 to-transparent rounded-full opacity-20 -translate-y-12 translate-x-12"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-indigo-200 to-transparent rounded-full opacity-20 translate-y-10 -translate-x-10"></div>

              <div className="flex flex-col md:flex-row pr-0 gap-[10px] w-full md:px-2 relative z-10">
                {/* Date Range */}
                <div className="flex-[1.5] w-full">
                  <Skeleton
                    variant="text"
                    width="30%"
                    height={20}
                    className="mb-1"
                  />
                  <Skeleton
                    variant="rectangular"
                    height={48}
                    className="w-full rounded-lg"
                  />
                </div>

                {/* Guests & Rooms */}
                <div className="flex-1 w-full">
                  <Skeleton
                    variant="text"
                    width="40%"
                    height={20}
                    className="mb-1"
                  />
                  <Skeleton
                    variant="rectangular"
                    height={48}
                    className="w-full rounded-lg"
                  />
                </div>

                {/* Search Button */}
                <div className="flex flex-col justify-end w-full md:w-auto self-stretch pb-[2px]">
                  <Skeleton
                    variant="rectangular"
                    height={48}
                    className="w-full md:w-32 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Main Content */}
      <div className="w-full flex justify-center md:pt-10 pt-50">
        <div className="flex flex-col md:flex-row lg:w-[70%] w-full px-6 lg:px-2 py-6 gap-6">
          {/* Sidebar Filter (Desktop) */}
          <div className="hidden md:block md:w-1/3">
            <Skeleton variant="rectangular" height={600} className="rounded-xl" />
          </div>

          {/* Hotel List */}
          <div className="w-full flex flex-col">
            <div className="w-full flex justify-between items-center pb-4">
              <Skeleton variant="text" width="40%" height={32} />
              <Skeleton variant="rectangular" width={180} height={40} className="rounded-md" />
            </div>

            {/* Hotel Card Skeletons */}
            <div className="w-full flex flex-col gap-6 mb-6">
              {[...Array(3)].map((_, idx) => (
                <div
                  key={idx}
                  className="flex flex-col md:flex-row items-center md:items-start bg-white rounded-2xl shadow-lg overflow-hidden w-full h-auto md:h-60 p-4 gap-4"
                >
                  {/* Image skeleton */}
                  <div className="w-full md:w-[30%] h-[200px] md:h-full bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <Skeleton
                      variant="rectangular"
                      animation="wave"
                      width="100%"
                      height="100%"
                      className="rounded-lg"
                    />
                  </div>

                  {/* Content skeleton */}
                  <div className="flex-1 flex flex-col justify-between h-auto md:h-[80%] px-0 md:px-4 w-full gap-2">
                    <div className="flex flex-row justify-between md:items-start gap-2">
                      <Skeleton animation="wave" variant="text" width="60%" height={28} />
                      <Skeleton animation="wave" variant="rectangular" width={80} height={24} className="rounded-full" />
                    </div>

                    <Skeleton animation="wave" variant="text" width="50%" height={20} />
                    <Skeleton animation="wave" variant="text" width="80%" height={20} />
                    <Skeleton animation="wave" variant="text" width="90%" height={48} />

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between md:block hidden gap-3 pt-4">
                      <Skeleton animation="wave" variant="text" width="30%" height={24} />
                      <Skeleton animation="wave" variant="rectangular" width={100} height={36} className="rounded-full" />
                    </div>
                  </div>
                </div>

              ))}
            </div>

            {/* Pagination */}
            <div className="mt-auto pt-6">
              <Skeleton variant="text" width="50%" height={24} className="mx-auto mb-4" />
              <div className="flex items-center justify-center gap-4">
                <Skeleton variant="rectangular" width={80} height={40} className="rounded" />
                <Skeleton variant="text" width={40} height={24} />
                <Skeleton variant="rectangular" width={80} height={40} className="rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  },
  {
    path: "/carpackagesearch",
    element: <CarPackageSearchResults />,
    fallback: <div className="min-h-screen">Loading Admin Dashboard...</div>,
  },
  {
    path: "/details",
    element: <HotelDetails />,
    fallback: <div className="min-h-screen w-full bg-gray-50">
      <div className="relative h-[450px] w-full">
        <Skeleton variant="rectangular" width="100%" height="100%" />
        <div className="absolute bottom-6 left-6 right-6">
          <Skeleton variant="text" width="60%" height={40} />
          <Skeleton variant="text" width="40%" height={25} />
        </div>
      </div>

      {/* About Section */}
      <div className="px-6 pt-8 pb-4 w-full max-w-7xl mx-auto">
        <Skeleton variant="text" width="40%" height={35} className="mb-4" />
        <Skeleton variant="rectangular" height={120} className="rounded-lg" />

        {/* Rooms Placeholder */}
        <div className="pt-10 space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-xl shadow-sm">
              <Skeleton variant="text" width="50%" height={30} />
              <Skeleton variant="text" width="30%" height={20} className="mt-2" />
              <Skeleton variant="text" width="70%" height={20} className="mt-2" />
            </div>
          ))}
        </div>
      </div>
    </div>,
  },
  {
    path: "/mybookings",
    element: (
      <AuthProtectedRoute>
        <MyBookings />
      </AuthProtectedRoute>
    ),
    fallback: <div>Loading Your Bookings...</div>,
  },
  {
    path: "/pay-bookings",
    element: <PaymentPage />,
    fallback: <div>Loading Payment Page...</div>,
  },
  {
    path: "/carpackagedetails",
    element: <CarPackageDetails />,
    fallback: <div className="min-h-screen w-full bg-gray-50">
    <div className="relative h-[450px] w-full">
      <Skeleton variant="rectangular" width="100%" height="100%" />
      <div className="absolute bottom-6 left-6 right-6">
        <Skeleton variant="text" width="60%" height={40} />
        <Skeleton variant="text" width="40%" height={25} />
      </div>
    </div>

    {/* About Section */}
    <div className="px-6 pt-8 pb-4 w-full max-w-7xl mx-auto">
      <Skeleton variant="text" width="40%" height={35} className="mb-4" />
      <Skeleton variant="rectangular" height={120} className="rounded-lg" />

      {/* Rooms Placeholder */}
      <div className="pt-10 space-y-4">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-xl shadow-sm">
            <Skeleton variant="text" width="50%" height={30} />
            <Skeleton variant="text" width="30%" height={20} className="mt-2" />
            <Skeleton variant="text" width="70%" height={20} className="mt-2" />
          </div>
        ))}
      </div>
    </div>
  </div>,
  },

];
