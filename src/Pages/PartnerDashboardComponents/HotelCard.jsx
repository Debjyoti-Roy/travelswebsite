import React, { useState } from "react";
import {
  FaUtensils, FaConciergeBell, FaParking, FaTshirt, FaUserTie,
  FaHotel, FaSuitcase, FaFirstAid, FaVideo, FaHotTub, FaFire, FaWifi,
   FaCouch, FaTint, FaHiking, FaHeart, FaUsers, FaBlind,
  FaUser, FaUserFriends, FaPaw, FaChild
} from "react-icons/fa";
import {MdPower} from "react-icons/md"
import {GiCampfire} from "react-icons/gi"
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

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

const HotelCard = ({ hotel }) => {
  const [expanded, setExpanded] = useState(false);

  const getAmenityIcon = (name) => {
    const match = amenitiesList.find((item) => item.label === name);
    return match ? match.icon : null;
  };

  const getTagIcon = (name) => {
    const match = tagsList.find((item) => item.label === name);
    return match ? match.icon : null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 w-full max-w-3xl mx-auto">
      <Carousel
        showThumbs={false}
        showStatus={false}
        infiniteLoop
        className="rounded-xl overflow-hidden"
      >
        {hotel.imageUrls.map((url, idx) => (
          <div key={idx}>
            <img src={url} alt={`Hotel Image ${idx}`} className="h-64 object-cover w-full" />
          </div>
        ))}
      </Carousel>

      <h2 className="text-2xl font-bold mt-4">{hotel.name}</h2>
      <p className="text-gray-600">{hotel.address}</p>
      <p className="mt-2 text-gray-700">{hotel.about}</p>

      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-4 text-blue-600 hover:underline transition-all"
      >
        {expanded ? "Hide Details" : "Show Details"}
      </button>

      {expanded && (
        <div className="mt-4 space-y-2">
          <div className="p-2 bg-gray-50 rounded-lg shadow-inner">
            <h3 className="font-semibold">Location</h3>
            <p>
              {hotel.location.area}, {hotel.location.city}, {hotel.location.district}, {hotel.location.state}, {hotel.location.pincode}
            </p>
          </div>

          <div className="p-2 bg-gray-50 rounded-lg shadow-inner">
            <h3 className="font-semibold">Latitude & Longitude</h3>
            <p>Lat: {hotel.latitude}, Lng: {hotel.longitude}</p>
          </div>

          {hotel.videoUrl && (
            <div className="p-2 bg-gray-50 rounded-lg shadow-inner">
              <h3 className="font-semibold">Video</h3>
              <video controls className="w-full rounded">
                <source src={hotel.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          <div className="p-2 bg-gray-50 rounded-lg shadow-inner">
            <h3 className="font-semibold">Amenities</h3>
            <div className="flex flex-wrap gap-2 mt-1">
              {hotel.amenities.map((a, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm shadow-sm"
                >
                  {getAmenityIcon(a.name)}
                  {a.name}
                </span>
              ))}
            </div>
          </div>

          <div className="p-2 bg-gray-50 rounded-lg shadow-inner">
            <h3 className="font-semibold">Tags</h3>
            <div className="flex flex-wrap gap-2 mt-1">
              {hotel.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm shadow-sm"
                >
                  {getTagIcon(tag)}
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {hotel.nearbyAttractions && hotel.nearbyAttractions.length > 0 && (
            <div className="p-2 bg-gray-50 rounded-lg shadow-inner">
              <h3 className="font-semibold">Nearby Attractions</h3>
              {hotel.nearbyAttractions.map((attraction, idx) => (
                <p key={idx}>
                  {attraction.name} ({attraction.type}) - {attraction.distance}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HotelCard;
