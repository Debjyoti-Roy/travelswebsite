import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPickupBooking, getPickupRoutes } from "../../../Redux/store/pickupSlice";
import { useNavigate } from "react-router-dom";
import { MapPin, Users, ArrowRight, AlertCircle, RefreshCw } from "lucide-react"; // Optional: Use icons for better UI
import toast from "react-hot-toast";
import GoogleRouteMap from "./Map";
import RouteSuccessModal from "../../ModalComponent/RouteSuccessModal";

const PickupRoutes = ({ pickupRoutesDetails }) => {
  const [modalFlag, setModalFlag] = useState(false)
  const { pickupLocationId, pickupLocation, dropLocationId, dropLocation, numberOfPeople, dateTime } = pickupRoutesDetails || {};

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { pickupRoutes, loadingRoutes, errorRoutes, loadingBooking, errorBooking, bookingData } = useSelector(
    (state) => state.pickup
  );

  useEffect(() => {
    if (bookingData) {
      console.log(bookingData)
      setModalFlag(true)
    }
  }, [bookingData])


  useEffect(() => {
    if (pickupLocationId && dropLocationId && numberOfPeople) {
      dispatch(
        getPickupRoutes({
          pickuplocation: pickupLocationId,
          dropuplocation: dropLocationId,
          numberofpeople: numberOfPeople,
        })
      );
    }
  }, [dispatch, pickupLocationId, dropLocationId, numberOfPeople]);

  const errorMessage = errorRoutes
    ? typeof errorRoutes === "string"
      ? errorRoutes
      : errorRoutes.message || errorRoutes.error || "No routes available"
    : null;

  const bookNow = async (pickups) => {
    // console.log(pickups)
    const data = {
      routeid: pickups.routeId,
      pickuplocation: pickupLocationId,
      droplocation: dropLocationId,
      pickUpTime: dateTime
    }
    // console.log(data)
    dispatch(createPickupBooking(data))
  }
  useEffect(() => {
    if (errorBooking !== null) {
      console.log(errorBooking)
      toast.error("Booking error")
    }
  }, [errorBooking])
  // useEffect(() => {
  //   if (bookingData !== null) {
  //     toast.success("Booking Confirmed")
  //   }
  // }, [bookingData])



  /* ---------------- UPDATED SKELETON ---------------- */
  if (loadingRoutes) {
    return (
      <div className="p-6 max-w-7xl mx-auto min-h-[400px]">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Skeleton */}
          <div className="hidden lg:block w-1/4 h-64 bg-gray-100 rounded-3xl animate-pulse" />

          {/* Content Skeleton */}
          <div className="flex-1 space-y-6">
            <div className="h-8 w-64 bg-gray-200 rounded-lg animate-pulse mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="h-56 bg-white rounded-3xl border border-gray-100 p-6 space-y-4 shadow-sm animate-pulse">
                  <div className="h-6 w-3/4 bg-gray-200 rounded" />
                  <div className="h-4 w-1/2 bg-gray-100 rounded" />
                  <div className="h-10 w-full bg-gray-100 rounded-xl mt-4" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- UPDATED ERROR / EMPTY STATE ---------------- */
  if (errorMessage || !pickupRoutes || pickupRoutes.length === 0) {
    return (
      <div className="pt-5 px-6 max-w-4xl mx-auto flex flex-col items-center justify-center text-center">
        <div className="bg-orange-50 p-6 rounded-full mb-6">
          <AlertCircle className="w-12 h-12 text-orange-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {errorMessage ? "No Routes Available" : "No Routes Available"}
        </h2>
        <p className="text-gray-600 max-w-md mx-auto mb-8">
          {errorMessage ||
            "We couldn't find any pickup services matching your selection. Try adjusting the number of people or check alternative locations."}
        </p>
      </div>
    );
  }

  /* ---------------- MAIN COMPONENT ---------------- */
  return (
    <>
      <div className="w-full mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* SIDEBAR: Occupies space on the left */}
          <div className="w-full lg:w-1/4">
            <div className="sticky top-6 rounded-3xl bg-indigo-50/50 border border-indigo-100 p-6">
              <h4 className="text-sm font-bold text-indigo-900 uppercase tracking-widest mb-6">Search Details</h4>

              <div className="space-y-6">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <div className="w-0.5 h-10 border-l border-dashed border-blue-300 my-1" />
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                  </div>
                  <div className="flex flex-col justify-between py-0.5">
                    <span className="text-sm font-medium text-gray-700 leading-none">{pickupLocation}</span>
                    <span className="text-sm font-medium text-gray-700 leading-none">{dropLocation}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-indigo-100">
                  <div className="bg-white p-2 rounded-lg shadow-sm text-indigo-600">
                    <Users size={18} />
                  </div>
                  <span className="text-sm font-semibold text-gray-800">{numberOfPeople} Passengers</span>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT: Routes cards */}
          <div className="flex-1">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Checkout the routes available</h2>
              <p className="text-gray-500 mt-1">Found {pickupRoutes.length} options for your journey</p>
            </div>

            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> */}
            <div className={`grid gap-6 ${pickupRoutes.length === 1
              ? "grid-cols-1"
              : "grid-cols-1 md:grid-cols-2"
              }`}>
              {pickupRoutes.map((route) => (
                <div
                  key={route.routeId}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-blue-200 hover:-translate-y-1"
                >
                  {/* Header with Price */}
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {route.name}
                    </h3>
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-bold text-gray-400 uppercase">Fare</span>
                      <span className="text-xl font-black text-blue-600">₹{Number(route.price).toFixed(0)}</span>
                    </div>
                  </div>

                  {/* Map */}
                  <div className="mb-4">
                    <GoogleRouteMap route={route?.encodedPolyline} distance={route?.distance} />
                  </div>

                  {/* Route Visualizer */}
                  <div className="bg-gray-50 rounded-2xl p-4 mb-6 space-y-3">
                    <div className="flex items-center gap-3">
                      <MapPin size={14} className="text-green-500" />
                      <span className="text-sm text-gray-600 truncate">{route.pickUpLocation}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin size={14} className="text-red-500" />
                      <span className="text-sm text-gray-600 truncate">{route.dropLocation}</span>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                      <Users size={14} />
                      {route.numberOfPeople} Seats
                    </div>

                    <button
                      onClick={() => bookNow(route)}
                      className="flex items-center gap-2 rounded-2xl bg-gray-900 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-blue-600 active:scale-95 group-hover:gap-3"
                    >
                      Book Now <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {modalFlag && bookingData && (
        <RouteSuccessModal bookingId={bookingData.bookingId} pickup={bookingData?.pickUpLocation} drop={bookingData?.dropLocation} number={bookingData?.numberOfPeople} price={bookingData?.price} onClose={() => setModalFlag(false)} />
      )}
    </>
  );
};

export default PickupRoutes;