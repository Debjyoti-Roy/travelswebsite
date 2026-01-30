import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPickupBookings } from "../../Redux/store/adminCarPickupSlice";
import { useNavigate } from "react-router-dom";
import { setCurrentPickupBookings } from "../../Redux/store/driveModeSlice";

const formatDate = (isoString) => {
  if (!isoString) return "—";
  const d = new Date(isoString);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const CarPickupBookings = () => {
  const [tab, setTab] = React.useState("Pending");
  const dispatch = useDispatch();
  const navigate=useNavigate()
  const {
    pickupBookings,
    getPickupBookingsLoading,
    getPickupBookingsError,
  } = useSelector((state) => state.adminCarPickup);

  const status = tab === "Pending" ? "PENDING" : "COMPLETED";

  useEffect(() => {
    dispatch(getPickupBookings({ status }));
  }, [dispatch, status]);

  const handleCancel = (booking) => {
    console.log("Cancel", booking.id);
  };

  const handleFindDrivers = (booking) => {
    const encodedBooking = btoa(encodeURIComponent(JSON.stringify(booking)));
    dispatch(setCurrentPickupBookings(booking))
    navigate(`/admin/carpickupbookings/findpickupdriver`);
  };
  

  const data = pickupBookings ?? [];
  const loading = getPickupBookingsLoading;
  const error = getPickupBookingsError;
  const showActions = tab === "Pending";
  const colCount = showActions ? 9 : 8;

  return (
    <div className="min-h-screen p-6">
      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {["Pending", "Completed"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg font-medium ${
              tab === t
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-700 text-left">
              <th className="p-3">ID</th>
              <th className="p-3">Booking Group Code</th>
              <th className="p-3">Journey Start</th>
              <th className="p-3">Price</th>
              <th className="p-3">Pick Up</th>
              <th className="p-3">Drop Off</th>
              <th className="p-3">Distance (in Km)</th>
              <th className="p-3">People</th>
              {showActions && (
                <th className="p-3 text-center">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50 transition">
                <td className="p-3">{booking.id}</td>
                <td className="p-3 font-medium">{booking.bookingGroupCode}</td>
                <td className="p-3 text-sm">
                  {formatDate(booking.journeyStartDate)}
                </td>
                <td className="p-3">{booking.price}</td>
                <td className="p-3">{booking.pickUpLocation}</td>
                <td className="p-3">{booking.dropOffLocation}</td>
                <td className="p-3">{booking.distance}</td>
                <td className="p-3">{booking.numberOfPeople}</td>
                {showActions && (
                  <td className="p-3">
                    <div className="flex gap-2 justify-center items-center">
                      <button
                        onClick={() => handleCancel(booking)}
                        className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleFindDrivers(booking)}
                        className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm"
                      >
                        Find Drivers
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}

            {data.length === 0 && !loading && !error && (
              <tr>
                <td
                  colSpan={colCount}
                  className="p-4 text-center text-gray-500"
                >
                  No pickup bookings found
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td
                  colSpan={colCount}
                  className="p-4 text-center text-gray-500"
                >
                  Loading...
                </td>
              </tr>
            )}
            {error && (
              <tr>
                <td
                  colSpan={colCount}
                  className="p-4 text-center text-red-500"
                >
                  {error}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CarPickupBookings;
