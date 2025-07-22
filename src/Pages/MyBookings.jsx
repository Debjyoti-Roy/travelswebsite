import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { fetchUserBookings } from "../Redux/store/profileSlice";
import { cancelBooking, getRefundStatus } from "../Redux/store/hotelSlice";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Clock, XCircle } from "lucide-react";

const MyBookings = () => {
  const dispatch = useDispatch();

  const [bookings, setBookings] = useState([]);
  const [expandedCards, setExpandedCards] = useState({});
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState("ALL");

  // Cancel modal state
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelBookingId, setCancelBookingId] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [showCustomReason, setShowCustomReason] = useState(false);

  // Refund modal state
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundBookingId, setRefundBookingId] = useState(null);

  // Not eligible for refund modal state
  const [showNotEligibleModal, setShowNotEligibleModal] = useState(false);
  const [notEligibleMessage, setNotEligibleMessage] = useState("");

  // Not eligible for refund confirm modal state
  const [showNotEligibleConfirmModal, setShowNotEligibleConfirmModal] = useState(false);
  const [pendingCancelBookingId, setPendingCancelBookingId] = useState(null);

  // Get refund status from Redux
  const { refundStatus, refundLoading, refundError } = useSelector((state) => state.hotel);

  // Predefined cancellation reasons
  const cancellationReasons = [
    "Change of plans",
    "Found better accommodation",
    "Travel dates changed",
    "Emergency situation",
    "Price too high",
    "Location not suitable",
    "Others"
  ];

  const toggleExpand = (id) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const fetchBookings = async (pageNum, selectedStatus = status) => {
    const token = localStorage.getItem("token");
    const res = await dispatch(fetchUserBookings({ token, page: pageNum, size, status: selectedStatus }));
    if (res.payload.status) {
      const data = res.payload.data;
      setBookings(data.content);
      setTotalPages(data.totalPages);
      setPage(data.pageNumber);
    }
  };

  useEffect(() => {
    fetchBookings(0, status);
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchBookings(newPage);
    }
  };

  const handleStatusChange = (e) => {
    const selected = e.target.value;
    setStatus(selected);
    fetchBookings(0, selected);
  };

  // Cancel booking handler
  const handleCancelBooking = async () => {
    setCancelLoading(true);
    const token = localStorage.getItem('token');
    await dispatch(
      cancelBooking({ token, bookingGroupCode: cancelBookingId, cancelReason })
    );
    setCancelLoading(false);
    setShowCancelModal(false);
    setCancelBookingId(null);
    setCancelReason("");
    setShowCustomReason(false);
    // Refetch bookings
    fetchBookings(page, status);
  };

  // Handle reason selection
  const handleReasonSelect = (reason) => {
    if (reason === "Others") {
      setShowCustomReason(true);
      setCancelReason("Others");
    } else {
      setShowCustomReason(false);
      setCancelReason(reason);
    }
  };

  // Handle refund status
  const handleRefundStatus = async (bookingGroupCode) => {
    try {
      const token = localStorage.getItem('token');
      const result = await dispatch(getRefundStatus({ token, bookingGroupCode }));

      if (result.error) {
        setNotEligibleMessage("Unfortunately, this booking is not eligible for a refund. If you believe this is a mistake or have questions, please contact our support team for assistance.");
        setShowNotEligibleModal(true);
        return;
      }

      setRefundBookingId(bookingGroupCode);
      setShowRefundModal(true);
    } catch (error) {
      setNotEligibleMessage("Unfortunately, this booking is not eligible for a refund. If you believe this is a mistake or have questions, please contact our support team for assistance.");
      setShowNotEligibleModal(true);
    }
  };

  // Show error toast when refundError changes
  // useEffect(() => {
  //     if (refundError) {
  //         toast.error("Failed to fetch refund status");
  //     }
  // }, [refundError]);

  return (
    <div className="flex justify-center pt-10 pb-20">
      <div className="w-full md:w-[60%] px-4">
        
        <h2 className="text-2xl font-bold text-gray-800 pb-6 text-center">My Bookings</h2>

        {/* Filter */}
        <div className="md:w-auto w-full pb-4 flex justify-end">
          <select
            value={status}
            onChange={handleStatusChange}
            className="border w-full md:w-auto border-gray-300 rounded px-3 py-2 text-sm"
          >
            {["ALL", "PENDING", "CONFIRMED", "CANCELLED", "PARTIALLY_CANCELLED", "COMPLETED"].map((option) => (
              <option key={option} value={option}>
                {option.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>

        {/* Bookings */}
        {bookings.map((item) => (
          <div
            key={item.bookingGroupCode}
            onClick={() => toggleExpand(item.bookingGroupCode)}
            className="relative border border-gray-200 p-5 rounded-xl shadow-sm bg-white transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-blue-500 hover:bg-blue-50 cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1 pr-4">
                <p className="text-sm text-gray-500 pb-1">
                  Booking ID: <span className="font-medium">{item.bookingGroupCode}</span>
                </p>
                <h3 className="text-lg font-semibold text-gray-800 pb-2">
                  {item.numberOfGuests} Guest{item.numberOfGuests > 1 ? "s" : ""} |{" "}
                  {item.roomBookingsList.length} Room Type{item.roomBookingsList.length > 1 ? "s" : ""}
                </h3>

                <div className="flex gap-[5px] items-center">
                  <h4 className="text-lg font-semibold text-gray-800">{item.hotelName}</h4>
                  <span
                    className={`inline-block px-2 py-[2px] text-xs rounded-full font-medium
                      ${item.status === "CONFIRMED"
                        ? "bg-green-100 text-green-700"
                        : item.status === "CANCELLED"
                          ? "bg-red-100 text-red-700"
                          : item.status === "PARTIALLY_CANCELLED"
                            ? "bg-yellow-100 text-yellow-700"
                            : item.status === "COMPLETED"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                      }
                    `}
                  >
                    {item.status.replace("_", " ")}
                  </span>
                </div>

                {item.roomBookingsList.map((room, idx) => (
                  <div key={idx} className="flex gap-[5px]">
                    <div className="text-sm text-gray-700 pb-1">
                      <span className="font-medium">{room.roomName}</span> ({room.numberOfRooms} room{room.numberOfRooms > 1 ? "s" : ""}) — ₹{room.totalPrice}
                    </div>
                    {item.status === "PARTIALLY_CANCELLED" && (

                      <span
                        className={`inline-block px-2 py-[2px] text-xs rounded-full font-medium
                            ${room.status === "CONFIRMED"
                            ? "bg-green-100 text-green-700"
                            : room.status === "CANCELLED"
                              ? "bg-red-100 text-red-700"
                              : room.status === "PARTIALLY_CANCELLED"
                                ? "bg-yellow-100 text-yellow-700"
                                : room.status === "COMPLETED"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-gray-100 text-gray-700"
                          }
                          `}
                      >
                        {room.status.replace("_", " ")}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-end text-right text-xs text-gray-500">
                <p>Check-in: {item.checkIn}</p>
                <p>Check-out: {item.checkOut}</p>
                <p>Total Guests: {item.numberOfGuests}</p>
                <p>Total Price: {item.totalPrice}</p>
              </div>
            </div>

            {/* Show Button only for confirmed bookings */}
            {item.status === "CONFIRMED" && (
              <button
                className="absolute bottom-4 right-4 px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={e => {
                  e.stopPropagation();
                  // Calculate days difference
                  const today = new Date();
                  const checkInDate = new Date(item.checkIn);
                  const diffTime = checkInDate - today;
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  if (diffDays <= 10) {
                    setPendingCancelBookingId(item.bookingGroupCode);
                    setShowNotEligibleConfirmModal(true);
                  } else {
                    setShowCancelModal(true);
                    setCancelBookingId(item.bookingGroupCode);
                    setCancelReason("");
                    setShowCustomReason(false);
                  }
                }}
              >
                Cancel
              </button>
            )}
            {item.status === "CANCELLED" && (
              <button
                className="absolute bottom-4 right-4 px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={e => {
                  e.stopPropagation();
                  handleRefundStatus(item.bookingGroupCode);
                }}
              >
                See Refund Status
              </button>
            )}
          </div>
        ))}

        {/* Cancel Modal */}
        {showCancelModal && (
          <div
            className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50"
            onClick={() => {
              setShowCancelModal(false);
              setShowCustomReason(false);
            }}
          >
            <div
              className="bg-white p-6 rounded-xl shadow-xl w-[90%] md:w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">Cancel Booking</h2>
              <label className="block mb-2 text-sm font-medium">Reason for cancellation:</label>

              <div className="mb-4 space-y-3">
                {cancellationReasons.map((reason) => (
                  <div
                    key={reason}
                    className="flex items-center cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => handleReasonSelect(reason)}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 flex-shrink-0 ${cancelReason === reason
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                      }`}>
                      {cancelReason === reason && (
                        <div className="w-2 h-2 bg-white rounded-full m-auto"></div>
                      )}
                    </div>
                    <span className="text-gray-700">{reason}</span>
                  </div>
                ))}

                {showCustomReason && (
                  <div className="mt-4 pl-7">
                    <textarea
                      className="w-full border border-gray-300 rounded p-2"
                      rows={3}
                      value={cancelReason}
                      onChange={e => setCancelReason(e.target.value)}
                      placeholder="Enter your custom reason..."
                      autoFocus
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 rounded bg-gray-200 text-gray-700"
                  onClick={() => {
                    setShowCancelModal(false);
                    setShowCustomReason(false);
                  }}
                >
                  Close
                </button>
                <button
                  className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700"
                  disabled={cancelLoading || !cancelReason.trim()}
                  onClick={handleCancelBooking}
                >
                  {cancelLoading ? "Cancelling..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Refund Status Modal */}
        {showRefundModal && refundStatus && (
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center"
            onClick={() => setShowRefundModal(false)}
          >
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="bg-white p-8 rounded-2xl shadow-2xl w-[90%] md:w-full max-w-lg relative"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Refund Status</h2>

                {/* Progress Bar with Icons */}
                <div className="pb-6">
                  <div className="flex justify-between items-center pb-3">
                    <div className="flex items-center gap-2">
                      <Clock
                        className={`w-5 h-5 ${["INITIATED", "COMPLETED"].includes(refundStatus.refundStatus)
                            ? "text-blue-600"
                            : "text-red-500"
                          }`}
                      />
                      <span className="text-sm font-medium">INITIATED</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">COMPLETED</span>
                      <CheckCircle
                        className={`w-5 h-5 ${refundStatus.refundStatus === "COMPLETED"
                            ? "text-green-600"
                            : "text-gray-400"
                          }`}
                      />
                    </div>
                  </div>

                  {/* Gradient Progress Line */}
                  <div className="relative h-2 rounded bg-gray-200 overflow-hidden">
                    <div
                      className={`absolute inset-0 transition-all duration-300 ${refundStatus.refundStatus === "FAILED"
                          ? "bg-gradient-to-r from-red-400 to-red-600"
                          : "bg-gradient-to-r from-blue-400 to-blue-600"
                        }`}
                      style={{
                        width:
                          refundStatus.refundStatus === "COMPLETED" ? "100%" : "50%",
                      }}
                    ></div>
                  </div>

                  {/* Status Badge */}
                  <div className="mt-4 text-center">
                    <span
                      className={`inline-flex items-center gap-2 px-4 py-1 rounded-full text-sm font-medium transition ${refundStatus.refundStatus === "COMPLETED"
                          ? "bg-green-100 text-green-700"
                          : refundStatus.refundStatus === "FAILED"
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                    >
                      {refundStatus.refundStatus === "COMPLETED" && <CheckCircle className="w-4 h-4" />}
                      {refundStatus.refundStatus === "FAILED" && <XCircle className="w-4 h-4" />}
                      {refundStatus.refundStatus === "INITIATED" && <Clock className="w-4 h-4" />}
                      {refundStatus.refundStatus}
                    </span>
                  </div>
                </div>

                {/* Refund Details */}
                <div className="space-y-4 pb-6 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Refund Amount:</span>
                    <span className="font-semibold text-gray-800">₹{refundStatus.refundAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Cancel Reason:</span>
                    <span className="font-medium text-gray-800">{refundStatus.cancelReason}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Cancelled On:</span>
                    <span className="text-gray-800">
                      {new Date(refundStatus.cancelAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Info Box */}
                {refundStatus.refundStatus === "INITIATED" && (
                  <div className="pb-6">

                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-800 mb-4">
                      Your refund will be processed within 5–7 business days.
                    </div>
                  </div>
                )}

                {/* Close Button */}
                <div className="flex justify-end">
                  <button
                    className="px-5 py-2 rounded-xl bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition"
                    onClick={() => setShowRefundModal(false)}
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* Refund Status Not Eligible Modal */}
        {showNotEligibleModal && (
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center"
            onClick={() => setShowNotEligibleModal(false)}
          >
            <div
              className="bg-white p-8 rounded-2xl shadow-2xl w-[90%] md:w-full max-w-lg relative flex flex-col items-center"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex flex-col items-center">
                <svg className="w-16 h-16 text-red-500 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Not Eligible for Refund</h2>
                <p className="text-gray-600 text-center pb-6">{notEligibleMessage}</p>
                <button
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition"
                  onClick={() => setShowNotEligibleModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Not Eligible for Refund Confirm Modal */}
        {showNotEligibleConfirmModal && (
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center"
            onClick={() => setShowNotEligibleConfirmModal(false)}
          >
            <div
              className="bg-white p-8 rounded-2xl shadow-2xl w-[90%] md:w-full max-w-lg relative flex flex-col items-center"
              onClick={e => e.stopPropagation()}
            >
              <svg className="w-16 h-16 text-yellow-500 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Not Eligible for Refund</h2>
              <p className="text-gray-600 text-center pb-6">
                Cancellations within 10 days of check-in are not eligible for a refund. Do you want to continue and cancel your booking anyway?
              </p>
              <div className="flex gap-4">
                <button
                  className="px-5 py-2 rounded-xl bg-gray-200 text-gray-800 font-medium shadow hover:bg-gray-300 transition"
                  onClick={() => setShowNotEligibleConfirmModal(false)}
                >
                  No, Go Back
                </button>
                <button
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition"
                  onClick={() => {
                    setShowNotEligibleConfirmModal(false);
                    setShowCancelModal(true);
                    setCancelBookingId(pendingCancelBookingId);
                    setCancelReason("");
                    setShowCustomReason(false);
                  }}
                >
                  Yes, Cancel Anyway
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center gap-2 pt-6">
          <button
            disabled={page === 0}
            onClick={() => handlePageChange(page - 1)}
            className={`px-3 py-1 rounded ${page === 0 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}`}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i)}
              className={`px-3 py-1 rounded ${page === i ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-blue-100"}`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={page === totalPages - 1}
            onClick={() => handlePageChange(page + 1)}
            className={`px-3 py-1 rounded ${page === totalPages - 1 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"}`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
