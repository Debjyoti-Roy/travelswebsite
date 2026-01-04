import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getPickupLocations } from '../../Redux/store/pickupSlice';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendar, FaMapPin, FaUsers } from "react-icons/fa";

const CustomDateInput = React.forwardRef(({ value, onClick, placeholder }, ref) => (
  <div
    onClick={onClick}
    ref={ref}
    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-md cursor-pointer flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <FaCalendar className="absolute left-3 text-blue-500 w-5 h-5" />
    <span className={value ? "text-black" : "text-gray-400"}>
      {value || placeholder}
    </span>
  </div>
));

const Pickup = ({ setPickupFlag, setPickRoutesDetails }) => {
    const dispatch = useDispatch();
    const { pickupLocations, pickupRoutes, loadingLocations, loadingRoutes, errorLocations, errorRoutes } = useSelector((state) => state.pickup);
    
    const [pickupLocation, setPickupLocation] = useState("");
    const [pickupSuggestions, setPickupSuggestions] = useState([]);
    const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
    
    const [dropLocation, setDropLocation] = useState("");
    const [dropSuggestions, setDropSuggestions] = useState([]);
    const [showDropSuggestions, setShowDropSuggestions] = useState(false);
    
    const [numberOfPeople, setNumberOfPeople] = useState(1);
    const [showPeopleOptions, setShowPeopleOptions] = useState(false);
    
    const [dateTime, setDateTime] = useState(null);

    useEffect(() => {
        dispatch(getPickupLocations());
    }, [dispatch]);

    // Get location names from pickupLocations
    const locationNames = pickupLocations.map(location => location.name);

    // Handle pickup location input change
    const handlePickupInputChange = (e) => {
        const value = e.target.value;
        setPickupLocation(value);

        if (value.length > 0) {
            const filtered = locationNames.filter((name) =>
                name.toLowerCase().includes(value.toLowerCase())
            );
            setPickupSuggestions(filtered);
            setShowPickupSuggestions(true);
        } else {
            setPickupSuggestions([]);
            setShowPickupSuggestions(false);
        }
    };

    // Handle drop location input change
    const handleDropInputChange = (e) => {
        const value = e.target.value;
        setDropLocation(value);

        if (value.length > 0) {
            const filtered = locationNames.filter((name) =>
                name.toLowerCase().includes(value.toLowerCase())
            );
            setDropSuggestions(filtered);
            setShowDropSuggestions(true);
        } else {
            setDropSuggestions([]);
            setShowDropSuggestions(false);
        }
    };

    // Handle suggestion click
    const handlePickupSuggestionClick = (value) => {
        setPickupLocation(value);
        setShowPickupSuggestions(false);
    };

    const handleDropSuggestionClick = (value) => {
        setDropLocation(value);
        setShowDropSuggestions(false);
    };

    // Handle search
    const handleSearch = () => {
        const searchData = {
            pickupLocation,
            dropLocation,
            numberOfPeople,
            dateTime: dateTime ? dateTime.toLocaleString() : null
        };
        console.log("Search Data:", searchData);
        setPickupFlag(true);
        setPickRoutesDetails(searchData);
    };

    // Filter time to allow times from now onwards (including times less than 1 hour from now)
    const filterTime = (time) => {
        if (!dateTime) return true;
        const now = new Date();
        const selectedDate = new Date(dateTime);
        
        // Check if selected date is today
        const isToday = 
            selectedDate.getDate() === now.getDate() &&
            selectedDate.getMonth() === now.getMonth() &&
            selectedDate.getFullYear() === now.getFullYear();
        
        if (isToday) {
            // Allow all times from now onwards (including times less than 1 hour)
            return time >= now;
        }
        // For future dates, allow all times
        return true;
    };

    return (
        <div className="package-search-container">
            <h2 className="flex lg:justify-start justify-center font-bold lg:pl-[15px] text-2xl text-black pt-[5px] pb-[5px]">
                Book a Pickup
            </h2>
            <div className="flex w-full lg:p-[10px] p-2">
                <div className="w-full mx-auto flex flex-col lg:flex-row gap-4 lg:gap-2 items-center">
                    {/* Pickup Location Suggestive Input */}
                    <div className="flex-1 w-full relative">
                        <label className="block flex pb-1 text-md font-medium mb-1">Pickup Location</label>
                        <div className="relative">
                            <FaMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5" />
                            <input
                                type="text"
                                value={pickupLocation}
                                onChange={handlePickupInputChange}
                                onFocus={() => pickupLocation && setShowPickupSuggestions(true)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter Pickup Location"
                            />
                            {showPickupSuggestions && pickupSuggestions.length > 0 && (
                                <ul className="absolute z-10 bg-white border border-gray-200 rounded-xl mt-1 w-full max-h-40 overflow-y-auto shadow-lg">
                                    {pickupSuggestions.map((s, index) => (
                                        <li
                                            key={index}
                                            onClick={() => handlePickupSuggestionClick(s)}
                                            className="px-4 py-2 cursor-pointer hover:bg-blue-100 text-left"
                                        >
                                            {s}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* Drop Location Suggestive Input */}
                    <div className="flex-1 w-full relative">
                        <label className="block flex pb-1 text-md font-medium mb-1">Drop Location</label>
                        <div className="relative">
                            <FaMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5" />
                            <input
                                type="text"
                                value={dropLocation}
                                onChange={handleDropInputChange}
                                onFocus={() => dropLocation && setShowDropSuggestions(true)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter Drop Location"
                            />
                            {showDropSuggestions && dropSuggestions.length > 0 && (
                                <ul className="absolute z-10 bg-white border border-gray-200 rounded-xl mt-1 w-full max-h-40 overflow-y-auto shadow-lg">
                                    {dropSuggestions.map((s, index) => (
                                        <li
                                            key={index}
                                            onClick={() => handleDropSuggestionClick(s)}
                                            className="px-4 py-2 cursor-pointer hover:bg-blue-100 text-left"
                                        >
                                            {s}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* Number of People */}
                    <div className="relative flex-1 w-full">
                        <label className="block text-md font-medium mb-1 flex pb-1">Number of People</label>
                        <div
                            onClick={() => setShowPeopleOptions(!showPeopleOptions)}
                            className="relative w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-md cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <FaUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5" />
                            <span className="flex lg:justify-start justify-start">
                                {`${numberOfPeople} ${numberOfPeople === 1 ? 'Person' : 'People'}`}
                            </span>
                        </div>

                        {showPeopleOptions && (
                            <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg p-4 z-10">
                                <div className="flex justify-between items-center">
                                    <span>People</span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setNumberOfPeople(Math.max(1, numberOfPeople - 1));
                                            }}
                                            className="w-8 h-8 rounded-full bg-gray-200 text-lg flex items-center justify-center"
                                        >
                                            -
                                        </button>
                                        <span>{numberOfPeople}</span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setNumberOfPeople(numberOfPeople + 1);
                                            }}
                                            className="w-8 h-8 rounded-full bg-gray-200 text-lg flex items-center justify-center"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Date and Time */}
                    <div className="flex-1 w-full">
                        <label className="block text-md font-medium mb-1 flex pb-1">Date & Time</label>
                        <div className="relative">
                            <DatePicker
                                selected={dateTime}
                                onChange={(date) => setDateTime(date)}
                                minDate={new Date()}
                                showTimeSelect
                                timeIntervals={15}
                                dateFormat="MMMM d, yyyy h:mm aa"
                                filterTime={filterTime}
                                isClearable
                                placeholderText="Select Date & Time"
                                customInput={<CustomDateInput />}
                                popperPlacement="bottom-start"
                                popperClassName="custom-datepicker"
                                className="w-full"
                            />
                        </div>
                    </div>

                    <div className="h-full w-full lg:w-auto flex items-end">
                        <button
                            onClick={handleSearch}
                            className="bg-blue-600 flex w-full lg:w-auto justify-center items-end text-white rounded-xl px-6 py-3 text-md font-medium hover:bg-blue-700 transition"
                        >
                            Search
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Pickup