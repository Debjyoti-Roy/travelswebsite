import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cancelBooking, confirmBooking, getCarAwaiting } from "../../Redux/store/adminCarSlice";
import toast from "react-hot-toast";

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

const ManageCarBookings = () => {
    const dispatch = useDispatch();
    const [reason, setReason] = useState("");
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const { getAwaiting, getAwaitingLoading, getAwaitingError, confirmLoading, confirmSuccess, confirmerror, confirmstatus } = useSelector(
        (state) => state.admincar
    );

    useEffect(() => {
        dispatch(getCarAwaiting());
        const interval = setInterval(() => {
            dispatch(getCarAwaiting());
        }, 60000);
        return () => clearInterval(interval);
    }, [dispatch]);

    const handleConfirm = (id) => {
        dispatch(confirmBooking({ bookingId: id }))
            .unwrap()
            .then(() => {
                dispatch(getCarAwaiting());
            })
            .catch((err) => {
                toast.error("Booking not confirmed.", {
                    style: {
                        borderRadius: "10px",
                        background: "#333",
                        color: "#fff",
                    },
                });
            });
    };

    const openCancelModal = (id) => {
        setSelectedBookingId(id);
        setShowCancelModal(true);
        setReason("");
        // dispatch(cancelBooking({ bookingId: id }))
        //     .unwrap()
        //     .then(() => {
        //         dispatch(getCarAwaiting());
        //     })
        //     .catch((err) => {
        //         toast.error("Booking not confirmed.", {
        //             style: {
        //                 borderRadius: "10px",
        //                 background: "#333",
        //                 color: "#fff",
        //             },
        //         });
        //     });
    };
    const closeCancelModal = () => {
        setShowCancelModal(false);
        setSelectedBookingId(null);
        setReason("");
    };

    const handleCancel = () => {
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
        dispatch(cancelBooking({ bookingId: selectedBookingId, reason: reason }))
            .unwrap()
            .then(() => {
                dispatch(getCarAwaiting());
                setShowCancelModal(false);
                setSelectedBookingId(null);
                setReason("");
            })
            .catch((err) => {
                toast.error("Booking not confirmed.", {
                    style: {
                        borderRadius: "10px",
                        background: "#333",
                        color: "#fff",
                    },
                });
            });
    }

    const handleSearchDrivers = (id) => {
        console.log("Search drivers for booking", id);
        // TODO: open driver search modal
    };

    return (
        <div className="min-h-screen p-6 bg-gray-100">
            <h1 style={{ marginBottom: "15px" }} className="text-2xl font-bold text-gray-800 mb-6">
                Awaiting Bookings
            </h1>
            <div className="overflow-x-auto bg-white rounded-xl shadow">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-200 text-gray-700 text-left">
                            <th className="p-3">Title</th>
                            <th className="p-3">Car Model</th>
                            <th className="p-3">Booking Code</th>
                            <th className="p-3">Pick-up</th>
                            <th className="p-3">Drop-off</th>
                            <th className="p-3">Destination</th>
                            <th className="p-3">Journey Date</th>
                            <th className="p-3">Duration (Days)</th>
                            <th className="p-3">Price</th>
                            <th className="p-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {getAwaiting.map((booking) => (
                            <tr
                                key={booking.bookingId}
                                className="hover:bg-gray-50 transition"
                            >
                                <td className="p-3 font-semibold">{booking.packageName}</td>
                                <td className="p-3 font-semibold">{booking.carModel}</td>
                                <td className="p-3 text-sm">{booking.bookingGroupCode}</td>
                                <td className="p-3 text-sm">{booking.pickUpLocation}</td>
                                <td className="p-3 text-sm">{booking.dropOffLocation}</td>
                                <td className="p-3 text-sm">{booking.destination}</td>
                                <td className="p-3 text-sm">{booking.journeyDate}</td>
                                <td className="p-3 text-sm">{booking.durationDays}</td>
                                <td className="p-3 text-sm">₹{booking.totalPrice}</td>
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
                                    <button
                                        onClick={() => handleSearchDrivers(booking.bookingId)}
                                        className="px-4 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm"
                                    >
                                        Search Drivers
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {getAwaiting.length === 0 && !getAwaitingLoading && (
                            <tr>
                                <td colSpan="9" className="p-4 text-center text-gray-500">
                                    No bookings found
                                </td>
                            </tr>
                        )}
                        {getAwaitingLoading && (
                            <tr>
                                <td colSpan="9" className="p-4 text-center text-gray-500">
                                    Loading bookings...
                                </td>
                            </tr>
                        )}
                        {getAwaitingError && (
                            <tr>
                                <td colSpan="9" className="p-4 text-center text-red-500">
                                    Failed to load bookings
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

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

export default ManageCarBookings;
