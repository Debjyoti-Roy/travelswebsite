import React, { useEffect } from 'react'
import CarRecentSearch from './RecentSearchComponents/CarRecentSearch'
import PackageRecentSearch from './RecentSearchComponents/PackageRecentSearch'
import HotelRecentSearch from './RecentSearchComponents/HotelRecentSearch'



const RecentSearches = ({ selectedTab }) => {

  useEffect(() => {
    if (selectedTab === "Packages") { }
    else if (selectedTab === "Hotels") { }
    else if (selectedTab === "Cars") {

    }
    console.log(selectedTab)
  }, [selectedTab])



  return (
    <div className="w-full flex justify-center bg-blue-50 py-16">
      {selectedTab === "Package" && (
        <section className="lg:w-[70%] w-[90%] text-center flex flex-col items-center gap-6">
          {/* Heading */}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Continue searching for Tour package
          </h2>

          {/* Car Recent Search Component */}
          <PackageRecentSearch />
        </section>
      )}
      {selectedTab === "Hotels" && (
        <section className="lg:w-[70%] w-[90%] text-center flex flex-col items-center gap-6">
          {/* Heading */}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Continue searching for Hotels
          </h2>

          {/* Car Recent Search Component */}
          <HotelRecentSearch />
        </section>
      )}
      {selectedTab === "Cars" && (
        <section className="lg:w-[70%] w-[90%] text-center flex flex-col items-center gap-6">
          {/* Heading */}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Continue searching for Car package
          </h2>

          {/* Car Recent Search Component */}
          <CarRecentSearch />
        </section>
      )}
    </div>

  )
}

export default RecentSearches