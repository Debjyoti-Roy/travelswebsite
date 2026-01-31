import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { finishTrip, getCurrentBooking, resetCurrentBooking, resetFinishTrip, updateLocation, updateStatus } from "../Redux/store/carPackageBookingsSlice";
// import { setPickupActive } from "../Redux/store/driveModeSlice";
import { FaMapMarkerAlt, FaUser, FaPhone, FaCalendarAlt, FaMoneyBillWave, FaMapMarkedAlt } from "react-icons/fa";
import { setPickupActive } from "../Redux/store/driveModeSlice";
import toast from "react-hot-toast";

const formatDateTime = (isoString) => {
    if (!isoString) return "—";
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    });
};

/** Treat empty object or missing data as no booking */
const hasBookingData = (data) => {
    if (!data || typeof data !== "object") return false;
    return Object.keys(data).length > 0;
};



const DriveMode = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [mobileShow, setMobileShow] = useState(true)
    const { carId } = useParams();
    const [status, setStatus] = useState()
    const { currentBookingLoading, currentBookingSuccess, currentBookingData, currentBookingError, updateStatusSuccess, updateStatusError, updateStatusLoading, finishTripLoading, finishTripSuccess, finishTripError } =
        useSelector((state) => state.carPackageBookings);
    const pickupActive = useSelector((state) => state.driveMode.pickupActive);

    const [gpsCoords, setGpsCoords] = useState({ latitude: null, longitude: null, error: null });

    useEffect(() => {
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        console.log("Hello1")
        if (!isMobile) {
            //   navigate("/", { replace: true });
            console.log("Hello2")
            setMobileShow(false)
        }
    }, [navigate]);

    useEffect(() => {
        console.log(currentBookingData)
    }, [currentBookingData])


    // Fetch GPS location (mobile-only usage)
    useEffect(() => {
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        if (!navigator.geolocation && !isMobile) {
            setGpsCoords((prev) => ({ ...prev, error: "Geolocation not supported" }));
            return;
        }
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setGpsCoords({ latitude, longitude, error: null });
                console.log("GPS Latitude:", latitude);
                console.log("GPS Longitude:", longitude);
                dispatch(updateLocation({ carId, latitude, longitude }))
            },
            (err) => {
                setGpsCoords((prev) => ({ ...prev, error: err.message }));
                console.error("GPS Error:", err.message);
            },
            { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
        );
        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    useEffect(() => {
        dispatch(getCurrentBooking({ carId }));
    }, [carId, dispatch]);

    useEffect(() => {
        if (updateStatusLoading) {
            console.log("Loading Started")
        } else if (updateStatusSuccess && !updateStatusError) {
            console.log(updateStatusSuccess)
            dispatch(setPickupActive(status));
        }
    }, [updateStatusSuccess, updateStatusLoading])


    const handleSetActive = () => {
        // dispatch(setPickupActive(true));
        dispatch(updateStatus({ carId, status: true }))
        // dispatch(setPickupActive(true));
        setStatus(true)
        // Add any other logic when setting active
    };

    useEffect(() => {
        console.log(mobileShow)
    }, [mobileShow])



    const handleSetInactive = () => {
        // dispatch(setPickupActive(false));
        dispatch(updateStatus({ carId, status: false }))
        // dispatch(setPickupActive(false));
        setStatus(false)
        // Add any other logic when setting inactive
    };

    const handleFinishTrip = () => {

        console.log(carId)
        console.log(currentBookingData)

        // bookingId:
        dispatch(finishTrip({ carId, tripId: currentBookingData.bookingId }))

    }

    useEffect(() => {
        if (finishTripSuccess) {
            toast.success("Trip successfully finished")
            dispatch(resetFinishTrip())
            dispatch(resetCurrentBooking())
            dispatch(getCurrentBooking({ carId }));

        }
    }, [finishTripSuccess])


    return (
        <div className="min-h-screen bg-gray-100 p-4">
            {/* Mobile-only booking card: visible on small screens, hidden from md up */}
            <div className={`${mobileShow ? "block" : "hidden"}`}>
                {currentBookingLoading && (
                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <p className="text-center text-gray-500">Loading booking...</p>
                    </div>
                )}

                {!currentBookingLoading && hasBookingData(currentBookingData) && (
                    <div className="rounded-2xl bg-white p-4 shadow-md">
                        <h2 className="mb-4 text-lg font-semibold text-gray-800">Current Booking</h2>

                        <div className="space-y-3 text-sm">
                            <div className="flex items-start gap-3">
                                <FaMapMarkerAlt className="mt-0.5 shrink-0 text-green-600" />
                                <div>
                                    <p className="text-gray-500">Pick up</p>
                                    <p className="font-medium text-gray-900">
                                        {currentBookingData.pickUpLocation || "—"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <FaMapMarkerAlt className="mt-0.5 shrink-0 text-red-500" />
                                <div>
                                    <p className="text-gray-500">Drop off</p>
                                    <p className="font-medium text-gray-900">
                                        {currentBookingData.dropOffLocation || "—"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <FaCalendarAlt className="mt-0.5 shrink-0 text-blue-600" />
                                <div>
                                    <p className="text-gray-500">Date & time</p>
                                    <p className="font-medium text-gray-900">
                                        {formatDateTime(currentBookingData.journeyDateTime)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <FaUser className="mt-0.5 shrink-0 text-gray-600" />
                                <div>
                                    <p className="text-gray-500">Customer</p>
                                    <p className="font-medium text-gray-900">
                                        {currentBookingData.userName || "—"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <FaPhone className="mt-0.5 shrink-0 text-gray-600" />
                                <div>
                                    <p className="text-gray-500">Phone</p>
                                    <p className="font-medium text-gray-900">
                                        {currentBookingData.userPhoneNumber || "—"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <FaMoneyBillWave className="mt-0.5 shrink-0 text-green-600" />
                                <div>
                                    <p className="text-gray-500">Price</p>
                                    <p className="font-medium text-gray-900">
                                        {currentBookingData.price != null
                                            ? `₹${Number(currentBookingData.price).toLocaleString()}`
                                            : "—"}
                                    </p>
                                </div>
                            </div>
                            <div className="border-t border-gray-100 pt-2">
                                <p className="text-gray-500">Booking ID</p>
                                <p className="font-mono text-xs text-gray-700">
                                    {currentBookingData.bookingId || "—"}
                                </p>
                            </div>
                        </div>
                        {currentBookingData.pickUpLatitude &&
                            currentBookingData.pickUpLongitude && (
                                <div className="pt-3">
                                    <a
                                        href={`https://www.google.com/maps?q=${currentBookingData.pickUpLatitude},${currentBookingData.pickUpLongitude}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 active:scale-95"
                                    >
                                        <FaMapMarkedAlt />
                                        Open Pickup Location
                                    </a>
                                </div>
                            )}


                        {/* Set Active / Set Inactive based on pickupActive */}

                    </div>
                )}

                {!currentBookingLoading && !hasBookingData(currentBookingData) && !currentBookingError && (
                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <p className="text-center text-gray-500">No active booking</p>
                    </div>
                )}

                {!currentBookingLoading && currentBookingError && (
                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <p className="text-center text-gray-500">No bookings available</p>
                    </div>
                )}
                {(!currentBookingLoading && hasBookingData(currentBookingData)) ? (
                    <div style={{ marginTop: "20px" }} className="mt-5 flex gap-3">
                        <button
                            type="button"
                            onClick={handleFinishTrip}
                            className="flex-1 rounded-xl bg-red-500 px-4 py-3 font-medium text-white shadow-sm active:bg-red-600"
                        >
                            Finish Trip
                        </button>
                    </div>
                ) : (

                    <div style={{ marginTop: "20px" }} className="mt-5 flex gap-3">
                        {pickupActive ? (
                            <button
                                type="button"
                                onClick={handleSetInactive}
                                className="flex-1 rounded-xl bg-red-500 px-4 py-3 font-medium text-white shadow-sm active:bg-red-600"
                            >
                                Mark Inactive for Pickup
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleSetActive}
                                className="flex-1 rounded-xl bg-green-500 px-4 py-3 font-medium text-white shadow-sm active:bg-green-600"
                            >
                                Mark Active for Pickup
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Desktop: optional message (page is mobile-focused) */}
            <div className={`${mobileShow ? 'hidden' : 'block'}`}>
                <p className="text-center text-gray-500">
                    Drive mode is available only on mobile.
                </p>
            </div>
        </div>
    );
};

export default DriveMode;