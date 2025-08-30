// import React, { useEffect } from 'react'
// import { useDispatch, useSelector } from 'react-redux';
// import { getStates } from '../../Redux/store/adminCarSlice';

// const AddCarPackage = () => {
//     const dispatch = useDispatch();
//   const { states, loading, error } = useSelector((state) => state.admincar);

//   useEffect(() => {
//     dispatch(getStates());
//   }, [dispatch]);

//   useEffect(() => {
//     console.log(states)
//   }, [states])

//   return (
//     <div>AddCarPackage</div>
//   )
// }

// export default AddCarPackage
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getStates } from '../../Redux/store/adminCarSlice';
import Select from "react-select";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import CreatableSelect from "react-select/creatable";

// Helper: month options
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

const CAR_TYPES = ['HATCHBACK', 'SEDAN', 'SUV', 'MUV', 'COUPE', 'CONVERTIBLE', 'MINIVAN', 'PICKUP', 'OTHER'];

const AddCarPackage = () => {
    const dispatch = useDispatch();
    const { states = [], loading, error } = useSelector((state) => state.admincar);

    useEffect(() => {
        dispatch(getStates());
    }, [dispatch]);

    // ----- Tabs -----
    const [tab, setTab] = useState(0); // 0: Basic, 1: Itineraries, 2: Car Details

    // ----- Basic Details -----
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
        includedFeatures: [''],
        excludedFeatures: [''],
    });

    // ----- Itineraries -----
    const [itineraries, setItineraries] = useState([
        // { title:'', description:'', imageFile:null, imagePreview:'' }
    ]);

    // ----- Car Details -----
    const [carDetails, setCarDetails] = useState([
        // {
        //   carType: '',
        //   carName: '',
        //   capacity: '',
        //   luggageCapacity: '',
        //   acAvailable: 'YES', // 'YES' | 'NO'
        //   notes: '',
        //   prices: [{ startMonth: '', endMonth: '', price: '' }]
        // }
    ]);

    // ----- Derived validations -----
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

    const carDetailsValid = useMemo(() => {
        if (carDetails.length === 0) return false;
        for (let i = 0; i < carDetails.length; i++) {
            const c = carDetails[i];
            if (!c.carType?.trim()) return false;
            if (!c.carName?.trim()) return false;
            const cap = Number(c.capacity);
            const lug = Number(c.luggageCapacity);
            if (!cap || cap <= 0) return false;
            if (isNaN(lug) || lug < 0) return false;
            if (!['YES', 'NO'].includes(c.acAvailable)) return false;
            if (!c.prices || c.prices.length === 0) return false;
            for (let j = 0; j < c.prices.length; j++) {
                const p = c.prices[j];
                const sm = Number(p.startMonth);
                const em = Number(p.endMonth);
                const price = Number(p.price);
                if (!sm || sm < 1 || sm > 12) return false;
                if (!em || em < 1 || em > 12) return false;
                if (isNaN(price) || price < 0) return false;
            }
        }
        return true;
    }, [carDetails]);

    // ----- Handlers: Basic -----
    const handleBasicChange = (field, value) => {
        setBasic((prev) => ({ ...prev, [field]: value }));
    };

    const handleBasicImage = (file) => {
        if (!file) return;
        const preview = URL.createObjectURL(file);
        setBasic((prev) => ({ ...prev, thumbnailFile: file, thumbnailPreview: preview }));
    };

    const handleFeatureChange = (type, idx, value) => {
        setBasic((prev) => {
            const copy = [...prev[type]];
            copy[idx] = value;
            return { ...prev, [type]: copy };
        });
    };

    const addFeature = (type) => {
        setBasic((prev) => ({ ...prev, [type]: [...prev[type], ''] }));
    };

    const removeFeature = (type, idx) => {
        setBasic((prev) => {
            const copy = [...prev[type]];
            copy.splice(idx, 1);
            return { ...prev, [type]: copy.length ? copy : [''] };
        });
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

    // ----- Handlers: Car Details -----
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

    // ----- Tab navigation guards -----
    const goNext = () => {
        if (tab === 0 && basicValid) setTab(1);
        else if (tab === 1 && itinerariesValid) setTab(2);
    };
    const goPrev = () => setTab((t) => Math.max(0, t - 1));

    // ----- Mock upload (replace with Firebase uploads) -----
    // const uploadFileMock = async (file) => {
    //     // TODO: Replace with your Firebase upload logic:
    //     // const url = await uploadBytes(...) then getDownloadURL(...)
    //     // For now, return a blob URL preview as a placeholder:
    //     return URL.createObjectURL(file);
    // };
    const storage = getStorage();
    const uploadFileMock = async (file, title) => {
        try {
            // Create a storage reference
            const fileRef = ref(storage, `car-package/${title}/${file.name}`);

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

    // ----- Submit -----
    const handleSubmit = async () => {
        if (!(basicValid && itinerariesValid && carDetailsValid)) return;

        // 1) Upload images (thumbnail + itinerary images)
        const thumbnailUrl = basic.thumbnailFile
            ? await uploadFileMock(basic.thumbnailFile, basic.title.trim())
            : '';

        const itinerariesWithUrls = [];
        for (let i = 0; i < itineraries.length; i++) {
            const it = itineraries[i];
            const imageUrl = it.imageFile ? await uploadFileMock(it.imageFile, basic.title.trim()) : '';
            itinerariesWithUrls.push({
                dayNumber: i + 1,
                title: it.title.trim(),
                description: it.description.trim(),
                imageUrl,
            });
        }

        // 2) Shape final payload
        const payload = {
            title: basic.title.trim(),
            description: basic.description.trim(),
            durationDays: Number(basic.durationDays),
            thumbnailUrl,
            pickupLocation: basic.pickupLocation.trim(),
            dropLocation: basic.dropLocation.trim(),
            destination: {
                name: basic.destinationName.trim(),
                state: basic.destinationState.trim(),
            },
            itineraries: itinerariesWithUrls,
            includedFeatures: (basic.includedFeatures || []).filter((x) => x && x.trim()).map((x) => x.trim()),
            excludedFeatures: (basic.excludedFeatures || []).filter((x) => x && x.trim()).map((x) => x.trim()),
            carDetails: carDetails.map((c) => ({
                carType: c.carType,
                carName: c.carName.trim(),
                capacity: Number(c.capacity),
                luggageCapacity: Number(c.luggageCapacity),
                acAvailable: c.acAvailable === 'YES',
                notes: c.notes?.trim() || '',
                prices: (c.prices || []).map((p) => ({
                    startMonth: Number(p.startMonth),
                    endMonth: Number(p.endMonth),
                    price: Number(p.price),
                })),
            })),
        };

        console.log('FINAL PAYLOAD:', payload);
        alert('Form ready! Check console for final payload.');
    };

    // ----- UI -----
    return (
        <div style={{ display: 'flex', gap: 16 }}>
            {/* Vertical Tabs */}
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
                    onClick={() => (itinerariesValid ? setTab(2) : null)}
                    className={`px-4 py-3 rounded-lg cursor-pointer transition 
      ${tab === 2 ? "bg-blue-500 font-medium text-white" : "hover:bg-blue-100"} 
      ${itinerariesValid ? "opacity-100" : "opacity-60 cursor-not-allowed"}
    `}
                    title={!itinerariesValid ? "Complete Itineraries to proceed" : ""}
                >
                    3) Car Details
                </div>
            </div>


            {/* Content */}
            <div style={{ flex: 1, paddingBottom: 24, marginTop:"5px" }}>
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
                      <label className="flex flex-col">
                        <span className="font-medium mb-1">Thumbnail Image*</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleBasicImage(e.target.files?.[0])}
                          className="border border-gray-300 rounded-lg p-2"
                        />
                        {basic.thumbnailPreview && (
                          <div className="mt-2">
                            <img
                              src={basic.thumbnailPreview}
                              alt="thumbnail preview"
                              className="max-w-[200px] rounded-lg shadow"
                            />
                          </div>
                        )}
                      </label>
                  
                      {/* Pickup Location */}
                      <label className="flex flex-col">
                        <span className="font-medium mb-1">Pickup Location*</span>
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
                        <span className="font-medium mb-1">Drop Location*</span>
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
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-2">Included Features (optional)</h3>
                      {basic.includedFeatures.map((f, i) => (
                        <div key={`inc-${i}`} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={f}
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
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-2">Excluded Features (optional)</h3>
                      {basic.excludedFeatures.map((f, i) => (
                        <div key={`exc-${i}`} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={f}
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
                    <div className="flex gap-4 mt-8">
                      <button
                        type="button"
                        disabled
                        className="bg-gray-300 text-gray-600 px-4 py-2 rounded-lg cursor-not-allowed"
                      >
                        Prev
                      </button>
                      <button
                        type="button"
                        disabled={!basicValid}
                        onClick={goNext}
                        title={!basicValid ? "Fill all required fields" : ""}
                        className={`px-4 py-2 rounded-lg text-white transition ${
                          basicValid
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
                    <section>
                        <h2>Itineraries</h2>
                        <p>Number of days: <b>{Number(basic.durationDays) || 0}</b></p>

                        {itineraries.map((it, idx) => (
                            <div key={idx} style={{ border: '1px solid #eee', borderRadius: 8, padding: 12, marginBottom: 12 }}>
                                <div style={{ marginBottom: 8, fontWeight: 600 }}>Day {idx + 1}</div>
                                <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
                                    <label>
                                        Title*<br />
                                        <input
                                            type="text"
                                            value={it.title}
                                            onChange={(e) => updateItineraryField(idx, 'title', e.target.value)}
                                            placeholder="Itenary title"
                                            style={{ width: '100%' }}
                                        />
                                    </label>
                                    <label>
                                        Image*<br />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleItineraryImage(idx, e.target.files?.[0])}
                                        />
                                        {it.imagePreview && (
                                            <div style={{ marginTop: 8 }}>
                                                <img src={it.imagePreview} alt={`itinerary-${idx}`} style={{ maxWidth: 200, borderRadius: 8 }} />
                                            </div>
                                        )}
                                    </label>
                                    <label style={{ gridColumn: '1 / -1' }}>
                                        Description*<br />
                                        <textarea
                                            rows={3}
                                            value={it.description}
                                            onChange={(e) => updateItineraryField(idx, 'description', e.target.value)}
                                            placeholder="Details for the day"
                                            style={{ width: '100%' }}
                                        />
                                    </label>
                                </div>
                                <div style={{ marginTop: 8 }}>
                                    <button type="button" onClick={() => removeItinerary(idx)}>Remove Day</button>
                                </div>
                            </div>
                        ))}

                        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                            <button type="button" onClick={goPrev}>← Back</button>
                            <button
                                type="button"
                                onClick={addItinerary}
                                disabled={itineraries.length >= (Number(basic.durationDays) || 0)}
                                title={itineraries.length >= (Number(basic.durationDays) || 0) ? 'Reached required number of days' : ''}
                            >
                                Add Itinerary
                            </button>
                            <button
                                type="button"
                                onClick={goNext}
                                disabled={!itinerariesValid}
                                title={!itinerariesValid ? 'Add & complete all itineraries' : ''}
                            >
                                Next → Car Details
                            </button>
                        </div>
                    </section>
                )}

                {tab === 2 && (
                    <section>
                        <h2>Car Details</h2>

                        {carDetails.map((car, idx) => (
                            <div key={idx} style={{ border: '1px solid #eee', borderRadius: 8, padding: 12, marginBottom: 16 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <b>Car #{idx + 1}</b>
                                    <button type="button" onClick={() => removeCar(idx)}>Remove Car</button>
                                </div>
                                <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr 1fr' }}>
                                    <label>
                                        Car Type*<br />
                                        <select
                                            value={car.carType}
                                            onChange={(e) => updateCarField(idx, 'carType', e.target.value)}
                                            style={{ width: '100%' }}
                                        >
                                            <option value="">Select type</option>
                                            {CAR_TYPES.map((t) => (
                                                <option key={t} value={t}>{t}</option>
                                            ))}
                                        </select>
                                    </label>
                                    <label>
                                        Car Name*<br />
                                        <input
                                            type="text"
                                            value={car.carName}
                                            onChange={(e) => updateCarField(idx, 'carName', e.target.value)}
                                            placeholder="e.g., Swift"
                                            style={{ width: '100%' }}
                                        />
                                    </label>
                                    <label>
                                        Capacity*<br />
                                        <input
                                            type="number"
                                            min={1}
                                            value={car.capacity}
                                            onChange={(e) => updateCarField(idx, 'capacity', e.target.value)}
                                            placeholder="e.g., 4"
                                            style={{ width: '100%' }}
                                        />
                                    </label>
                                    <label>
                                        Luggage Capacity*<br />
                                        <input
                                            type="number"
                                            min={0}
                                            value={car.luggageCapacity}
                                            onChange={(e) => updateCarField(idx, 'luggageCapacity', e.target.value)}
                                            placeholder="e.g., 2"
                                            style={{ width: '100%' }}
                                        />
                                    </label>
                                    <label>
                                        AC Available*<br />
                                        <select
                                            value={car.acAvailable}
                                            onChange={(e) => updateCarField(idx, 'acAvailable', e.target.value)}
                                            style={{ width: '100%' }}
                                        >
                                            <option value="YES">Yes</option>
                                            <option value="NO">No</option>
                                        </select>
                                    </label>
                                    <label>
                                        Notes (optional)<br />
                                        <input
                                            type="text"
                                            value={car.notes}
                                            onChange={(e) => updateCarField(idx, 'notes', e.target.value)}
                                            placeholder="Any additional info"
                                            style={{ width: '100%' }}
                                        />
                                    </label>
                                </div>

                                <div style={{ marginTop: 12 }}>
                                    <h4>Prices* (at least one)</h4>
                                    {car.prices.map((p, pIdx) => (
                                        <div key={pIdx} style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 1fr 1fr auto', alignItems: 'end', marginBottom: 8 }}>
                                            <label>
                                                Start Month*<br />
                                                <select
                                                    value={p.startMonth}
                                                    onChange={(e) => updatePrice(idx, pIdx, 'startMonth', e.target.value)}
                                                    style={{ width: '100%' }}
                                                >
                                                    <option value="">Select</option>
                                                    {MONTHS.map((m) => (
                                                        <option key={m.value} value={m.value}>{m.label}</option>
                                                    ))}
                                                </select>
                                            </label>
                                            <label>
                                                End Month*<br />
                                                <select
                                                    value={p.endMonth}
                                                    onChange={(e) => updatePrice(idx, pIdx, 'endMonth', e.target.value)}
                                                    style={{ width: '100%' }}
                                                >
                                                    <option value="">Select</option>
                                                    {MONTHS.map((m) => (
                                                        <option key={m.value} value={m.value}>{m.label}</option>
                                                    ))}
                                                </select>
                                            </label>
                                            <label>
                                                Price*<br />
                                                <input
                                                    type="number"
                                                    min={0}
                                                    value={p.price}
                                                    onChange={(e) => updatePrice(idx, pIdx, 'price', e.target.value)}
                                                    placeholder="e.g., 3500"
                                                    style={{ width: '100%' }}
                                                />
                                            </label>
                                            <button type="button" onClick={() => removePrice(idx, pIdx)}>Remove</button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => addPrice(idx)}>Add Price</button>
                                </div>
                            </div>
                        ))}

                        <div style={{ display: 'flex', gap: 8 }}>
                            <button type="button" onClick={goPrev}>← Back</button>
                            <button type="button" onClick={addCar}>Add Car</button>
                            <button
                                type="button"
                                disabled={!(basicValid && itinerariesValid && carDetailsValid)}
                                onClick={handleSubmit}
                                title={!(basicValid && itinerariesValid && carDetailsValid) ? 'Complete required fields' : ''}
                            >
                                Submit
                            </button>
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default AddCarPackage;
