import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cancelBooking, confirmBooking, getCarAwaiting, searchCarBooking } from "../../Redux/store/adminCarSlice";
import toast from "react-hot-toast";
import { Dialog, Transition } from "@headlessui/react";
import { FaTimes } from "react-icons/fa";

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
    const [searchModal, setSearchModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [selectedBookingId2, setSelectedBookingId2] = useState(null)
    const { getAwaiting, getAwaitingLoading, getAwaitingError, confirmLoading, confirmSuccess, confirmerror, confirmstatus } = useSelector(
        (state) => state.admincar
    );
    const { searchResults, searchLoading, searchError, searchPagination } = useSelector(
        (state) => state.admincar
    );


    useEffect(() => {
        dispatch(getCarAwaiting());
        const interval = setInterval(() => {
            dispatch(getCarAwaiting());
        }, 60000);
        return () => clearInterval(interval);
    }, [dispatch]);

    const handleConfirm = () => {
        dispatch(confirmBooking({ bookingId: selectedBookingId2, carId: selectedDriver.carId }))
            .unwrap()
            .then(() => {
                toast.success("Car package booking confirmation successful", {
                    style: {
                        borderRadius: "10px",
                        background: "#333",
                        color: "#fff",
                    },
                });
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
                // setSearchModal(false)
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
        // console.log("Search drivers for booking", id);
        // TODO: open driver search modal
        dispatch(searchCarBooking({ bookingId: id, page: 0, size: 10 }));
        setSelectedBookingId2(id)
        setSearchModal(true)
    };

    const handleSearch = async () => {
        // console.log(searchQuery)
        dispatch(searchCarBooking({ bookingId: searchQuery, page: 0, size: 10 }));

    }

    useEffect(() => {
        console.log(searchResults)
    }, [searchResults])


    return (
        <div className="min-h-screen p-6 bg-gray-100">
            {/* <h1 style={{ marginBottom: "15px" }} className="text-2xl font-bold text-gray-800 mb-6">
                Awaiting Bookings
            </h1> */}
            <div style={{ marginBottom: "5px" }} className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Awaiting Bookings
                </h1>
                {/* <button
                    //   onClick={() => setShowSearch(true)} // <-- replace with your search handler
                    onClick={() => setSearchModal(true)}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow text-sm font-medium transition"
                >
                    Search
                </button> */}
            </div>
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
                                    {/* <button
                                        onClick={() => handleConfirm(booking.bookingId)}
                                        className="px-4 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm"
                                    >
                                        Confirm
                                    </button> */}
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
            <Transition appear show={searchModal} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setSearchModal(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-100/70 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-6">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-6xl min-w-[80vw] transform overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-2xl transition-all">
                                    <div className="max-h-[85vh] min-h-[85vh] overflow-y-auto">
                                        {/* Header */}
                                        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
                                            {/* Left heading */}
                                            <Dialog.Title
                                                as="h3"
                                                className="text-2xl font-bold leading-6 text-gray-900"
                                            >
                                                Drivers List
                                            </Dialog.Title>

                                            {/* Right actions */}
                                            <div className="flex items-center gap-3">
                                                <button
                                                    disabled={!selectedDriver}
                                                    onClick={() => {
                                                        // console.log("Confirmed driver:", selectedDriver);
                                                        // TODO: handle confirm action
                                                        handleConfirm()
                                                        setSearchModal(false);
                                                    }}
                                                    className={`px-4 py-2 rounded-lg font-medium transition ${selectedDriver
                                                        ? "bg-blue-600 text-white hover:bg-blue-700"
                                                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                        }`}
                                                >
                                                    Confirm
                                                </button>

                                                <button
                                                    onClick={() => setSearchModal(false)}
                                                    className="text-gray-500 hover:text-gray-700 transition cursor-pointer"
                                                >
                                                    <FaTimes className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="p-6 space-y-6">
                                            {searchResults && searchResults?.length > 0 && (
                                                <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow">
                                                    <table className="w-full border-collapse">
                                                        <thead>
                                                            <tr className="bg-gray-100 text-gray-700 text-left">
                                                                <th className="p-3">Car Model</th>
                                                                <th className="p-3">Driver Name</th>
                                                                <th className="p-3">Driver Phone</th>
                                                                <th className="p-3">Ac Available</th>
                                                                <th className="p-3 text-center">Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {searchResults?.map((item, idx) => (
                                                                <tr
                                                                    key={idx}
                                                                    className={`transition ${selectedDriver?.driverId === item.driverId
                                                                        ? "bg-blue-50"
                                                                        : "hover:bg-gray-50"
                                                                        }`}
                                                                >
                                                                    <td className="p-3">{item.carModel}</td>
                                                                    <td className="p-3">{item.driverName}</td>
                                                                    <td className="p-3">{item.driverPhoneNumber}</td>
                                                                    <td className="p-3">{item.acAvailable ? "Yes" : "No"}</td>
                                                                    <td className="p-3 text-center">
                                                                        <button
                                                                            onClick={() => {
                                                                                if (selectedDriver === null) {

                                                                                    setSelectedDriver(item)
                                                                                }
                                                                                else {
                                                                                    setSelectedDriver(null)
                                                                                }

                                                                            }}

                                                                            className={`px-3 py-1 rounded-lg text-sm font-medium transition ${selectedDriver?.carId === item.carId
                                                                                ? "bg-blue-600 text-white"
                                                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                                                }`}
                                                                        >
                                                                            {selectedDriver?.carId === item.carId
                                                                                ? "Selected"
                                                                                : "Select"}
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}

                                            {searchResults && searchResults.length === 0 && !searchLoading && (
                                                <p className="text-center text-gray-500">No results found</p>
                                            )}
                                            {searchLoading && (
                                                <p className="text-center text-gray-500">Searching...</p>
                                            )}

                                            {/* Pagination Controls */}
                                            {searchPagination.totalPages > 1 && (
                                                <div className="flex items-center justify-between mt-4">
                                                    <button
                                                        disabled={searchPagination.pageNumber === 0 || searchLoading}
                                                        onClick={() =>
                                                            dispatch(
                                                                searchCarBooking({
                                                                    bookingId: currentBookingId,
                                                                    page: searchPagination.pageNumber - 1,
                                                                    size: searchPagination.pageSize,
                                                                })
                                                            )
                                                        }
                                                        className={`px-4 py-2 rounded-lg border ${searchPagination.pageNumber === 0 || searchLoading
                                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                            : "bg-white hover:bg-gray-100 text-gray-700"
                                                            }`}
                                                    >
                                                        Prev
                                                    </button>

                                                    <span className="text-gray-600 text-sm">
                                                        Page {searchPagination.pageNumber + 1} of{" "}
                                                        {searchPagination.totalPages}
                                                    </span>

                                                    <button
                                                        disabled={searchPagination.last || searchLoading}
                                                        onClick={() =>
                                                            dispatch(
                                                                searchCarBooking({
                                                                    bookingId: currentBookingId,
                                                                    page: searchPagination.pageNumber + 1,
                                                                    size: searchPagination.pageSize,
                                                                })
                                                            )
                                                        }
                                                        className={`px-4 py-2 rounded-lg border ${searchPagination.last || searchLoading
                                                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                            : "bg-white hover:bg-gray-100 text-gray-700"
                                                            }`}
                                                    >
                                                        Next
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* <Transition appear show={searchModal} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setSearchModal(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-100/70 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-6">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-6xl min-w-[80vw] transform overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-2xl transition-all">
                                    <div className="max-h-[85vh] min-h-[85vh] overflow-y-auto">
                                        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
                                            <Dialog.Title
                                                as="h3"
                                                className="text-2xl font-bold leading-6 text-gray-900"
                                            >
                                                Search Bookings
                                            </Dialog.Title>
                                            <button
                                                onClick={() => setSearchModal(false)}
                                                className="text-gray-500 hover:text-gray-700 transition cursor-pointer"
                                            >
                                                <FaTimes className="h-5 w-5" />
                                            </button>
                                        </div>
                                        <div className="p-6 space-y-6">
                                            {searchResults && searchResults?.length > 0 && (
                                                <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow">
                                                    <table className="w-full border-collapse">
                                                        <thead>
                                                            <tr className="bg-gray-100 text-gray-700 text-left">
                                                                <th className="p-3">Car Model</th>
                                                                <th className="p-3">Driver Name</th>
                                                                <th className="p-3">Driver Phone</th>
                                                                <th className="p-3">Ac Available</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {searchResults?.map((item, idx) => (
                                                                <tr
                                                                    key={idx}
                                                                    className="hover:bg-gray-50 transition"
                                                                >
                                                                    <td className="p-3">{item.carModel}</td>
                                                                    <td className="p-3">{item.driverName}</td>
                                                                    <td className="p-3">{item.driverPhoneNumber}</td>
                                                                    <td className="p-3">{item.acAvailable ? "Yes" : "No"}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}

                                            {searchResults && searchResults.length === 0 && !searchLoading && (
                                                <p className="text-center text-gray-500">No results found</p>
                                            )}
                                            {searchLoading && (
                                                <p className="text-center text-gray-500">Searching...</p>
                                            )}

                                            {searchPagination.totalPages > 1 && (
                                                <div className="flex items-center justify-between mt-4">
                                                    <button
                                                        disabled={searchPagination.pageNumber === 0 || searchLoading}
                                                        onClick={() =>
                                                            dispatch(
                                                                searchCarBooking({
                                                                    bookingId: currentBookingId, // keep track of bookingId in state
                                                                    page: searchPagination.pageNumber - 1,
                                                                    size: searchPagination.pageSize,
                                                                })
                                                            )
                                                        }
                                                        className={`px-4 py-2 rounded-lg border ${searchPagination.pageNumber === 0 || searchLoading
                                                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                                : "bg-white hover:bg-gray-100 text-gray-700"
                                                            }`}
                                                    >
                                                        Prev
                                                    </button>

                                                    <span className="text-gray-600 text-sm">
                                                        Page {searchPagination.pageNumber + 1} of {searchPagination.totalPages}
                                                    </span>

                                                    <button
                                                        disabled={searchPagination.last || searchLoading}
                                                        onClick={() =>
                                                            dispatch(
                                                                searchCarBooking({
                                                                    bookingId: currentBookingId,
                                                                    page: searchPagination.pageNumber + 1,
                                                                    size: searchPagination.pageSize,
                                                                })
                                                            )
                                                        }
                                                        className={`px-4 py-2 rounded-lg border ${searchPagination.last || searchLoading
                                                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                                                : "bg-white hover:bg-gray-100 text-gray-700"
                                                            }`}
                                                    >
                                                        Next
                                                    </button>
                                                </div>
                                            )}


                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition> */}

        </div>
    );
};

export default ManageCarBookings;
