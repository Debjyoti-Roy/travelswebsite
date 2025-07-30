import {
    FaUtensils, FaConciergeBell, FaParking, FaTshirt, FaUserTie,
    FaHotel, FaSuitcase, FaFirstAid, FaVideo, FaHotTub, FaFire, FaWifi,
    FaCouch, FaTint, FaHiking, FaHeart, FaUsers, FaBlind,
    FaUser, FaUserFriends, FaPaw, FaChild, FaLandmark,
    FaTree, FaWater, FaShoppingBag, FaUniversity, FaBinoculars, FaStar
  } from "react-icons/fa";
  import { MdPower } from "react-icons/md";
  import { GiCampfire } from "react-icons/gi";
  
  export const amenitiesList = [
    { id: "1", label: "On-site Restaurant / Kitchen", icon: <FaUtensils /> },
    { id: "2", label: "Room Service", icon: <FaConciergeBell /> },
    { id: "3", label: "Power Backup", icon: <MdPower /> },
    { id: "4", label: "Parking Facility", icon: <FaParking /> },
    { id: "5", label: "Laundry Service", icon: <FaTshirt /> },
    { id: "6", label: "Caretaker on Site", icon: <FaUserTie /> },
    { id: "7", label: "Reception", icon: <FaHotel /> },
    { id: "8", label: "Luggage Storage", icon: <FaSuitcase /> },
    { id: "9", label: "First Aid Kit", icon: <FaFirstAid /> },
    { id: "10", label: "CCTV Surveillance", icon: <FaVideo /> },
    { id: "11", label: "Hot Water", icon: <FaHotTub /> },
    { id: "12", label: "Room Heater", icon: <FaFire /> },
    { id: "13", label: "Wi-Fi", icon: <FaWifi /> },
    { id: "14", label: "Bonfire Facility", icon: <GiCampfire /> },
    { id: "15", label: "Seating Area", icon: <FaCouch /> },
    { id: "16", label: "Water Purifier", icon: <FaTint /> },
  ];
  
  export const tagsList = [
    { id: 1, label: "Backpackers", icon: <FaHiking /> },
    { id: 2, label: "Couple Friendly", icon: <FaHeart /> },
    { id: 3, label: "Family Friendly", icon: <FaUsers /> },
    { id: 4, label: "Senior Citizen Friendly", icon: <FaBlind /> },
    { id: 5, label: "Solo Traveler Friendly", icon: <FaUser /> },
    { id: 6, label: "Group Friendly", icon: <FaUserFriends /> },
    { id: 7, label: "Pet Friendly", icon: <FaPaw /> },
    { id: 8, label: "Child Friendly", icon: <FaChild /> },
  ];
  