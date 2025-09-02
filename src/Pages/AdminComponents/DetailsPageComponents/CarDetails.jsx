import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { updateCarPackage } from '../../../Redux/store/adminCarSlice';
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

const CarDetails = ({ carPackageDetails, carDetailsClose }) => {
    const [removedAllPrices, setRemovedAllPrices] = useState(false);
    const [removedPriceIds, setRemovedPriceIds] = useState([]);
    const [carDetails, setCarDetails] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        console.log('useEffect triggered with carPackageDetails:', carPackageDetails);
        if (carPackageDetails && carPackageDetails.carDetails) {
            const mappedCars = carPackageDetails.carDetails.map(c => ({
                carId: c.carId,
                carType: c.carType,
                carName: c.carName,
                capacity: c.capacity,
                luggageCapacity: c.luggageCapacity,
                acAvailable: c.acAvailable ? "YES" : "NO",
                notes: c.notes || "",
                prices: c.carPrices?.map(p => ({
                    seasonPriceId: p.seasonPriceId,
                    startMonth: p.startMonth,
                    endMonth: p.endMonth,
                    price: p.price,
                })) || [{ startMonth: "", endMonth: "", price: "" }],
            }));
            console.log('Setting carDetails to:', mappedCars);
            setCarDetails(mappedCars);
        } else {
            console.log('Setting carDetails to empty array');
            setCarDetails([]);
        }
    }, [carPackageDetails])

    const addCar = () => {
        setCarDetails((prev) => [
            ...prev,
            {
                carId: null, // New car has no carId
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

    const removeCar = (index) => {
        setCarDetails((prev) => prev.filter((_, i) => i !== index));
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

    // Remove specific price for a car
    const removePrice = (carIdx, priceIdx) => {
        setCarDetails((prev) => {
            const copy = [...prev];
            const prices = [...copy[carIdx].prices];
            prices.splice(priceIdx, 1);
            copy[carIdx].prices = prices.length ? prices : [{ startMonth: '', endMonth: '', price: '' }];
            return copy;
        });
    };

    const updateCarField = (index, field, value) => {
        setCarDetails((prev) => {
            const copy = [...prev];
            copy[index] = { ...copy[index], [field]: value };
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

    // Remove all prices for a car (for month changes)
    const removeAllPrices = (carIdx) => {
        setRemovedAllPrices(true);
        setCarDetails((prev) => {
            const copy = [...prev];
            copy[carIdx] = {
                ...copy[carIdx],
                prices: [{ startMonth: '', endMonth: '', price: '' }]
            };
            return copy;
        });
    };

    const handleSubmit = async () => {
        setSubmitting(true);
    
        try {
            const originalCarDetails = carPackageDetails?.carDetails || [];
            const apiCalls = [];
            const updatedCars = [];
            const updatedPrices = []; // ✅ collect all price updates here
    
            for (let i = 0; i < carDetails.length; i++) {
                const car = carDetails[i];
                const originalCar = originalCarDetails.find(oc => oc.carId === car.carId);
    
                if (originalCar) {
                    // ✅ Existing car
                    const hasChanges =
                        car.carType !== originalCar.carType ||
                        car.carName !== originalCar.carName ||
                        Number(car.capacity) !== originalCar.capacity ||
                        Number(car.luggageCapacity) !== originalCar.luggageCapacity ||
                        car.acAvailable !== (originalCar.acAvailable ? "YES" : "NO") ||
                        car.notes !== (originalCar.notes || "");
    
                    const hasPriceChanges = car.prices.some((price, priceIdx) => {
                        const originalPrice = originalCar.carPrices?.[priceIdx];
                        if (!originalPrice) return true; // new price
                        return Number(price.price) !== originalPrice.price;
                    });
    
                    const hasRemovedAllPrices = car.prices.every(price => !price.seasonPriceId);
    
                    // 🔹 Collect car detail updates
                    if (hasChanges) {
                        updatedCars.push({
                            carId: car.carId,
                            carType: car.carType,
                            carName: car.carName,
                            capacity: Number(car.capacity),
                            luggageCapacity: Number(car.luggageCapacity),
                            acAvailable: car.acAvailable === "YES",
                            notes: car.notes,
                        });
                    }
    
                    // 🔹 Collect price updates (batch instead of pushing directly)
                    if (hasPriceChanges || hasRemovedAllPrices) {
                        const newPrices = car.prices.filter(
                            p => p.startMonth && p.endMonth && p.price
                        );
    
                        updatedPrices.push({
                            type: hasRemovedAllPrices ? "removeAllPrices" : "updatePrices",
                            payload: {
                                id: car.carId,
                                packageId: carPackageDetails.packageId,
                                prices: newPrices.map(p => ({
                                    startMonth: Number(p.startMonth),
                                    endMonth: Number(p.endMonth),
                                    price: Number(p.price),
                                    seasonPriceId: p.seasonPriceId,
                                })),
                            },
                        });
                    }
                } else {
                    // ✅ New car
                    const newCarPrices = car.prices.filter(
                        p => p.startMonth && p.endMonth && p.price
                    );
                    if (
                        car.carType &&
                        car.carName &&
                        car.capacity &&
                        car.luggageCapacity &&
                        newCarPrices.length > 0
                    ) {
                        apiCalls.push({
                            type: "addCar",
                            payload: {
                                carPackageId: carPackageDetails.packageId,
                                carType: car.carType,
                                carName: car.carName,
                                capacity: Number(car.capacity),
                                luggageCapacity: Number(car.luggageCapacity),
                                acAvailable: car.acAvailable === "YES",
                                notes: car.notes,
                                prices: newCarPrices.map(p => ({
                                    startMonth: Number(p.startMonth),
                                    endMonth: Number(p.endMonth),
                                    price: Number(p.price),
                                })),
                            },
                        });
                    }
                }
            }
    
            // ✅ Handle removed cars
            const removedCars = originalCarDetails.filter(
                originalCar => !carDetails.some(car => car.carId === originalCar.carId)
            );
    
            removedCars.forEach(car => {
                apiCalls.push({
                    type: "removeCar",
                    payload: {
                        packageId: carPackageDetails.packageId,
                        carId: car.carId,
                    },
                });
            });
    
            // ✅ Add all detail updates in one call
            if (updatedCars.length > 0) {
                apiCalls.push({
                    type: "updateCars",
                    payload: {
                        packageId: carPackageDetails.packageId,
                        carDetails: updatedCars,
                    },
                });
            }
    
            // ✅ Add all price updates (one entry per car, collected earlier)
            if (updatedPrices.length > 0) {
                apiCalls.push(...updatedPrices);
            }
    
            // 🚀 Execute all API calls (currently mocked with console.log)
            console.log("Final Car Details API Calls:", apiCalls);
            for (const apiCall of apiCalls) {
                console.log(`${apiCall.type} API Call:`, apiCall.payload);
                // Example:
                // if (apiCall.type === "updateCars") {
                //     await dispatch(updateCarPackage({ formData: apiCall.payload }));
                // }
            }
    
            setSubmitting(false);
            toast.success("Car details processed successfully");
            // carDetailsClose();
        } catch (error) {
            setSubmitting(false);
            console.error("Error processing car details:", error);
            toast.error("Failed to process car details");
        }
    };
    
    

    return (
        <section className="p-4 min-h-full">

            {carDetails && carDetails.length > 0 ? carDetails.map((car, idx) => (
                <div
                    key={idx}
                    className=" rounded-xl mb-6"
                >
                    {/* Header Row */}
                    <div className="flex justify-between items-center mb-3">
                        <b className="text-gray-800">Car #{idx + 1}</b>
                        <button
                            type="button"
                            onClick={() => removeCar(idx)}
                            className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                        >
                            Remove Car
                        </button>
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
                                className={`grid grid-cols-1 gap-3 items-end mb-3 ${removedAllPrices ? "md:grid-cols-4" : "md:grid-cols-3"}`}
                            >
                                <label className="flex flex-col">
                                    <span className="font-medium mb-1">Start Month*</span>
                                    <select
                                        value={p.startMonth}
                                        disabled={!!p.seasonPriceId}
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
                                        disabled={!!p.seasonPriceId}
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
                                    className={`bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 ${!removedAllPrices ? "hidden" : "block"}`}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}

                        {/* Remove All Prices button */}
                        <div className="flex gap-3 mt-3">
                            <button
                                type="button"
                                onClick={() => addPrice(idx)}
                                className={`bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 ${!removedAllPrices ? "hidden" : "block"}`}
                            >
                                Add Price
                            </button>
                            <button
                                type="button"
                                onClick={() => removeAllPrices(idx)}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                            >
                                Remove All Prices
                            </button>
                        </div>
                    </div>
                </div>
            )) : (
                <div className="text-center text-gray-500 py-8">
                    No cars available
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-6">

                <button
                    type="button"
                    onClick={addCar}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                    Add Car
                </button>

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

export default CarDetails