import React, { useEffect } from 'react'
import { FaEdit } from 'react-icons/fa'
import { IoIosArrowRoundBack } from 'react-icons/io'

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const TourDetails = ({ tourPackageDetails, isOpen, onEdit }) => {
    return (
        <div className="p-6">
            {/* HEADER */}
            <div style={{ marginBottom: "2vh" }} className="flex justify-between mb-4">
                <div className="flex gap-2">
                    <button onClick={() => isOpen()} className="bg-transparent border-none p-0 cursor-pointer">
                        <IoIosArrowRoundBack className="text-4xl" />
                    </button>
                    <h3 className="font-semibold text-4xl">{tourPackageDetails?.title}</h3>
                </div>
                <button
                    onClick={() => setBasic(true)}
                    className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                    <FaEdit className="text-sm" />
                    Edit Basic Details
                </button>
            </div>

            {/* THUMBNAIL */}
            {tourPackageDetails?.thumbnailUrl && (
                <img
                    src={tourPackageDetails.thumbnailUrl}
                    alt={tourPackageDetails.title}
                    className="w-full h-64 object-cover rounded-lg border border-gray-200 mb-6"
                />
            )}

            {/* DESCRIPTION */}
            <p style={{ marginTop: "1vh" }} className="text-gray-700 mb-4">{tourPackageDetails?.description}</p>

            {/* BASIC INFO */}
            <div className="grid grid-cols-2 gap-4 mb-6 text-sm border border-gray-100 rounded-lg p-4 bg-gray-50">
                <div><strong>Duration:</strong> {tourPackageDetails?.durationDays} days</div>
                <div><strong>Pickup:</strong> {tourPackageDetails?.pickupLocation}</div>
                <div><strong>Drop:</strong> {tourPackageDetails?.dropLocation}</div>
                <div><strong>Destination:</strong> {tourPackageDetails?.destination?.name}, {tourPackageDetails?.destination?.state}</div>
            </div>

            {/* INCLUDED / EXCLUDED */}
            <div style={{ marginTop: "1vh" }} className="grid grid-cols-2 gap-6 mb-6">
                <div>
                    <h4 className="font-semibold mb-2 text-green-700">Included</h4>
                    <ul className="list-disc pl-5 text-green-700">
                        {tourPackageDetails?.included?.map((item, idx) => (
                            <li key={idx}>{item}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold mb-2 text-red-700">Excluded</h4>
                    <ul className="list-disc pl-5 text-red-700">
                        {tourPackageDetails?.excluded?.map((item, idx) => (
                            <li key={idx}>{item}</li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* TOUR TYPES */}
            {tourPackageDetails?.tourPackageTypes?.length > 0 && (
                <div  style={{ marginTop: "2vh" }} className="mb-6">
                    <h4 className="font-semibold text-lg mb-2">Tour Packages</h4>
                    {tourPackageDetails.tourPackageTypes.map((type) => (
                        <div key={type.id} className="border border-gray-200 p-4 rounded-lg mb-3 bg-white shadow-sm">
                            <p><strong>Car Types:</strong> {type.carTypes}</p>
                            <p><strong>Hotel Type:</strong> {type.hotelType}</p>
                            <p><strong>Tour Type:</strong> {type.tourType}</p>

                            <p className="mt-2 font-semibold">Prices:</p>
                            <ul className="list-disc pl-5 text-sm text-gray-600">
                                {type.seasonPrices.map((price) => (
                                    <li key={price.id}>
                                        {MONTHS[price.startMonth - 1]} to {MONTHS[price.endMonth - 1]}: ₹
                                        {price.price}                 
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}

            {/* ITINERARIES */}
            {tourPackageDetails?.itineraries?.length > 0 && (
                <div  style={{ marginTop: "2vh" }} className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-lg">Itineraries</h4>
                        <button
                            onClick={() => setItinerary(true)}
                            className="flex items-center gap-2 bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-purple-600"
                        >
                            <FaEdit className="text-sm" />
                            Edit Itineraries
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {tourPackageDetails.itineraries.map((it, idx) => (
                            <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                                {it.imageUrl && <img src={it.imageUrl} alt={it.title} className="w-full h-40 object-cover border-b border-gray-200" />}
                                <div className="p-3">
                                    <p className="font-bold text-gray-800">Day {it.dayNumber}: {it.title}</p>
                                    <p className="text-sm text-gray-600">{it.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>

    )
}

export default TourDetails