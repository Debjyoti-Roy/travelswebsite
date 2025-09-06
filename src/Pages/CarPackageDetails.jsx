import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { IoIosInformationCircleOutline } from "react-icons/io";
import { MdOutlineCancel, MdAutorenew, MdSupportAgent, MdPlace } from "react-icons/md";
import { getCarDetails } from '../Redux/store/carPackageSlice';

const CarPackageDetails = () => {
    const location = useLocation();
    const { state } = location;
    const dispatch = useDispatch()
    const {
        carDetails,
        carDetailsLoading,
        carDetailsError,
        carDetailsStatus,
    } = useSelector((state) => state.carPackage);
    const getDetails = useCallback(() => {
        dispatch(getCarDetails({ id: state.id }));
    }, [dispatch, state])
    useEffect(() => {
        getDetails()
        console.log(state)
    }, [getCarDetails])

    useEffect(() => {
        console.log(carDetails)
    }, [carDetails])

    const [showInfo, setShowInfo] = useState(false);

    const travelMonth = state?.travelDate
        ? parseInt(state.travelDate.split("-")[0], 10) // since format is mm-dd-yyyy
        : null;

    if (carDetailsLoading) return <p>Loading...</p>;
    if (carDetailsError) return <p className="text-red-600">{carDetailsError}</p>;
    if (!carDetails || carDetails.length === 0) return <p>No details available</p>;


    return (
        <div className="w-full bg-gray-50">
            {/* Package Header */}
            <div className="relative h-[450px] w-full">
                <img
                    src={carDetails?.thumbnailUrl}
                    alt="package thumbnail"
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                    <h1 className="text-3xl md:text-5xl font-bold">{carDetails[0]?.title}</h1>
                    <p className="mt-2 text-sm md:text-base">
                        {carDetails?.pickupLocation} → {carDetails?.dropLocation}
                    </p>
                </div>
            </div>


            <div className="flex justify-center">
                <div className="lg:w-[70%] w-full flex justify-center flex-col">



                    {/* Cars Section */}
                    <div className="max-w-full mx-auto px-6 pb-3 pt-8">
                        <h2 className="text-3xl font-semibold pb-6 text-gray-800">
                            Available Cars
                        </h2>

                        <div className="space-y-6">
                            {carDetails.carDetails.map((car) => {
                                // Find matching price for travelMonth
                                const applicablePrice = travelMonth
                                    ? car.carPrices.find(
                                        (p) => travelMonth >= p.startMonth && travelMonth <= p.endMonth
                                    )
                                    : null;

                                return (
                                    <div
                                        key={car.carId}
                                        className="border border-gray-200 p-4 shadow-sm hover:shadow transition bg-white flex flex-col md:flex-row md:justify-between"
                                    >
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-800">{car.carName}</h3>
                                            <p className="text-gray-600 mt-1">
                                                Type: {car.carType} | Capacity: {car.capacity} | Luggage:{" "}
                                                {car.luggageCapacity}
                                            </p>
                                            <p className="text-gray-600 text-sm">
                                                AC: {car.acAvailable ? "Yes" : "No"}
                                            </p>
                                            {car.notes && (
                                                <p className="text-gray-500 text-md mt-2 italic">{car.notes}</p>
                                            )}
                                        </div>

                                        <div className="mt-4 md:mt-0 md:ml-6 text-right">
                                            <p className="text-gray-600 text-md">Price</p>
                                            {applicablePrice ? (
                                                <p className="text-blue-600 font-semibold">
                                                    ₹{applicablePrice.price}
                                                </p>
                                            ) : (
                                                <p className="text-gray-400 italic">No price available</p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>


                    {/* Itineraries */}
                    <div className="w-full mx-auto px-6 pt-10 pb-5">
                        <h2 className="text-3xl font-bold pb-12 text-gray-800">Itinerary</h2>

                        <div className="relative border-l-4 border-blue-500 pl-6 space-y-16">
                            {/* Journey Start */}
                            <div className="absolute -left-[4px] top-0 transform -translate-x-full bg-white px-3 py-1 rounded-full shadow text-blue-600 font-semibold">
                                Journey Start
                            </div>

                            {carDetails?.itineraries?.map((day, idx) => (
                                <div
                                    key={day.itineraryId}
                                    className={`relative flex flex-col md:flex-row gap-5 items-center md:items-stretch ${idx % 2 === 1 ? "md:flex-row-reverse" : ""
                                        }`}
                                >
                                    {/* Day marker */}
                                    <div className="absolute -left-[46px] top-5 w-10 h-10 bg-gradient-to-r from-[#2589f3] via-[#4ea3f8] to-[#5dacf2] text-white font-bold rounded-full flex items-center justify-center shadow-lg">
                                        {day.dayNumber}
                                    </div>

                                    {/* Image */}
                                    <div className="md:w-1/2 rounded-2xl overflow-hidden shadow-xl transform hover:scale-102 transition-transform duration-500">
                                        <img
                                            src={day.imageUrl}
                                            alt={day.title}
                                            className="w-full h-[300px] object-cover"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="md:w-1/2 rounded-2xl p-6 flex flex-col justify-center relative z-10">
                                        <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                                            Day {day.dayNumber}:{" "}
                                            <span className="text-blue-600">{day.title}</span>
                                        </h3>
                                        <p className="text-gray-700 leading-relaxed text-lg">
                                            {day.description}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {/* Journey End */}
                            <div className="absolute -left-[4px] bottom-0 transform -translate-x-full bg-white px-3 py-1 rounded-full shadow text-blue-600 font-semibold">
                                Journey End
                            </div>
                        </div>
                    </div>





                    {/* Included / Excluded Features */}
                    <div className="px-6 py-8 bg-gray-50 rounded-xl">
                        <h2 className="text-3xl font-bold pb-4 text-gray-800">Package Details</h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold text-xl pb-2">Included</h3>
                                <ul className="list-disc list-inside text-gray-600 space-y-1">
                                    {carDetails?.includedFeatures?.map((f) => (
                                        <li key={f.inclusionId}>{f.description}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-xl pb-2">Excluded</h3>
                                <ul className="list-disc list-inside text-gray-600 space-y-1">
                                    {carDetails?.excludedFeatures?.map((f) => (
                                        <li key={f.inclusionId}>{f.description}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Cancellation / Refund Policy (like hotel theme) */}
                    <div className="bg-gray-50 p-8 rounded-xl mx-auto mt-8">
                        <h2 className="text-3xl font-bold pb-6 text-gray-800">Our Premium Cancellation Policy</h2>

                        <div className="flex items-start gap-3 pb-6">
                            <MdOutlineCancel size={26} className="text-blue-500 flex-shrink-0" />
                            <div>
                                <h3 className="text-xl font-semibold">Flexible & Hassle-Free Cancellations</h3>
                                <p className="text-gray-700 text-lg pt-2">
                                    100% refund for cancellations made 10 days or more before your scheduled trip.
                                    No refund for cancellations made within 10 days.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 pb-6">
                            <MdAutorenew size={26} className="text-blue-500 flex-shrink-0" />
                            <div>
                                <h3 className="text-xl font-semibold">Easy & Transparent Refunds</h3>
                                <p className="text-gray-700 text-lg pt-2">
                                    Eligible refunds will be processed within <strong>5–7 business days</strong> to your original payment method.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 pb-2">
                            <MdSupportAgent size={26} className="text-blue-500 flex-shrink-0" />
                            <div>
                                <h3 className="text-xl font-semibold">24/7 Guest Support</h3>
                                <p className="text-gray-700 text-lg pt-2">
                                    Our support team is available 24/7 to assist with any modifications, emergencies, or travel requests.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default CarPackageDetails