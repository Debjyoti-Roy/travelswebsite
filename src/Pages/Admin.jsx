import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { countAwaiting } from "../Redux/store/adminSlices";
import { useNavigate } from "react-router-dom";
import { carCountAwaiting } from "../Redux/store/adminCarSlice";
import { tourCountAwaiting } from "../Redux/store/adminTourSlice";

const Admin = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { awaitingCount, loading, error } = useSelector((state) => state.admin);
  const { carAwaitingCount, awaitingLoading, awaitingError } = useSelector(
    (state) => state.admincar
  );
  const { awaitingtourCount, awaitingtourCountLoading, awaitingtourCountError } = useSelector((state) => state.adminTour)

  

  useEffect(() => {
    dispatch(countAwaiting());
    dispatch(carCountAwaiting());
    dispatch(tourCountAwaiting());
    const interval = setInterval(() => {
      dispatch(countAwaiting());
      dispatch(carCountAwaiting());
      dispatch(tourCountAwaiting());
    }, 300000);
    return () => clearInterval(interval);
  }, [dispatch]);
  
  const cards = [
    {
      title: "Manage Partner",
      desc: "View, approve, and manage all partners.",
      color: "from-blue-500 to-blue-700"
    },
    {
      title: "Manage Hotel Bookings",
      desc: "Track, modify, and confirm hotel reservations.",
      color: "from-sky-500 to-blue-600"
    },
    {
      title: "Manage Car Bookings",
      desc: "View and manage car rental bookings.",
      color: "from-cyan-500 to-blue-500"
    },
    {
      title: "Manage Car Package",
      desc: "Create, update, and manage car packages.",
      color: "from-indigo-500 to-purple-600"
    },
    {
      title: "Manage Tour Bookings",
      desc: "View and manage car rental bookings.",
      color: "from-cyan-500 to-blue-500"
    },
    {
      title: "Manage Tour Package",
      desc: "Create, update, and manage car packages.",
      color: "from-indigo-500 to-purple-600"
    }
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <h1 className="text-3xl font-bold mb-8 text-blue-800">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {cards.map((card, idx) => (
          <div
            key={idx}
            onClick={() => {
              if (card.title === "Manage Hotel Bookings") {
                navigate("/admin/managehotelbooking")
              }
              else if (card.title === "Manage Car Package") {
                navigate("/admin/managecarpackage")
              }
              else if (card.title === "Manage Tour Package") {
                navigate("/admin/managetourpackage")
              }
              else if (card.title === "Manage Car Bookings") {
                navigate("/admin/managecarbookings")
              }
              else if (card.title === "Manage Tour Bookings") {
                navigate("/admin/managetourbookings")
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
            {card.title === "Manage Car Bookings" && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold shadow-lg">
                {loading ? "..." : error ? "!" : carAwaitingCount}
              </div>
            )}
            {card.title === "Manage Tour Bookings" && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold shadow-lg">
                {loading ? "..." : error ? "!" : awaitingtourCount}
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
