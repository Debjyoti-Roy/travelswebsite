import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserCarPackageBookings } from '../../Redux/store/profileSlice';
import { cancelcarPackageBooking, getRefundStatus } from '../../Redux/store/carPackageSlice';
import PaymentDeadline from '../MyBookingsComponents/PaymentDeadline';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Clock, XCircle } from 'lucide-react';


const statusMap = {
    // ALL: "",
    Upcoming: "CONFIRMED",
    "Payment Pending": "PENDING,AWAITING_CUSTOMER_PAYMENT",
    Past: "COMPLETED",
    Canceled: "EXPIRED,REJECTED,CANCELLED",
    Processing: "AWAITING_ADMIN_CONFIRMATION",
};

// Custom dropdown options for each tab
const tabDropdownOptions = {
    Upcoming: ["CONFIRMED"],
    "Payment Pending": ["ALL", "PENDING", "PAYMENT PENDING"],
    // "Payment Pending": ["ALL","PENDING","AWAITING_CUSTOMER_PAYMENT"],
    Processing: ["PENDING ADMIN CONFIRMATION"],
    Past: ["COMPLETED"],
    Canceled: ["ALL", "EXPIRED", "REJECTED", "CANCELLED"],
};

const MyCarPackageBookings = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [expandedCards, setExpandedCards] = useState({});
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [status, setStatus] = useState("Upcoming");
    const [selectedDropdownOption, setSelectedDropdownOption] = useState("All Upcoming");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    //Button scheduler
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        // Update every 1 minute (or 1 second if you need more accuracy)
        const interval = setInterval(() => {
            setNow(new Date());
        }, 1000 * 60);

        return () => clearInterval(interval);
    }, []);

    // Not eligible for refund confirm modal state
    const [showNotEligibleConfirmModal, setShowNotEligibleConfirmModal] = useState(false);
    const [pendingCancelBookingId, setPendingCancelBookingId] = useState(null);
    const [refundStatusData, setRefundStatusData] = useState({})
    const {
        carPackagebookings,
        carPackagebookingsLoading,
        carPackagebookingsError,
        carPackagebookingsStatus
    } = useSelector((state) => state.profile);
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
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            dispatch(fetchUserCarPackageBookings({ token, page: pageNum, size, status: selectedStatus }))
            if (carPackagebookingsStatus !== 200) {
                setError("Failed to fetch bookings. Please try again later.");
                setTotalPages(1);
                setPage(0);
            }
        } catch (err) {
            setError("Failed to fetch bookings. Please try again later.");
            setTotalPages(1);
            setPage(0);
        }
    }
    useEffect(() => {
        if (status === "Payment Pending" && selectedDropdownOption === "ALL") {
            fetchBookings(0, "PENDING,AWAITING_CUSTOMER_PAYMENT");

        } else if (status === "Canceled" && selectedDropdownOption === "ALL") {
            fetchBookings(0, "EXPIRED,REJECTED,CANCELLED");
        } else if (selectedDropdownOption !== "PAYMENT PENDING" && selectedDropdownOption !== "PENDING ADMIN CONFIRMATION") {

            fetchBookings(0, selectedDropdownOption);
        } else if (selectedDropdownOption === "PAYMENT PENDING") {
            fetchBookings(0, "AWAITING_CUSTOMER_PAYMENT");
        } else if (selectedDropdownOption === "PENDING ADMIN CONFIRMATION") {
            fetchBookings(0, "AWAITING_ADMIN_CONFIRMATION");
        }else{

            fetchBookings(0, "CONFIRMED");
        }
    }, []);
    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            fetchBookings(newPage);
        }
    };
    const handleDropdownChange = (dropdownOption) => {
        setSelectedDropdownOption(dropdownOption);
        if (status === "Payment Pending" && dropdownOption === "ALL") {
            fetchBookings(0, "PENDING,AWAITING_CUSTOMER_PAYMENT");

        } else if (status === "Canceled" && dropdownOption === "ALL") {
            fetchBookings(0, "EXPIRED,REJECTED,CANCELLED");
        } else if (dropdownOption !== "PAYMENT PENDING" && dropdownOption !== "PENDING ADMIN CONFIRMATION") {

            fetchBookings(0, dropdownOption);
        } else if (dropdownOption === "PAYMENT PENDING") {
            fetchBookings(0, "AWAITING_CUSTOMER_PAYMENT");
        } else if (dropdownOption === "PENDING ADMIN CONFIRMATION") {
            fetchBookings(0, "AWAITING_ADMIN_CONFIRMATION");
        }
    };
    const handleStatusChange = (option) => {
        console.log(option)
        setStatus(option);
        setSelectedDropdownOption(tabDropdownOptions[option][0]);
        if (option === "Payment Pending") {
            // fetchBookings(0, statusMap[option]);
            fetchBookings(0, "PENDING,AWAITING_CUSTOMER_PAYMENT");
        } else if (option === "Canceled") {
            fetchBookings(0, "EXPIRED,REJECTED,CANCELLED");
        } else {
            console.log(statusMap[option])
            fetchBookings(0, statusMap[option]);
        }
    };
    const handleCancelBooking = async () => {
        setCancelLoading(true);
        const token = localStorage.getItem('token');
        await dispatch(
            cancelcarPackageBooking({ token, bookingGroupCode: cancelBookingId, cancelReason })
        );
        setCancelLoading(false);
        setShowCancelModal(false);
        setCancelBookingId(null);
        setCancelReason("");
        setShowCustomReason(false);
        // Refetch bookings
        fetchBookings(page, "CONFIRMED");
    };
    const handleReasonSelect = (reason) => {
        if (reason === "Others") {
            setShowCustomReason(true);
            setCancelReason("Others");
        } else {
            setShowCustomReason(false);
            setCancelReason(reason);
        }
    };
    const handleRefundStatus = async (bookingGroupCode) => {
        try {
            // console.log("HELLO")
            const token = localStorage.getItem('token');
            const result = await dispatch(getRefundStatus({ token, bookingGroupCode }));
            console.log(result)
            if (result.error) {
                setNotEligibleMessage("Unfortunately, this booking is not eligible for a refund. If you believe this is a mistake or have questions, please contact our support team for assistance.");
                setShowNotEligibleModal(true);
                return;
            }
            //   console.log(refundStatus)
            setRefundStatusData(result.payload)
            setRefundBookingId(bookingGroupCode);
            setShowRefundModal(true);
        } catch (error) {
            setNotEligibleMessage("Unfortunately, this booking is not eligible for a refund. If you believe this is a mistake or have questions, please contact our support team for assistance.");
            setShowNotEligibleModal(true);
        }
    };
    const topRef = useRef(null);

    useEffect(() => {
        if (topRef.current) {
            const navbarHeight = 80; // px height of your navbar
            const elementTop = topRef.current.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
                top: elementTop - navbarHeight,
                behavior: "smooth",
            });
        }
    }, []);
    return (
        <div className="flex justify-center pt-10 pb-20">
            <div ref={topRef} className="w-full px-4">

                {/* <h2 className="text-2xl font-bold text-gray-800 pb-6 text-center">My Bookings</h2> */}

                {/* Filter Tabs */}
                <div className="w-full pb-6">
                    {/* Wrapper flexbox */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                        {/* Tabs */}
                        <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                            {Object.keys(statusMap).map((option) => (
                                <button
                                    key={option}
                                    onClick={() => handleStatusChange(option)}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${status === option
                                        ? "bg-blue-600 text-white shadow-md"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                                        }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>

                        {/* Dropdown */}
                        {(status !== "ALL" && status !== "Upcoming" && status !== "Past" && status !== "Processing") && (
                            <div className="flex justify-center lg:justify-end">
                                <div className="relative">
                                    <select
                                        value={selectedDropdownOption}
                                        onChange={(e) => handleDropdownChange(e.target.value)}
                                        className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer hover:border-gray-400 transition-colors"
                                    >
                                        {tabDropdownOptions[status]?.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <svg
                                            className="w-4 h-4 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>



                {/* Bookings */}
                {carPackagebookingsLoading ? (
                    <div className="space-y-4">
                        {/* Skeleton Cards */}
                        {[1, 2, 3].map((index) => (
                            <div
                                key={index}
                                className="relative border border-gray-200 p-5 rounded-xl shadow-sm bg-white animate-pulse"
                            >
                                <div className="flex justify-between items-start">
                                    {/* Left side */}
                                    <div className="flex-1 pr-4 space-y-3">
                                        <div className="h-5 bg-gray-200 rounded w-40"></div>
                                        <div className="h-4 bg-gray-200 rounded w-60"></div>
                                        <div className="h-4 bg-gray-200 rounded w-48"></div>
                                    </div>

                                    {/* Right side */}
                                    <div className="flex flex-col justify-start gap-3 items-end text-right pl-4">
                                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                                    </div>
                                </div>

                                {/* Button */}
                                <div className="absolute bottom-4 right-4">
                                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                                </div>
                            </div>


                        ))}
                    </div>
                ) : carPackagebookingsError ? (
                    <div className="flex flex-col items-center justify-center py-16 px-4">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Data Available</h3>
                    </div>
                ) : carPackagebookings.content?.length > 0 ? (
                    carPackagebookings.content?.map((item) => (
                        <div
                            key={item.bookingGroupCode}
                            onClick={() => toggleExpand(item.bookingGroupCode)}
                            className="relative border border-gray-200 p-4 md:p-5 rounded-xl shadow-sm bg-white transition-all duration-300 hover:shadow-lg hover:scale-[1.01] hover:border-blue-500 hover:bg-blue-50 cursor-pointer"
                        >
                            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-500 pb-1">
                                        Booking ID: <span className="font-medium break-all">{item.bookingGroupCode}</span>
                                    </p>

                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                        <h3 className="text-base md:text-lg font-semibold text-gray-800 break-words">{item.carPackageName}</h3>
                                        <span
                                            className={`inline-block px-2 py-1 text-xs rounded-full font-medium self-start sm:self-center ${item.status === "CONFIRMED"
                                                ? "bg-green-100 text-green-700"
                                                : item.status === "CANCELLED"
                                                    ? "bg-red-100 text-red-700"
                                                    : item.status === "PARTIALLY_CANCELLED"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : item.status === "COMPLETED"
                                                            ? "bg-blue-100 text-blue-700"
                                                            : "bg-gray-100 text-gray-700"
                                                }`}
                                        >
                                            {item.status.replace(/_/g, " ")}
                                        </span>
                                    </div>
                                    <div className="flex flex-col sm:flex-col gap-2 mb-2">
                                        {/* <h5 className="text-base md:text-md font-semibold text-gray-800">Car Type: {item.carType}</h5> */}
                                        <h5 className="text-base md:text-md font-semibold text-gray-800">Car: {item.carModel}({item.carType})</h5>
                                    </div>

                                    {/* <div className="space-y-2 mb-3">
                    {item.roomBookingsList.map((room, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="text-sm text-gray-700">
                          <span className="font-medium">{room.roomName}</span> ({room.numberOfRooms} room{room.numberOfRooms > 1 ? "s" : ""}) — ₹{room.totalPrice}
                        </div>
                        {item.status === "PARTIALLY_CANCELLED" && (
                          <span
                            className={`inline-block px-2 py-1 text-xs rounded-full font-medium self-start sm:self-center ${room.status === "CONFIRMED"
                              ? "bg-green-100 text-green-700"
                              : room.status === "CANCELLED"
                                ? "bg-red-100 text-red-700"
                                : room.status === "PARTIALLY_CANCELLED"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : room.status === "COMPLETED"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-gray-100 text-gray-700"
                              }`}
                          >
                            {room.status.replace(/_/g, " ")}
                          </span>
                        )}
                      </div>
                    ))}
                  </div> */}

                                    {/* Hotel address and contact */}
                                    {/* <div className="text-sm text-gray-600 space-y-1">
                    <p className="break-words">
                      {item.hotelAddress}
                    </p>
                    <p className="break-all">
                      {item.hotelContact}
                    </p>
                    
                    </div> */}
                                    {(item.status === "PENDING" || item.status === "AWAITING_CUSTOMER_PAYMENT") && (
                                        <PaymentDeadline expiredAt={item.expiredAt} />
                                    )}
                                </div>

                                <div className="flex flex-col items-start lg:items-end text-left lg:text-right text-xs text-gray-500 space-y-1 lg:space-y-0">
                                    <p>Journey Start Date: {item.journeyStartDate}</p>
                                    <p>Duration: {item.duration}</p>
                                    <p className="font-semibold text-sm">Total Price: ₹{item.totalPrice}</p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-end">
                                {item.status === "CONFIRMED" && (
                                    <button
                                        className="w-full sm:w-auto px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
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
                                        Cancel Booking
                                    </button>
                                )}

                                {(item.status === "CANCELLED" || item.status === "REJECTED") && (
                                    <button
                                        className="w-full sm:w-auto px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                                        onClick={e => {
                                            e.stopPropagation();
                                            handleRefundStatus(item.bookingGroupCode);
                                        }}
                                    >
                                        See Refund Status
                                    </button>
                                )}
                                {item.status === "PENDING" && now < new Date(item.expiredAt) && (
                                    <button
                                        className="w-full sm:w-auto px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                                        onClick={e => {
                                            e.stopPropagation();
                                            // Navigate to payment page
                                            const payment = item.payments;
                                            const pay = payment.filter(item => item.paymentType === "TOKEN");
                                            const razorId = pay[0]?.razorpayOrderId;
                                            navigate(`/pay-bookings?orderId=${razorId}&bookingCode=${item.bookingGroupCode}`);
                                        }}
                                    >
                                        Pay Now
                                    </button>
                                )}
                                {item.status === "AWAITING_ADMIN_CONFIRMATION" && (
                                    <button
                                        className="w-full sm:w-auto px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
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

                                {item.status === "AWAITING_CUSTOMER_PAYMENT" && now < new Date(item.expiredAt) && (
                                    <>
                                        <button
                                            className="w-full sm:w-auto px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                                            onClick={e => {
                                                e.stopPropagation();
                                                // Calculate days difference
                                                const today = new Date();
                                                const checkInDate = new Date(item.checkIn);
                                                const diffTime = checkInDate - today;
                                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                                setShowCancelModal(true);
                                                setCancelBookingId(item.bookingGroupCode);
                                                setCancelReason("");
                                                setShowCustomReason(false);
                                                // }
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="w-full sm:w-auto px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                                            onClick={e => {
                                                e.stopPropagation();
                                                // Navigate to payment page
                                                const payment = item.payments;
                                                const pay = payment.filter(item => item.paymentType === "FINAL");
                                                const razorId = pay[0]?.razorpayOrderId;
                                                navigate(`/pay-bookings?orderId=${razorId}&bookingCode=${item.bookingGroupCode}`);
                                            }}
                                        >
                                            Pay Now
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 px-4">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Bookings Found</h3>
                        <p className="text-gray-600 text-center max-w-md">
                            {status === "ALL"
                                ? "You haven't made any bookings yet. Start exploring car packages and make your first reservation!"
                                : `No ${selectedDropdownOption.toLowerCase()} ${status.toLowerCase()} bookings found.`
                            }
                        </p>
                        <button
                            onClick={() => navigate("/")}
                            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Explore Car Packages
                        </button>
                    </div>
                )}

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
                {showRefundModal && refundStatusData && (
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
                                                className={`w-5 h-5 ${["INITIATED", "PARTIALLY_COMPLETED", "PARTIALLY_FAILED", "COMPLETED"].includes(
                                                    refundStatusData.refundStatus
                                                )
                                                    ? "text-blue-600"
                                                    : "text-red-500"
                                                    }`}
                                            />
                                            <span className="text-sm font-medium">INITIATED</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium">COMPLETED</span>
                                            <CheckCircle
                                                className={`w-5 h-5 ${refundStatusData.refundStatus === "COMPLETED"
                                                    ? "text-green-600"
                                                    : "text-gray-400"
                                                    }`}
                                            />
                                        </div>
                                    </div>

                                    {/* Gradient Progress Line */}
                                    <div className="relative h-2 rounded bg-gray-200">
                                        <div
                                            className={`absolute inset-0 transition-all duration-300 ${["FAILED", "PARTIALLY_FAILED"].includes(refundStatusData.refundStatus)
                                                ? "bg-gradient-to-r from-red-400 to-red-600"
                                                : "bg-gradient-to-r from-blue-400 to-blue-600"
                                                }`}
                                            style={{
                                                width:
                                                    refundStatusData.refundStatus === "COMPLETED"
                                                        ? "100%"
                                                        : refundStatusData.refundStatus === "PARTIALLY_COMPLETED"
                                                            ? "75%"
                                                            : refundStatusData.refundStatus === "INITIATED"
                                                                ? "50%"
                                                                : refundStatusData.refundStatus === "FAILED"
                                                                    ? "0%"
                                                                    : refundStatusData.refundStatus === "PARTIALLY_FAILED"
                                                                        ? "0%"
                                                                        : "0%",
                                            }}
                                        ></div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="mt-4 text-center">
                                        <span
                                            className={`inline-flex items-center gap-2 px-4 py-1 rounded-full text-sm font-medium transition ${refundStatusData.refundStatus === "COMPLETED"
                                                ? "bg-green-100 text-green-700"
                                                : ["FAILED", "PARTIALLY_FAILED"].includes(refundStatusData.refundStatus)
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-blue-100 text-blue-700"
                                                }`}
                                        >
                                            {refundStatusData.refundStatus === "COMPLETED" && <CheckCircle className="w-4 h-4" />}
                                            {["FAILED", "PARTIALLY_FAILED"].includes(refundStatusData.refundStatus) && (
                                                <XCircle className="w-4 h-4" />
                                            )}
                                            {["INITIATED", "PARTIALLY_COMPLETED"].includes(refundStatusData.refundStatus) && (
                                                <Clock className="w-4 h-4" />
                                            )}
                                            {refundStatusData.refundStatus}
                                        </span>
                                    </div>
                                </div>

                                {/* Refund Details */}
                                <div className="space-y-4 pb-6 text-sm text-gray-700">
                                    {/* Common Details */}
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Cancel Reason:</span>
                                        <span className="font-medium text-gray-800">{refundStatusData.cancelReason}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Cancelled On:</span>
                                        <span className="text-gray-800">
                                            {new Date(refundStatusData.cancelAt).toLocaleDateString()}
                                        </span>
                                    </div>

                                    {/* Conditional Details */}
                                    {refundStatusData.refundStatus === "INITIATED" && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">To be Refunded:</span>
                                            <span className="font-semibold text-gray-800">₹{refundStatusData.refundPending}</span>
                                        </div>
                                    )}

                                    {refundStatusData.refundStatus === "PARTIALLY_COMPLETED" && (
                                        <>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">To be Refunded:</span>
                                                <span className="font-semibold text-gray-800">₹{refundStatusData.refundPending}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Refunded Amount:</span>
                                                <span className="font-semibold text-gray-800">₹{refundStatusData.refundAmount}</span>
                                            </div>
                                        </>
                                    )}

                                    {refundStatusData.refundStatus === "PARTIALLY_FAILED" && (
                                        <>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Refunded Amount:</span>
                                                <span className="font-semibold text-gray-800">₹{refundStatusData.refundAmount}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Refund Failed Amount:</span>
                                                <span className="font-semibold text-gray-800">₹{refundStatusData.refundFailed}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Failure Reason:</span>
                                                <span className="font-medium text-red-600">{refundStatusData.failureReason}</span>
                                            </div>
                                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                                                Please contact customer support for further assistance.
                                            </div>
                                        </>
                                    )}

                                    {refundStatusData.refundStatus === "FAILED" && (
                                        <>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Refund Failed Amount:</span>
                                                <span className="font-semibold text-gray-800">₹{refundStatusData.refundFailed}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Failure Reason:</span>
                                                <span className="font-medium text-red-600">{refundStatusData.failureReason}</span>
                                            </div>
                                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                                                Please contact customer support for further assistance.
                                            </div>
                                        </>
                                    )}

                                    {refundStatusData.refundStatus === "COMPLETED" && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Refunded Amount:</span>
                                            <span className="font-semibold text-gray-800">₹{refundStatusData.refundAmount}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Info Box */}
                                {refundStatusData.refundStatus === "INITIATED" && (
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
                {!loading && !error && bookings.length > 0 && (
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
                )}
            </div>
        </div>
    )
}

export default MyCarPackageBookings