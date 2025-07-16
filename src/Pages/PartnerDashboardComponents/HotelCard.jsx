import React, { useState, useRef, useEffect } from "react";
import {
  FaUtensils, FaConciergeBell, FaParking, FaTshirt, FaUserTie,
  FaHotel, FaSuitcase, FaFirstAid, FaVideo, FaHotTub, FaFire, FaWifi,
  FaCouch, FaTint, FaHiking, FaHeart, FaUsers, FaBlind,
  FaUser, FaUserFriends, FaPaw, FaChild, FaChevronDown, FaChevronUp,
  FaLandmark,
  FaTree,
  FaWater,
  FaShoppingBag,
  FaUniversity,
  FaBinoculars,
  FaStar
} from "react-icons/fa";
import { MdPower } from "react-icons/md";
import { GiCampfire } from "react-icons/gi";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { IoLocationSharp } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { getRoomsByPartner } from "../../Redux/store/hotelSlice";
import RoomCard from "./RoomCard";

const amenitiesList = [
  { id: 1, label: "On-site Restaurant / Kitchen", icon: <FaUtensils /> },
  { id: 2, label: "Room Service", icon: <FaConciergeBell /> },
  { id: 3, label: "Power Backup", icon: <MdPower /> },
  { id: 4, label: "Parking Facility", icon: <FaParking /> },
  { id: 5, label: "Laundry Service", icon: <FaTshirt /> },
  { id: 6, label: "Caretaker on Site", icon: <FaUserTie /> },
  { id: 7, label: "Reception", icon: <FaHotel /> },
  { id: 8, label: "Luggage Storage", icon: <FaSuitcase /> },
  { id: 9, label: "First Aid Kit", icon: <FaFirstAid /> },
  { id: 10, label: "CCTV Surveillance", icon: <FaVideo /> },
  { id: 11, label: "Hot Water", icon: <FaHotTub /> },
  { id: 12, label: "Room Heater", icon: <FaFire /> },
  { id: 13, label: "Wi-Fi", icon: <FaWifi /> },
  { id: 14, label: "Bonfire Facility", icon: <GiCampfire /> },
  { id: 15, label: "Seating Area", icon: <FaCouch /> },
  { id: 16, label: "Water Purifier", icon: <FaTint /> },
];

const tagsList = [
  { id: 1, label: "Backpackers", icon: <FaHiking /> },
  { id: 2, label: "Couple Friendly", icon: <FaHeart /> },
  { id: 3, label: "Family Friendly", icon: <FaUsers /> },
  { id: 4, label: "Senior Citizen Friendly", icon: <FaBlind /> },
  { id: 5, label: "Solo Traveler Friendly", icon: <FaUser /> },
  { id: 6, label: "Group Friendly", icon: <FaUserFriends /> },
  { id: 7, label: "Pet Friendly", icon: <FaPaw /> },
  { id: 8, label: "Child Friendly", icon: <FaChild /> },
];

const attractionTypes = [
  { type: "MONUMENT", icon: <FaLandmark /> },
  { type: "PARK", icon: <FaTree /> },
  { type: "LAKE", icon: <FaWater /> },
  { type: "MARKET", icon: <FaShoppingBag /> },
  { type: "MUSEUM", icon: <FaUniversity /> },
  { type: "VIEWPOINT", icon: <FaBinoculars /> },
  { type: "OTHER", icon: <FaStar /> },
];

const HotelCard = ({ hotel }) => {
  const [expanded, setExpanded] = useState(false);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [rooms, setRooms] = useState([])
  const dispatch = useDispatch()
  useEffect(() => {
    console.log(hotel.id)
    const job = async () => {
      const token = localStorage.getItem("token")
      const res = await dispatch(getRoomsByPartner({ partnerId: hotel.id, token: token }))
      console.log(hotel.imageUrls, " For Hotel ", hotel.id)
      if (res.payload.status == 200) {
        console.log(res.payload.data)
        setRooms(res.payload.data);
      }
    }
    job()
  }, [])


  const getAmenityIcon = (name) => {
    const match = amenitiesList.find((item) => item.label === name);
    return match ? match.icon : null;
  };

  const getTagIcon = (name) => {
    const match = tagsList.find((item) => item.label === name);
    return match ? match.icon : null;
  };
  const getAttractionIcon = (type) => {
    const match = attractionTypes.find((item) => item.type === type);
    return match ? match.icon : <FaStar />;
  };


  const toggleVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const validImages = hotel.imageUrls?.filter(
    (url) => url && url !== "null" && url !== "undefined" && url.trim() !== ""
  );
  const validVideoUrl =
    hotel.videoUrl &&
      hotel.videoUrl !== null &&
      hotel.videoUrl !== undefined &&
      hotel.videoUrl !== "null" &&
      hotel.videoUrl !== "undefined" &&
      hotel.videoUrl.trim() !== ""
      ? hotel.videoUrl
      : null;
  const slides = [...validImages];

  if (validVideoUrl) {
    slides.push(validVideoUrl);
  }



  return (
    <div className="w-full p-4 flex justify-center">
      <div className="bg-white rounded-xl shadow-lg w-full overflow-hidden transition-all duration-500">

        {/* Combined Carousel */}
        {slides.length > 1 ? (
          <Carousel
            showThumbs={false}
            showStatus={false}
            infiniteLoop
            autoPlay
            interval={3000}
            className="w-full"
          >
            {validImages.map((url, idx) => (
              <div key={`img-${idx}`}>
                <img src={url} alt={`Hotel ${idx}`} className="w-full h-72 object-cover" />
              </div>
            ))}

            {validVideoUrl && (
              <div key="video" className="relative group cursor-pointer" onClick={toggleVideo}>
                <video
                  ref={videoRef}
                  src={validVideoUrl}
                  className="w-full h-72 object-cover"
                  autoPlay
                  muted
                  loop
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-sm font-medium">
                  {isPlaying ? "Click to Pause" : "Click to Play"}
                </div>
              </div>
            )}
          </Carousel>
        ) : (
          <>
            {validImages.length === 1 && (
              <img src={validImages[0]} alt="Hotel" className="w-full h-72 object-cover" />
            )}
            {validVideoUrl && validImages.length === 0 && (
              <video
                ref={videoRef}
                src={validVideoUrl}
                className="w-full h-72 object-cover"
                autoPlay
                muted
                loop
              />
            )}
          </>
        )}




        {/* Hotel info */}
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-800">{hotel.name}</h2>
          <p className="text-gray-500 text-sm pt-1">{hotel.address}</p>
          <p className="pt-2 text-gray-700 text-sm">{hotel.about}</p>

          <div className="flex flex-wrap gap-2 pt-4">
            {hotel.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
              >
                {getTagIcon(tag)}
                {tag}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {hotel.amenities.slice(0, 3).map((a, idx) => (
              <span
                key={idx}
                className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
              >
                {getAmenityIcon(a.name)}
                {a.name}
              </span>
            ))}
          </div>

          <div className={`flex justify-center  ${expanded ? ` border-b border-gray-300 py-6` : `pt-6`} `}>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 px-4 py-2 rounded-full text-blue-700 text-sm cursor-pointer transition-all"
            >
              {expanded ? "Hide Details" : "Show Details"}
              {expanded ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          </div>
        </div>

        {/* Expanded details */}
        <div
          className={`px-6 pb-6 space-y-4 transition-all duration-500 ease-in-out ${expanded ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"
            }`}
        >
          <div>
            <div className="flex gap-[2px] items-center">
              <IoLocationSharp className="text-red-500" />
              <h3 className="font-semibold text-gray-700">Location</h3>
            </div>
            <p className="text-gray-600 text-sm">
              {hotel.location.area}, {hotel.location.city}, {hotel.location.district}, {hotel.location.state}, {hotel.location.pincode}
            </p>
          </div>



          <div>
            <h3 className="font-semibold text-gray-700 pt-5">Amenities</h3>
            <div className="grid grid-cols-4 gap-2 pt-2">
              {hotel.amenities.map((a, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-1 px-3 py-3 rounded-full text-xs font-medium"
                >
                  <div className="text-xl text-blue-700 p-1 rounded-xl bg-blue-100">

                    {getAmenityIcon(a.name)}
                  </div>
                  <div className="truncate">
                    {a.name}
                  </div>
                </span>
              ))}
            </div>
          </div>


          <div>
            <h3 className="font-semibold text-gray-700 pt-5">Tags</h3>
            <div className="flex flex-wrap gap-2 pt-2">
              {hotel.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
                >
                  {getTagIcon(tag)}
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {hotel.nearbyAttractions && hotel.nearbyAttractions.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-700 pt-5">Nearby Attractions</h3>
              <div className=" grid grid-cols-1 md:grid-cols-1 gap-2 pt-2">
                {hotel.nearbyAttractions.map((attraction, idx) => (
                  <div
                    key={idx}
                    className="w-full flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg"
                  >
                    <div className="text-xl text-blue-700 p-1 rounded-md bg-blue-100 flex-shrink-0">
                      {getAttractionIcon(attraction.type)}
                    </div>
                    <div className="truncate text-gray-700 text-sm" title={attraction.name}>
                      {attraction.name}
                      <span className="block text-gray-500 text-[10px]">
                        {attraction.distance}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {rooms.length > 0 && (
            <div className="pt-4">
              <h3 className="font-semibold text-gray-700 mb-2">Available Rooms</h3>
              <RoomCard rooms={rooms} />
            </div>
          )}
        </div>
      </div>
    </div>

  );
};

export default HotelCard;
