import React, { useEffect, useState } from "react";
import { AiOutlinePlus, AiOutlineEdit } from "react-icons/ai";
import AddCar from "./AddCar";
import EditCar from "./editCar";
import { useDispatch, useSelector } from "react-redux";
import { editStatus } from "../../Redux/store/partnerCar";
import toast from "react-hot-toast";
import { FaCarSide, FaRegClipboard } from "react-icons/fa";
import { confirmRegisterforPickup, resetConfirmRegisterforPickup } from "../../Redux/store/carPackageBookingsSlice";
import { useNavigate } from "react-router-dom";
import { setPickupActive } from "../../Redux/store/driveModeSlice";

const CarList = ({ cars, counter }) => {
    const dispatch = useDispatch()
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false)
    const [specificCar, setSpecificCar] = useState({})
    const navigate = useNavigate()

    const { loading, success, error } = useSelector(
        (state) => state.carPackageBookings
    );

    const drive = async (carId, pickupActive) => {
        dispatch(setPickupActive(pickupActive));
        navigate(`/drivemode/${carId}`)
    }


    useEffect(() => {
        console.log(cars)
    }, [cars])

    const handleRegister = async (carId) => {
        dispatch(confirmRegisterforPickup({ carId }));

    }

    useEffect(() => {
        if (success) {
            counter()

            // reset slice so it doesn't re-trigger
            dispatch(resetConfirmRegisterforPickup());

            // optional: close modal
            setShowEditModal(false);
        }

        if (error) {
            toast.error(error?.message || "Registration failed");
        }
    }, [success, error, dispatch]);



    const handleStatusChange = async (id) => {
        // console.log(id)
        const token = localStorage.getItem("token")
        const resultAction = await dispatch(editStatus({ token, carId: id }));
        if (editStatus.fulfilled.match(resultAction)) {
            toast.success("Car Status Changed Successfully!!", {
                style: {
                    borderRadius: "10px",
                    background: "#333",
                    color: "#fff",
                },
            });
            counter()
        } else {
            // console.error("Error adding car ❌", resultAction.payload || resultAction.error);
            toast.error("Failed to change the status", {
                style: {
                    borderRadius: "10px",
                    background: "#333",
                    color: "#fff",
                },
            });
            counter()
        }
    }
    return (
        <>
            <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Car List</h2>
                    <button
                        //   onClick={onAdd}
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
                    >
                        <AiOutlinePlus size={20} />
                        Add
                    </button>
                </div>

                {/* Cards grid */}
                <div style={{ marginTop: '15px' }} className="grid md:grid-cols-1 lg:grid-cols-1 gap-6">
                    {cars.map((car, index) => (
                        <div
                            key={index}
                            className="bg-white border border-gray-200 rounded-xl shadow-md p-4 flex items-center justify-between"
                        >
                            {/* Car details */}
                            <div className="space-y-1">
                                <h3 className="text-lg font-semibold text-gray-700">{car.carModel}</h3>
                                <p className="text-sm text-gray-500">Type: {car.carType}</p>
                                <p className="text-sm text-gray-500">Plate: {car.carPlateNumber}</p>
                                <p className="text-sm text-gray-500">Driver: {car.driverName}</p>
                                <p className="text-sm text-gray-500">License: {car.driverLicenseNumber}</p>
                                <p className="text-sm text-gray-500">Phone: {car.driverPhoneNumber}</p>
                                <p
                                    className={`text-sm font-medium ${car.isActive ? "text-green-600" : "text-red-600"
                                        }`}
                                >
                                    {car.isActive ? "Active" : "Inactive"}
                                </p>
                            </div>

                            {/* Right side buttons */}
                            <div className="flex items-center gap-2 self-center">
                                {/* Edit button */}

                                <button
                                    onClick={() => {
                                        if (!car?.isPickUpActive) {
                                            handleRegister(car.id)
                                        } else {
                                            drive(car.id, car.isPickUpActive)
                                        }
                                    }}
                                    className={`flex cursor-pointer items-center gap-2 px-3 py-2 rounded-md transition
    ${car?.isPickUpActive
                                            ? "bg-green-600 hover:bg-green-700 text-white"
                                            : "bg-blue-600 hover:bg-blue-700 text-white"
                                        }
  `}
                                >
                                    {!car?.isPickUpActive ? (
                                        <>
                                            <FaRegClipboard size={18} />
                                            Register for Pickup
                                        </>
                                    ) : (
                                        <>
                                            <FaCarSide size={18} />
                                            Drive Mode
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={() => {
                                        setSpecificCar(car);
                                        setShowEditModal(true);
                                    }}
                                    className="flex items-center gap-2 bg-yellow-500 text-white px-3 py-2 rounded-md hover:bg-yellow-600 transition"
                                >
                                    <AiOutlineEdit size={18} />
                                    Edit
                                </button>

                                {/* Activate / Deactivate button */}
                                <button
                                    onClick={async () =>
                                        await handleStatusChange(car.id)
                                    }
                                    className={`flex items-center gap-2 px-3 py-2 rounded-md transition ${car.isActive
                                        ? "bg-red-500 hover:bg-red-600 text-white"
                                        : "bg-green-500 hover:bg-green-600 text-white"
                                        }`}
                                >
                                    {car.isActive ? "Deactivate" : "Activate"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {showModal && (
                <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl relative">
                        {/* Close button */}
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                        <AddCar counter={() => {
                            counter()
                            setShowModal(false)
                        }} />
                    </div>
                </div>
            )}
            {showEditModal && (
                <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl relative">
                        {/* Close button */}
                        <button
                            onClick={() => setShowEditModal(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                        <EditCar car={specificCar} counter={() => {
                            counter()
                            setShowEditModal(false)
                        }} />
                    </div>
                </div>
            )}
        </>
    );
};

export default CarList;
