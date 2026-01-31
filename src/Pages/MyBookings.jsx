import React, { useState } from "react";
import MyHotelBookings from "./MyBookingsComponent/MyHotelBookings";
import MyCarPackageBookings from "./MyBookingsComponent/MyCarPackageBookings";
import MyTourQueries from "./MyBookingsComponent/MyTourQueries";
import MyCarPickupBookings from "./MyBookingsComponent/MyCarPickupBookings";

const MyBookings = () => {
  const [tab, setTab] = useState(0);

  return (
    <div className="min-h-screen flex flex-col items-center pt-10 pb-20">
      {/* Page Heading */}
      <h1 style={{marginBottom:'5px'}} className="text-3xl font-bold text-gray-800 mb-8">My Bookings</h1>

      <div className="w-full lg:w-[70%] px-4 flex flex-col md:flex-row gap-4">
        {/* Vertical Tabs */}
        <div className="w-full md:w-[20%] border-r border-gray-200">
          {/* Hotel Bookings */}
          <div
            onClick={() => setTab(0)}
            className={`px-4 py-3 mb-2 rounded-lg cursor-pointer transition 
              ${tab === 0 ? "bg-blue-500 font-medium text-white" : "hover:bg-blue-100"}
            `}
          >
            1) Hotel Bookings
          </div>

          {/* Car Bookings */}
          <div
            onClick={() => setTab(1)}
            className={`px-4 py-3 mb-2 rounded-lg cursor-pointer transition 
              ${tab === 1 ? "bg-blue-500 font-medium text-white" : "hover:bg-blue-100"}
            `}
          >
            2) Car Bookings
          </div>
          <div
            onClick={() => setTab(2)}
            className={`px-4 py-3 mb-2 rounded-lg cursor-pointer transition 
              ${tab === 2 ? "bg-blue-500 font-medium text-white" : "hover:bg-blue-100"}
            `}
          >
            3) Tour Queries
          </div>
          <div
            onClick={() => setTab(3)}
            className={`px-4 py-3 mb-2 rounded-lg cursor-pointer transition 
              ${tab === 3 ? "bg-blue-500 font-medium text-white" : "hover:bg-blue-100"}
            `}
          >
            3) Car Pickup Bookings
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, paddingBottom: 24, marginTop: "5px" }}>
          {tab === 0 && (
            <MyHotelBookings />
          )}

          {tab === 1 && (
            <MyCarPackageBookings />
          )}
          {tab === 2 && (
            <MyTourQueries />
          )}
          {tab === 3 && (
            <MyCarPickupBookings />
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
