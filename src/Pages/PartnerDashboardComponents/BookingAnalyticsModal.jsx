import React, { useEffect, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import { FaBed } from "react-icons/fa";

const statusBadge = {
  CANCELLED: "bg-red-500 text-white",
  RELEASED: "bg-yellow-500 text-white",
  CONFIRMED: "bg-blue-500 text-white",
  COMPLETED: "bg-green-500 text-white",
};

const BookingAnalyticsModal = ({ data, onClose }) => {
  const modalRef = useRef();

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!data) return null;

  const badgeClass = statusBadge[data.status] || "bg-gray-500 text-white";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 overflow-y-auto">
      <div
        ref={modalRef}
        className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-gray-200 relative animate-fadeIn"
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b rounded-t-2xl bg-gray-50">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-800">Booking Details</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeClass}`}>
              {data.status}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Modal"
            className="text-gray-600 hover:text-red-600 transition rounded-full p-1 hover:bg-gray-100"
          >
            <IoMdClose size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
            {[
              ["Booking Code", data.bookingGroupCode],
              ["Hotel", data.hotelName],
              ["Customer", data.customerName],
              ["Phone", data.customerPhone],
              ["Email", data.customerEmail],
              ["Created At", new Date(data.createdAt).toLocaleString()],
              ["Check-in", data.checkinDate],
              ["Check-out", data.checkoutDate],
              ["Guests", data.numberOfGuests],
              ["Total Amount", `₹${data.totalAmount}`],
              ["Payment ID", data.paymentId],
              ["Refund Amount", `₹${data.refundAmount}`],
            ].map(([label, value]) => (
              <div key={label}>
                <div className="text-xs text-gray-500">{label}</div>
                <div className="font-medium text-gray-900 truncate">{value || "-"}</div>
              </div>
            ))}
          </div>

          {/* Rooms Booked */}
          <div className="pt-5">
          {data.roomTypes && (
            <div className="border border-gray-200 rounded-xl p-5 bg-gray-50 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <FaBed className="text-blue-600" />
                <span className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Rooms Booked</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {Object.entries(data.roomTypes).map(([type, count]) => (
                  <span
                    key={type}
                    className="bg-blue-600 text-white px-4 py-1.5 rounded-xl text-sm font-medium shadow border border-blue-800/20 flex items-center gap-2"
                  >
                    <FaBed className="text-white/80" />
                    {type}: <span className="font-bold">{count}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingAnalyticsModal;
