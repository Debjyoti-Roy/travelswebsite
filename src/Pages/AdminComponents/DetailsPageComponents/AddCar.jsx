import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { addCartoPackage } from '../../../Redux/store/adminCarSlice';
import toast from 'react-hot-toast';

const MONTHS = [
    { label: 'January', value: 1 },
    { label: 'February', value: 2 },
    { label: 'March', value: 3 },
    { label: 'April', value: 4 },
    { label: 'May', value: 5 },
    { label: 'June', value: 6 },
    { label: 'July', value: 7 },
    { label: 'August', value: 8 },
    { label: 'September', value: 9 },
    { label: 'October', value: 10 },
    { label: 'November', value: 11 },
    { label: 'December', value: 12 },
];

const CAR_TYPES = ['HATCHBACK', 'SEDAN', 'SUV', 'TEMPO_TRAVELLER', 'MINI_BUS'];

const AddCar = ({ carPackageDetails, addCarClose }) => {
    // console.log(carPackageDetails)
    const [submitting, setSubmitting] = useState(false);
    const [carDetails, setCarDetails] = useState([]);
    const dispatch = useDispatch()
    const addCar = () => {
        setCarDetails((prev) => [
            ...prev,
            {
                carType: '',
                carName: '',
                capacity: '',
                luggageCapacity: '',
                acAvailable: 'YES',
                notes: '',
                prices: [{ startMonth: '', endMonth: '', price: '' }],
            },
        ]);
    };
    useEffect(() => {
        addCar()
    }, [carPackageDetails])



    const updateCarField = (index, field, value) => {
        setCarDetails((prev) => {
            const copy = [...prev];
            copy[index] = { ...copy[index], [field]: value };
            return copy;
        });
    };

    const addPrice = (carIdx) => {
        setCarDetails((prev) => {
            const copy = [...prev];
            copy[carIdx] = {
                ...copy[carIdx],
                prices: [...copy[carIdx].prices, { startMonth: '', endMonth: '', price: '' }],
            };
            return copy;
        });
    };

    const removePrice = (carIdx, priceIdx) => {
        setCarDetails((prev) => {
            const copy = [...prev];
            const prices = [...copy[carIdx].prices];
            prices.splice(priceIdx, 1);
            copy[carIdx].prices = prices.length ? prices : [{ startMonth: '', endMonth: '', price: '' }];
            return copy;
        });
    };

    const updatePrice = (carIdx, priceIdx, field, value) => {
        setCarDetails((prev) => {
            const copy = [...prev];
            const prices = [...copy[carIdx].prices];
            prices[priceIdx] = { ...prices[priceIdx], [field]: value };
            copy[carIdx].prices = prices;
            return copy;
        });
    };
    const handleSubmit = async () => {
        setSubmitting(true)
        // console.log(carPackageDetails)
        // console.log(carDetails[0]);
        const car = {
            ...carDetails[0],
            acAvailable: carDetails[0].acAvailable === "YES",
          };
        dispatch(addCartoPackage({ formData: car, packageId: carPackageDetails.packageId }))
        .unwrap()
        .then((res)=>{
            toast.success("Car added successfully");
            setSubmitting(false)
            addCarClose()

        })
        .catch(async(err)=>{
            toast.error("Failed to add car");
            setSubmitting(false)
            addCarClose()
        })
    }
    return (
        <section className="p-4">

            {carDetails.map((car, idx) => (
                <div
                    key={idx}
                    className=" rounded-xl mb-6"
                >
                    {/* Header Row */}
                    <div className="flex justify-between items-center mb-3">
                        <b className="text-gray-800">Car #{idx + 1}</b>

                    </div>

                    {/* Car Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex flex-col">
                            <span className="font-medium mb-1">Car Type*</span>
                            <select
                                value={car.carType}
                                onChange={(e) => updateCarField(idx, "carType", e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-300"
                            >
                                <option value="">Select type</option>
                                {CAR_TYPES.map((t) => (
                                    <option key={t} value={t}>
                                        {t}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="flex flex-col">
                            <span className="font-medium mb-1">Car Name*</span>
                            <input
                                type="text"
                                value={car.carName}
                                onChange={(e) => updateCarField(idx, "carName", e.target.value)}
                                placeholder="e.g., Swift"
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-300"
                            />
                        </label>

                        <label className="flex flex-col">
                            <span className="font-medium mb-1">Capacity*</span>
                            <input
                                type="number"
                                min={1}
                                value={car.capacity}
                                onChange={(e) => updateCarField(idx, "capacity", e.target.value)}
                                placeholder="e.g., 4"
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-300"
                            />
                        </label>

                        <label className="flex flex-col">
                            <span className="font-medium mb-1">Luggage Capacity*</span>
                            <input
                                type="number"
                                min={0}
                                value={car.luggageCapacity}
                                onChange={(e) =>
                                    updateCarField(idx, "luggageCapacity", e.target.value)
                                }
                                placeholder="e.g., 2"
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-300"
                            />
                        </label>

                        <label className="flex flex-col">
                            <span className="font-medium mb-1">AC Available*</span>
                            <select
                                value={car.acAvailable}
                                onChange={(e) => updateCarField(idx, "acAvailable", e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-300"
                            >
                                <option value="YES">Yes</option>
                                <option value="NO">No</option>
                            </select>
                        </label>

                        <label className="flex flex-col">
                            <span className="font-medium mb-1">Notes (optional)</span>
                            <input
                                type="text"
                                value={car.notes}
                                onChange={(e) => updateCarField(idx, "notes", e.target.value)}
                                placeholder="Any additional info"
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-300"
                            />
                        </label>
                    </div>

                    {/* Prices */}
                    <div style={{ marginTop: '2vh', marginBottom: '2vh' }} className="mt-4">
                        <h4 className="font-semibold text-gray-800 mb-2">
                            Prices* (at least one)
                        </h4>

                        {car.prices.map((p, pIdx) => (
                            <div
                                key={pIdx}
                                className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end mb-3"
                            >
                                <label className="flex flex-col">
                                    <span className="font-medium mb-1">Start Month*</span>
                                    <select
                                        value={p.startMonth}
                                        onChange={(e) =>
                                            updatePrice(idx, pIdx, "startMonth", e.target.value)
                                        }
                                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-300"
                                    >
                                        <option value="">Select</option>
                                        {MONTHS.map((m) => (
                                            <option key={m.value} value={m.value}>
                                                {m.label}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <label className="flex flex-col">
                                    <span className="font-medium mb-1">End Month*</span>
                                    <select
                                        value={p.endMonth}
                                        onChange={(e) =>
                                            updatePrice(idx, pIdx, "endMonth", e.target.value)
                                        }
                                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-300"
                                    >
                                        <option value="">Select</option>
                                        {MONTHS.map((m) => (
                                            <option key={m.value} value={m.value}>
                                                {m.label}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <label className="flex flex-col">
                                    <span className="font-medium mb-1">Price*</span>
                                    <input
                                        type="number"
                                        min={0}
                                        value={p.price}
                                        onChange={(e) => updatePrice(idx, pIdx, "price", e.target.value)}
                                        placeholder="e.g., 3500"
                                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-300"
                                    />
                                </label>

                                <button
                                    type="button"
                                    onClick={() => removePrice(idx, pIdx)}
                                    className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
                                >
                                    Remove
                                </button>


                                {/* <button
                                    type="button"
                                    onClick={() => addPrice(idx)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                >
                                    Add Price
                                </button> */}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => addPrice(idx)}
                            style={{ marginTop: "1vh" }}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        >
                            Add Price
                        </button>
                    </div>
                </div>
            ))}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-6">




                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className={`px-4 py-2 rounded-lg text-white transition ${submitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-600"
                        }`}
                >
                    {submitting ? "Submitting..." : "Submit"}
                </button>
            </div>
        </section>
    )
}

export default AddCar