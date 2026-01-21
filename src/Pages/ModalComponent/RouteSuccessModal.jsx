import React, { useRef } from 'react'
import { FiCopy } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';

const RouteSuccessModal = ({ bookingId, pickup, drop, number, price, onClose }) => {
    const backdropRef = useRef();

    const handleBackdropClick = (e) => {
        if (e.target === backdropRef.current) {
            onClose();
        }
    };
    return (
        <div
            ref={backdropRef}
            onClick={handleBackdropClick}
            className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50"
        >
            <div className="bg-white rounded-lg overflow-hidden shadow-xl w-full max-w-md">
                <div className="bg-blue-600 text-white text-center py-4 relative">
                    <h2 className="text-lg font-semibold">Booking Confirmed</h2>
                    <p className="text-sm p-3">Your booking request has been received.</p>

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
                                        <span className="text-sm text-gray-600">Pickup</span>
                                        <span className="text-md font-medium text-gray-800">{pickup}</span>
                                    </div>

                                    <div className="p-2 flex flex-col">
                                        <span className="text-sm text-gray-600">Drop</span>
                                        <span className="text-md font-medium text-gray-800">{drop}</span>
                                    </div>

                                    <div className="p-2 flex flex-col">
                                        <span className="text-sm text-gray-600">Number of People</span>
                                        <span className="text-md font-medium text-gray-800">{number}</span>
                                    </div>
                                    <div className="p-2 flex flex-col">
                                        <span className="text-sm text-gray-600">Price</span>
                                        <span className="text-md font-medium text-gray-800">{price}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RouteSuccessModal