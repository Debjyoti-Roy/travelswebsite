import React, { useEffect } from "react";
import HotelCard from "./HotelCard";
// import HotelCard from "./HotelCard"; // adjust import path if needed

const PropertyDashboard = ({ hotelList }) => {
  useEffect(() => {
    console.log(hotelList);
  }, [hotelList]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* <h1 className="text-3xl font-bold mb-6 text-center">Property Dashboard</h1> */}

      <div className="grid gap-8">
        {hotelList && hotelList.length > 0 ? (
          hotelList.map((hotel, index) => (
            <div key={index} className="w-[65%] md:w-[80%] lg:w-full">

              <HotelCard key={index} hotel={hotel} />
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No hotels found.</p>
        )}
      </div>
    </div>
  );
};

export default PropertyDashboard;
