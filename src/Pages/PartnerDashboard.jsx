import React, { useEffect, useState } from 'react'

const PartnerDashboard = () => {
    const options = ["Hotel", "Car", "Guest house"];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fade, setFade] = useState(true);
     const [tab, setTab] = useState("overview");
    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false); // Start fade-out
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % options.length);
                setFade(true); // Start fade-in
            }, 300); // Duration of fade-out
        }, 2000);
        return () => clearInterval(interval);
    }, []);
    return (
        <div className="min-h-screen">

      {/* Banner */}
      <div className="h-[40vh] w-full bg-gradient-to-r from-[#2589f3] via-[#4ea3f8] to-[#5dacf2] flex justify-center items-center text-center px-4">
        <h1 className="text-3xl md:text-5xl font-bold text-white relative animate-fade-in">
          Get ready to <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0036ac] to-[#0036ac] animate-gradient-move">
            showcase & manage your listings
          </span>
          <br />
          and welcome your next guest or rider!
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mt-8">
        <div className="bg-gray-100 rounded-full p-2 flex gap-2 shadow-md">
          <button
            onClick={() => setTab("overview")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300
              ${tab === "overview" 
                ? "bg-[#2589f3] text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-200"
              }`}
          >
            Overview & Bookings
          </button>

          <button
            onClick={() => setTab("properties")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300
              ${tab === "properties" 
                ? "bg-[#2589f3] text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-200"
              }`}
          >
            Manage Properties
          </button>

          <button
            onClick={() => setTab("vehicles")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300
              ${tab === "vehicles" 
                ? "bg-[#2589f3] text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-200"
              }`}
          >
            Manage Vehicles
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="w-full flex justify-center px-4 py-12">
        <div className="md:w-[70%] w-full">
          {tab === "overview" && (
            <div className="text-center text-gray-700">
              {/* Your overview & bookings component */}
              <p className="text-lg">This is your overview & bookings dashboard.</p>
            </div>
          )}
          {tab === "properties" && (
            <div className="text-center text-gray-700">
              {/* Your manage properties component */}
              <p className="text-lg">Manage all your listed properties here.</p>
            </div>
          )}
          {tab === "vehicles" && (
            <div className="text-center text-gray-700">
              {/* Your manage vehicles component */}
              <p className="text-lg">Manage all your vehicles and rental options here.</p>
            </div>
          )}
        </div>
      </div>

    </div>
    )

}

export default PartnerDashboard