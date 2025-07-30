
import { useEffect, useState, useRef } from "react";
import { Users, DoorClosed, IndianRupee, ChevronDown, ChevronUp } from "lucide-react";
import { FiEdit2 } from "react-icons/fi";
import EditRoomModal from './EditRoomModal';

const RoomCard = ({ room }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [editRoom, setEditRoom] = useState(null);
    
    if (!room) {
        return null;
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
            {/* Room Image */}
            <div className="relative h-48 bg-gray-200 flex-shrink-0">
                {room.imageUrls && room.imageUrls.length > 0 ? (
                    <img
                        src={room.imageUrls[0]}
                        alt={room.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <DoorClosed className="w-12 h-12" />
                    </div>
                )}
                
                {/* Edit Button */}
                <button
                    onClick={() => setEditRoom(room)}
                    className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-white rounded-lg shadow-sm transition-colors"
                >
                    <FiEdit2 className="w-4 h-4 text-gray-600" />
                </button>
            </div>

            {/* Room Details */}
            <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                    <h4 className="text-lg font-semibold text-gray-800 line-clamp-2">{room.name}</h4>
                    <div className="flex items-center gap-1 text-green-600 font-semibold flex-shrink-0 ml-2">
                        <IndianRupee className="w-4 h-4" />
                        <span>{room.pricePerNight}</span>
                    </div>
                </div>

                {/* Room Stats */}
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>Max {room.maxOccupancy}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <DoorClosed className="w-4 h-4" />
                        <span>{room.totalRooms} rooms</span>
                    </div>
                </div>

                {/* Features - Always show first 2, rest in expandable section */}
                {room.features && room.features.length > 0 && (
                    <div className="space-y-2">
                        <h5 className="text-sm font-medium text-gray-700">Features:</h5>
                        <div className="flex flex-wrap gap-1">
                            {room.features.slice(0, 2).map((feature, featureIndex) => (
                                <span
                                    key={featureIndex}
                                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                                >
                                    {feature}
                                </span>
                            ))}
                        </div>
                        
                        {/* Show expand/collapse if more than 2 features */}
                        {room.features.length > 2 && (
                            <div>
                                {isExpanded && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {room.features.slice(2).map((feature, featureIndex) => (
                                            <span
                                                key={featureIndex + 2}
                                                className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                                            >
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                
                                <button
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="flex items-center gap-1 text-blue-600 text-xs hover:text-blue-700 transition-colors mt-2"
                                >
                                    {isExpanded ? (
                                        <>
                                            <span>Show less</span>
                                            <ChevronUp className="w-3 h-3" />
                                        </>
                                    ) : (
                                        <>
                                            <span>Show {room.features.length - 2} more</span>
                                            <ChevronDown className="w-3 h-3" />
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Spacer to push content to top */}
                <div className="flex-1"></div>
            </div>

            {/* Edit Room Modal */}
            {editRoom && (
                <EditRoomModal
                    room={editRoom}
                    onClose={() => setEditRoom(null)}
                    onUpdate={() => {
                        setEditRoom(null);
                        // Add any refresh logic here
                    }}
                />
            )}
        </div>
    );
};

export default RoomCard;
