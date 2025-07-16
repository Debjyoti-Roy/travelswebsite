import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { searchHotels } from '../Redux/store/hotelSlice';
import { FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import { Carousel } from 'react-responsive-carousel';

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
      {shouldTruncate && (
        <button
          onClick={toggleDescription}
          className="text-blue-600 font-medium ml-1 focus:outline-none"
        >
          {isExpanded ? "Show less" : "Show more"}
        </button>
      )}
    </p>)
}

const HotelSearchResult = () => {
  const location = useLocation();
  const { state } = location;
  const dispatch = useDispatch();
  const { searchResults, loading, error } = useSelector((state) => state.hotel);

  const [page, setPage] = useState(0);
  const navigate = useNavigate()


  const fetchHotels = () => {
    dispatch(searchHotels({
      location: state.location,
      checkIn: state.startDate,
      checkOut: state.endDate,
      requiredRoomCount: state.rooms,
      page,
      size: 10,
    }));
  };

  useEffect(() => {
    fetchHotels();
  }, [dispatch, state, page]);

  useEffect(() => {
    console.log("Search results updated:", searchResults);
  }, [searchResults]);

  const hotelDetails = (id) => {
    console.log(id)
    const data = {
      room: state.rooms,
      location: state.location,
      checkIn: state.startDate,
      checkOut: state.endDate,
      id: id,
      total: state.total
    }
    navigate("/details", { state: data })
  }



  if (loading) return <div className='min-h-screen p-8'>Loading...</div>;
  if (error) return <div className='min-h-screen p-8 text-red-500'>Error: {error}</div>;

  return (
    <div className='w-full bg-[#f2f2f2] flex justify-center'>

      <div className="flex flex-col md:flex-row w-[60%] justify-center px-2 py-6 gap-6 min-h-screen">
        {/* Left Filter Section */}
        <div className="md:w-1/3 bg-white shadow rounded-xl p-4 border border-gray-100">
          <h2 className="text-lg font-semibold pb-4">Filters</h2>
          <div className="space-y-2">


            {/* Price Sort Filter */}
            <select
              className="w-full px-3 py-2 border rounded text-gray-700"
            >
              <option value="">Sort by Price</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* ... Right content section here ... */}
        {/* </div> */}

        {/* </div> */}

        {/* Hotel Cards Section */}
        <div className="w-full flex flex-col items-center mt-6">
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
                // value={state.priceSort}
                // onChange={(e) => setState({ ...state, priceSort: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300 hover:border-blue-400"
              >
                <option value="">Select</option>
                <option value="lowToHigh">Low to High</option>
                <option value="highToLow">High to Low</option>
              </select>
            </div>

          </div>


          <div className="w-full flex-1 gap-6">
            {searchResults.content?.map((hotel) => (
              <div
                key={hotel.id}
                className="flex bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-xl w-full"
              >
                {/* Image */}
                <div className="w-48 h-50 flex-shrink-0">
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

                {/* Info section */}
                <div className="flex flex-col justify-between p-4 flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-gray-800">{hotel.name}</h3>
                    <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">Available</span>
                  </div>

                  <div className="flex items-center text-gray-500 text-sm pt-2">
                    <FaMapMarkerAlt className="mr-1 text-blue-600" />
                    {hotel.city}, {hotel.district} - {hotel.pinCode}
                  </div>

                  <div className="flex items-center flex-wrap gap-2 pt-2">
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
                    <button onClick={() => hotelDetails(hotel.id)} className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}





          </div>

          {/* Pagination Section */}

          <div className="text-gray-600 mb-2">
            Total Elements: {searchResults.totalElements} | Total Pages: {searchResults.totalPages}
          </div>
          <div className="flex items-center gap-4">
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
  );
};

export default HotelSearchResult;
