import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Slider from 'react-slick';
import { motion } from 'framer-motion';
import { searchHotels } from '../../../Redux/store/hotelSlice';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [
        { breakpoint: 1024, settings: { slidesToShow: 2 } },
        { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
};

const HotelRecentSearch = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { searchResults, loading, error } = useSelector((state) => state.hotel);
    const [hotels, setHotels] = useState([])
    const getCookie = (name) => {
        const cookie = document.cookie.split('; ').find((row) => row.startsWith(name + '='));
        return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
    };
    useEffect(() => {
        // hotelState
        const savedData = getCookie('hotelState');
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                dispatch(searchHotels({
                    location: parsedData.location,
                    checkIn: parsedData.startDate,
                    checkOut: parsedData.endDate,
                    requiredRoomCount: parsedData.rooms,
                    page: 0,
                    size: 10,
                }));
            } catch (error) {
                console.error('Error parsing cookie JSON:', error);
            }
        } else {
            console.log('No carPackageState cookie found');
        }
    }, [dispatch])

    useEffect(() => {
        // console.log(searchResults.content)
        setHotels(searchResults.content)
    }, [searchResults])

    const handleBookNow=async(startingPrice, hotel)=>{
        const savedData = getCookie('hotelState');
        const parsedData = JSON.parse(savedData);
        const data = {
            room: parsedData.rooms,
            location: parsedData.location,
            checkIn: parsedData.startDate,
            checkOut: parsedData.endDate,
            id: hotel.id,
            total: parsedData.total,
            startingPrice: startingPrice
          }
          navigate("/details", { state: data })
    }


    return (
        <div className="w-full mt-6">
            {hotels?.length >= 3 ? (
                // ✅ Show Carousel if there are 3 or more hotels
                <Slider {...settings}>
                    {hotels.map((hotel, index) => (
                        <motion.div
                            key={hotel.id || index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            className="p-3"
                        >
                            <div className="rounded-3xl bg-white overflow-hidden border border-gray-200 hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 flex flex-col h-[430px]">
                                {/* Image */}
                                <div className="h-52 w-full overflow-hidden">
                                    <img
                                        src={hotel.photoUrls?.[0]}
                                        alt={hotel.name}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                    />
                                </div>

                                {/* Content */}
                                <div className="p-6 flex flex-col h-full">
                                    <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 min-h-[28px]">
                                        {hotel.name}
                                    </h2>

                                    <div className="flex items-center gap-2 mb-3 text-gray-700 min-h-[24px]">
                                        <FaMapMarkerAlt className="text-red-500 text-lg" />
                                        <span className="text-sm">
                                            {hotel.area}, {hotel.city}
                                        </span>
                                    </div>

                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 min-h-[60px]">
                                        {hotel.description || ""}
                                    </p>

                                    {hotel.tags?.length > 0 && (
                                        <div className="flex items-center gap-2 mb-4 min-h-[24px]">
                                            <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                                {hotel.tags[0]}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between mt-auto">
                                        <span className="text-lg font-bold text-gray-900">
                                            ₹{hotel.startingPrice.toLocaleString("en-IN")}
                                            <span className="text-sm font-normal text-gray-600 ml-1">
                                                /night
                                            </span>
                                        </span>
                                        <button
                                            onClick={() =>
                                                handleBookNow(
                                                    hotel.startingPrice,
                                                    hotel
                                                )
                                            }
                                            className="cursor-pointer px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                                        >
                                            View Details →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </Slider>
            ) : (
                // ✅ Static layout if 1 or 2 hotels
                <div
                    className={`grid gap-1 justify-items-center ${hotels?.length === 1 ? "grid-cols-1" : "grid-cols-2"
                        }`}
                >
                    {hotels?.map((hotel, index) => (
                        <motion.div
                            key={hotel.id || index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            className="w-full max-w-[400px]"
                        >
                            <div className="rounded-3xl bg-white overflow-hidden border border-gray-200 hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 flex flex-col h-[430px]">
                                <div className="h-52 w-full overflow-hidden">
                                    <img
                                        src={hotel.photoUrls?.[0]}
                                        alt={hotel.name}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                    />
                                </div>

                                <div className="p-6 flex flex-col h-full">
                                    <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 min-h-[28px]">
                                        {hotel.name}
                                    </h2>

                                    <div className="flex items-center gap-2 mb-3 text-gray-700 min-h-[24px]">
                                        <FaMapMarkerAlt className="text-red-500 text-lg" />
                                        <span className="text-sm">
                                            {hotel.area}, {hotel.city}
                                        </span>
                                    </div>

                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 min-h-[60px]">
                                        {hotel.description || ""}
                                    </p>

                                    {hotel.tags?.length > 0 && (
                                        <div className="flex items-center gap-2 mb-4 min-h-[24px]">
                                            <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                                {hotel.tags[0]}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between mt-auto">
                                        <span className="text-lg font-bold text-gray-900">
                                            ₹{hotel.startingPrice.toLocaleString("en-IN")}
                                            <span className="text-sm font-normal text-gray-600 ml-1">
                                                /night
                                            </span>
                                        </span>
                                        <button
                                            onClick={() =>
                                                handleBookNow(
                                                    hotel.startingPrice.toLocaleString("en-IN"),
                                                    hotel
                                                )
                                            }
                                            className="cursor-pointer px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                                        >
                                            View Details →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>

    )
}

export default HotelRecentSearch