import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { cancelBooking, confirmBooking, getAwaiting } from "../../Redux/store/adminSlices";
import toast from "react-hot-toast";

const ManageHotelBooking = () => {
  const dispatch = useDispatch();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reason, setReason] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  // Typical admin cancellation reasons
  const cancellationReasons = [
    "Hotel is overbooked",
    "Hotel is temporarily closed",
    "Maintenance issues",
    "Safety concerns",
    "Hotel policy violation",
    "Payment issues",
    "Customer request",
    "Other"
  ];

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const res = await dispatch(getAwaiting());
        if (res.payload?.status === 200) {
          setBookings(res.payload.data);
        } else {
          setError("Failed to fetch bookings");
        }
      } catch (err) {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();

    const interval = setInterval(() => {
      fetchBookings();
    }, 60000);

    return () => clearInterval(interval);
  }, [dispatch]);

  const handleConfirm = async (id) => {
    console.log("Confirm booking:", id);
    const res = await dispatch(confirmBooking({ bookingId: id }))
    console.log(res)
    if (res.payload.status === 200) {
      toast.success("Booking confirmed successfully", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      setBookings((prev) => prev.filter((item) => item.bookingId !== id))
    } else if (res.payload.status === 409) {
      setBookings((prev) => prev.filter((item) => item.bookingId !== id))
      toast.error("This booking has already been confirmed by another admin", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    } else {
      toast.error("Confirm Booking Failed", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

  const openCancelModal = (id) => {
    setSelectedBookingId(id);
    setShowCancelModal(true);
    setReason("");
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setSelectedBookingId(null);
    setReason("");
  };

  const handleCancel = async () => {
    if (!reason.trim()) {
      toast.error("Please select a cancellation reason", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      return;
    }

    console.log("Cancel booking:", reason);
    const res = await dispatch(cancelBooking({ bookingId: selectedBookingId, reasonforCancel: reason }))
    if (res.payload.status === 200) {
      setBookings((prev) => prev.filter((item) => item.bookingId !== selectedBookingId))
      closeCancelModal();
      toast.success("Booking cancelled successfully", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    } else if (res.payload.status === 409) {
      setBookings((prev) => prev.filter((item) => item.bookingId !== selectedBookingId))
      closeCancelModal();
      toast.error("This booking has already been canceled by another admin", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    } else {
      toast.error("Cancel Booking Failed", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 style={{ marginBottom: "15px" }} className="text-2xl font-bold text-gray-800 mb-6">
        Awaiting Bookings
      </h1>

      {/* {loading && <p>Loading...</p>} */}
      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-700 text-left">
              <th className="p-3">Hotel</th>
              <th className="p-3">Booking Code</th>
              <th className="p-3">Hotel Phone No.</th>
              <th className="p-3">Check-in</th>
              <th className="p-3">Check-out</th>
              <th className="p-3">Rooms</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr
                key={booking.bookingId}
                className="hover:bg-gray-50 transition"
              >
                <td className="p-3 font-semibold">{booking.hotelName}</td>
                <td className="p-3 text-sm">{booking.bookingGroupCode}</td>
                <td className="p-3 text-sm">{booking.phoneNumber}</td>
                <td className="p-3 text-sm">{booking.checkInDate}</td>
                <td className="p-3 text-sm">{booking.checkOutDate}</td>
                <td className="p-3 text-sm">
                  {booking.roomBookings.map((room, idx) => (
                    <div key={idx}>
                      {room.count} × {room.roomType}
                    </div>
                  ))}
                </td>
                <td className="p-3 flex gap-2 justify-center">
                  <button
                    onClick={() => handleConfirm(booking.bookingId)}
                    className="px-4 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => openCancelModal(booking.bookingId)}
                    className="px-4 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && !loading && (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  No bookings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Cancellation Reason Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-[90%] max-w-3xl shadow-xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <h3 className="text-xl font-bold mb-6 text-gray-900">
              Select Cancellation Reason
            </h3>

            {/* Body */}
            <div className="flex-1 overflow-y-auto mb-6">
              <label className="block text-base font-medium text-gray-700 mb-3">
                Reason for cancellation:
              </label>
              <div className="space-y-3">
                {cancellationReasons.map((reasonOption, index) => (
                  <label
                    key={index}
                    className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer transition"
                  >
                    <input
                      type="radio"
                      name="cancellationReason"
                      value={reasonOption}
                      checked={reason === reasonOption}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-5 h-5 text-red-500 border-gray-300 focus:ring-red-500"
                    />
                    <span style={{ marginLeft: "5px" }} className="text-base text-gray-800">{reasonOption}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-4 justify-center md:justify-end">
              <button
                onClick={closeCancelModal}
                className="px-5 py-2.5 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCancel}
                disabled={!reason.trim()}
                className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageHotelBooking;
