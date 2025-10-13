import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserTourPackageBookings } from '../../Redux/store/profileSlice'
//New confirm
const MyTourQueries = () => {
    const dispatch = useDispatch()
    const { tourPackageBookings, tourPackageBookingsLoading, tourPackageBookingsError, tourPackageBookingsStatus } = useSelector((state) => state.profile)
    const [tabs, setTabs] = useState("New")
    const [page, setPage] = useState(0)
    const [size] = useState(10);
    const [content, setContent] = useState([])
    const [totalPages, setTotalPages] = useState(1)
    const [pageNumber, setPageNumber] = useState(0)
    const [expandedCards, setExpandedCards] = useState({});

    useEffect(() => {
        let status;
        if (tabs === "New") status = "OPEN,IN_PROGRESS"
        if (tabs == "Confirm") status = "RESOLVED"
        dispatch(fetchUserTourPackageBookings({ page: pageNumber, size, status }))
    }, [tabs, pageNumber])

    useEffect(() => {
        console.log(tourPackageBookings)
        setContent(tourPackageBookings?.content)
        setTotalPages(tourPackageBookings?.totalPages)
        // setPage(tourPackageBookings?.pageNumber)
        setPageNumber(tourPackageBookings?.pageNumber)
    }, [tourPackageBookings])

    useEffect(() => {
        console.log(content)
    }, [content])

    const toggleExpand = (id) => {
        setExpandedCards((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const handleNextPage = () => {
        if (pageNumber + 1 < totalPages) {
            setCurrentPage((prev) => prev + 1);
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
    const truncate = (text, limit = 100) => {
        if (!text) return "";
        return text.length > limit ? text.slice(0, limit) + "..." : text;
    };

    const ticketCreatedAt = (date) => {
        if (!date) return "N/A";

        const parsed = new Date(date);
        if (isNaN(parsed.getTime())) return "Invalid date";

        return parsed.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };
    const formatRelativeTime = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "1 day ago";
        return `${diffDays} days ago`;
    };

    // const content = tourPackageBookings?.content || [];
    // const totalPages = tourPackageBookings?.totalPages || 1;
    // const pageNumber = tourPackageBookings?.pageNumber || 0;




    return (
        <div className="flex justify-center pt-10 pb-20">
            <div ref={topRef} className="w-full px-4">
                {/* Filter Tabs */}
                <div className="w-full pb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                            <button
                                onClick={() => setTabs("New")}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${tabs === "New"
                                    ? "bg-blue-600 text-white shadow-md"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                                    }`}
                            >
                                New
                            </button>
                            <button
                                onClick={() => setTabs("Confirm")}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${tabs === "Confirm"
                                    ? "bg-blue-600 text-white shadow-md"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                                    }`}
                            >
                                Confirmed
                            </button>
                        </div>
                    </div>
                </div>
                <div className="pt-6 w-full">
                    {tourPackageBookingsLoading && <div className="space-y-4">

                        {[1, 2, 3].map((index) => (
                            <div
                                key={index}
                                className="relative border border-gray-200 p-5 rounded-xl shadow-sm bg-white animate-pulse"
                            >
                                <div className="flex justify-between items-start">

                                    <div className="flex-1 pr-4 space-y-3">
                                        <div className="h-5 bg-gray-200 rounded w-40"></div>
                                        <div className="h-4 bg-gray-200 rounded w-60"></div>
                                        <div className="h-4 bg-gray-200 rounded w-48"></div>
                                    </div>


                                    <div className="flex flex-col justify-start gap-3 items-end text-right pl-4">
                                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                                    </div>
                                </div>


                                <div className="absolute bottom-4 right-4">
                                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                                </div>
                            </div>
                        ))}
                    </div>}
                    {tourPackageBookingsError && <div className="flex flex-col items-center justify-center py-16 px-4">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Data Available</h3>
                    </div>}

                    {!tourPackageBookingsLoading && content && content.length > 0 ? (
                        content.map((item) => (
                            <div
                                key={item.ticketId}
                                onClick={() => toggleExpand(item.ticketId)}
                                className="border border-gray-200 p-5 rounded-xl shadow-sm mb-4 bg-white transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-blue-500 hover:bg-blue-50 cursor-pointer"
                            >
                                <div className="flex justify-between items-start">
                                    {/* Left content */}
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500 mb-1">
                                            Ticket ID: <span className="font-medium">{item.ticketId}</span>
                                        </p>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.subject}</h3>
                                        <p className="text-gray-700 mb-2 whitespace-pre-line">
                                            {expandedCards[item.ticketId]
                                                ? item.message
                                                : truncate(item.message, 50)}
                                        </p>

                                    </div>

                                    {/* Right content (status and dates) */}
                                    <div className="flex flex-col items-end ml-4 text-right">
                                        <span
                                            className={`inline-block px-3 py-1 text-xs font-medium rounded-full mb-2
                    ${item.status === "OPEN"
                                                    ? "bg-green-100 text-green-700"
                                                    : item.status === "IN_PROGRESS"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : item.status === "RESOLVED"
                                                            ? "bg-blue-100 text-blue-700"
                                                            : "bg-gray-200 text-gray-600"
                                                }
                  `}
                                        >
                                            {item.status.replace("_", " ")}
                                        </span>
                                        <p className="text-xs text-gray-500">Created at: {ticketCreatedAt(item.createdAt)}</p>
                                        <p className="text-xs text-gray-400">Updated at: {formatRelativeTime(item.updatedAt)}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        !tourPackageBookingsLoading && <p>No queries found.</p>
                    )}
                </div>
                <div className="w-full flex items-center justify-between pt-6">
                    {/* Prev button */}
                    <button
                        onClick={handlePrevPage}
                        className={`px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 ${pageNumber === 0 ? "invisible pointer-events-none" : ""}`}
                    >
                        ← Prev
                    </button>

                    {/* Page text */}
                    <span>
                        Page {pageNumber + 1} of {totalPages}
                    </span>

                    {/* Next button */}
                    <button
                        onClick={handleNextPage}
                        className={`px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 ${pageNumber + 1 >= totalPages ? "invisible pointer-events-none" : ""}`}
                    >
                        Next →
                    </button>
                </div>

            </div>
        </div>
    )
}

export default MyTourQueries