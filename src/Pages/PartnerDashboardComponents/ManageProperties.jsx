import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import { City, Country, State } from "country-state-city";
import statesJson from "../../assets/ade5836fae0ac40531e6afb111d61870-4fe8c90e127060d55ad3c7d6d603d13528450e5b/india-states-and-districts.json"

const india = Country.getCountryByCode('IN');

// const statesData = [ // Example data, can extend
//     { value: "Odisha", label: "Odisha" },
//     { value: "Maharashtra", label: "Maharashtra" },
//     { value: "Delhi", label: "Delhi" },
// ];
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

const BasicDetailsForm = () => {
    const [state, setState] = useState(null);
    const [district, setDistrict] = useState(null);
    const [city, setCity] = useState(null);
    const [districtsOptions, setDistrictsOptions] = useState([]);
    const [citiesOptions, setCitiesOptions] = useState([]);
    const [pincode, setPincode] = useState("");
    const [lat, setLat] = useState("");
    const [long, setLong] = useState("");
    const [area, setArea] = useState("");

    const [locationAccessGranted, setLocationAccessGranted] = useState(false);

    // Example districts data
    // const allDistricts = {
    //     Odisha: [{ value: "Khordha", label: "Khordha" }, { value: "Cuttack", label: "Cuttack" }],
    //     Maharashtra: [{ value: "Pune", label: "Pune" }, { value: "Mumbai", label: "Mumbai" }],
    //     Delhi: [{ value: "NewDelhi", label: "New Delhi" }],
    // };
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
        if (state) {
            setDistrictsOptions(allDistricts[state.value] || []);
            setDistrict(null);
            setCity(null);
        }
    }, [state]);

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

    return (
        <div className="flex flex-col gap-5 bg-white p-8 rounded-2xl max-w-xl mx-auto">

            {/* Name */}
            <div>
                <label className="block text-gray-700 font-medium mb-1">Name</label>
                <input
                    type="text"
                    placeholder="Enter name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
            </div>

            {/* Address */}
            <div>
                <label className="block text-gray-700 font-medium mb-1">Address</label>
                <input
                    type="text"
                    placeholder="Enter address"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
            </div>

            {/* About */}
            <div>
                <label className="block text-gray-700 font-medium mb-1">About</label>
                <textarea
                    placeholder="Tell us about this place"
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
            </div>

            {/* State */}
            <div>
                <label className="block text-gray-700 font-medium mb-1">State</label>
                <Select
                    options={statesData}
                    value={state}
                    onChange={setState}
                    placeholder="Select state"
                    isSearchable
                    className="rounded-lg focus:outline-none"
                />
            </div>

            {/* District */}
            {districtsOptions.length > 0 && (
                <div>
                    <label className="block text-gray-700 font-medium mb-1">District</label>
                    <Select
                        options={districtsOptions}
                        value={district}
                        onChange={setDistrict}
                        placeholder="Select district"
                        isSearchable
                        className="rounded-lg focus:outline-none"
                    />
                </div>
            )}

            {/* City */}
            {/* {citiesOptions.length > 0 && (
                <div>
                    <label className="block text-gray-700 font-medium mb-1">City</label>
                    <Select
                        options={citiesOptions}
                        value={city}
                        onChange={setCity}
                        placeholder="Select city"
                        isSearchable
                        className="rounded-lg focus:outline-none"
                    />
                </div>
            )} */}
            {citiesOptions.length > 0 && (
                <div>
                    <label className="block text-gray-700 font-medium mb-1">City</label>
                    <input
                        type="text"
                        placeholder="Enter city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            )}

            <div className="mt-4">
                <label className="block text-gray-700 font-medium mb-1">Area</label>
                <textarea
                    placeholder="Describe the area"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    rows={3}
                    className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Pincode */}
            <div>
                <label className="block text-gray-700 font-medium mb-1">Pincode</label>
                <input
                    type="text"
                    placeholder="Enter pincode"
                    value={pincode}
                    onChange={handlePincodeChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
            </div>

            {/* Latitude */}
            <div>
                <label className="block text-gray-700 font-medium mb-1">Latitude</label>
                <input
                    type="text"
                    placeholder="Latitude"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
            </div>

            {/* Longitude */}
            <div>
                <label className="block text-gray-700 font-medium mb-1">Longitude</label>
                <input
                    type="text"
                    placeholder="Longitude"
                    value={long}
                    onChange={(e) => setLong(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
            </div>

        </div>

    );
};


const ManageProperties = () => {
    const [tab, setTab] = useState("basic");
    return (
        <div className="flex w-full min-h-screen">
            {/* Tabs */}
            <div className="flex flex-col w-1/4 border-r border-gray-300">
                <button
                    className={`p-4 text-left ${tab === "basic" ? "bg-blue-500 text-white" : ""}`}
                    onClick={() => setTab("basic")}
                >
                    Basic Details
                </button>
                <button
                    className={`p-4 text-left ${tab === "media" ? "bg-blue-500 text-white" : ""}`}
                    onClick={() => setTab("media")}
                >
                    Media Upload
                </button>
                <button
                    className={`p-4 text-left ${tab === "attractions" ? "bg-blue-500 text-white" : ""}`}
                    onClick={() => setTab("attractions")}
                >
                    Nearby Attractions
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 p-6">
                {tab === "basic" && <BasicDetailsForm />}
                {tab === "media" && (
                    <p className="text-gray-500 text-center">Media upload section coming soon...</p>
                )}
                {tab === "attractions" && (
                    <p className="text-gray-500 text-center">Nearby attractions section coming soon...</p>
                )}
            </div>
        </div>
    )
}

export default ManageProperties