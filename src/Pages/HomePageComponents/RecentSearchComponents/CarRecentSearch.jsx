import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPackages } from '../../../Redux/store/carPackageSlice';
import Slider from 'react-slick';
import { MdHotel } from 'react-icons/md';
import { FaCarSide } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const settings = {
    dots: false,
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

const CarRecentSearch = () => {
    const dispatch = useDispatch();
    const { packages } = useSelector((state) => state.carPackage);
    const navigate = useNavigate()

    const getCookie = (name) => {
        const cookie = document.cookie.split('; ').find((row) => row.startsWith(name + '='));
        return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
    };

    useEffect(() => {
        const savedData = getCookie('carPackageState');
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                const [day, month] = parsedData.travelDate.split('-');
                dispatch(getPackages({ area: parsedData.location, month: month }));
            } catch (error) {
                console.error('Error parsing cookie JSON:', error);
            }
        } else {
            console.log('No carPackageState cookie found');
        }
    }, [dispatch]);

    const handleBookNow = (pkg) => {
        const savedData = getCookie('carPackageState');
        const parsedData = JSON.parse(savedData);
        const data={
            id:pkg.id,
            travelDate:parsedData.travelDate
        }
        navigate("/carpackagedetails", { state: data })
    };

    return (
        <div className="w-full mt-6">
            {packages.length >= 3 ? (
                <Slider {...settings}>
                    {packages.map((pkg, index) => (
                        <motion.div
                            key={pkg.id || index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            className="p-3"
                        >
                            <div className="rounded-3xl bg-white overflow-hidden border border-gray-200 hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 flex flex-col h-[400px]">
                                <div className="h-52 w-full overflow-hidden">
                                    <img
                                        src={pkg.thumbnailUrl}
                                        alt={pkg.title}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                    />
                                </div>

                           
                                <div className="p-6 flex flex-col h-full">
                                    {/* Title */}
                                    <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 min-h-[28px]">
                                        {pkg.title}
                                    </h2>

                                    {/* Description */}
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 min-h-[60px]">
                                        {pkg.description || ""}
                                    </p>

                                    {/* Accommodation */}
                                    <div className="flex items-center gap-3 mb-3 min-h-[60px]">
                                        <MdHotel className="text-blue-600 text-xl" />
                                        <span className="text-gray-800">
                                            <span className="font-semibold block">Accommodation</span>
                                            <span className="text-gray-600">{pkg.hotelType || "Standard"}</span>
                                        </span>
                                    </div>

                                    {/* Transportation */}
                                    <div className="flex items-center gap-3 mb-6 min-h-[60px]">
                                        <FaCarSide className="text-green-600 text-xl" />
                                        <span className="text-gray-800">
                                            <span className="font-semibold block">Transportation</span>
                                            <span className="text-gray-600">{pkg.carTypes || "Comfort"}</span>
                                        </span>
                                    </div>

                                    {/* Price + Button */}
                                    <div className="flex items-center justify-between mt-auto">
                                        <span className="text-lg font-bold text-gray-900">
                                            ₹{pkg.price.toLocaleString("en-IN")}
                                        </span>
                                        <button
                                            onClick={() => handleBookNow(pkg)}
                                            className="cursor-pointer px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                                        >
                                            Book Now →
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </motion.div>
                    ))}
                </Slider>
            ) : (
                <div className="flex flex-col gap-4">
                    {packages.map((pkg, index) => (
                        <motion.div
                            key={pkg.id || index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                        >
                            <div className="rounded-3xl bg-white overflow-hidden border border-gray-200 hover:shadow-2xl hover:scale-[1.02] transition-all duration-500">
                                <div className="h-52 w-full overflow-hidden">
                                    <img
                                        src={pkg.thumbnailUrl}
                                        alt={pkg.title}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-6 flex flex-col h-full">
                                    <h2 className="text-xl font-bold text-gray-900 mb-2">{pkg.title}</h2>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{pkg.description}</p>

                                    <div className="flex items-center justify-between mt-auto">
                                        <span className="text-lg font-bold text-gray-900">
                                            ₹{pkg.price.toLocaleString('en-IN')}
                                        </span>
                                        <button
                                            onClick={() => handleBookNow(pkg)}
                                            className="cursor-pointer px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                                        >
                                            Book Now →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CarRecentSearch;
