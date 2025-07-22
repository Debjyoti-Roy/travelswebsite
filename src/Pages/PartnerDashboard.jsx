import React, { useEffect, useState } from 'react'
import ManageProperties from './PartnerDashboardComponents/ManageProperties';
import AddRoom from './PartnerDashboardComponents/AddRoom';
import PropertyDashboard from './PartnerDashboardComponents/PropertyDashboard';
import { useDispatch } from 'react-redux';
import { getHotels } from '../Redux/store/hotelSlice';
import HotelAnalytics from './PartnerDashboardComponents/HotelAnalytics';

const PartnerDashboard = () => {
  const options = ["Hotel", "Car", "Guest house"];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [tab, setTab] = useState("overview");
  const [room, setRoom] = useState(true)
  const [hotelId, setHotelId] = useState("")
  const [hotelPresent, setHotelPresent] = useState(false)
  const [hotelList, setHotelList] = useState([])
  const dispatch = useDispatch()
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
  useEffect(() => {
    const job = async () => {
      const token = localStorage.getItem('token')
      const res = await dispatch(getHotels({ token }))
      // console.log(res.payload.status)
      if (res.payload.status == 200) {
        setHotelPresent(true)
        setHotelList(res.payload.data)
      } else {
        setHotelPresent(false)
        setHotelList([])
      }
    }
    job()
  }, [])

  return (
    <div className="min-h-screen">

      {/* Banner */}
      <div className="h-[40vh] w-full bg-gradient-to-r from-[#2589f3] via-[#4ea3f8] to-[#5dacf2] flex justify-center items-center text-center px-4 relative">
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
      <div className="flex justify-center w-full">
        <div
          className="
        bg-gray-100 rounded-md w-[90%] lg:w-[60%] p-2 flex flex-row md:flex-row gap-2 shadow-lg 
        -translate-y-1/2
      "
        >
          <button
            onClick={() => setTab("overview")}
            className={`flex-1 px-3 py-3 rounded-md text-sm md:text-xl font-medium transition-all duration-300
          ${tab === "overview"
                ? "bg-[#2589f3] text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-200"
              }`}
          >
            Overview & Bookings
          </button>

          <button
            onClick={() => setTab("properties")}
            className={`flex-1 px-3 py-3 rounded-md text-sm md:text-xl font-medium transition-all duration-300
          ${tab === "properties"
                ? "bg-[#2589f3] text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-200"
              }`}
          >
            Manage Properties
          </button>

          <button
            onClick={() => setTab("vehicles")}
            className={`flex-1 px-3 py-3 rounded-md text-sm md:text-xl font-medium transition-all duration-300
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
      <div className="w-full flex justify-center">
        <div className="lg:w-[60%] w-full px-6 lg:px-0">
          {tab === "overview" && (
            <div className='w-full'>
              <HotelAnalytics hotelList={hotelList} />
            </div>
          )}
          {tab === "properties" && (
            <>
              {hotelPresent && <div className='w-full'>
                <PropertyDashboard hotelList={hotelList} />
              </div>}
              {!hotelPresent && (
                <>
                  {!room && (
                    <ManageProperties setRoom={setRoom} setHotelId={setHotelId} />
                  )}
                  {room && (
                    <AddRoom hotelId={hotelId} setHotelPresent={setHotelPresent} />
                  )}
                </>
              )}
            </>
          )}
          {tab === "vehicles" && (
            <div className="text-center text-gray-700">
              <p className="text-lg">Manage all your vehicles and rental options here.</p>
            </div>
          )}
        </div>
      </div>

    </div>

  )

}

export default PartnerDashboard