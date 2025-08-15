import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { countAwaiting } from "../Redux/store/adminSlices";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate=useNavigate()
  const dispatch = useDispatch();
  const { awaitingCount, loading, error } = useSelector((state) => state.admin);

  // Call countAwaiting every 5 minutes
  useEffect(() => {
    // Initial call
    dispatch(countAwaiting());

    // Set up interval for every 5 minutes (300000 milliseconds)
    const interval = setInterval(() => {
      dispatch(countAwaiting());
    }, 300000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [dispatch]);

  // Log awaitingCount whenever it changes
  useEffect(() => {
    console.log("Awaiting Count:", awaitingCount);
  }, [awaitingCount]);

  const cards = [
    { title: "Manage Partner", desc: "View, approve, and manage all partners.", color: "from-blue-500 to-blue-700" },
    { title: "Manage Hotel Bookings", desc: "Track, modify, and confirm hotel reservations.", color: "from-sky-500 to-blue-600" },
    { title: "Manage Car Bookings", desc: "View and manage car rental bookings.", color: "from-cyan-500 to-blue-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <h1 className="text-3xl font-bold mb-8 text-blue-800">Admin Dashboard</h1>
      
      

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cards.map((card, idx) => (
          <div
            key={idx}
            onClick={()=>{
              if(card.title === "Manage Hotel Bookings"){
                  navigate("/admin/managehotelbooking")
              }
            }}
            className={`bg-gradient-to-r ${card.color} p-6 rounded-2xl shadow-lg transform hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer aspect-square flex flex-col justify-center items-center text-center relative`}
          >
            {/* Notification bubble for Hotel Bookings card */}
            {card.title === "Manage Hotel Bookings" && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold shadow-lg">
                {loading ? "..." : error ? "!" : awaitingCount}
              </div>
            )}
            <h2 className="text-white text-2xl font-semibold mb-2">{card.title}</h2>
            <p className="text-white/90">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
