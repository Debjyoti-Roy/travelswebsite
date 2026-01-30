import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getLatestCarPickupBooking,
    getAllCarPickupBookings,
    cancelCarPickupBookings,
    resetCancel,
} from "../../Redux/store/profileSlice";
import { cancelPickupCarBooking } from "../../Redux/store/adminCarPickupSlice";
import { MapPin, Calendar, Users, Car, Phone, DollarSign, IndianRupee } from "lucide-react";

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

const statusStyles = {
    PENDING: "bg-amber-100 text-amber-800",
    CONFIRMED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
    COMPLETED: "bg-blue-100 text-blue-800",
};

const MyCarPickupBookings = () => {
    const dispatch = useDispatch();
    const {
        latestCarPickupBooking,
        latestCarPickupBookingLoading,
        latestCarPickupBookingError,
        allCarPickupBookings,
        allCarPickupBookingsLoading,
        allCarPickupBookingsError,
    } = useSelector((state) => state.profile);
    const {
        cancelCarPickupBookingLoading,
        cancelCarPickupBookingSuccess,
        cancelCarPickupBookingError,
    } = useSelector((state) => state.profile);

    const {
        cancelPickupBookingLoading,
        cancelPickupBookingError,
    } = useSelector((state) => state.adminCarPickup);

    useEffect(() => {
        dispatch(getLatestCarPickupBooking());
        dispatch(getAllCarPickupBookings());
    }, [dispatch]);

    const otherBookings = (allCarPickupBookings || []).filter(
        (b) => b.bookingId !== latestCarPickupBooking?.bookingId
    );

    const canCancel = (status) =>
        status === "PENDING" || status === "CONFIRMED";

    const handleCancel = async (bookingId) => {
        // const result = await dispatch(cancelPickupCarBooking({ bookingId }));
        // if (cancelPickupCarBooking.fulfilled.match(result)) {
        //     dispatch(getLatestCarPickupBooking());
        //     dispatch(getAllCarPickupBookings());
        // }()
        // console.log(bookingId)
        dispatch(cancelCarPickupBookings({ bookingId }))
    };
    useEffect(() => {
        if (cancelCarPickupBookingSuccess) {
            dispatch(getLatestCarPickupBooking());
            dispatch(getAllCarPickupBookings());
            dispatch(resetCancel())
        }
    }, [cancelCarPickupBookingSuccess])


    const loading =
        latestCarPickupBookingLoading || allCarPickupBookingsLoading;
    const error = latestCarPickupBookingError?.message || allCarPickupBookingsError?.message;

    return (
        <div className="space-y-8">
            {loading && (
                <div className="text-center py-8 text-gray-500">
                    Loading your car pickup bookings...
                </div>
            )}
            {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3">
                    {error}
                </div>
            )}
            {cancelPickupBookingError && (
                <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3">
                    {cancelPickupBookingError}
                </div>
            )}

            {!loading && (
                <>
                    {/* Latest booking – full detail */}
                    {latestCarPickupBooking && (
                        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-3">
                                <h2 className="text-lg font-semibold text-white">
                                    Latest booking
                                </h2>
                                <p className="text-blue-100 text-sm">
                                    Booking ID: {latestCarPickupBooking.bookingId}
                                </p>
                            </div>
                            <div className="p-5 space-y-4">
                                <div style={{ marginBottom: '10px' }} className="flex flex-wrap gap-2">
                                    <span
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusStyles[latestCarPickupBooking.status] ||
                                            "bg-gray-100 text-gray-800"
                                            }`}
                                    >
                                        {latestCarPickupBooking.status}
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 uppercase">
                                                Pick up
                                            </p>
                                            <p className="text-gray-800">
                                                {latestCarPickupBooking.pickUpLocation || "—"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 uppercase">
                                                Drop off
                                            </p>
                                            <p className="text-gray-800">
                                                {latestCarPickupBooking.dropLocation || "—"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Calendar className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 uppercase">
                                                Pick up time
                                            </p>
                                            <p className="text-gray-800">
                                                {formatDate(latestCarPickupBooking.pickUpTime)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Calendar className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 uppercase">
                                                Created at
                                            </p>
                                            <p className="text-gray-800">
                                                {formatDate(latestCarPickupBooking.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Users className="w-5 h-5 text-gray-600 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 uppercase">
                                                Passengers
                                            </p>
                                            <p className="text-gray-800">
                                                {latestCarPickupBooking.numberOfPeople ?? "—"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <IndianRupee className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 uppercase">
                                                Price
                                            </p>
                                            <p className="text-gray-800">
                                                {latestCarPickupBooking.price != null
                                                    ? `₹${latestCarPickupBooking.price}`
                                                    : "—"}
                                            </p>
                                        </div>
                                    </div>
                                    

                                        <div className="flex items-start gap-3">
                                            <span className="text-gray-500 text-sm">Distance</span>
                                            <p className="text-gray-800">
                                                {latestCarPickupBooking.distance != null
                                                    ? `${latestCarPickupBooking.distance} km`
                                                    : "—"}
                                            </p>
                                        </div>
                                        <div className="flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() => handleCancel(latestCarPickupBooking.id)}
                                            disabled={cancelPickupBookingLoading}
                                            className="shrink-0 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white text-sm font-medium rounded-lg"
                                        >
                                            {cancelPickupBookingLoading ? "Cancelling..." : "Cancel"}
                                        </button>
                                        </div>
                                    
                                </div>
                                {(latestCarPickupBooking.driverName ||
                                    latestCarPickupBooking.driverPhone ||
                                    latestCarPickupBooking.carModel ||
                                    latestCarPickupBooking.carPlateNumber) && (
                                        <div className="pt-4 border-t border-gray-100">
                                            <p className="text-sm font-medium text-gray-700 mb-2">
                                                Driver & car
                                            </p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {latestCarPickupBooking.driverName && (
                                                    <div className="flex items-center gap-2">
                                                        <Car className="w-4 h-4 text-gray-500" />
                                                        <span className="text-gray-700">
                                                            {latestCarPickupBooking.driverName}
                                                        </span>
                                                    </div>
                                                )}
                                                {latestCarPickupBooking.driverPhone && (
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="w-4 h-4 text-gray-500" />
                                                        <span className="text-gray-700">
                                                            {latestCarPickupBooking.driverPhone}
                                                        </span>
                                                    </div>
                                                )}
                                                {latestCarPickupBooking.carModel && (
                                                    <p className="text-gray-700">
                                                        {latestCarPickupBooking.carModel}
                                                    </p>
                                                )}
                                                {latestCarPickupBooking.carPlateNumber && (
                                                    <p className="text-gray-600 text-sm">
                                                        {latestCarPickupBooking.carPlateNumber}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                            </div>
                        </div>
                    )}

                    {!latestCarPickupBooking && !loading && (
                        <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center text-gray-500">
                            No latest car pickup booking.
                        </div>
                    )}

                    {/* Other bookings */}
                    <div>
                        <h3 style={{ marginTop: '10px', marginBottom: '5px' }} className="text-lg font-semibold text-gray-800 mb-4">
                            Other bookings
                        </h3>
                        {otherBookings.length === 0 && !loading && (
                            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center text-gray-500">
                                No other car pickup bookings.
                            </div>
                        )}
                        <ul className="space-y-3">
                            {otherBookings.map((booking) => (
                                <li
                                    key={booking.bookingId}
                                    className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm flex flex-wrap items-center justify-between gap-3"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <span className="font-medium text-gray-800 truncate">
                                                {booking.pickUpLocation} → {booking.dropLocation}
                                            </span>
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[booking.status] ||
                                                    "bg-gray-100 text-gray-800"
                                                    }`}
                                            >
                                                {booking.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            {formatDate(booking.pickUpTime)} · {booking.numberOfPeople} pax · ₹
                                            {booking.price ?? "—"}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            ID: {booking.bookingId}
                                        </p>
                                    </div>
                                    {canCancel(booking.status) && (
                                        <button
                                            type="button"
                                            onClick={() => handleCancel(booking.id)}
                                            disabled={cancelPickupBookingLoading}
                                            className="shrink-0 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white text-sm font-medium rounded-lg"
                                        >
                                            {cancelPickupBookingLoading ? "Cancelling..." : "Cancel"}
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
};

export default MyCarPickupBookings;
