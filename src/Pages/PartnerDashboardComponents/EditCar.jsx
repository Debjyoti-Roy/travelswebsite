import React, { useEffect, useState } from 'react'
import { editCars } from '../../Redux/store/partnerCar';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

const EditCar = ({ counter, car }) => {
    const dispatch = useDispatch()
    const [formData, setFormData] = useState({
        carId:"",
        carType: "",
        carModel: "",
        carPlateNumber: "",
        acAvailable: true,
        driverName: "",
        driverPhoneNumber: "",
        driverLicenseNumber: "",
    });

    


    useEffect(() => {
        if (car) {
            setFormData({
                carId: car.id || "",
                carType: car.carType || "",
                carModel: car.carModel || "",
                carPlateNumber: car.carPlateNumber || "",
                acAvailable: car.acAvailable ?? true, // keep default true if undefined
                driverName: car.driverName || "",
                driverPhoneNumber: car.driverPhoneNumber || "",
                driverLicenseNumber: car.driverLicenseNumber || "",
            });
        }
    }, [car]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log("Car JSON:", formData);
        const token = localStorage.getItem("token")
        const resultAction = await dispatch(editCars({ token, body: formData }));
        if (editCars.fulfilled.match(resultAction)) {
            toast.success("Car Edited Successfully!!", {
                style: {
                    borderRadius: "10px",
                    background: "#333",
                    color: "#fff",
                },
            });
            counter()
        } else {
            // console.error("Error adding car ❌", resultAction.payload || resultAction.error);
            toast.error("Failed to Edit the Car", {
                style: {
                    borderRadius: "10px",
                    background: "#333",
                    color: "#fff",
                },
            });
            counter()
        }
    };
    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 bg-white p-6 rounded-2xl w-full mx-auto"
            style={{ margin: "30px auto" }} // custom margin override
        >
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
                Add Car
            </h2>
            {/* Car Type */}

            <div>
                <label className="block text-gray-700 font-medium mb-1">Car Type</label>
                <select
                    name="carType"
                    value={formData.carType}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                >
                    <option value="HATCHBACK">Hatchback</option>
                    <option value="SEDAN">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="TEMPO_TRAVELLER">Tempo Traveller</option>
                    <option value="MINI_BUS">Mini Bus</option>
                </select>
            </div>

            {/* Car Model */}
            <div>
                <label className="block text-gray-700 font-medium mb-1">Car Model</label>
                <input
                    type="text"
                    name="carModel"
                    value={formData.carModel}
                    onChange={handleChange}
                    placeholder="Enter Car Model"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
            </div>

            {/* Car Plate Number */}
            <div>
                <label className="block text-gray-700 font-medium mb-1">
                    Car Plate Number
                </label>
                <input
                    type="text"
                    name="carPlateNumber"
                    value={formData.carPlateNumber}
                    onChange={handleChange}
                    placeholder="Enter Car Plate Number"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
            </div>

            {/* AC Available */}
            <div>
                <label className="block text-gray-700 font-medium mb-1">AC Available</label>
                <select
                    name="acAvailable"
                    value={formData.acAvailable ? "true" : "false"}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            acAvailable: e.target.value === "true",
                        }))
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                </select>
            </div>


            {/* Driver Name */}
            <div>
                <label className="block text-gray-700 font-medium mb-1">Driver Name</label>
                <input
                    type="text"
                    name="driverName"
                    value={formData.driverName}
                    onChange={handleChange}
                    placeholder="Enter Driver Name"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
            </div>

            {/* Driver Phone Number */}
            <div>
                <label className="block text-gray-700 font-medium mb-1">
                    Driver Phone Number
                </label>
                <input
                    type="text"
                    name="driverPhoneNumber"
                    value={formData.driverPhoneNumber}
                    onChange={handleChange}
                    placeholder="Enter Phone Number"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
            </div>

            {/* Driver License Number */}
            <div>
                <label className="block text-gray-700 font-medium mb-1">
                    Driver License Number
                </label>
                <input
                    type="text"
                    name="driverLicenseNumber"
                    value={formData.driverLicenseNumber}
                    onChange={handleChange}
                    placeholder="Enter License Number"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
            </div>

            {/* Submit Button */}
            <div className="w-full flex justify-end">
                <button
                    type="submit"
                    className="md:w-1/4 w-full cursor-pointer bg-[#2589f3] text-white font-semibold py-3 rounded-full shadow-md transition-all duration-300 hover:bg-[#0036ac] hover:shadow-lg hover:scale-105"
                >
                    Submit Car
                </button>
            </div>
        </form>
    )
}

export default EditCar