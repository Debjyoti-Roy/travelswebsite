import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FaUsers, FaDoorClosed, FaRupeeSign, FaSnowflake } from "react-icons/fa";

const RoomCard = ({ rooms }) => {
    return (
        <div className="flex flex-wrap -mx-2">
            {rooms.map((room) => (
                <div key={room.id} className="w-full md:w-1/3 px-2 mb-4">
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition hover:shadow-2xl duration-300">
                        <Carousel
                            showThumbs={false}
                            showStatus={false}
                            infiniteLoop
                            autoPlay
                            interval={3000}
                            className="w-full"
                        >
                            {room.imageUrls.map((url, i) => (
                                <div key={i}>
                                    <img src={url} alt={`Room ${i}`} className="w-full h-48 object-cover" />
                                </div>
                            ))}
                        </Carousel>

                        <div className="p-4">
                            <h2 className="text-lg font-semibold text-gray-800 mb-2">{room.name}</h2>

                            <div className="flex items-center text-gray-600 text-sm pb-2 ">
                                <div className="pr-2">

                                    <FaUsers className="text-xl text-blue-700 p-1 rounded-xl bg-blue-100" />
                                </div>
                                Max: {room.maxOccupancy}
                            </div>
                            <div className="flex items-center text-gray-600 text-sm pb-2 ">
                                <div className="pr-2">

                                    <FaDoorClosed className="text-xl text-blue-700 p-1 rounded-xl bg-blue-100" />
                                </div>
                                Rooms: {room.totalRooms}
                            </div>
                            <div className="flex items-center text-gray-600 text-sm pb-2 ">
                                <div className="pr-2">

                                    <FaRupeeSign className="text-xl text-blue-700 p-1 rounded-xl bg-blue-100" />
                                </div>
                                ₹{room.pricePerNight}
                            </div>
                            {room.features && room.features.length > 0 && (
                                <div className="flex flex-wrap gap-1 pt-2">
                                    {room.features.map((feature, idx) => (
                                        <span
                                            key={idx}
                                            className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium"
                                        >
                                            {feature}
                                        </span>
                                    ))}
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default RoomCard