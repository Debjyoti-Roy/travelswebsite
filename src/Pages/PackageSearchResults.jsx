import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { FaCalendar, FaChevronDown, FaFilter, FaMapPin, FaTimes } from 'react-icons/fa';
import { Skeleton } from '@mui/material';
import { getPackages } from '../Redux/store/tourPackageSlice';
import { getDestinations } from '../Redux/store/carPackageSlice';


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

const FilterSection = React.memo(({ onFilterChange, onApplyFilters, initialFilters }) => {
    const tourTypes = ["BUDGET", "PREMIUM", "LUXURY"];

    // Match parent filter structure
    const [selectedCarTypes, setSelectedCarTypes] = useState(initialFilters.selectedCarTypes || []);
    const [duration, setDuration] = useState(initialFilters.duration ?? 0); // start from 0

    useEffect(() => {
        onFilterChange({
            selectedCarTypes,
            duration: duration === 0 ? null : duration, // send null if 0
        });
    }, [selectedCarTypes, duration, onFilterChange]);

    const handleCarTypeToggle = useCallback((type) => {
        setSelectedCarTypes((prev) =>
            prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
        );
    }, []);

    const handleDurationChange = useCallback((change) => {
        setDuration((prev) => {
            const current = prev ?? 0;
            const newVal = current + change;
            return Math.max(0, newVal); // allow 0 (Not selected)
        });
    }, []);

    const clearFilters = () => {
        setSelectedCarTypes([]);
        setDuration(0);
        onApplyFilters({
            selectedCarTypes: [],
            duration: null,
        });
    };

    const handleApplyFilters = useCallback(() => {
        onApplyFilters({
            selectedCarTypes,
            duration: duration === 0 ? null : duration, // send null if 0
        });
    }, [selectedCarTypes, duration, onApplyFilters]);

    return (
        <div className="bg-white min-h-screen rounded-2xl p-6 md:border md:border-gray-200">
            {/* Header */}
            <div className="flex justify-between items-center pb-4">
                <h2 className="text-xl font-bold text-gray-800">Filters</h2>
                <button
                    onClick={clearFilters}
                    className="text-sm font-semibold text-blue-500 hover:text-blue-700 transition duration-150"
                >
                    Clear All
                </button>
            </div>

            <div className="space-y-8">
                {/* Duration */}
                <div style={{ marginBottom: "15px" }}>
                    <h3 className="text-md font-semibold text-gray-700 mb-3">Duration</h3>
                    <div style={{ marginTop: "7px" }} className="flex items-center justify-between w-48">
                        <button
                            onClick={() => handleDurationChange(-1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100"
                        >
                            –
                        </button>
                        <span className="text-sm font-medium text-gray-500 text-center flex-1">
                            {(duration === 0 || duration ==='0')
                                ? "Not selected"
                                : `${duration} Day${duration > 1 ? "s" : ""}`}
                        </span>
                        <button
                            onClick={() => handleDurationChange(1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100"
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Car Types */}
                <div>
                    <h3 className="text-md font-semibold text-gray-700 mb-3">Tour Type</h3>
                    <div className="flex flex-col gap-3">
                        {tourTypes.map((type) => (
                            <label key={type} className="inline-flex items-center gap-2 cursor-pointer text-sm">
                                <input
                                    type="checkbox"
                                    checked={selectedCarTypes.includes(type)}
                                    onChange={() => handleCarTypeToggle(type)}
                                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                />
                                <span className="text-gray-700">{type}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Apply Button */}
                <div className="pt-5">
                    <button
                        onClick={handleApplyFilters}
                        className="w-full py-3 px-4 mt-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-[1.01] transition duration-200"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );
});

const parseDate = (str) => {
    if (!str) return null;
    const [day, month, year] = str.split("-");
    return new Date(`${year}-${month}-${day}`);
};

const PackageSearchResults = () => {
    const navigate = useNavigate()
    const location = useLocation();
    const { state } = location;
    const dispatch = useDispatch()
    const [dest, setDest] = useState([])
    const [date, setDate] = useState(parseDate(state.travelDate));
    const [loc, setLoc] = useState(state.location)
    const [suggestions, setSuggestions] = useState([]);
    const [loadedImages, setLoadedImages] = useState({});
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [priceSort, setPriceSort] = useState("");
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const { packages, loading, error } = useSelector((state) => state.tourPackage);
    const { destinations } = useSelector((state) => state.carPackage);

    //filters
    const [filters, setFilters] = useState({
        selectedCarTypes: [],
        duration: '0'
    })
    const [appliedFilters, setAppliedFilters] = useState({
        selectedCarTypes: [],
        duration: ""
    })

    const handleFilterChange = useCallback((newFilters) => {
        setFilters(newFilters);
    }, []);
    const handleApplyFilters = useCallback((newFilters) => {
        setAppliedFilters(newFilters);
    }, []);


    const fetchTourPackage = useCallback(() => {
        const [day, month, year] = state.travelDate.split("-");
        dispatch(getPackages({ area: state.location, month: month }))
    }, [dispatch, state])
    const fetchTourPackage2 = useCallback(() => {
        const [day, month, year] = state.travelDate.split("-");
        const appfilters = appliedFilters.selectedCarTypes
        if (appliedFilters.duration !== "" || appfilters.length) {
            dispatch(getPackages({ area: state.location, month: month, tourTypes: appliedFilters.selectedCarTypes, duration: appliedFilters.duration }))
        } else {
            dispatch(getPackages({ area: state.location, month: month }))
        }
    }, [appliedFilters])
    useEffect(() => {
        dispatch(getDestinations());
    }, [dispatch]);
    useEffect(() => {
        fetchTourPackage()
    }, [fetchTourPackage])
    useEffect(() => {
        fetchTourPackage2()
    }, [fetchTourPackage2])
    useEffect(() => {
        if (destinations.length) {
            const processedDestinations = [
                ...new Set(
                    destinations.flatMap((item) =>
                        item.split(",").map((part) => part.trim())
                    )
                ),
            ];
            setDest(processedDestinations)
        }
    }, [destinations])


    useEffect(() => {
      console.log(packages)
    }, [packages])
    

    const handleImageLoad = (id) => {
        setLoadedImages((prev) => ({ ...prev, [id]: true }));
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setLoc(value);

        if (value.length > 0) {
            const filtered = dest.filter((d) =>
                d.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (value) => {
        setLoc(value);
        setShowSuggestions(false);
    };
    const formatDate = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    };
    const handleSearch = () => {
        const data = {
            location: loc,
            travelDate: formatDate(date)
        }
        window.location.reload();
        navigate(".", { state: data });
    }
    const handleBookNow = (id) => {
        const data = {
            id: id,
            travelDate:state.travelDate
        }
        navigate("/tourdetails", { state: data })
    }
    return (
        <div className="max-w-screen overflow-x-hidden">
            <div
                // ref={topRef}
                className="md:hidden fixed left-0 bg-white border-t border-gray-200 z-40 min-w-screen overflow-x-hidden"
            >
                <div className="flex items-center justify-between px-4 py-3 w-full">
                    <div className="flex items-center gap-2 flex-shrink">
                        <FaFilter className="text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">Filters</span>
                    </div>
                    <button
                        onClick={() => setIsMobileFilterOpen(true)}
                        className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition flex-shrink-0"
                    >
                        <FaChevronDown />
                    </button>
                </div>
            </div>
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
                                <div className="flex-1 w-full relative">
                                    <label className="block flex pb-1 text-sm font-medium mb-1">Destination</label>
                                    <div className="relative">
                                        <FaMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5" />
                                        <input
                                            type="text"
                                            value={loc}
                                            onChange={handleInputChange}
                                            onFocus={() => loc && setShowSuggestions(true)}
                                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter Destination"
                                        />
                                        {showSuggestions && suggestions.length > 0 && (
                                            <ul className="absolute z-10 bg-white border border-gray-200 rounded-xl mt-1 w-full max-h-40 overflow-y-auto shadow-lg">
                                                {suggestions.map((s, index) => (
                                                    <li
                                                        key={index}
                                                        onClick={() => handleSuggestionClick(s)}
                                                        className="px-4 py-2 cursor-pointer hover:bg-blue-100 text-left"
                                                    >
                                                        {s}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1 w-full">
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
                                        onClick={handleSearch}
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
            <div className='w-full bg-[#f2f2f2] flex justify-center pt-50 md:pt-10'>
                <div className='flex flex-col md:flex-row lg:w-[70%] w-full  md:justify-center px-6 lg:px-2 py-0 md:py-6 gap-6 min-h-screen'>
                    <div className="hidden md:block md:w-1/3 ">
                        <FilterSection
                            onFilterChange={handleFilterChange}
                            onApplyFilters={handleApplyFilters}
                            initialFilters={filters}
                        />
                    </div>
                    <div className="w-full flex flex-col h-full md:min-h-screen pt-5 md:pt-0">
                        <div className="w-full flex justify-between flex-col md:flex-row items-center pb-4">
                            <div className="text-2xl font-bold text-center md:text-left pb-2 md:pb-0">
                                Showing Car Packages in {state.location}
                            </div>

                            <div className="flex justify-center gap-2 items-center">
                                <label
                                    htmlFor="priceSort"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Sort by price:
                                </label>
                                <select
                                    id="priceSort"
                                    value={priceSort}
                                    onChange={(e) => setPriceSort(e.target.value)}
                                    className="w-40 px-3 py-2 border border-gray-300 rounded-md text-gray-700 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 hover:border-blue-400"
                                >
                                    <option value="">Select</option>
                                    <option value="lowToHigh">Low to High</option>
                                    <option value="highToLow">High to Low</option>
                                </select>

                            </div>
                        </div>
                        {(loading) && (
                            <div className="w-full flex flex-col gap-6 mb-6">
                                {[...Array(3)].map((_, idx) => (
                                    <div
                                        key={idx}
                                        className="flex flex-col md:flex-row items-center md:items-start bg-white rounded-2xl shadow-lg overflow-hidden w-full h-auto md:h-60 p-4 gap-4"
                                    >
                                        {/* Image skeleton */}
                                        <div className="w-full md:w-[30%] h-[200px] md:h-full bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                            <Skeleton
                                                variant="rectangular"
                                                animation="wave"
                                                width="100%"
                                                height="100%"
                                                className="rounded-lg"
                                            />
                                        </div>

                                        {/* Content skeleton */}
                                        <div className="flex-1 flex flex-col justify-between h-auto md:h-[80%] px-0 md:px-4 w-full gap-2">
                                            <div className="flex flex-row justify-between md:items-start gap-2">
                                                <Skeleton animation="wave" variant="text" width="60%" height={28} />
                                                <Skeleton animation="wave" variant="rectangular" width={80} height={24} className="rounded-full" />
                                            </div>

                                            <Skeleton animation="wave" variant="text" width="50%" height={20} />
                                            <Skeleton animation="wave" variant="text" width="80%" height={20} />
                                            <Skeleton animation="wave" variant="text" width="90%" height={48} />

                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-4">
                                                <Skeleton animation="wave" variant="text" width="30%" height={24} />
                                                <Skeleton animation="wave" variant="rectangular" width={100} height={36} className="rounded-full" />
                                            </div>
                                        </div>
                                    </div>

                                ))}
                            </div>
                        )}
                        {error && <div className='w-full flex flex-col items-center mt-6 min-h-screen p-8 text-red-500'>Error: {packagesError}</div>}
                        {packages && !loading && !error && (
                            <>
                                {packages.length > 0 ? (
                                    <div className="w-full flex-1 gap-6 mb-6">
                                        {[...packages]
                                            .sort((a, b) => {
                                                if (priceSort === "lowToHigh") {
                                                    return a.price - b.price; // normal order
                                                }
                                                if (priceSort === "highToLow") {
                                                    return b.price - a.price; // reverse order
                                                }
                                                return 0;
                                            })
                                            .map((pkg) => (
                                                <div
                                                    key={pkg.id}
                                                    style={{ marginBottom: "10px" }}
                                                    className="relative mb-6 "
                                                >
                                                    <div className={`transition-opacity duration-300 ${loadedImages[pkg.id] ? "opacity-100" : "opacity-0"
                                                        }`}>
                                                        <div className="flex flex-col md:flex-row items-center md:items-start bg-white rounded-2xl shadow-lg overflow-hidden w-full h-auto md:h-60 p-4 gap-4">

                                                            {/* Image */}
                                                            <div className="w-full md:w-[30%] h-[200px] md:h-full bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                                <img
                                                                    src={pkg.thumbnailUrl}
                                                                    alt={pkg.title}
                                                                    onLoad={() => handleImageLoad(pkg.id)}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>

                                                            {/* Content */}
                                                            <div className="flex-1 flex flex-col justify-between h-auto md:h-[80%] px-0 md:px-4 w-full">
                                                                <div className="flex flex-row justify-between md:items-start gap-2">
                                                                    <h3 className="text-lg md:text-2xl font-bold text-gray-800">
                                                                        {pkg.title}
                                                                    </h3>
                                                                    <span className="bg-green-100 text-green-700 text-xs md:text-sm font-semibold px-2 md:px-3 py-1 rounded-full">
                                                                        Available
                                                                    </span>
                                                                </div>

                                                                <p className="text-gray-600 text-sm md:text-base mt-2">
                                                                    {pkg.description}
                                                                </p>

                                                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-4">
                                                                    <div className="flex flex-col">
                                                                        <span className="text-gray-500 text-xs md:text-sm font-normal mb-1">
                                                                            Starting from
                                                                        </span>
                                                                        <div className="text-lg md:text-xl font-bold text-blue-700">
                                                                            ₹{pkg.price}
                                                                            <span className="text-gray-500 text-xs md:text-sm font-normal">
                                                                                {" "}
                                                                                / {pkg.durationDays} Days - {pkg.durationDays - 1} Nights
                                                                            </span>
                                                                        </div>
                                                                    </div>

                                                                    <button
                                                                    onClick={()=>handleBookNow(pkg.id)}
                                                                    // onClick={()=>console.log(pkg.id)}
                                                                        className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-full text-xs md:text-sm font-semibold hover:bg-blue-700 transition"
                                                                    >
                                                                        Book Now
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {!loadedImages[pkg.id] && (
                                                        <div className="absolute inset-0 z-10">
                                                            <div
                                                                className="flex flex-col md:flex-row items-center md:items-start bg-white rounded-2xl shadow-lg overflow-hidden w-full h-auto md:h-60 p-4 gap-4"
                                                            >
                                                                {/* Image skeleton */}
                                                                <div className="w-full md:w-[30%] h-[200px] md:h-full bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                                    <Skeleton
                                                                        variant="rectangular"
                                                                        animation="wave"
                                                                        width="100%"
                                                                        height="100%"
                                                                        className="rounded-lg"
                                                                    />
                                                                </div>

                                                                {/* Content skeleton */}
                                                                <div className="flex-1 flex flex-col justify-between h-auto md:h-[80%] px-0 md:px-4 w-full gap-2">
                                                                    <div className="flex flex-row justify-between md:items-start gap-2">
                                                                        <Skeleton animation="wave" variant="text" width="60%" height={28} />
                                                                        <Skeleton animation="wave" variant="rectangular" width={80} height={24} className="rounded-full" />
                                                                    </div>

                                                                    <Skeleton animation="wave" variant="text" width="50%" height={20} />
                                                                    <Skeleton animation="wave" variant="text" width="80%" height={20} />
                                                                    <Skeleton animation="wave" variant="text" width="90%" height={48} />

                                                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-4">
                                                                        <Skeleton animation="wave" variant="text" width="30%" height={24} />
                                                                        <Skeleton animation="wave" variant="rectangular" width={100} height={36} className="rounded-full" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    )}
                                                </div>
                                            ))}
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-500 font-semibold text-lg py-10">
                                        No packages available.
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {isMobileFilterOpen && (
                    <div className="md:hidden fixed inset-0  bg-opacity-50 z-50 flex items-end">
                        <div className="bg-white w-full h-[85vh] rounded-t-3xl overflow-hidden">
                            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                                <h2 className="text-xl font-bold text-gray-800">Filters</h2>
                                <button
                                    onClick={() => setIsMobileFilterOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition"
                                >
                                    <FaTimes className="text-gray-600" />
                                </button>
                            </div>

                            <div className="h-full overflow-y-hidden">
                                <div className="p-4">
                                    <FilterSection
                                        onFilterChange={handleFilterChange}
                                        onApplyFilters={(newFilters) => {
                                            handleApplyFilters(newFilters);
                                            setIsMobileFilterOpen(false);
                                        }}
                                        initialFilters={filters}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}

export default PackageSearchResults