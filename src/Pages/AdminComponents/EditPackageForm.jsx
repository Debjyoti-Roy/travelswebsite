import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getStates } from '../../Redux/store/adminCarSlice';
import CreatableSelect from "react-select/creatable";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

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

const EditPackageForm = ({ carPackageDetails, isOpen }) => {
    const [removedAllPrices, setRemovedAllPrices] = useState(!isOpen);
    const [removedPriceIds, setRemovedPriceIds] = useState([]);
    const [submitting, setSubmitting] = useState(false)
    const [basic, setBasic] = useState({
        title: '',
        description: '',
        durationDays: '',
        thumbnailFile: null,
        thumbnailPreview: '',
        pickupLocation: '',
        dropLocation: '',
        destinationName: '',
        destinationState: '',
        includedFeatures: [{ id: null, desc: '' }],
        excludedFeatures: [{ id: null, desc: '' }],
    });

    // ----- Itineraries -----
    const [itineraries, setItineraries] = useState([
        { title: '', description: '', imageFile: null, imagePreview: '' }
    ]);

    // ----- Car Details -----
    const [carDetails, setCarDetails] = useState([]);
    const dispatch = useDispatch();
    const [tab, setTab] = useState(0);
    const { states = [], statesloading, stateserror } = useSelector((state) => state.admincar);

    // Firebase storage
    const storage = getStorage();

    useEffect(() => {
        dispatch(getStates());
    }, [dispatch]);

    useEffect(() => {
        if (carPackageDetails) {
            setBasic({
                title: carPackageDetails.title || "",
                durationDays: carPackageDetails.durationDays || 0,
                description: carPackageDetails.description || "",
                thumbnailPreview: carPackageDetails.thumbnailUrl || null,
                pickupLocation: carPackageDetails.pickupLocation || "",
                dropLocation: carPackageDetails.dropLocation || "",
                destinationName: carPackageDetails.destination?.name || "",
                destinationState: carPackageDetails.destination?.state || "",
                includedFeatures: carPackageDetails.includedFeatures?.map(f => ({
                    id: f.inclusionId,
                    desc: f.description
                })) || [{ id: null, desc: '' }],
                excludedFeatures: carPackageDetails.excludedFeatures?.map(f => ({
                    id: f.exclusionId,
                    desc: f.description
                })) || [{ id: null, desc: '' }],
            });

            setItineraries(
                carPackageDetails.itineraries?.map(it => ({
                    title: it.title,
                    description: it.description,
                    imagePreview: it.imageUrl,
                    itineraryId: it.itineraryId,
                })) || []
            );

            setCarDetails(
                carPackageDetails.carDetails?.map(c => ({
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
                })) || []
            );
        }
    }, [carPackageDetails]);

    // Firebase upload function
    const uploadFileMock = async (file, title) => {
        try {
            const fileRef = ref(storage, `car-package/${title}/${file.name}`);
            await uploadBytes(fileRef, file);
            const url = await getDownloadURL(fileRef);
            return url;
        } catch (error) {
            console.error("File upload failed:", error);
            throw error;
        }
    };

    const deleteFiles = async (paths = []) => {
        for (let path of paths) {
            try {
                await deleteObject(ref(storage, path));
            } catch (err) {
                console.warn("Failed to delete file:", path, err);
            }
        }
    };

    // Navigation functions
    const goNext = () => {
        if (tab === 0) setTab(1);
        else if (tab === 1) setTab(2);
    };
    const goPrev = () => setTab((t) => Math.max(0, t - 1));

    const addItinerary = () => {
        const days = Number(basic.durationDays) || 0;
        if (itineraries.length >= days) return;
        setItineraries((prev) => [
            ...prev,
            { title: '', description: '', imageFile: null, imagePreview: '' },
        ]);
    };

    const removeItinerary = (index) => {
        setItineraries((prev) => prev.filter((_, i) => i !== index));
    };

    const handleBasicChange = (field, value) => {
        setBasic((prev) => ({ ...prev, [field]: value }));
    };

    const handleBasicImage = (file) => {
        if (!file) return;
        const preview = URL.createObjectURL(file);
        setBasic((prev) => ({ ...prev, thumbnailFile: file, thumbnailPreview: preview }));
    };

    const updateItineraryField = (index, field, value) => {
        setItineraries((prev) => {
            const copy = [...prev];
            copy[index] = { ...copy[index], [field]: value };
            return copy;
        });
    };

    const handleItineraryImage = (index, file) => {
        if (!file) return;
        const preview = URL.createObjectURL(file);
        setItineraries((prev) => {
            const copy = [...prev];
            copy[index] = { ...copy[index], imageFile: file, imagePreview: preview };
            return copy;
        });
    };

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

    const removeCar = (index) => {
        setCarDetails((prev) => prev.filter((_, i) => i !== index));
    };

    // Feature management functions
    const handleFeatureChange = (type, idx, value) => {
        setBasic((prev) => {
            const copy = [...prev[type]];
            copy[idx] = { ...copy[idx], desc: value };
            return { ...prev, [type]: copy };
        });
    };

    const addFeature = (type) => {
        setBasic((prev) => ({ ...prev, [type]: [...prev[type], { id: null, desc: '' }] }));
    };

    const removeFeature = (type, idx) => {
        setBasic((prev) => {
            const copy = [...prev[type]];
            copy.splice(idx, 1);
            return { ...prev, [type]: copy.length ? copy : [{ id: null, desc: '' }] };
        });
    };

    // Car management functions
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

    // Add new price for a car
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

    // Submit function
    const handleSubmit = async () => {
        // Basic validation
        if (!basic.title?.trim()) {
            alert('Please enter a title');
            return;
        }
        if (!basic.description?.trim()) {
            alert('Please enter a description');
            return;
        }
        if (!basic.durationDays || Number(basic.durationDays) <= 0) {
            alert('Please enter a valid duration');
            return;
        }
        if (!basic.pickupLocation?.trim()) {
            alert('Please enter pickup location');
            return;
        }
        if (!basic.dropLocation?.trim()) {
            alert('Please enter drop location');
            return;
        }
        if (!basic.destinationName?.trim()) {
            alert('Please enter destination name');
            return;
        }
        if (!basic.destinationState?.trim()) {
            alert('Please enter destination state');
            return;
        }

        setSubmitting(true);
        const uploadedPaths = [];
        const oldImagesToDelete = [];

        try {
            // 1) Handle thumbnail image
            let thumbnailUrl = basic.thumbnailPreview;
            if (basic.thumbnailFile) {
                thumbnailUrl = await uploadFileMock(basic.thumbnailFile, basic.title.trim());
                uploadedPaths.push(thumbnailUrl);
                if (carPackageDetails.thumbnailUrl) {
                    oldImagesToDelete.push(carPackageDetails.thumbnailUrl);
                }
            }

            // 2) Handle itinerary images
            const itinerariesWithUrls = [];
            for (let i = 0; i < itineraries.length; i++) {
                const it = itineraries[i];
                let imageUrl = it.imagePreview;

                if (it.imageFile) {
                    imageUrl = await uploadFileMock(it.imageFile, basic.title.trim());
                    uploadedPaths.push(imageUrl);
                    if (carPackageDetails.itineraries?.[i]?.imageUrl) {
                        oldImagesToDelete.push(carPackageDetails.itineraries[i].imageUrl);
                    }
                }

                itinerariesWithUrls.push({
                    title: it.title,
                    description: it.description,
                    imageUrl,
                    itineraryId: it.itineraryId || 0,
                });
            }

            // 3) Handle features - maintain original array structure
            const includedFeatures = basic.includedFeatures.map(f => {
                if (f.id) {
                    // Existing feature
                    if (f.desc && f.desc.trim()) {
                        // Feature with description (updated)
                        return { inclusionId: f.id, description: f.desc.trim() };
                    } else {
                        // Feature without description (removed)
                        return { inclusionId: f.id };
                    }
                } else {
                    // New feature
                    if (f.desc && f.desc.trim()) {
                        return { description: f.desc.trim() };
                    } else {
                        // Empty new feature - skip
                        return null;
                    }
                }
            }).filter(Boolean); // Remove null entries

            const excludedFeatures = basic.excludedFeatures.map(f => {
                if (f.id) {
                    // Existing feature
                    if (f.desc && f.desc.trim()) {
                        // Feature with description (updated)
                        return { exclusionId: f.id, description: f.desc.trim() };
                    } else {
                        // Feature without description (removed)
                        return { exclusionId: f.id };
                    }
                } else {
                    // New feature
                    if (f.desc && f.desc.trim()) {
                        return { description: f.desc.trim() };
                    } else {
                        // Empty new feature - skip
                        return null;
                    }
                }
            }).filter(Boolean); // Remove null entries

            // 4) Handle car details
            const carDetailsPayload = carDetails.map((c) => {
                const hasNewPrices = c.prices.some(p => !p.seasonPriceId);

                if (hasNewPrices) {
                    // New price structure (with months)
                    return {
                        carId: c.carId,
                        carType: c.carType,
                        carName: c.carName.trim(),
                        capacity: Number(c.capacity),
                        luggageCapacity: Number(c.luggageCapacity),
                        acAvailable: c.acAvailable === 'YES',
                        notes: c.notes?.trim() || '',
                        prices: c.prices
                            .filter(p => p.startMonth && p.endMonth && p.price)
                            .map((p) => ({
                                startMonth: Number(p.startMonth),
                                endMonth: Number(p.endMonth),
                                price: Number(p.price),
                            })),
                    };
                } else {
                    // Existing price structure (only price updates)
                    return {
                        carId: c.carId,
                        carType: c.carType,
                        carName: c.carName.trim(),
                        capacity: Number(c.capacity),
                        luggageCapacity: Number(c.luggageCapacity),
                        acAvailable: c.acAvailable === 'YES',
                        notes: c.notes?.trim() || '',
                        carPrices: c.prices.map((p) => ({
                            seasonPriceId: p.seasonPriceId,
                            price: Number(p.price),
                        })),
                    };
                }
            });

            // 5) Final payload
            const payload = {
                packageId: carPackageDetails.packageId,
                title: basic.title.trim(),
                description: basic.description.trim(),
                thumbnailUrl,
                pickupLocation: basic.pickupLocation.trim(),
                dropLocation: basic.dropLocation.trim(),
                destination: {
                    name: basic.destinationName.trim(),
                    state: basic.destinationState.trim(),
                },
                includedFeatures: includedFeatures,
                excludedFeatures: excludedFeatures,
                itineraries: itinerariesWithUrls,
                carDetails: carDetailsPayload,
            };

            if (!removedAllPrices) {
                console.log('Edit Package Payload:', payload);
            } else {
                console.log(payload.carDetails);
            }

            // TODO: Call API here
            // dispatch(updateCarPackage(payload))
            //     .unwrap()
            //     .then((res) => {
            //         setSubmitting(false);
            //         toast.success("Car package updated successfully");
            //         // Delete old images after successful update
            //         deleteFiles(oldImagesToDelete);
            //     })
            //     .catch(async (err) => {
            //         setSubmitting(false);
            //         await deleteFiles(uploadedPaths);
            //         toast.error("Failed to update car package. Uploads removed.");
            //     });

        } catch (error) {
            setSubmitting(false);
            await deleteFiles(uploadedPaths);
            console.error('Error updating package:', error);
        }
    };

    return (
        <div style={{ display: 'flex', gap: 16 }} className='h-full'>
            {/* Vertical Tabs */}
            <div className="min-w-[200px] ">
                {/* Basic Details */}
                <div
                    onClick={() => setTab(0)}
                    className={`px-4 py-3 mb-2 rounded-lg cursor-pointer transition 
      ${tab === 0 ? "bg-blue-500 font-medium text-white" : "hover:bg-blue-100"}
    `}
                >
                    1) Basic Details
                </div>

                {/* Itineraries */}
                <div
                    onClick={() => setTab(1)}
                    className={`px-4 py-3 mb-2 rounded-lg cursor-pointer transition 
      ${tab === 1 ? "bg-blue-500 font-medium text-white" : "hover:bg-blue-100"} 
    `}

                >
                    2) Itineraries
                </div>

                {/* Car Details */}
                <div
                    onClick={() => setTab(2)}
                    className={`px-4 py-3 rounded-lg cursor-pointer transition 
      ${tab === 2 ? "bg-blue-500 font-medium text-white" : "hover:bg-blue-100"} 
      
    `}

                >
                    3) Car Details
                </div>
            </div>


            {/* Content */}
            <div style={{ flex: 1, paddingBottom: 24, marginTop: "5px" }} className='h-full'>
                {tab === 0 && (
                    <section className="p-4">
                        <h2 className="text-xl font-semibold mb-4">Basic Details</h2>

                        {/* Grid layout - responsive */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Title */}
                            <label className="flex flex-col">
                                <span className="font-medium mb-1">Title*</span>
                                <input
                                    type="text"
                                    value={basic.title}
                                    onChange={(e) => handleBasicChange("title", e.target.value)}
                                    placeholder="Package title"
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-300"
                                />
                            </label>

                            {/* Duration */}
                            <label className="flex flex-col">
                                <span className="font-medium mb-1">Duration (days)*</span>
                                <input
                                    type="number"
                                    min={1}
                                    value={basic.durationDays}
                                    onChange={(e) => handleBasicChange("durationDays", e.target.value)}
                                    placeholder="e.g., 5"
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-300"
                                />
                            </label>

                            {/* Description - full width */}
                            <label className="flex flex-col md:col-span-2">
                                <span className="font-medium mb-1">Description*</span>
                                <textarea
                                    rows={4}
                                    value={basic.description}
                                    onChange={(e) => handleBasicChange("description", e.target.value)}
                                    placeholder="Describe the package"
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-300"
                                />
                            </label>

                            {/* Thumbnail */}
                            <label className="flex flex-col md:col-span-2">
                                {basic.thumbnailPreview && (
                                    <div className="mt-2">
                                        <img
                                            src={basic.thumbnailPreview}
                                            alt="thumbnail preview"
                                            className="max-w-[200px] rounded-lg shadow"
                                        />
                                    </div>
                                )}
                                <span className="font-medium mb-1">Thumbnail Image*</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleBasicImage(e.target.files?.[0])}
                                    className="border border-gray-300 rounded-lg"
                                />

                            </label>

                            {/* Pickup Location */}
                            <label className="flex flex-col">
                                <span className="font-medium mb-1">Pickup Location(s)* (comma-separated)</span>
                                <input
                                    type="text"
                                    value={basic.pickupLocation}
                                    onChange={(e) => handleBasicChange("pickupLocation", e.target.value)}
                                    placeholder="City/Address"
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-300"
                                />
                            </label>

                            {/* Drop Location */}
                            <label className="flex flex-col">
                                <span className="font-medium mb-1">Drop Location(s)* (comma-separated)</span>
                                <input
                                    type="text"
                                    value={basic.dropLocation}
                                    onChange={(e) => handleBasicChange("dropLocation", e.target.value)}
                                    placeholder="City/Address"
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-300"
                                />
                            </label>

                            {/* Destination Name */}
                            <label className="flex flex-col">
                                <span className="font-medium mb-1">Destination Name*</span>
                                <input
                                    type="text"
                                    value={basic.destinationName}
                                    onChange={(e) => handleBasicChange("destinationName", e.target.value)}
                                    placeholder="e.g., Manali"
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-300"
                                />
                            </label>

                            {/* Destination State */}
                            <label className="flex flex-col">
                                <span className="font-medium mb-1">Destination State*</span>
                                <CreatableSelect
                                    options={states.map((s) => ({ value: s, label: s }))}
                                    value={
                                        basic.destinationState
                                            ? { value: basic.destinationState, label: basic.destinationState }
                                            : null
                                    }
                                    onChange={(selectedOption) =>
                                        handleBasicChange(
                                            "destinationState",
                                            selectedOption ? selectedOption.value : ""
                                        )
                                    }
                                    placeholder="Type or pick a state"
                                    isClearable
                                />
                            </label>
                        </div>

                        {/* Included Features */}
                        <div style={{ marginTop: "2vh" }} className="mt-6">
                            <h3 className="text-lg font-semibold mb-2">Included Features (optional)</h3>
                            {basic.includedFeatures.map((f, i) => (
                                <div style={{ marginBottom: "1vh" }} key={`inc-${i}`} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={f.desc}
                                        onChange={(e) =>
                                            handleFeatureChange("includedFeatures", i, e.target.value)
                                        }
                                        placeholder="e.g., Breakfast"
                                        className="flex-1 border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeFeature("includedFeatures", i)}
                                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addFeature("includedFeatures")}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                            >
                                Add more
                            </button>
                        </div>

                        {/* Excluded Features */}
                        <div style={{ marginTop: "2vh" }} className="mt-6">
                            <h3 className="text-lg font-semibold mb-2">Excluded Features (optional)</h3>
                            {basic.excludedFeatures.map((f, i) => (
                                <div style={{ marginBottom: "1vh" }} key={`exc-${i}`} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={f.desc}
                                        onChange={(e) =>
                                            handleFeatureChange("excludedFeatures", i, e.target.value)
                                        }
                                        placeholder="e.g., Airfare"
                                        className="flex-1 border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeFeature("excludedFeatures", i)}
                                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                                    >
                                        Remove
                                    </button>

                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addFeature("excludedFeatures")}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                            >
                                Add more
                            </button>
                        </div>

                        {/* Navigation Buttons */}
                        <div style={{ marginTop: "2vh" }} className="flex gap-4 mt-8">

                            <button
                                type="button"

                                onClick={goNext}
                                className={`px-4 py-2 rounded-lg text-white transition bg-green-500 hover:bg-green-600`}
                            >
                                Next → Itineraries
                            </button>
                        </div>
                    </section>

                )}

                {tab === 1 && (
                    <section className="p-4">
                        <h2 className="text-xl font-semibold mb-2">Itineraries</h2>
                        <p className="text-gray-600 mb-4">
                            Number of days: <b>{Number(basic.durationDays) || 0}</b>
                        </p>

                        {itineraries.map((it, idx) => (
                            <div
                                key={idx}
                                className=" rounded-xl pb-2 mb-4"
                            >
                                <div className="mb-2 font-semibold text-gray-800">Day {idx + 1}</div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Title */}
                                    <label className="flex flex-col md:col-span-2">
                                        <span className="font-medium mb-1">Title*</span>
                                        <input
                                            type="text"
                                            value={it.title}
                                            onChange={(e) =>
                                                updateItineraryField(idx, "title", e.target.value)
                                            }
                                            placeholder="Itinerary title"
                                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-300"
                                        />
                                    </label>

                                    {/* Image */}
                                    <label className="flex flex-col md:col-span-2">
                                        <span className="font-medium mb-1">Image*</span>
                                        {it.imagePreview && (
                                            <div className="mt-2">
                                                <img
                                                    src={it.imagePreview}
                                                    alt={`itinerary-${idx}`}
                                                    className="max-w-[200px] rounded-lg shadow"
                                                />
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                                handleItineraryImage(idx, e.target.files?.[0])
                                            }
                                            className="border border-gray-300 rounded-lg"
                                        />

                                    </label>

                                    {/* Description */}
                                    <label className="flex flex-col md:col-span-2">
                                        <span className="font-medium mb-1">Description*</span>
                                        <textarea
                                            rows={3}
                                            value={it.description}
                                            onChange={(e) =>
                                                updateItineraryField(idx, "description", e.target.value)
                                            }
                                            placeholder="Details for the day"
                                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-300"
                                        />
                                    </label>
                                </div>
                            </div>
                        ))}

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3 mt-4">
                            <button
                                type="button"
                                onClick={goPrev}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                            >
                                ← Back
                            </button>

                            <button
                                type="button"
                                onClick={addItinerary}
                                disabled={itineraries.length >= (Number(basic.durationDays) || 0)}
                                title={
                                    itineraries.length >= (Number(basic.durationDays) || 0)
                                        ? "Reached required number of days"
                                        : ""
                                }
                                className={`px-4 py-2 rounded-lg text-white transition ${itineraries.length >= (Number(basic.durationDays) || 0)
                                    ? "bg-gray-300 cursor-not-allowed"
                                    : "bg-blue-500 hover:bg-blue-600"
                                    }`}
                            >
                                Add Itinerary
                            </button>

                            <button
                                type="button"
                                onClick={goNext}

                                className={`px-4 py-2 rounded-lg text-white transition bg-green-500 hover:bg-green-600`}
                            >
                                Next → Car Details
                            </button>
                        </div>
                    </section>
                )}

                {tab === 2 && (
                    <section className="p-4 min-h-full">
                        <h2 className="text-xl font-semibold mb-4">Car Details</h2>

                        {carDetails.map((car, idx) => (
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
                                            className={`grid grid-cols-1  gap-3 items-end mb-3 ${removedAllPrices ? "md:grid-cols-4" : "md:grid-cols-3"}`}
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

                                            {/* <button
                                                type="button"
                                                onClick={() => removePrice(idx, pIdx)}
                                                className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
                                            >
                                                Remove
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => addPrice(idx)}
                                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                            >
                                                Add Price
                                            </button> */}
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
                                            onClick={() => {
                                                removeAllPrices(idx)
                                                setRemovedPriceIds([...removedPriceIds, p.carId])
                                            }}
                                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                        >
                                            Remove All Prices
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3 mt-6">
                            <button
                                type="button"

                                onClick={goPrev}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                            >
                                ← Back
                            </button>

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
                                className={`px-4 py-2 rounded-lg text-white transition  ${submitting
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-green-500 hover:bg-green-600"
                                    }`}
                            >
                                {submitting ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </section>

                )}
            </div>
        </div>
    )
}

export default EditPackageForm