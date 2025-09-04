import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getPackages } from '../Redux/store/carPackageSlice';
import DatePicker from 'react-datepicker';
import { FaCalendar } from 'react-icons/fa';

const CustomDateInput = React.forwardRef(({ value, onClick, placeholder }, ref) => (
    <div
        onClick={onClick}
        ref={ref}
        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm cursor-pointer flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
        <FaCalendar className="absolute left-3 text-blue-500 w-5 h-5" />
        <span className={value ? "text-black" : "text-gray-400"}>
            {value || placeholder}
        </span>
    </div>
));

function packageDescription({ description }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleDescription = () => {
        setIsExpanded(!isExpanded);
    };

    // You can adjust this character limit
    const charLimit = 100;

    const shouldTruncate = description.length > charLimit;
    const displayedText = isExpanded ? description : description.slice(0, charLimit) + (shouldTruncate ? "..." : "");

    return (
        <p className="hidden lg:block text-gray-500 text-md pt-2">
            {displayedText}
        </p>)
}

const FilterSection = React.memo(() => {
    // Filter states


    // Available tags
    const availableTags = [
        "Child Friendly",
        "Pet Friendly",
        "Group Friendly",
        "Solo Traveler Friendly",
        "Senior Citizen Friendly",
        "Family Friendly",
        "Couple Friendly",
        "Backpackers"
    ];

    // Available amenities with icons
    const availableAmenities = [
        { name: "Water Purifier", icon: FaWater },
        { name: "Seating Area", icon: FaChair },
        { name: "Bonfire Facility", icon: FaFire },
        { name: "Wi-Fi", icon: FaWifi },
        { name: "Room Heater", icon: FaThermometerHalf },
        { name: "Hot Water", icon: FaTint },
        { name: "CCTV Surveillance", icon: FaVideo },
        { name: "First Aid Kit", icon: FaFirstAid },
        { name: "Luggage Storage", icon: FaSuitcase },
        { name: "Reception", icon: FaConciergeBell },
        { name: "Caretaker on Site", icon: FaUserTie },
        { name: "Laundry Service", icon: FaHamburger },
        { name: "Parking Facility", icon: FaCar },
        { name: "Power Backup", icon: FaBolt },
        { name: "Room Service", icon: FaUtensils },
        { name: "On-site Restaurant / Kitchen", icon: FaUtensils }
    ];



    return (
        <div className="bg-white min-h-screen rounded-2xl p-6 md:border md:border-gray-200">
            <div className="flex justify-between items-center pb-4">
                <h2 className="text-xl font-bold text-gray-800">Filters</h2>
                <button
                    // onClick={clearFilters}
                    className="text-sm font-semibold text-blue-500 hover:text-blue-700 transition duration-150"
                >
                    Clear All
                </button>
            </div>

            <div
                style={{
                    marginBottom: isMobile ? "50px" : 0,
                }}
                className="space-y-8"
            >
                {/* Price Range */}
                <div>
                    <h3 className="text-md font-semibold text-gray-700 mb-3">Price Range</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>₹{priceRange.min.toLocaleString()}</span>
                            <span>₹{priceRange.max.toLocaleString()}</span>
                        </div>
                        <div className="px-2">
                            <Slider
                                value={[priceRange.min, priceRange.max]}
                                min={0}
                                max={20000}
                                step={500}
                                //   onChange={(_, newValue) => {
                                //     // newValue is [min, max]
                                //     handlePriceRangeChange('min', newValue[0]);
                                //     handlePriceRangeChange('max', newValue[1]);
                                //   }}
                                valueLabelDisplay="auto"
                                getAriaLabel={() => 'Price range'}
                                marks={[
                                    { value: 0, label: '₹0' },
                                    { value: 20000, label: '₹20,000' }
                                ]}
                                sx={{
                                    color: '#2563eb', // Tailwind blue-600
                                    height: 6,
                                    '& .MuiSlider-thumb': {
                                        borderRadius: '50%',
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Tags */}
                <div>
                    <h3 className="text-md font-semibold text-gray-700 mb-3">Traveler Types</h3>
                    <div className="flex flex-wrap gap-3">
                        {availableTags.map((tag) => (
                            <label key={tag} className="inline-flex items-center gap-2 cursor-pointer text-sm">
                                <input
                                    type="checkbox"
                                    checked={selectedTags.includes(tag)}
                                    onChange={() => handleTagToggle(tag)}
                                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                />
                                <span className="text-gray-700">{tag}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Amenities */}
                <div style={{ marginTop: "10px" }}>
                    <h3 className="text-md font-semibold text-gray-700 mb-3">Amenities</h3>
                    <div className="flex flex-col gap-2">
                        {availableAmenities.map((amenity) => (
                            <label key={amenity.name} className="flex items-center gap-2 cursor-pointer text-sm">
                                <input
                                    type="checkbox"
                                    // checked={selectedAmenities.includes(amenity.name)}
                                    // onChange={() => handleAmenityToggle(amenity.name)}
                                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                />
                                <span className="text-gray-700">{amenity.name}</span>
                            </label>
                        ))}
                    </div>
                </div>



                {/* Apply Button */}
                <div className='pt-5'>
                    <button
                        //   onClick={handleApplyFilters}
                        className="w-full py-3 px-4 mt-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-[1.01] transition duration-200"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>

    );
});

const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const CarPackageSearchResults = () => {
    const location = useLocation();
    const { state } = location;
    const dispatch = useDispatch()
    const { packages, packagesLoading, packagesError, packagesStatus } = useSelector((state) => state.carPackage)
    useEffect(() => {
        console.log(packages)
    }, [packages])

    const fetchCarPackage = useCallback(() => {
        const [day, month, year] = state.travelDate.split("-");
        dispatch(getPackages({ area: state.location, month: month }))
    }, [dispatch, state])

    useEffect(() => {
        fetchCarPackage()
    }, [fetchCarPackage])

    const [date, setDate] = useState(state.travelDate)
    const [loc, setLoc] = useState(state.location)
    const [loadedImages, setLoadedImages] = useState({});

    const handleImageLoad = (id) => {
        setLoadedImages((prev) => ({ ...prev, [id]: true }));
    };


    return (
        <div className="max-w-screen overflow-x-hidden">
            <div className='w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex justify-center relative pt-10 md:pt-0'>
        {/* Banner */}
        <div className="h-[10vh] w-full bg-gradient-to-r from-[#2589f3] via-[#4ea3f8] to-[#5dacf2] flex justify-center items-center text-center px-4 relative">

        </div>

        <div className="flex flex-col md:flex-row lg:w-[70%] w-full md:justify-center px-6 lg:px-0 pt-20 md:pt-4 gap-6 absolute top-[-5vh] md:top-[0vh] z-10">
          <div className="package-search-container w-full pt-10 md:pt-0">
            <div className="bg-white rounded-2xl p-6 border border-blue-100 backdrop-blur-sm relative">
              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-200 to-transparent rounded-full opacity-20 -translate-y-12 translate-x-12"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-indigo-200 to-transparent rounded-full opacity-20 translate-y-10 -translate-x-10"></div>

              <div className="flex flex-col md:flex-row pr-0 gap-[10px] w-full md:px-2 relative z-10">
                <div className="flex-[1.5] w-full">
                  <label className="block text-sm font-medium mb-1 flex pb-1 text-gray-700 flex items-center gap-2">
                    {/* <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse"></div> */}
                    Dates
                  </label>
                  <div className="relative">
                  <DatePicker
                selected={date}
                onChange={(date) => setDate(date)}
                minDate={new Date()}
                isClearable
                placeholderText="Select Date"
                customInput={<CustomDateInput />}
                popperPlacement="bottom-start"
                popperClassName="custom-datepicker"
                className="w-full"
              />
                  </div>
                </div>

                

                <div className="flex flex-col justify-end w-full md:w-auto self-stretch pb-[2px]">
                  <button
                    // onClick={handleSearch}
                    className="bg-blue-600 w-full md:w-auto justify-center cursor-pointer
      text-white rounded-xl px-6 py-3 text-sm font-medium hover:bg-blue-700 transition"
                  >
                    Search
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
        </div>
    )
}

export default CarPackageSearchResults