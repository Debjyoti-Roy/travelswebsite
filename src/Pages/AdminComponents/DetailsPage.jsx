import React, { Fragment, useEffect, useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { Dialog, Transition } from "@headlessui/react";
import { FaAddressCard, FaTimes } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import BasicDetails from './DetailsPageComponents/BasicDetails';
import ItenaryDetails from './DetailsPageComponents/ItenaryDetails';
import CarDetails from './DetailsPageComponents/CarDetails';
import { FiTrash } from "react-icons/fi";
import AddCar from './DetailsPageComponents/AddCar';
import { useDispatch } from 'react-redux';
import { deregisterCar } from '../../Redux/store/adminCarSlice';
import toast from 'react-hot-toast';
const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const DetailsPage = ({ carPackageDetails, isOpen, onEditBasic, onEditItineraries, onEditCarDetails }) => {
    const [basic, setBasic] = useState(false)
    const [itenary, setItenary] = useState(false)
    const [carDetails, setCarDetails] = useState(false)
    const [addCar, setAddCar] = useState(false)
    const [sureModal, setSureModal] = useState(false)
    const [carId, setCarId] = useState("")
    const dispatch = useDispatch()
    // useEffect(() => {
    //     console.log(carPackageDetails)
    // }, [carPackageDetails])

    const handleDeregister = async () => {
        dispatch(deregisterCar({ carPackageId: carPackageDetails.packageId, carId: carId }))
            .unwrap()
            .then((res) => {
                onEditBasic(carPackageDetails.packageId)
                setSureModal(false)
                toast.success("Car package deregistered successfully");
            })
            .catch(async (err) => {
                onEditBasic(carPackageDetails.packageId)
                setSureModal(false)
                toast.error("Failed to deregister car");
                // console.error(err);
            });
    }

    return (
        <>
            <div className="p-6">
                {/*BASIC DETAILS START*/}
                <div style={{ marginBottom: "2vh" }} className='flex justify-between'>
                    <div className='flex gap-2'>
                        <button onClick={() => isOpen()} className="bg-transparent border-none p-0 cursor-pointer">
                            <IoIosArrowRoundBack className='font-bold text-4xl' />
                        </button>

                        <h3 className='font-semibold text-4xl'>{carPackageDetails?.title}</h3>
                    </div>
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={() => setBasic(true)}
                            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            <FaEdit className="text-sm" />
                            Edit Basic Details
                        </button>
                    </div>
                </div>

                {carPackageDetails?.thumbnailUrl && (
                    <img
                        src={carPackageDetails.thumbnailUrl}
                        alt={carPackageDetails.title}
                        className="w-full h-64 object-cover rounded-lg border border-gray-200 mb-6"
                    />
                )}

                <p style={{ marginTop: "1vh" }} className="text-gray-700 mb-4 leading-relaxed">
                    {carPackageDetails?.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6 text-sm border border-gray-100 rounded-lg p-4 bg-gray-50">
                    <div>
                        <strong>Duration:</strong> {carPackageDetails?.durationDays} days
                    </div>
                    <div>
                        <strong>Pickup:</strong> {carPackageDetails?.pickupLocation}
                    </div>
                    <div>
                        <strong>Drop:</strong> {carPackageDetails?.dropLocation}
                    </div>
                    <div>
                        <strong>Destination:</strong>{" "}
                        {carPackageDetails?.destination?.name},{" "}
                        {carPackageDetails?.destination?.state}
                    </div>
                </div>

                <div style={{ marginTop: "1vh" }} className="grid grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-semibold mb-2 text-green-700">Included</h4>
                        <ul className="list-disc pl-5 text-sm text-green-700">
                            {carPackageDetails?.includedFeatures?.map((f) => (
                                <li key={f.inclusionId}>{f.description}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2 text-red-700"> Excluded</h4>
                        <ul className="list-disc pl-5 text-sm text-red-700">
                            {carPackageDetails?.excludedFeatures?.map((f) => (
                                <li key={f.inclusionId}>{f.description}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                {carPackageDetails?.carDetails?.length > 0 && (
                    <div style={{ marginTop: "2vh" }} className="mb-6">
                        <div style={{ marginBottom: '1vh' }} className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold text-lg">Available Cars</h4>
                            <div className='flex gap-2'>
                                <button
                                    onClick={() => setAddCar(true)}
                                    className="flex items-center gap-2 bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition-colors text-sm"
                                >
                                    <FaAddressCard className="text-xs" />
                                    Add Cars
                                </button>
                                <button
                                    onClick={() => setCarDetails(true)}
                                    className="flex items-center gap-2 bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition-colors text-sm"
                                >
                                    <FaEdit className="text-xs" />
                                    Edit Cars
                                </button>
                            </div>
                        </div>
                        {carPackageDetails.carDetails.map((car, id) => (

                            <div
                                key={id}
                                style={{ marginBottom: "1vh" }}
                                className="relative border border-gray-200 bg-white p-4 rounded-lg mb-3 shadow-sm"
                            >
                                {/* Delete button */}
                                <button
                                    onClick={() => {
                                        setCarId(car.carId)
                                        setSureModal(true)
                                    }}
                                    className="absolute top-2 right-2 flex items-center gap-1 px-3 py-1.5 
             bg-red-500 text-white text-xs font-medium rounded-md 
             hover:bg-red-600 shadow-sm"
                                >

                                    Deregister
                                </button>


                                <p className="font-medium">
                                    {car.carName} ({car.carType}) - {car.capacity} Seats, Luggage:{" "}
                                    {car.luggageCapacity}
                                </p>
                                <ul className="list-disc pl-5 text-sm text-gray-600 mt-1">
                                    {car.carPrices?.map((price) => (
                                        <li key={price.seasonPriceId}>
                                            {MONTHS[price.startMonth - 1]} to {MONTHS[price.endMonth - 1]}: ₹
                                            {price.price}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}

                {/*ITENARIES START*/}
                {carPackageDetails?.itineraries?.length > 0 && (
                    <div style={{ marginTop: "2vh" }} className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold text-lg"> Itinerary</h4>
                            <button
                                onClick={() => setItenary(true)}
                                className="flex items-center gap-2 bg-purple-500 text-white px-3 py-1 rounded-lg hover:bg-purple-600 transition-colors text-sm"
                            >
                                <FaEdit className="text-xs" />
                                Edit Itineraries
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {carPackageDetails.itineraries.map((it) => (
                                <div
                                    key={it.itineraryId}
                                    className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm"
                                >
                                    {it.imageUrl && (
                                        <img
                                            src={it.imageUrl}
                                            alt={it.title}
                                            className="w-full h-40 object-cover border-b border-gray-200"
                                        />
                                    )}
                                    <div className="p-3">
                                        <p className="font-bold text-gray-800">
                                            Day {it.dayNumber}: {it.title}
                                        </p>
                                        <p className="text-sm text-gray-600">{it.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <Transition appear show={basic} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setBasic(false)}>
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
                                <Dialog.Panel className="w-full max-w-5xl min-w-5xl transform overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-2xl transition-all">
                                    <div className="max-h-[80vh] min-h-[80vh] overflow-y-auto">

                                        <div>
                                            {/* Header */}
                                            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
                                                <Dialog.Title
                                                    as="h3"
                                                    className="text-2xl font-bold leading-6 text-gray-900"
                                                >
                                                    Basic Details
                                                </Dialog.Title>
                                                <button
                                                    onClick={() => setBasic(false)}
                                                    className="text-gray-500 hover:text-gray-700 transition cursor-pointer"
                                                >
                                                    <FaTimes className="h-5 w-5" />
                                                </button>
                                            </div>

                                            {/* Content */}
                                            <BasicDetails carPackageDetails={carPackageDetails} basicClose={() => {
                                                setBasic(false)
                                                onEditBasic(carPackageDetails.packageId)
                                            }} />
                                        </div>

                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
            <Transition appear show={itenary} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setItenary(false)}>
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
                                <Dialog.Panel className="w-full max-w-5xl min-w-5xl transform overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-2xl transition-all">
                                    <div className="max-h-[80vh] min-h-[80vh] overflow-y-auto">

                                        <div>
                                            {/* Header */}
                                            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
                                                <Dialog.Title
                                                    as="h3"
                                                    className="text-2xl font-bold leading-6 text-gray-900"
                                                >
                                                    Itenary Details
                                                </Dialog.Title>
                                                <button
                                                    onClick={() => setItenary(false)}
                                                    className="text-gray-500 hover:text-gray-700 transition cursor-pointer"
                                                >
                                                    <FaTimes className="h-5 w-5" />
                                                </button>
                                            </div>

                                            {/* Content */}
                                            <ItenaryDetails carPackageDetails={carPackageDetails} itenaryClose={() => {
                                                setItenary(false)
                                                onEditBasic(carPackageDetails.packageId)
                                            }} />
                                        </div>

                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
            <Transition appear show={carDetails} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setCarDetails(false)}>
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
                                <Dialog.Panel className="w-full max-w-5xl min-w-5xl transform overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-2xl transition-all">
                                    <div className="max-h-[80vh] min-h-[80vh] overflow-y-auto">

                                        <div>
                                            {/* Header */}
                                            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
                                                <Dialog.Title
                                                    as="h3"
                                                    className="text-2xl font-bold leading-6 text-gray-900"
                                                >
                                                    Edit Car Details
                                                </Dialog.Title>
                                                <button
                                                    onClick={() => setCarDetails(false)}
                                                    className="text-gray-500 hover:text-gray-700 transition cursor-pointer"
                                                >
                                                    <FaTimes className="h-5 w-5" />
                                                </button>
                                            </div>

                                            {/* Content */}
                                            <CarDetails carPackageDetails={carPackageDetails} carDetailsClose={() => {
                                                setCarDetails(false)
                                                onEditBasic(carPackageDetails.packageId)
                                            }} />
                                        </div>

                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
            <Transition appear show={addCar} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setAddCar(false)}>
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
                                <Dialog.Panel className="w-full max-w-5xl min-w-5xl transform overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-2xl transition-all">
                                    <div className="max-h-[80vh] min-h-[80vh] overflow-y-auto">

                                        <div>
                                            {/* Header */}
                                            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
                                                <Dialog.Title
                                                    as="h3"
                                                    className="text-2xl font-bold leading-6 text-gray-900"
                                                >
                                                    Add Car
                                                </Dialog.Title>
                                                <button
                                                    onClick={() => setAddCar(false)}
                                                    className="text-gray-500 hover:text-gray-700 transition cursor-pointer"
                                                >
                                                    <FaTimes className="h-5 w-5" />
                                                </button>
                                            </div>

                                            {/* Content */}
                                            <AddCar carPackageDetails={carPackageDetails} addCarClose={() => {
                                                setAddCar(false)
                                                onEditBasic(carPackageDetails.packageId)
                                            }} />
                                        </div>

                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
            <Transition appear show={sureModal} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setSureModal(false)}>
                    {/* Overlay */}
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm" />
                    </Transition.Child>

                    {/* Modal Container */}
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-2xl transition-all">
                                <div className="p-6">
                                    {/* Header */}
                                    <div className="flex items-center justify-between">
                                        <Dialog.Title className="text-lg font-semibold text-gray-900">
                                            Are you sure?
                                        </Dialog.Title>
                                        <button
                                            onClick={() => setSureModal(false)}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            <FaTimes className="h-4 w-4" />
                                        </button>
                                    </div>

                                    {/* Footer Actions */}
                                    <div className="mt-6 flex justify-end gap-3">
                                        <button
                                            // onClick={onClose}
                                            className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            // onClick={onConfirm}
                                            onClick={handleDeregister}
                                            className="px-4 py-2 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700"
                                        >
                                            Confirm
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}

export default DetailsPage