
import { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import { Users, DoorClosed, IndianRupee } from "lucide-react";
import { FiEdit2 } from "react-icons/fi";
import EditRoomModal from './EditRoomModal';

const RoomCard = ({ rooms = [] }) => {
    const [expandedRoom, setExpandedRoom] = useState(null);
    const [editRoom, setEditRoom] = useState(null);
    const CustomCarousel = ({ images = [] }) => {
        const [currentIndex, setCurrentIndex] = useState(0);
        const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % images.length);
        const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

        // Auto-play
        useState(() => {
            const interval = setInterval(nextSlide, 3000);
            return () => clearInterval(interval);
        }, []);

       

        return (
            <div className="relative w-full h-48 overflow-hidden">
                <div
                    className="flex transition-transform duration-300 ease-in-out h-full"
                >
                    <Carousel
                        showThumbs={false}
                        showStatus={false}
                        infiniteLoop
                        autoPlay
                        interval={3000}
                        className="w-full"
                    >
                        {images.map((url, i) => (
                            <div key={i}>
                                <img src={url} alt={`Room ${i}`} className="w-full h-48 object-cover" />
                            </div>
                        ))}
                    </Carousel>
                </div>


            </div>
        );
    };
    return (
        <div className="overflow-hidden w-[100%]">
            <div className="flex flex-nowrap overflow-x-auto gap-4">
                {rooms.map((room) => (
                    <div
                        key={room.id}
                        className="w-full md:w-1/2 lg:w-1/3 px-2 shrink-0"
                    >
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full flex flex-col">
                            <CustomCarousel images={room.imageUrls || []} />
                            <div className="p-4 flex flex-col flex-grow">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-2">{room.name}</h2>
                                    <button title="Edit Room" className="text-yellow-500 px-4 py-2 rounded-md cursor-pointer" onClick={() => setEditRoom(room)}><FiEdit2 /></button>
                                </div>
                                <div className="flex items-center text-gray-600 text-sm pb-2">
                                    <Users className="w-5 h-5 text-blue-700 p-1 rounded-xl bg-blue-100 mr-2" />
                                    Max: {room.maxOccupancy}
                                </div>
                                <div className="flex items-center text-gray-600 text-sm pb-2">
                                    <DoorClosed className="w-5 h-5 text-blue-700 p-1 rounded-xl bg-blue-100 mr-2" />
                                    Rooms: {room.totalRooms}
                                </div>
                                <div className="flex items-center text-gray-600 text-sm pb-2">
                                    <IndianRupee className="w-5 h-5 text-blue-700 p-1 rounded-xl bg-blue-100 mr-2" />
                                    ₹{room.pricePerNight}
                                </div>
                                {/* Features with Show More */}
                                {room.features && room.features.length > 0 && (
                                    <>
                                        <div className={`flex flex-wrap gap-1 pt-2 transition-all duration-300 ${expandedRoom === room.id ? "" : "max-h-16 overflow-hidden"}`}>
                                            {room.features.map((feature, idx) => (
                                                <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                                                    {feature}
                                                </span>
                                            ))}
                                        </div>
                                        {room.features.length > 2 && (
                                            <button
                                                onClick={() =>
                                                    setExpandedRoom((prev) => (prev === room.id ? null : room.id))
                                                }
                                                className="text-blue-600 text-xs font-medium mt-1"
                                            >
                                                {expandedRoom === room.id ? "Show less" : "Show more"}
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {editRoom && (
                <EditRoomModal room={editRoom} onClose={() => setEditRoom(null)} />
            )}
        </div>
    );
};

export default RoomCard;
