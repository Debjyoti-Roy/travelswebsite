import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Country } from "country-state-city";
import statesJson from "../../assets/ade5836fae0ac40531e6afb111d61870-4fe8c90e127060d55ad3c7d6d603d13528450e5b/india-states-and-districts.json"
import { useDispatch, useSelector } from "react-redux";
import { getPartnerArea } from "../../Redux/store/partnerSlice";
import { storage } from "../../auth/firebase";
import { FiX } from "react-icons/fi";
import { ref, uploadBytesResumable, getDownloadURL, uploadBytes, deleteObject } from "firebase/storage";
import {
    FaUtensils, FaConciergeBell, FaParking, FaTshirt, FaUserTie, FaHotel,
    FaSuitcase, FaFirstAid, FaVideo, FaHotTub, FaFire, FaWifi, FaCouch,
    FaTint, FaHiking, FaHeart, FaUsers, FaBlind, FaUser, FaUserFriends,
    FaPaw, FaChild
} from "react-icons/fa";
import { MdPower } from "react-icons/md";
import { GiCampfire } from "react-icons/gi";
import { MdDelete, MdAdd } from "react-icons/md";
import toast from "react-hot-toast";
import { createHotel } from "../../Redux/store/hotelSlice";


const statesData = statesJson.states.map((s) => ({
    value: s.state,
    label: s.state,
}));


const fetchLatLng = async (pincode) => {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?postalcode=${pincode}&country=India&format=json`
        );
        const data = await response.json();
        if (data && data.length > 0) {
            const { lat, lon } = data[0];
            return { lat, lon };
        } else {
            return { lat: "", lon: "" };
        }
    } catch (error) {
        console.error("Error fetching lat/lng:", error);
        return { lat: "", lon: "" };
    }
};

const BasicDetailsForm = ({ tab, setBasicDetails, basicDetails }) => {
    const [state, setState] = useState(null);
    const [district, setDistrict] = useState(null);
    const [city, setCity] = useState(null);
    const [districtsOptions, setDistrictsOptions] = useState([]);
    const [citiesOptions, setCitiesOptions] = useState([]);
    const [pincode, setPincode] = useState("");
    const [lat, setLat] = useState("");
    const [long, setLong] = useState("");
    const [area, setArea] = useState("");
    const [areaList, setAreaList] = useState([])
    const [hotelName, setHotelName] = useState("")
    const [hotelAddress, setHotelAddress] = useState("")
    const [hotelAbout, setHotelAbout] = useState("")
    //area list
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filtered, setFiltered] = useState([]);



    useEffect(() => {
        if (area === "") {
            setFiltered(areaList);
        } else {
            setFiltered(
                areaList.filter((item) =>
                    item.toLowerCase().includes(area.toLowerCase())
                )
            );
        }
    }, [area, areaList]);

    const handleSelect = (selectedArea) => {
        setBasicDetails({ ...basicDetails, area: selectedArea });
        setShowSuggestions(false);
    };


    const dispatch = useDispatch()

    const [locationAccessGranted, setLocationAccessGranted] = useState(false);


    const allDistricts = {};
    statesJson.states.forEach((s) => {
        allDistricts[s.state] = s.districts.map((d) => ({
            value: d.name,
            label: d.name,
        }));
    });

    const allCities = {
        Khordha: [{ value: "Bhubaneswar", label: "Bhubaneswar" }],
        Cuttack: [{ value: "Cuttack City", label: "Cuttack City" }],
        Pune: [{ value: "Pune City", label: "Pune City" }],
        Mumbai: [{ value: "Mumbai City", label: "Mumbai City" }],
        NewDelhi: [{ value: "Connaught Place", label: "Connaught Place" }],
    };



    useEffect(() => {
        if (basicDetails.state) {
            setDistrictsOptions(allDistricts[basicDetails.state] || []);
            setDistrict(null);
            setCity(null);
        }
    }, [basicDetails.state]);

    useEffect(() => {
        if (district) {
            setCitiesOptions(allCities[district.value] || []);
            setCity(null);
        }
    }, [district]);

    // Ask for location on mount
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLat(position.coords.latitude);
                    setLong(position.coords.longitude);
                    setLocationAccessGranted(true);
                },
                (error) => {
                    console.log("Location permission denied, fallback to pincode");
                    setLocationAccessGranted(false);
                }
            );
        }
    }, []);

    const handlePincodeChange = async (e) => {
        const pin = e.target.value;
        setPincode(pin);

        // Only do pincode-based lookup if location access was denied
        if (!locationAccessGranted && pin.length === 6) {
            try {
                const { lat, lon } = await fetchLatLng(pin);
                setLat(lat)
                setLong(lon)
            } catch (err) {
                console.error("Error fetching location from pincode", err);
            }
        }
    };
    useEffect(() => {
        const area = async () => {
            const token = localStorage.getItem("token")
            const areas = await dispatch(getPartnerArea({ token }));
            if (areas.payload.status == 200) {
                setAreaList(areas.payload.data)
            }

        }
        area()
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        // const basicDetails = {
        //     name: hotelName,
        //     about: hotelAbout,
        //     address: hotelAddress,
        //     state: state.value,
        //     district: district.value,
        //     city: city,
        //     pincode: pincode,
        //     area: area,
        //     latitude: lat,
        //     longitude: long
        // }
        setBasicDetails({
            ...basicDetails,
            latitude: lat,
            longitude: long
        })
        tab("media")
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 bg-white p-1 rounded-2xl w-full mx-auto">
            {/* <form onSubmit={handleSubmit}> */}
            <div>

                <label className="block text-gray-700 font-medium mb-1">Hotel Name</label>
                <input
                    type="text"
                    placeholder="Enter Hotel Name"
                    value={basicDetails.name}
                    onChange={(e) => setBasicDetails({ ...basicDetails, name: e.target.value })}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
            </div>
            <div>
                <label className="block text-gray-700 font-medium mb-1">Hotel Address</label>
                <input
                    type="text"
                    required
                    value={basicDetails.address}
                    onChange={(e) => setBasicDetails({ ...basicDetails, address: e.target.value })}
                    placeholder="Enter address"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
            </div>
            <div>
                <label className="block text-gray-700 font-medium mb-1">About</label>
                <textarea
                    placeholder="Tell us about this place"
                    rows={3}
                    value={basicDetails.about}
                    onChange={(e) => setBasicDetails({ ...basicDetails, about: e.target.value })}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
            </div>
            <div>
                <label className="block text-gray-700 font-medium mb-1">State</label>
                <Select
                    options={statesData}
                    value={statesData.find(opt => opt.value === basicDetails.state)}
                    onChange={(option) => setBasicDetails({ ...basicDetails, state: option.value })}
                    placeholder="Select state"
                    isSearchable
                    required
                    className="rounded-lg focus:outline-none"
                />
            </div>
            {basicDetails.state && (
                <div>
                    <label className="block text-gray-700 font-medium mb-1">District</label>
                    <Select
                        options={districtsOptions}
                        value={districtsOptions.find(opt => opt.value === basicDetails.district)}
                        onChange={(option) => setBasicDetails({ ...basicDetails, district: option.value })}
                        placeholder="Select district"
                        isSearchable
                        required
                        className="rounded-lg focus:outline-none"
                    />
                </div>
            )}
            <div>
                <label className="block text-gray-700 font-medium mb-1">City</label>
                <input
                    type="text"
                    placeholder="Enter city"
                    value={basicDetails.city}
                    required
                    onChange={(e) => setBasicDetails({ ...basicDetails, city: e.target.value })}
                    className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-blue-500"
                />
            </div>
            <div className="relative mt-4">
                <label className="block text-gray-700 font-medium mb-1">Area</label>
                <input
                    type="text"
                    placeholder="Select or type your area"
                    value={basicDetails.area}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)} // Delay for allowing click
                    onChange={(e) => setBasicDetails({ ...basicDetails, area: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />

                {showSuggestions && filtered.length > 0 && (
                    <ul className="absolute z-20 w-full bg-white mt-1 rounded-lg shadow-lg max-h-48 overflow-auto border border-gray-300">
                        {filtered.map((item, index) => (
                            <li
                                key={index}
                                onMouseDown={() => handleSelect(item)}
                                // onClick={() => handleSelect(item)}
                                className="px-4 py-2 text-gray-700 hover:bg-blue-100 cursor-pointer transition-all"
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div>
                <label className="block text-gray-700 font-medium mb-1">Pincode</label>
                <input
                    type="text"
                    placeholder="Enter pincode"
                    value={basicDetails.pincode}
                    required
                    onChange={(e) => setBasicDetails({ ...basicDetails, pincode: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
            </div>
            <div className="w-full flex justify-end">
                <button
                    type="submit"
                    className="md:w-1/4 w-full cursor-pointer bg-[#2589f3] text-white font-semibold py-3 rounded-full shadow-md transition-all duration-300 hover:bg-[#0036ac] hover:shadow-lg hover:scale-105"
                >
                    Next
                </button>
            </div>

        </form>
        // </div>
    );
};

const MediaUpload = ({ mediaImages, setMediaImages, mediaVideo, setMediaVideo, tab, mediaImagesPreview, setMediaImagesPreview, mediaVidePreview, setMediaVideoPreview }) => {
    const [imageLinks, setImageLinks] = useState([]);
    const [videoLink, setVideoLink] = useState("");
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [videoFile, setVideoFile] = useState(null);
    const [uploadingImg, setUploadingImg] = useState(false);
    const [uploadingVid, setUploadingVid] = useState(false);
    const [videoPreview, setVideoPreview] = useState(null);

    useEffect(() => {
        console.log(mediaImages)
    }, [mediaImages])



    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (mediaImages.length < 5) {
                // Create a local preview URL
                const previewUrl = URL.createObjectURL(file);

                setImageFiles([...imageFiles, file]);
                setMediaImages([...mediaImages, file])
                setImagePreviews([...imagePreviews, previewUrl]);
                setMediaImagesPreview([...mediaImagesPreview, previewUrl])
            } else {
                alert("Maximum 5 images allowed");
            }
        }
    };

    const removeImage = (index) => {
        const newFiles = [...mediaImages];
        const newPreviews = [...mediaImagesPreview];
        newFiles.splice(index, 1);
        newPreviews.splice(index, 1);

        setMediaImages(newFiles);
        setMediaImagesPreview(newPreviews);
    };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVideoFile(file);
            setMediaVideo(file)
            setMediaVideoPreview(URL.createObjectURL(file))
            setVideoPreview(URL.createObjectURL(file));
        }
    };

    const removeVideo = () => {
        setMediaVideo(null);
        setMediaVideoPreview(null);
        setVideoLink("");
    };

    const uploadImages = async () => {
        setUploadingImg(true);
        const urls = [];

        for (let file of imageFiles) {
            const imageRef = ref(storage, `hotels/images/${file.name}_${Date.now()}`);
            await uploadBytes(imageRef, file);
            const url = await getDownloadURL(imageRef);
            urls.push(url);
        }
        URL.revokeObjectURL(imagePreviews);
        setImageLinks(urls);
        setUploadingImg(false);
    };

    const uploadVideo = async () => {
        if (!videoFile) return;
        setUploadingVid(true);
        const videoRef = ref(storage, `hotels/videos/${videoFile.name}_${Date.now()}`);
        await uploadBytes(videoRef, videoFile);
        const url = await getDownloadURL(videoRef);
        setVideoLink(url);
        setUploadingVid(false);
        URL.revokeObjectURL(videoPreview);
    };

    const handleSubmit = (e) => {
        tab(e)
    }

    return (
        <div className="flex flex-col gap-6">

            <div>
                <h3 className="text-xl font-semibold mb-2">
                    Image Upload <span className="text-red-500">*</span>
                </h3>
                <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-4">
                        {mediaImagesPreview?.map((preview, index) => (
                            <div
                                key={index}
                                className="relative bg-gray-100 rounded overflow-hidden"
                            >
                                <img
                                    src={preview}
                                    alt={`Preview ${index}`}
                                    className="w-full h-48 object-contain rounded"
                                />
                                <button
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1 right-1 bg-[#2589f3] text-white rounded-full p-1 hover:bg-[#5dacf2]"
                                >
                                    <FiX size={16} className="text-white" />
                                </button>

                                <span className="block mt-1 text-center text-sm text-gray-700 break-words px-1">{mediaImages[index].name}</span>
                            </div>
                        ))}
                    </div>

                    {imageFiles.length <= 5 && (
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    )}
                </div>
                <p className="text-sm text-gray-500 mt-2">Minimum 1 image required, maximum 5 allowed.</p>
            </div>

            {/* Video Upload Section */}
            <div>
                <h3 className="text-xl font-semibold mb-2">Video Upload</h3>

                {mediaVidePreview && (
                    <div className="relative w-full max-w-xs bg-gray-100 rounded overflow-hidden mb-4">
                        <video
                            src={mediaVidePreview}
                            controls
                            className="w-full h-48 object-contain rounded"
                        />
                        <button
                            onClick={removeVideo}
                            className="absolute top-1 right-1 bg-[#2589f3] text-white rounded-full p-1 hover:bg-red-600"
                        >
                            <FiX size={16} />
                        </button>
                        <span className="block mt-1 text-center text-sm text-gray-700 break-words px-1">{mediaVidePreview.name}</span>
                    </div>
                )}

                {!mediaVidePreview && (
                    <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                )}

                {/* <button
                    onClick={uploadVideo}
                    disabled={uploadingVid || !videoFile}
                    className="bg-[#2589f3] text-white font-medium py-2 px-4 mt-3 rounded shadow transition hover:bg-[#0036ac] disabled:opacity-50"
                >
                    {uploadingVid ? "Uploading..." : "Upload Video"}
                </button> */}
            </div>

            {/* Preview Uploaded Links */}
            {/* {imageLinks.length > 0 && (
                <div>
                    <h4 className="font-medium mt-4">Uploaded Image Links:</h4>
                    <ul className="list-disc pl-5 text-sm text-gray-600">
                        {imageLinks.map((link, idx) => (
                            <li key={idx}>
                                <a href={link} target="_blank" rel="noopener noreferrer" className="underline text-blue-500">View Image {idx + 1}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            )} */}

            {/* {videoLink && (
                <div>
                    <h4 className="font-medium mt-4">Uploaded Video Link:</h4>
                    <a href={videoLink} target="_blank" rel="noopener noreferrer" className="underline text-blue-500">View Video</a>
                </div>
            )} */}
            <div className="w-full flex justify-end">
                <div className="md:w-1/2 w-full flex flex-row md:flex-row justify-between gap-2">

                    <button
                        type="button"
                        onClick={() => handleSubmit("basic")}
                        className="w-1/2 cursor-pointer bg-gray-500 text-white font-semibold py-3 rounded-full shadow-md transition-all duration-300 hover:bg-gray-800 hover:shadow-lg hover:scale-105"
                    >
                        Prev
                    </button>
                    <button
                        type="button"
                        onClick={() => handleSubmit("attractions")}
                        className="w-1/2 cursor-pointer bg-[#2589f3] text-white font-semibold py-3 rounded-full shadow-md transition-all duration-300 hover:bg-[#0036ac] hover:shadow-lg hover:scale-105"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};
const amenitiesList = [
    { id: 1, label: "On-site Restaurant / Kitchen", icon: <FaUtensils /> },
    { id: 2, label: "Room Service", icon: <FaConciergeBell /> },
    { id: 3, label: "Power Backup", icon: <MdPower /> },
    { id: 4, label: "Parking Facility", icon: <FaParking /> },
    { id: 5, label: "Laundry Service", icon: <FaTshirt /> },
    { id: 6, label: "Caretaker on Site", icon: <FaUserTie /> },
    { id: 7, label: "Reception", icon: <FaHotel /> },
    { id: 8, label: "Luggage Storage", icon: <FaSuitcase /> },
    { id: 9, label: "First Aid Kit", icon: <FaFirstAid /> },
    { id: 10, label: "CCTV Surveillance", icon: <FaVideo /> },
    { id: 11, label: "Hot Water", icon: <FaHotTub /> },
    { id: 12, label: "Room Heater", icon: <FaFire /> },
    { id: 13, label: "Wi-Fi", icon: <FaWifi /> },
    { id: 14, label: "Bonfire Facility", icon: <GiCampfire /> },
    { id: 15, label: "Seating Area", icon: <FaCouch /> },
    { id: 16, label: "Water Purifier", icon: <FaTint /> },
];

const tagsList = [
    { id: 1, label: "Backpackers", icon: <FaHiking /> },
    { id: 2, label: "Couple Friendly", icon: <FaHeart /> },
    { id: 3, label: "Family Friendly", icon: <FaUsers /> },
    { id: 4, label: "Senior Citizen Friendly", icon: <FaBlind /> },
    { id: 5, label: "Solo Traveler Friendly", icon: <FaUser /> },
    { id: 6, label: "Group Friendly", icon: <FaUserFriends /> },
    { id: 7, label: "Pet Friendly", icon: <FaPaw /> },
    { id: 8, label: "Child Friendly", icon: <FaChild /> },
];
const attractionTypes = [
    "MONUMENT",
    "PARK",
    "LAKE",
    "MARKET",
    "MUSEUM",
    "VIEWPOINT",
    "OTHER",
];
const AdditionalDetails = ({ selectedTags, setSelectedTags, selectedAmenities, setSelectedAmenities, attractions, setAttractions, handleSubmit, submitloading }) => {

    const toggleTag = (id) => {
        setSelectedTags((prev) =>
            prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
        );
    };

    const toggleAmenity = (id) => {
        setSelectedAmenities((prev) =>
            prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
        );
    };
    const handleAttractionChange = (index, field, value) => {
        const updated = [...attractions];
        updated[index][field] = value;
        setAttractions(updated);
    };

    const addAttraction = () => {
        if (attractions.length < 3) {
            setAttractions([...attractions, { name: "", description: "", type: "", distance: "" }]);
        }
    };

    const removeAttraction = (index) => {
        const updated = attractions.filter((_, i) => i !== index);
        setAttractions(updated);
    };

    return (
        <div className="space-y-8 flex flex-col gap-4">
            {/* Tags */}
            <div>
                <h3 className="text-lg font-semibold mb-3">Tags</h3>
                <div className="flex flex-wrap gap-3">
                    {tagsList.map((tag) => (
                        <button
                            key={tag.id}
                            onClick={() => toggleTag(tag.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition 
                ${selectedTags.includes(tag.id)
                                    ? "bg-blue-500 text-white border-blue-500"
                                    : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
                                }`}
                        >
                            {tag.icon}
                            <span className="text-sm font-medium">{tag.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Amenities */}
            <div>
                <h3 className="text-lg font-semibold mb-3">Amenities</h3>
                <div className="flex flex-wrap gap-3">
                    {amenitiesList.map((amenity) => (
                        <button
                            key={amenity.id}
                            onClick={() => toggleAmenity(amenity.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition 
                ${selectedAmenities.includes(amenity.id)
                                    ? "bg-blue-500 text-white border-blue-500"
                                    : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
                                }`}
                        >
                            {amenity.icon}
                            <span className="text-sm font-medium">{amenity.label}</span>
                        </button>
                    ))}
                </div>
            </div>
            <div>
                <h3 className="text-lg font-semibold mb-3 flex flex-col md:flex-row pb-3  flex items-center justify-between">
                    <div className="pb-2">

                        Nearby Attractions
                    </div>
                    <button
                        onClick={addAttraction}
                        disabled={attractions.length >= 3}
                        type="button"
                        className={`cursor-pointer text-center mt-2 md:mt-0 text-sm md:text-lg w-full md:w-1/4 flex items-center justify-center bg-[#2589f3] text-white font-semibold py-2 px-4 rounded-full shadow-md transition-all duration-300 
    hover:bg-[#0036ac] hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        <MdAdd size={20} />
                        <span className="ml-2">Add</span>
                    </button>


                </h3>

                {attractions.map((attraction, index) => (
                    <div
                        key={index}
                        className=" rounded-lg p-4 mb-4 bg-white relative"
                    >
                        <button
                            onClick={() => removeAttraction(index)}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition"
                        >
                            <MdDelete size={20} />
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={attraction.name}
                                    onChange={(e) => handleAttractionChange(index, "name", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-400"
                                    placeholder="Enter name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                <select
                                    value={attraction.type}
                                    onChange={(e) => handleAttractionChange(index, "type", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-400"
                                >
                                    <option value="">Select type</option>
                                    {attractionTypes.map((type) => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                value={attraction.description}
                                onChange={(e) => handleAttractionChange(index, "description", e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-400"
                                placeholder="Enter description"
                            ></textarea>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Distance (optional)</label>
                            <input
                                type="text"
                                value={attraction.distance}
                                onChange={(e) => handleAttractionChange(index, "distance", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-400"
                                placeholder="e.g., 2 km"
                            />
                        </div>
                    </div>
                ))}
            </div>
            <div className="w-full flex justify-end">
                <div className="md:w-1/2 w-full flex flex-row md:flex-row justify-between gap-2">

                    <button
                        type="button"
                        className="w-1/2 cursor-pointer bg-gray-500 text-white font-semibold py-3 rounded-full shadow-md transition-all duration-300 hover:bg-gray-800 hover:shadow-lg hover:scale-105"
                    >
                        Prev
                    </button>
                    {/* <button
                        type="button"
                        onClick={handleSubmit}
                        className="w-1/2 cursor-pointer bg-[#2589f3] text-white font-semibold py-3 rounded-full shadow-md transition-all duration-300 hover:bg-[#0036ac] hover:shadow-lg hover:scale-105"
                    >
                        Submit
                    </button> */}
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={submitloading}
                        className={`w-1/2 cursor-pointer bg-[#2589f3] text-white font-semibold py-3 rounded-full shadow-md transition-all duration-300 hover:bg-[#0036ac] hover:shadow-lg hover:scale-105 ${submitloading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                    >
                        {submitloading ? "Submitting..." : "Submit"}
                    </button>
                </div>
            </div>
        </div>
    );
};



const ManageProperties = ({ setRoom, setHotelId }) => {
    const [tab, setTab] = useState("basic");
    const [basicDetails, setBasicDetails] = useState({
        name: "",
        about: "",
        address: "",
        state: "",
        district: "",
        city: "",
        pincode: "",
        area: "",
        latitude: "",
        longitude: ""
    })
    const [mediaImages, setMediaImages] = useState([])
    const [mediaImagesPreview, setMediaImagesPreview] = useState([])
    const [mediaVideo, setMediaVideo] = useState()
    const [mediaVidePreview, setMediaVideoPreview] = useState()
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const [imageLinks, setImageLinks] = useState([])
    const [videoLink, setVideoLink] = useState("");
    const [uploadingImg, setUploadingImg] = useState(false);
    const [attractions, setAttractions] = useState([
        { name: "", description: "", type: "", distance: "" },
    ]);
    const [submitloading, setSubmitLoading] = useState(false)
    const dispatch = useDispatch();
    const { loading, error, hotelData } = useSelector((state) => state.hotel);

    useEffect(() => {
        console.log(attractions)
    }, [attractions])

    const uploadImages = async () => {
        setUploadingImg(true);
        const urls = [];

        for (let file of mediaImages) {
            const formattedName = basicDetails.name ? basicDetails.name.replace(/\s+/g, '').toLowerCase() : "";
            const imageRef = ref(storage, `hotels/${formattedName}/images/${file.name}_${Date.now()}`);
            await uploadBytes(imageRef, file);
            const url = await getDownloadURL(imageRef);
            urls.push(url);
        }
        setMediaImagesPreview([])
        setImageLinks(urls);
        setUploadingImg(false);
        return urls
    };

    const uploadVideo = async () => {
        if (!mediaVideo) return;

        const formattedName = basicDetails.name ? basicDetails.name.replace(/\s+/g, '').toLowerCase() : "";
        setUploadingImg(true);
        const videoRef = ref(storage, `hotels/${formattedName}/videos/${mediaVideo.name}_${Date.now()}`);
        await uploadBytes(videoRef, mediaVideo);
        const url = await getDownloadURL(videoRef);
        setVideoLink(url);
        setUploadingImg(false);
        setMediaVideoPreview("")
        return url
    };

    const deleteImages = async (imageUrls) => {
        try {
            for (const url of imageUrls) {
                // Extract path between "o/" and "?alt="
                const path = decodeURIComponent(url.split("/o/")[1].split("?alt=")[0]);

                // Create reference
                const fileRef = ref(storage, path);

                // Delete
                await deleteObject(fileRef);
                console.log(`Deleted: ${path}`);
            }
            console.log("All images deleted successfully.");
        } catch (error) {
            console.error("Error deleting images:", error);
        }
    };

    const deleteVideo = async (videoUrl) => {
        try {
            // Extract storage path from URL
            const path = decodeURIComponent(videoUrl.split("/o/")[1].split("?alt=")[0]);

            // Create reference
            const fileRef = ref(storage, path);

            // Delete file
            await deleteObject(fileRef);
            console.log(`Deleted video: ${path}`);
        } catch (error) {
            console.error("Error deleting video:", error);
        }
    };

    const handleSubmit = async () => {

        setSubmitLoading(true)

        const imageLinks = await uploadImages()
        const videoLink = await uploadVideo()
        if (imageLinks && imageLinks.length > 0) {
            if (!videoLink || videoLink.length > 0) {
                // console.log("hello");
                const finalData = {
                    name: basicDetails.name,
                    about: basicDetails.about,
                    address: basicDetails.address,
                    location: {
                        state: basicDetails.state,
                        district: basicDetails.district,
                        city: basicDetails.city,
                        area: basicDetails.area,
                        pincode: basicDetails.pincode,
                    },
                    latitude: parseFloat(basicDetails.latitude),
                    longitude: parseFloat(basicDetails.longitude),
                    amenityIds: selectedAmenities,
                    tagIds: selectedTags,
                    media: {
                        imageUrls: imageLinks,
                        videoUrl: videoLink || null, // optional
                    },
                    nearbyAttractions: attractions.map(attraction => ({
                        name: attraction.name,
                        description: attraction.description,
                        type: attraction.type,
                        distance: attraction.distance || ""
                    })),
                };
                console.log(finalData)
                const token = localStorage.getItem("token")
                const res = await dispatch(createHotel({ token: token, data: finalData }));
                if (res.payload.status == 201) {
                    setSubmitLoading(false)
                    toast.success("Hotel Created", {
                        style: {
                            borderRadius: "10px",
                            background: "#333",
                            color: "#fff",
                        },
                    });
                    setBasicDetails({
                        name: "",
                        about: "",
                        address: "",
                        state: "",
                        district: "",
                        city: "",
                        pincode: "",
                        area: "",
                        latitude: "",
                        longitude: ""
                    })
                    setSelectedTags([])
                    setSelectedTags([])
                    setTab("basic")
                    setRoom(true)
                    // console.log(res.payload.data)
                    setHotelId(res.payload.data)
                } else {
                    setSubmitLoading(false)
                    await deleteImages(imageLinks)
                    await deleteVideo(videoLink)
                    setBasicDetails({
                        name: "",
                        about: "",
                        address: "",
                        state: "",
                        district: "",
                        city: "",
                        pincode: "",
                        area: "",
                        latitude: "",
                        longitude: ""
                    })
                    setSelectedTags([])
                    setSelectedTags([])
                    setTab("basic")
                    toast.error("Error Creating Hotel!!", {
                        style: {
                            borderRadius: "10px",
                            background: "#333",
                            color: "#fff",
                        },
                    });
                }

            }
        } else {
            toast.error("Error Creating Hotel!!", {
                style: {
                    borderRadius: "10px",
                    background: "#333",
                    color: "#fff",
                },
            });

        }

    }


    //Tab Change
    const isBasicDetailsComplete = () => {
        return Object.values(basicDetails).every(value => value !== "");
    };
    const hasImages = mediaImages.length > 0;
    const handleTabChange = (targetTab) => {
        if (targetTab === "basic") {
            setTab("basic");
        } else if (targetTab === "media") {
            if (isBasicDetailsComplete()) {
                setTab("media");
            } else {
                // alert("Please fill all Basic Details first.");
                toast.error("Please fill all Basic Details first.", {
                    style: {
                        borderRadius: "10px",
                        background: "#333",
                        color: "#fff",
                    },
                });
            }
        } else if (targetTab === "attractions") {
            if (!isBasicDetailsComplete()) {
                // alert("Please fill all Basic Details first.");
                toast.error("Please fill all Basic Details first.", {
                    style: {
                        borderRadius: "10px",
                        background: "#333",
                        color: "#fff",
                    },
                });
            } else if (!hasImages) {
                // alert("Please upload at least one image in Media before proceeding to Additional Details.");
                toast.error("Please upload at least one image in Media before proceeding to Additional Details.", {
                    style: {
                        borderRadius: "10px",
                        background: "#333",
                        color: "#fff",
                    },
                });
            } else {
                setTab("attractions");
            }
        }
    };




    return (
        <div className="flex w-full min-h-screen">
            {/* Tabs */}
            <div className="flex flex-col w-1/4 border-r border-gray-300">
                <button
                    className={`p-4 text-left ${tab === "basic" ? "bg-blue-500 text-white" : ""}`}
                    onClick={() => handleTabChange("basic")}
                >
                    Basic Details
                </button>
                <button
                    className={`p-4 text-left ${tab === "media" ? "bg-blue-500 text-white" : ""}`}
                    onClick={() => handleTabChange("media")}
                >
                    Media Upload
                </button>
                <button
                    className={`p-4 text-left ${tab === "attractions" ? "bg-blue-500 text-white" : ""}`}
                    onClick={() => handleTabChange("attractions")}
                >
                    Additional Details
                </button>

            </div>

            {/* Content */}
            <div className="flex-1 p-6">
                {tab === "basic" &&
                    <BasicDetailsForm
                        tab={(e) => setTab(e)}
                        setBasicDetails={setBasicDetails}
                        basicDetails={basicDetails} />
                }
                {tab === "media" && (
                    <MediaUpload
                        tab={(e) => setTab(e)}
                        mediaImages={mediaImages}
                        setMediaImages={setMediaImages}
                        mediaImagesPreview={mediaImagesPreview}
                        setMediaImagesPreview={setMediaImagesPreview}
                        mediaVideo={mediaVideo}
                        setMediaVideo={setMediaVideo}
                        setMediaVideoPreview={setMediaVideoPreview}
                        mediaVidePreview={mediaVidePreview}
                    />
                )}
                {tab === "attractions" && (
                    // <p className="text-gray-500 text-center">Nearby attractions section coming soon...</p>
                    <AdditionalDetails
                        selectedTags={selectedTags}
                        setSelectedTags={setSelectedTags}
                        selectedAmenities={selectedAmenities}
                        setSelectedAmenities={setSelectedAmenities}
                        attractions={attractions}
                        setAttractions={setAttractions}
                        handleSubmit={handleSubmit}
                        submitloading={submitloading}
                    />
                )}
            </div>
        </div>
    )
}

export default ManageProperties