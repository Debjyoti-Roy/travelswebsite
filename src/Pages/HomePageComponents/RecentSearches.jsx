import React, { useEffect, useState } from 'react'
import CarRecentSearch from './RecentSearchComponents/CarRecentSearch'
import PackageRecentSearch from './RecentSearchComponents/PackageRecentSearch'
import HotelRecentSearch from './RecentSearchComponents/HotelRecentSearch'
import PickupRoutes from './PickupRouteComponent/PickupRoutes'

const RecentSearches = ({ selectedTab, pickupFlag, setPickupFlag, pickupRoutesDetails }) => {
  const [carPackageState, setCarPackageState] = useState(false);
  const [hotelState, setHotelState] = useState(false);
  const [packageState, setPackageState] = useState(false);

  useEffect(() => {
    if (selectedTab === "Packages") { }
    else if (selectedTab === "Hotels") { }
    else if (selectedTab === "Cars") {

    }
  }, [selectedTab])

  const getCookie = (name) => {
    const cookie = document.cookie.split('; ').find((row) => row.startsWith(name + '='));
    return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
  };

  useEffect(() => {
    const carPackageState = getCookie('carPackageState');
    const hotelState = getCookie('hotelState');
    const packageState = getCookie('packageState');
    if (carPackageState) {
      setCarPackageState(true);
    }
    if (hotelState) {
      setHotelState(true);
    }
    if (packageState) {
      setPackageState(true);
    }
  }, [])


  useEffect(() => {
    if (selectedTab !== "Pickup") {
      setPickupFlag(false)
    }
  }, [selectedTab])

  const shouldShowWrapper =
    ((selectedTab === "Package" && packageState) ||
      (selectedTab === "Hotels" && hotelState) ||
      (selectedTab === "Cars" && carPackageState)) || 
      (selectedTab === "Pickup" && pickupRoutesDetails && Object.keys(pickupRoutesDetails).length > 0);

  return (
    <>
      {shouldShowWrapper && (
        <div className="w-full flex justify-center bg-blue-50 pt-16 pb-8">
          {selectedTab === "Package" && packageState && (
            <section className="lg:w-[70%] w-[90%] text-center flex flex-col items-center gap-6">
              {/* Heading */}
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Continue searching for Tour package
              </h2>

              {/* Car Recent Search Component */}
              <PackageRecentSearch />
            </section>
          )}
          {selectedTab === "Hotels" && hotelState && (
            <section className="lg:w-[70%] w-[90%] text-center flex flex-col items-center gap-6">
              {/* Heading */}
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Continue searching for Hotels
              </h2>
              {/* Car Recent Search Component */}
              <HotelRecentSearch />
            </section>
          )}
          {selectedTab === "Cars" && carPackageState && (
            <section className="lg:w-[70%] w-[90%] text-center flex flex-col items-center gap-6">
              {/* Heading */}
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Continue searching for Car package
              </h2>

              {/* Car Recent Search Component */}
              <CarRecentSearch />
            </section>
          )}
          {selectedTab === "Pickup" && pickupFlag && (
            <section className="lg:w-[70%] w-[90%] text-center flex flex-col items-center gap-6">
              <PickupRoutes pickupRoutesDetails={pickupRoutesDetails} />
            </section>
          )}
        </div>
      )}
    </>
  )
}

export default RecentSearches