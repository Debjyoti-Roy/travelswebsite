import React, { useRef } from 'react'
import { FiCopy } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';

const CarPackageSuccessModal = ({bookingId, paidAt, total, travelDate, numberofdays, onClose}) => {
    const backdropRef = useRef();

    const handleBackdropClick = (e) => {
        if (e.target === backdropRef.current) {
            onClose();
        }
    };

    const date = new Date(paidAt);

    const options = {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    };

    const parts = new Intl.DateTimeFormat("en-IN", options).formatToParts(date);

    // Extract parts manually
    const getPart = (type) => parts.find((p) => p.type === type)?.value || "";

    const formatted = `${getPart("day")} ${getPart("month")} ${getPart("year")}, ${getPart("hour")}:${getPart("minute")} ${getPart("dayPeriod")}`;
    return (
        <div
            ref={backdropRef}
            onClick={handleBackdropClick}
            className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50"
        >
            <div className="bg-white rounded-lg overflow-hidden shadow-xl w-full max-w-md">
                <div className="bg-blue-600 text-white text-center py-4 relative">
                    <h2 className="text-lg font-semibold">Payment Successful!</h2>
                    <p className="text-sm p-3">Your booking request has been received. You’ll get a payment link within 24 hours — confirm within 48 hours to secure your booking.</p>

                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 text-white hover:text-gray-300 transition"
                    >
                        <IoMdClose size={20} />
                    </button>
                </div>

                <div className="w-full py-6 flex justify-center">
                    <div className="w-[90%] bg-blue-50 rounded-lg">
                        <p className="text-gray-600 text-xs pt-2 mb-1 text-center">YOUR BOOKING ID</p>
                        <div className="flex items-center justify-center gap-2 pb-6">
                            <h2 className="text-3xl font-bold text-blue-600 text-center">{bookingId}</h2>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(bookingId);
                                }}
                                className="text-blue-600 hover:text-blue-800 text-sm p-2 rounded-full transition"
                                title="Copy Ticket ID"
                            >
                                <FiCopy size={18} />
                            </button>
                        </div>


                        <div className="w-full flex justify-center">
                            <div className="w-[90%] border-b-2 border-blue-100 mx-auto mb-4"></div>
                        </div>

                        <div className="w-full flex justify-center">
                            <div className="w-[90%] pt-6 pb-6">
                                <div className="grid grid-cols-2 gap-2">
                                    
                                        <div className="p-2 flex flex-col">
                                            <span className="text-sm text-gray-600">Travel Date</span>
                                            <span className="text-md font-medium text-gray-800">{travelDate}</span>
                                        </div>
                                    
                                        <div className="p-2 flex flex-col">
                                            <span className="text-sm text-gray-600">Number of days</span>
                                            <span className="text-md font-medium text-gray-800">{numberofdays}</span>
                                        </div>
                                    
                                    <div className="p-2 flex flex-col">
                                        <span className="text-sm text-gray-600">Amount</span>
                                        <span className="text-md font-medium text-gray-800">{total}</span>
                                    </div>
                                    <div className="p-2 flex flex-col">
                                        <span className="text-sm text-gray-600">Paid on</span>
                                        <span className="text-md font-medium text-gray-800">{formatted}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default CarPackageSuccessModal