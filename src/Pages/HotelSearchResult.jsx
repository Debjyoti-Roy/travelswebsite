import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchHotels } from '../Redux/store/hotelSlice';
import { FaMapMarkerAlt, FaUsers, FaWifi, FaFire, FaThermometerHalf, FaTint, FaVideo, FaWater, FaChair, FaFirstAid, FaSuitcase, FaConciergeBell, FaUserTie, FaHamburger, FaCar, FaBolt, FaUtensils, FaFilter, FaTimes } from "react-icons/fa";
import { Carousel } from 'react-responsive-carousel';
import Slider from '@mui/material/Slider';

function HotelDescription({ description }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  // You can adjust this character limit
  const charLimit = 100;

  const shouldTruncate = description.length > charLimit;
  const displayedText = isExpanded ? description : description.slice(0, charLimit) + (shouldTruncate ? "..." : "");

  return (
    <p className="text-gray-500 text-sm pt-2">
      {displayedText}
      {/* {shouldTruncate && (
        <button
          onClick={toggleDescription}
          className="text-blue-600 font-medium ml-1 focus:outline-none"
        >
          {isExpanded ? "Show less" : "Show more"}
        </button>
      )} */}
    </p>)
}

// Separate Filter Component to prevent re-renders
const FilterSection = React.memo(({ onFilterChange, onApplyFilters, initialFilters }) => {
  // Filter states
  const [priceRange, setPriceRange] = useState(initialFilters.priceRange);
  const [selectedTags, setSelectedTags] = useState(initialFilters.selectedTags);
  const [selectedAmenities, setSelectedAmenities] = useState(initialFilters.selectedAmenities);
  const [priceSort, setPriceSort] = useState(initialFilters.priceSort);
  const [activeThumb, setActiveThumb] = useState(null); // 'min' or 'max'
  const [activeThumb2, setActiveThumb2] = useState(null); // 'min' or 'max'

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

  const handleTagToggle = useCallback((tag) => {
    setSelectedTags(prev => {
      const newTags = prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag];

      // Update local state only, don't trigger search
      onFilterChange({
        priceRange,
        selectedTags: newTags,
        selectedAmenities,
        priceSort
      });

      return newTags;
    });
  }, [priceRange, selectedAmenities, priceSort, onFilterChange]);

  const handleAmenityToggle = useCallback((amenity) => {
    setSelectedAmenities(prev => {
      const newAmenities = prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity];

      // Update local state only, don't trigger search
      onFilterChange({
        priceRange,
        selectedTags,
        selectedAmenities: newAmenities,
        priceSort
      });

      return newAmenities;
    });
  }, [priceRange, selectedTags, priceSort, onFilterChange]);

  const handlePriceRangeChange = useCallback((type, value) => {
    setPriceRange(prev => {
      const newRange = {
        ...prev,
        [type]: parseInt(value)
      };

      // Update local state only, don't trigger search
      onFilterChange({
        priceRange: newRange,
        selectedTags,
        selectedAmenities,
        priceSort
      });

      return newRange;
    });
  }, [selectedTags, selectedAmenities, priceSort, onFilterChange]);

  const handlePriceSortChange = useCallback((value) => {
    setPriceSort(value);

    // Update local state only, don't trigger search
    onFilterChange({
      priceRange,
      selectedTags,
      selectedAmenities,
      priceSort: value
    });
  }, [priceRange, selectedTags, selectedAmenities, onFilterChange]);

  const clearFilters = useCallback(() => {
    const defaultFilters = {
      priceRange: { min: 0, max: 10000 },
      selectedTags: [],
      selectedAmenities: [],
      priceSort: ''
    };

    setPriceRange(defaultFilters.priceRange);
    setSelectedTags(defaultFilters.selectedTags);
    setSelectedAmenities(defaultFilters.selectedAmenities);
    setPriceSort(defaultFilters.priceSort);

    // Update local state only, don't trigger search
    onFilterChange(defaultFilters);
  }, [onFilterChange]);

  const handleApplyFilters = useCallback(() => {
    const currentFilters = {
      priceRange,
      selectedTags,
      selectedAmenities,
      priceSort
    };

    // Trigger the actual search
    onApplyFilters(currentFilters);
  }, [priceRange, selectedTags, selectedAmenities, priceSort, onApplyFilters]);

  useEffect(() => {
    console.log(activeThumb)
  }, [activeThumb])
  useEffect(() => {
    console.log(activeThumb2)
  }, [activeThumb2])

  // Global mouse up listener to reset active thumb
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setActiveThumb(null);
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkScreenSize();

    // Listen to resize
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <div className="bg-white md:shadow-2xl  rounded-2xl p-6 md:border md:border-gray-200">
      <div className="flex justify-between items-center pb-4">
        <h2 className="text-xl font-bold text-gray-800">Filters</h2>
        <button
          onClick={clearFilters}
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
                onChange={(_, newValue) => {
                  // newValue is [min, max]
                  handlePriceRangeChange('min', newValue[0]);
                  handlePriceRangeChange('max', newValue[1]);
                }}
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
        <div>
          <h3 className="text-md font-semibold text-gray-700 mb-3">Amenities</h3>
          <div className="flex flex-col gap-2">
            {availableAmenities.map((amenity) => (
              <label key={amenity.name} className="flex items-center gap-2 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={selectedAmenities.includes(amenity.name)}
                  onChange={() => handleAmenityToggle(amenity.name)}
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

const HotelSearchResult = () => {
  const location = useLocation();
  const { state } = location;
  const dispatch = useDispatch();
  const { searchResults, loading, error } = useSelector((state) => state.hotel);

  const [page, setPage] = useState(0);
  const navigate = useNavigate()

  // Filter state for the main component
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 10000 },
    selectedTags: [],
    selectedAmenities: [],
    priceSort: ''
  });

  // Applied filters state (what's actually being used for search)
  const [appliedFilters, setAppliedFilters] = useState({
    priceRange: { min: 0, max: 10000 },
    selectedTags: [],
    selectedAmenities: [],
    priceSort: ''
  });

  // Mobile filter overlay state
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const fetchHotels = useCallback(() => {
    dispatch(searchHotels({
      location: state.location,
      checkIn: state.startDate,
      checkOut: state.endDate,
      requiredRoomCount: state.rooms,
      page,
      size: 10,
      // Add filter parameters
      minPrice: appliedFilters.priceRange.min,
      maxPrice: appliedFilters.priceRange.max,
      tags: appliedFilters.selectedTags,
      amenities: appliedFilters.selectedAmenities,
      // sortBy: appliedFilters.priceSort
    }));
  }, [dispatch, state, page, appliedFilters]);

  // Handle filter changes from the FilterSection component (local state only)
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    // Don't trigger search here - only update local state
  }, []);

  // Handle apply filters button click
  const handleApplyFilters = useCallback((newFilters) => {
    setAppliedFilters(newFilters);
    setPage(0); // Reset to first page when filters are applied
  }, []);

  // Fetch hotels when page changes or applied filters change
  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  useEffect(() => {
    // console.log("Search results updated:", searchResults);
  }, [searchResults]);

  const hotelDetails = (id, startingPrice) => {
    // console.log(id)
    const data = {
      room: state.rooms,
      location: state.location,
      checkIn: state.startDate,
      checkOut: state.endDate,
      id: id,
      total: state.total,
      startingPrice: startingPrice
    }
    navigate("/details", { state: data })
  }



  return (
    <div className='w-full bg-[#f2f2f2] flex justify-center'>

      <div className="flex flex-col md:flex-row lg:w-[60%] w-full  md:justify-center px-6 lg:px-2 py-6 gap-6 min-h-screen">

        <div className="hidden md:block md:w-1/3 ">
          <FilterSection
            onFilterChange={handleFilterChange}
            onApplyFilters={handleApplyFilters}
            initialFilters={filters}
          />
        </div>



        <div className="w-full flex flex-col md:min-h-screen">
          <div className="w-full flex justify-between items-center pb-4">
            <div className="text-2xl font-bold">
              Showing properties in {state.location}
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
                value={appliedFilters.priceSort}
                onChange={(e) => handleApplyFilters({ ...appliedFilters, priceSort: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 hover:border-blue-400"
              >
                <option value="">Select</option>
                <option value="lowToHigh">Low to High</option>
                <option value="highToLow">High to Low</option>
              </select>
            </div>
          </div>

          {loading && <div className="w-full flex-1 gap-6">Loading...</div>}
          {error && <div className='w-full flex flex-col items-center mt-6 min-h-screen p-8 text-red-500'>Error: {error}</div>}

          {searchResults && !loading && !error && (
            <div className="w-full flex-1 gap-6 mb-6">
              {[...(searchResults.content || [])]
                .sort((a, b) => {
                  if (appliedFilters.priceSort === 'lowToHigh') {
                    return a.startingPrice - b.startingPrice;
                  }
                  if (appliedFilters.priceSort === 'highToLow') {
                    return b.startingPrice - a.startingPrice;
                  }
                  return 0;
                })
                .map((hotel) => (
                  <div
                    key={hotel.id}
                    className="flex items-center bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-xl w-full h-80 md:h-55"
                  >
                    {/* Image */}
                    <div style={{ marginLeft: "10px" }} className="flex items-center justify-center w-[30%] h-[80%] bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <div className="w-full h-full ml-2">
                        {hotel.photoUrls.length === 1 ? (
                          <img
                            src={hotel.photoUrls[0]}
                            alt={hotel.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Carousel
                            showThumbs={false}
                            showStatus={false}
                            infiniteLoop
                            autoPlay
                            interval={3000}
                            className="w-full h-full"
                          >
                            {hotel.photoUrls.map((url, idx) => (
                              <div key={idx} className="w-full h-full">
                                <img src={url} alt={`${hotel.name} ${idx + 1}`} className="w-full h-full object-cover" />
                              </div>
                            ))}
                          </Carousel>
                        )}
                      </div>
                    </div>

                    {/* Info section */}
                    <div className="flex flex-col justify-between p-4 flex-1 h-full">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold text-gray-800">{hotel.name}</h3>
                        <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">Available</span>
                      </div>

                      <div className="flex items-center text-gray-500 text-sm pt-2">
                        <FaMapMarkerAlt className="mr-1 text-blue-600" />
                        {hotel.city}, {hotel.district} - {hotel.pinCode}
                      </div>

                      <div className="flex items-center flex-wrap gap-2 pt-1">
                        {hotel.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-blue-100 text-blue-700 rounded-full px-2 py-1 text-xs font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                        <div className="flex items-center text-yellow-500 text-sm">
                          ★★★★☆
                        </div>
                        <span className="text-gray-500 text-sm">Very Good</span>
                      </div>

                      <HotelDescription description={hotel.description} />

                      <div className="flex items-center justify-between pt-4">
                        <div className="text-xl font-bold text-blue-700">
                          ₹{hotel.startingPrice}
                          <span className="text-gray-500 text-sm font-normal"> /night</span>
                        </div>
                        <button onClick={() => hotelDetails(hotel.id, hotel.startingPrice)} className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition">
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Pagination Section - Now positioned at bottom */}
          <div className="mt-auto pt-6">
            <div className="text-gray-600 mb-2 text-center">
              Total Elements: {searchResults.totalElements} | Total Pages: {searchResults.totalPages}
            </div>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                disabled={page === 0}
                className={`px-4 py-2 rounded ${page === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 text-white"
                  }`}
              >
                Prev
              </button>
              <span>Page {page + 1}</span>
              <button
                onClick={() => !searchResults.last && setPage((prev) => prev + 1)}
                disabled={searchResults.last}
                className={`px-4 py-2 rounded ${searchResults.last ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 text-white"
                  }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Bottom Bar - Only visible on mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <FaFilter className="text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Filters</span>
            {(appliedFilters.selectedTags.length > 0 || appliedFilters.selectedAmenities.length > 0 ||
              appliedFilters.priceRange.min > 0 || appliedFilters.priceRange.max < 10000) && (
                <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {(appliedFilters.selectedTags.length + appliedFilters.selectedAmenities.length +
                    (appliedFilters.priceRange.min > 0 ? 1 : 0) + (appliedFilters.priceRange.max < 10000 ? 1 : 0))}
                </span>
              )}
          </div>
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Mobile Filter Overlay */}
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

            <div className="h-full overflow-y-auto">
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
  );
};

export default HotelSearchResult;
