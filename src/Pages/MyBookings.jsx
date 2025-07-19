import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchUserBookings } from "../Redux/store/profileSlice";

const MyBookings = () => {
    const dispatch = useDispatch();

    const [bookings, setBookings] = useState([]);
    const [expandedCards, setExpandedCards] = useState({});
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [status, setStatus] = useState("ALL");

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
                                    Ticket ID: <span className="font-medium">{item.bookingGroupCode}</span>
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
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // console.log("View ticket for:", item.bookingGroupCode);
                                }}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                ))}

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
