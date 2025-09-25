import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getStates } from '../../Redux/store/adminCarSlice';
import CreatableSelect from "react-select/creatable";
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { addTourPackage } from '../../Redux/store/adminTourSlice';
import toast from 'react-hot-toast';

const CAR_TYPES = ["HATCHBACK", "SEDAN", "SUV", "TEMPO_TRAVELLER", "MINI_BUS"];
const TOUR_TYPES = ["BUDGET", "PREMIUM", "LUXURY"];
const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const AddTourPackage = ({ setTabRef }) => {
    const dispatch = useDispatch();
    const { states = [], statesloading, stateserror } = useSelector((state) => state.admincar);
    useEffect(() => {
        dispatch(getStates());
    }, [dispatch]);
    const [tab, setTab] = useState(0);
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
        note: '',
        inclusions: [{}],
    });

    const basicValid = useMemo(() => {
        const {
            title,
            description,
            durationDays,
            thumbnailFile,
            pickupLocation,
            dropLocation,
            destinationName,
            destinationState,
        } = basic;
        if (!title?.trim()) return false;
        if (!description?.trim()) return false;
        const days = Number(durationDays);
        if (!days || days <= 0) return false;
        if (!thumbnailFile) return false;
        if (!pickupLocation?.trim()) return false;
        if (!dropLocation?.trim()) return false;
        if (!destinationName?.trim()) return false;
        if (!destinationState?.trim()) return false;
        return true;
    }, [basic]);

    //itinaries
    const [itineraries, setItineraries] = useState([
        { title: '', description: '', imageFile: null, imagePreview: '' }
    ]);
    const itinerariesValid = useMemo(() => {
        const days = Number(basic.durationDays) || 0;
        if (!days) return false;
        if (itineraries.length !== days) return false;
        for (let i = 0; i < itineraries.length; i++) {
            const it = itineraries[i];
            if (!it.title?.trim()) return false;
            if (!it.description?.trim()) return false;
            if (!it.imageFile) return false;
        }
        return true;
    }, [basic.durationDays, itineraries]);

    const [types, setTypes] = useState([
        {
            tourType: "",
            carTypes: "",
            hotelType: "",
            sampleHotelImageUrls: '',
            sampleHotelImageFile: null,
            sampleCarImageUrls: '',
            sampleCarImageFile: null,
            seasonPrices: [
                { startMonth: 0, endMonth: 0, price: 0, isActive: true }
            ]
        }
    ]);
    const typesValid = useMemo(() => {
        if (!types.length) return false;

        return types.every((t) => {
            if (!t.tourType) return false;
            if (!t.carTypes) return false;
            if (!t.hotelType?.trim()) return false;
            if (!t.sampleHotelImageUrls.length) return false;
            if (!t.sampleCarImageUrls.length) return false;

            if (!t.seasonPrices.length) return false;

            return t.seasonPrices.every((sp) => {
                if (sp.startMonth === null || sp.startMonth === undefined) return false;
                if (sp.endMonth === null || sp.endMonth === undefined) return false;
                if (!sp.price || sp.price <= 0) return false;
                return true;
            });
        });
    }, [types]);


    //tab change
    const goNext = () => {
        if (tab === 0 && basicValid) setTab(1);
        else if (tab === 1 && itinerariesValid) setTab(2);
    };
    const goPrev = () => setTab((t) => Math.max(0, t - 1));

    //Incusion
    const handleInclusionChange = (index, field, value) => {
        const updated = [...basic.inclusions];
        updated[index] = { ...updated[index], [field]: value };
        setBasic({ ...basic, inclusions: updated });
    };

    const addInclusion = () => {
        setBasic({
            ...basic,
            inclusions: [...basic.inclusions, { type: "", description: "" }]
        });
    };

    const removeInclusion = (index) => {
        const updated = basic.inclusions.filter((_, i) => i !== index);
        setBasic({ ...basic, inclusions: updated });
    };



    // ----- Handlers: Basic -----
    const handleBasicChange = (field, value) => {
        setBasic((prev) => ({ ...prev, [field]: value }));
    };

    const handleBasicImage = (file) => {
        if (!file) return;
        const preview = URL.createObjectURL(file);
        setBasic((prev) => ({ ...prev, thumbnailFile: file, thumbnailPreview: preview }));
    };
    // ----- Handlers: Itineraries -----
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

    // Keep itineraries count trimmed when durationDays reduces
    useEffect(() => {
        const days = Number(basic.durationDays) || 0;
        if (days === 0) {
            setItineraries([]);
            return;
        }
        setItineraries((prev) => (prev.length > days ? prev.slice(0, days) : prev));
    }, [basic.durationDays]);


    // ----- Handlers: Types -----
    const handleTypeChange = (index, field, value) => {
        const updated = [...types];
        updated[index] = { ...updated[index], [field]: value };
        setTypes(updated);
    };

    const handleSeasonPriceChange = (typeIndex, spIndex, field, value) => {
        const updated = [...types];
        updated[typeIndex].seasonPrices[spIndex][field] = value;
        setTypes(updated);
    };

    const addSeasonPrice = (typeIndex) => {
        const updated = [...types];
        updated[typeIndex].seasonPrices.push({
            startMonth: 0,
            endMonth: 0,
            price: 0,
            isActive: true
        });
        setTypes(updated);
    };

    const removeSeasonPrice = (typeIndex, spIndex) => {
        const updated = [...types];
        updated[typeIndex].seasonPrices = updated[typeIndex].seasonPrices.filter(
            (_, i) => i !== spIndex
        );
        setTypes(updated);
    };

    const addType = () => {
        setTypes([
            ...types,
            {
                tourType: "",
                carTypes: "",
                hotelType: "",
                sampleHotelImageUrls: '',
                sampleHotelImageFile: null,
                sampleCarImageUrls: '',
                sampleCarImageFile: null,
                seasonPrices: [
                    { startMonth: 0, endMonth: 0, price: 0, isActive: true }
                ]
            }
        ]);
    };

    const removeType = (index) => {
        setTypes(types.filter((_, i) => i !== index));
    };

    const handleImageUpload = (typeIndex, fieldUrls, fieldFile, files) => {
        const updated = [...types];
        if (files) {
            updated[typeIndex][fieldUrls] = Array.from(files).map((f) =>
                URL.createObjectURL(f)
            ); // preview URLs
            updated[typeIndex][fieldFile] = files[0]; // keep the first file (or you can store all if needed)
        } else {
            updated[typeIndex][fieldUrls] = [];
            updated[typeIndex][fieldFile] = null;
        }
        setTypes(updated);
    };

    const storage = getStorage();
    const uploadFileMock = async (file, title) => {
        try {
            // Create a storage reference
            const fileRef = ref(storage, `tour-package/${title}/${file.name}`);

            // Upload the file
            await uploadBytes(fileRef, file);

            // Get the download URL
            const url = await getDownloadURL(fileRef);

            return url; // <-- return the Firebase file link
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

    const handleSubmit = async () => {
        setSubmitting(true)
        const uploadedPaths = []
        if (!(basicValid && itinerariesValid && typesValid)) return;
        const thumbnailUrl = basic.thumbnailFile
            ? await uploadFileMock(basic.thumbnailFile, basic.title.trim())
            : '';
        if (thumbnailUrl) uploadedPaths.push(thumbnailUrl)

        const itinerariesWithUrls = [];
        for (let i = 0; i < itineraries.length; i++) {
            const it = itineraries[i];
            const imageUrl = it.imageFile ? await uploadFileMock(it.imageFile, basic.title.trim()) : '';
            if (imageUrl) uploadedPaths.push(imageUrl)
            itinerariesWithUrls.push({
                dayNumber: i + 1,
                title: it.title,
                description: it.description,
                imageUrl,
            });
        }
        const typeswithUrls = [];
        for (let i = 0; i < types.length; i++) {
            const tp = types[i];
            const hotelImage = tp.sampleHotelImageFile ? await uploadFileMock(tp.sampleHotelImageFile, basic.title.trim()) : "";
            const carImage = tp.sampleCarImageFile ? await uploadFileMock(tp.sampleCarImageFile, basic.title.trim()) : "";
            if (hotelImage) uploadedPaths.push(hotelImage)
            if (carImage) uploadedPaths.push(carImage)
            typeswithUrls.push({
                tourType: tp.tourType,
                carTypes: tp.carTypes,
                hotelType: tp.hotelType,
                sampleHotelImageUrls: hotelImage,
                sampleCarImageUrls: carImage,
                seasonPrices: tp.seasonPrices.map((sp) => ({
                    startMonth: sp.startMonth + 1,
                    endMonth: sp.endMonth + 1,
                    price: sp.price,
                    isActive: sp.isActive,
                }))
            })
        }
        console.log(basic)
        console.log(itineraries)
        console.log(types)
        const payload = {
            title: basic.title,
            description: basic.description,
            durationDays: Number(basic.durationDays),
            thumbnailUrl: thumbnailUrl, // use the preview URL
            pickupLocation: basic.pickupLocation,
            dropLocation: basic.dropLocation,
            destination: {
                name: basic.destinationName,
                state: basic.destinationState,
            },
            note: basic.note,
            isActive: true,
            inclusions: basic.inclusions.map((inc) => ({
                type: inc.type,
                description: inc.description,
            })),
            itineraries: itinerariesWithUrls, // your existing itineraries array
            types: typeswithUrls,
        };

        console.log(payload);
        const push = await dispatch(addTourPackage(payload))
        if (addTourPackage.fulfilled.match(push)) {
            setSubmitting(false)
            setBasic([
                {
                    tourType: "",
                    carTypes: "",
                    hotelType: "",
                    sampleHotelImageUrls: '',
                    sampleHotelImageFile: null,
                    sampleCarImageUrls: '',
                    sampleCarImageFile: null,
                    seasonPrices: [
                        { startMonth: 0, endMonth: 0, price: 0, isActive: true }
                    ]
                }
            ])
            setItineraries([
                { title: '', description: '', imageFile: null, imagePreview: '' }
            ])
            setTypes([
                {
                    tourType: "",
                    carTypes: "",
                    hotelType: "",
                    sampleHotelImageUrls: '',
                    sampleHotelImageFile: null,
                    sampleCarImageUrls: '',
                    sampleCarImageFile: null,
                    seasonPrices: [
                        { startMonth: 0, endMonth: 0, price: 0, isActive: true }
                    ]
                }
            ])
            setTab(0)
            toast.success("Tour package added successfully");
        } else {
            setSubmitting(false)
            await deleteFiles(uploadedPaths);
            toast.error("Failed to add tour package. Uploads removed.");
        }


    }



    return (
        <div style={{ display: 'flex', gap: 16 }}>
            <div className="min-w-[200px] border-r border-gray-200">
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
                    onClick={() => (basicValid ? setTab(1) : null)}
                    className={`px-4 py-3 mb-2 rounded-lg cursor-pointer transition 
      ${tab === 1 ? "bg-blue-500 font-medium text-white" : "hover:bg-blue-100"} 
      ${basicValid ? "opacity-100" : "opacity-60 cursor-not-allowed"}
    `}
                    title={!basicValid ? "Fill Basic Details to proceed" : ""}
                >
                    2) Itineraries
                </div>

                {/* Car Details */}
                <div
                    onClick={() => setTab(2)}
                    // onClick={() => (itinerariesValid ? setTab(2) : null)}
                    className={`px-4 py-3 rounded-lg cursor-pointer transition 
      ${tab === 2 ? "bg-blue-500 font-medium text-white" : "hover:bg-blue-100"} 
      ${itinerariesValid ? "opacity-100" : "opacity-60 cursor-not-allowed"}
    `}
                    title={!itinerariesValid ? "Complete Itineraries to proceed" : ""}
                >
                    3) Types
                </div>
            </div>
            <div style={{ flex: 1, paddingBottom: 24, marginTop: "5px" }}>
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

                        {/* Note - full row */}
                        <div className="mt-6">
                            <label className="flex flex-col">
                                <span className="font-medium mb-1">Note (optional)</span>
                                <textarea
                                    rows={3}
                                    value={basic.note}
                                    onChange={(e) => handleBasicChange("note", e.target.value)}
                                    placeholder="Add any additional notes here..."
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-300"
                                />
                            </label>
                        </div>

                        {/* Inclusions */}
                        <div style={{ marginTop: "2vh" }} className="mt-6">
                            <h3 className="text-lg font-semibold mb-2">Inclusions</h3>
                            {basic.inclusions.map((inc, i) => (
                                <div
                                    key={`inc-${i}`}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3"
                                >
                                    {/* Type dropdown */}
                                    <select
                                        value={inc.type || ""}
                                        onChange={(e) =>
                                            handleInclusionChange(i, "type", e.target.value)
                                        }
                                        className="border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-300"
                                    >
                                        <option value="">Select type</option>
                                        <option value="INCLUDED">INCLUDED</option>
                                        <option value="EXCLUDED">EXCLUDED</option>
                                    </select>

                                    {/* Description */}
                                    <input
                                        type="text"
                                        value={inc.description || ""}
                                        onChange={(e) =>
                                            handleInclusionChange(i, "description", e.target.value)
                                        }
                                        placeholder="Description"
                                        className="border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-300"
                                    />

                                    {/* Remove button (full width on small, right aligned on md) */}
                                    <div className="md:col-span-2 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => removeInclusion(i)}
                                            className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 mt-2"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addInclusion}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                            >
                                Add more
                            </button>
                        </div>

                        {/* Navigation Buttons */}
                        <div style={{ marginTop: "2vh" }} className="flex gap-4 mt-8">
                            <button
                                type="button"
                                disabled={!basicValid}
                                // onClick={()=>console.log(basic)}
                                onClick={goNext}
                                title={!basicValid ? "Fill all required fields" : ""}
                                className={`px-4 py-2 rounded-lg text-white transition ${basicValid
                                    ? "bg-green-500 hover:bg-green-600"
                                    : "bg-gray-300 cursor-not-allowed"
                                    }`}
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

                                {/* Remove Day Button */}
                                <div style={{ marginTop: "1vh" }} className="mt-3">
                                    <button
                                        type="button"
                                        onClick={() => removeItinerary(idx)}
                                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                    >
                                        Remove Day
                                    </button>
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
                                disabled={!itinerariesValid}
                                title={!itinerariesValid ? "Add & complete all itineraries" : ""}
                                className={`px-4 py-2 rounded-lg text-white transition ${itinerariesValid
                                    ? "bg-green-500 hover:bg-green-600"
                                    : "bg-gray-300 cursor-not-allowed"
                                    }`}
                            >
                                Next → Car Details
                            </button>
                        </div>
                    </section>

                )}
                {tab == 2 && (
                    <section className="p-4">
                        <h2 className="text-xl font-semibold mb-4">Tour Types</h2>

                        {types.map((t, typeIndex) => (
                            <div
                                key={`type-${typeIndex}`}
                                className="rounded-xl p-4 mb-6"
                            >
                                {/* Tour Type */}
                                <label className="flex flex-col mb-3">
                                    <span className="font-medium mb-1">Tour Type*</span>
                                    <select
                                        value={t.tourType}
                                        onChange={(e) =>
                                            handleTypeChange(typeIndex, "tourType", e.target.value)
                                        }
                                        className="border border-gray-300 rounded-lg p-2"
                                    >
                                        <option value="">Select Tour Type</option>
                                        {TOUR_TYPES.map((tt) => (
                                            <option key={tt} value={tt}>
                                                {tt}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                {/* Car Type */}
                                <label className="flex flex-col mb-3">
                                    <span className="font-medium mb-1">Car Type*</span>
                                    <select
                                        value={t.carTypes}
                                        onChange={(e) =>
                                            handleTypeChange(typeIndex, "carTypes", e.target.value)
                                        }
                                        className="border border-gray-300 rounded-lg p-2"
                                    >
                                        <option value="">Select Car Type</option>
                                        {CAR_TYPES.map((ct) => (
                                            <option key={ct} value={ct}>
                                                {ct}
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                {/* Hotel Type */}
                                <label className="flex flex-col mb-3">
                                    <span className="font-medium mb-1">Hotel Type*</span>
                                    <input
                                        type="text"
                                        value={t.hotelType}
                                        onChange={(e) =>
                                            handleTypeChange(typeIndex, "hotelType", e.target.value)
                                        }
                                        placeholder="Hotel type"
                                        className="border border-gray-300 rounded-lg p-2"
                                    />
                                </label>

                                {/* Hotel Images */}
                                <label className="flex flex-col md:col-span-2 mb-3">
                                    <span className="font-medium mb-1">Hotel Images*</span>
                                    <div className="flex gap-2 mt-2 flex-wrap">
                                        {t.sampleHotelImageUrls &&
                                            t.sampleHotelImageUrls.map((src, i) => (
                                                <img
                                                    key={i}
                                                    src={src}
                                                    alt="hotel preview"
                                                    className="max-w-[200px] rounded-lg shadow"
                                                />
                                            ))}
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                            handleImageUpload(
                                                typeIndex,
                                                "sampleHotelImageUrls",
                                                "sampleHotelImageFile",
                                                e.target.files
                                            )
                                        }
                                    />
                                </label>

                                {/* Car Images */}
                                <label className="flex flex-col md:col-span-2 mb-3">
                                    <span className="font-medium mb-1">Car Images*</span>
                                    <div className="flex gap-2 mt-2 flex-wrap">
                                        {t.sampleCarImageUrls &&
                                            t.sampleCarImageUrls.map((src, i) => (
                                                <img
                                                    key={i}
                                                    src={src}
                                                    alt="car preview"
                                                    className="max-w-[200px] rounded-lg shadow"
                                                />
                                            ))}
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                            handleImageUpload(
                                                typeIndex,
                                                "sampleCarImageUrls",
                                                "sampleCarImageFile",
                                                e.target.files
                                            )
                                        }
                                    />
                                </label>


                                {/* Season Prices */}
                                <h4 className="font-semibold mt-4">Season Prices</h4>
                                {t.seasonPrices.map((p, pIdx) => (
                                    <div
                                        key={`sp-${typeIndex}-${pIdx}`}
                                        className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end mb-3"
                                    >
                                        {/* Start Month */}
                                        <label className="flex flex-col">
                                            <span className="font-medium mb-1">Start Month*</span>
                                            <select
                                                value={p.startMonth}
                                                onChange={(e) =>
                                                    handleSeasonPriceChange(typeIndex, pIdx, "startMonth", Number(e.target.value))
                                                }
                                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-300"
                                            >
                                                <option value="">Select</option>
                                                {MONTHS.map((m, i) => (
                                                    <option key={i} value={i}>
                                                        {m}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>

                                        {/* End Month */}
                                        <label className="flex flex-col">
                                            <span className="font-medium mb-1">End Month*</span>
                                            <select
                                                value={p.endMonth}
                                                onChange={(e) =>
                                                    handleSeasonPriceChange(typeIndex, pIdx, "endMonth", Number(e.target.value))
                                                }
                                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-300"
                                            >
                                                <option value="">Select</option>
                                                {MONTHS.map((m, i) => (
                                                    <option key={i} value={i}>
                                                        {m}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>

                                        {/* Price */}
                                        <label className="flex flex-col">
                                            <span className="font-medium mb-1">Price*</span>
                                            <input
                                                type="number"
                                                min={0}
                                                value={p.price}
                                                onChange={(e) =>
                                                    handleSeasonPriceChange(typeIndex, pIdx, "price", Number(e.target.value))
                                                }
                                                placeholder="e.g., 3500"
                                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-300"
                                            />
                                        </label>

                                        {/* Remove */}
                                        <button
                                            type="button"
                                            onClick={() => removeSeasonPrice(typeIndex, pIdx)}
                                            className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}


                                {/* Add More Season Prices (hidden if endMonth=December) */}
                                {t.seasonPrices[t.seasonPrices.length - 1]?.endMonth !== 11 && (
                                    <button
                                        type="button"
                                        style={{ marginTop: '10px' }}
                                        onClick={() => addSeasonPrice(typeIndex)}
                                        className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                                    >
                                        Add Season Price
                                    </button>
                                )}

                                {/* Remove Type */}
                                <div style={{ marginTop: '10px' }} className=" flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => removeType(typeIndex)}
                                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                                    >
                                        Remove Type
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Add New Type */}
                        <button
                            type="button"
                            onClick={addType}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        >
                            Add New Type
                        </button>

                        {/* Submit */}
                        <div className="mt-6">
                            <button
                                type="button"
                                disabled={!typesValid || submitting}
                                onClick={handleSubmit}
                                // onClick={() => console.log("Submitting:", types)}
                                className={`px-4 py-2 rounded-lg text-white transition ${typesValid
                                    ? "bg-green-500 hover:bg-green-600"
                                    : "bg-gray-300 cursor-not-allowed"
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

export default AddTourPackage