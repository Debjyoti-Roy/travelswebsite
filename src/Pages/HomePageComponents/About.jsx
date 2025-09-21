import React from "react";
import { FaHotel, FaCarSide, FaUmbrellaBeach } from "react-icons/fa";
import { motion } from "framer-motion";

const HotelIcon = ({ className = "w-12 h-12 text-white" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M10 22v-6.57" />
        <path d="M12 11h.01" />
        <path d="M12 7h.01" />
        <path d="M14 15.43V22" />
        <path d="M15 16a5 5 0 0 0-6 0" />
        <path d="M16 11h.01" />
        <path d="M16 7h.01" />
        <path d="M8 11h.01" />
        <path d="M8 7h.01" />
        <rect x="4" y="2" width="16" height="20" rx="2" />
    </svg>
);


const CarIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="44"
        height="44"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-car-front-icon lucide-car-front"
    >
        {/* Roof and front */}
        <path d="m21 8-2 2-1.5-3.7A2 2 0 0 0 15.646 5H8.4a2 2 0 0 0-1.903 1.257L5 10 3 8" />

        {/* Headlights */}
        <path d="M7 14h.01" />
        <path d="M17 14h.01" />

        {/* Car body */}
        <rect width="18" height="8" x="3" y="10" rx="2" />

        {/* Wheels / ground */}
        <path d="M5 18v2" />
        <path d="M19 18v2" />
    </svg>
);


const TravelIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-10 h-10 text-white"
    >
        {/* Bag body */}
        <rect x="6" y="7" width="12" height="13" rx="2" ry="2" stroke="currentColor" />

        {/* Handle */}
        <path d="M10 7V4a2 2 0 0 1 4 0v3" stroke="currentColor" strokeLinecap="round" />

        {/* Wheels */}
        <circle cx="9" cy="21" r="1" fill="currentColor" />
        <circle cx="15" cy="21" r="1" fill="currentColor" />

        {/* Bag lines (detail) */}
        <path d="M12 7v13" stroke="currentColor" strokeLinecap="round" />
    </svg>
);

const About = () => {
    const cardData = [
        {
            icon: <HotelIcon className="w-10 h-10 text-white" />,
            // icon: <FaHotel className="text-4xl text-white" />,
            title: "Hotels",
            desc: "Find the best hotels at unbeatable prices and enjoy a hassle-free stay.",
            bg: "bg-gradient-to-r from-blue-500 to-blue-600",
        },
        {
            icon: <CarIcon />,
            // icon: <FaCarSide className="text-4xl text-white" />,
            title: "Cars",
            desc: "Book car rentals and travel with comfort wherever your journey takes you.",
            bg: "bg-gradient-to-r from-purple-500 to-purple-600",
        },
        {
            icon: <TravelIcon />,
            title: "Holiday Packages",
            desc: "Choose from curated holiday packages designed to make your trips memorable.",
            bg: "bg-gradient-to-r from-yellow-400 to-yellow-500",
        },
    ];

    return (
        <div className="w-full flex justify-center bg-blue-50 py-16">
            <section className="lg:w-[70%] w-[90%] text-center">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-6"
                >
                    About <span className="text-blue-500">InoHub</span>
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    style={{ marginBottom: '20px' }}
                    className="text-lg text-gray-600 leading-relaxed mb-12"
                >
                    At <span className="font-semibold text-blue-500">InoHub</span>,
                    we believe that every journey should be as unique as you are. Whether
                    you're looking for <span className="font-medium">hotel bookings</span>,
                    convenient <span className="font-medium">car rentals & travel packages</span>,
                    or fully planned <span className="font-medium">holiday experiences</span>,
                    we’ve got you covered. <br /><br />
                    Our mission is to simplify travel by offering seamless booking solutions
                    that blend comfort, adventure, and affordability. Focus on making memories,
                    we’ll handle the details.
                </motion.p>

                <div className="grid md:grid-cols-3 grid-cols-1 gap-8">
                    {cardData.map((card, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: idx * 0.2 }}
                            className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-md hover:shadow-2xl transition-transform transform hover:scale-105 cursor-pointer"
                        >
                            <div className="flex flex-col items-center text-center p-4 rounded-xl">
                                <div className={`${card.bg} w-16 h-16 flex items-center justify-center rounded-xl mb-4`}>
                                    {card.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">{card.title}</h3>
                                <p className="text-gray-600">{card.desc}</p>
                            </div>

                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default About;
