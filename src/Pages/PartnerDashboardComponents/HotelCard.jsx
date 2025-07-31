import React, { useState, useRef, useEffect } from "react";
import AddRoom from "./AddRoom";
import EditHotelModal from "./EditHotelModal";
import { getRoomsByPartner } from "../../Redux/store/hotelSlice";
import { useDispatch } from "react-redux";
import RoomCard from "./RoomCard";
import { Carousel } from "primereact/carousel";

// Icon components using SVG
const IconSVG = ({ path, size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d={path} />
  </svg>
);

// Icon definitions
const icons = {
  utensils: "M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.20-1.10-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12.88 11.53z",
  bell: "M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z",
  power: "M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z",
  parking: "M6 3h6c3.31 0 6 2.69 6 6 0 2.22-1.21 4.15-3 5.19l3 2.81h-2.83l-2.31-2.16c-.51.11-1.04.16-1.86.16H8v2H6V3zm2 2v4h4c1.1 0 2-.9 2-2s-.9-2-2-2H8z",
  shirt: "M12 2l3.09 6.26L22 9l-1 5-3-1-3 7h-4l-3-7-3 1-1-5 6.91-.74L12 2z",
  userTie: "M12 4c1.93 0 3.5 1.57 3.5 3.5S13.93 11 12 11s-3.5-1.57-3.5-3.5S10.07 4 12 4zm0 14c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
  hotel: "M9 21v-6h6v6h2V9H7v12h2zm3-9c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm8-1V9c0-1.1-.9-2-2-2h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v1H6c-1.1 0-2 .9-2 2v2c1.1 0 2 .9 2 2s-.9 2-2 2v3c0 1.1.9 2 2 2h1v3h12v-3h1c1.1 0 2-.9 2-2v-3c-1.1 0-2-.9-2-2s.9-2 2-2z",
  suitcase: "M18 6V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H6c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-4zm-6-2h4v2h-4V4zm4 4v11H8V8h8z",
  firstAid: "M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z",
  video: "M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z",
  hotTub: "M7 6c1.11 0 2-.89 2-2 0-.73-.4-1.35-.99-1.69C7.9 2.11 7.78 2 7.66 2c-.2 0-.37.14-.37.37 0 .13.1.27.25.27.58 0 1.03.47 1.03 1.03C8.57 4.26 7.83 5 6.91 5c-.58 0-1.03-.47-1.03-1.03 0-.13-.1-.27-.25-.27-.2 0-.37.14-.37.37 0 .73.4 1.35.99 1.69C6.1 5.89 6.22 6 6.34 6c.2 0 .37-.14.37-.37C6.71 5.5 6.84 5.5 7 6zm5.66 0c1.11 0 2-.89 2-2 0-.73-.4-1.35-.99-1.69C13.56 2.11 13.44 2 13.32 2c-.2 0-.37.14-.37.37 0 .13.1.27.25.27.58 0 1.03.47 1.03 1.03 0 .59-.74 1.33-1.66 1.33-.58 0-1.03-.47-1.03-1.03 0-.13-.1-.27-.25-.27-.2 0-.37.14-.37.37 0 .73.4 1.35.99 1.69.15.14.27.25.39.25.2 0 .37-.14.37-.37 0-.13.13-.13.29 0zm4.5 16c.83 0 1.5-.67 1.5-1.5v-1c0-.83-.67-1.5-1.5-1.5h-11c-.83 0-1.5.67-1.5 1.5v1c0 .83.67 1.5 1.5 1.5h11zm0-6c.83 0 1.5-.67 1.5-1.5v-4c0-.83-.67-1.5-1.5-1.5h-11c-.83 0-1.5.67-1.5 1.5v4c0 .83.67 1.5 1.5 1.5h11z",
  fire: "M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.28 2.82-.2 4.25-.57 1.7-1.61 2.66-3.01 2.66-.24 0-.47-.02-.7-.07z",
  wifi: "M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.07 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z",
  couch: "M21 9V7c0-1.65-1.35-3-3-3H6C4.35 4 3 5.35 3 7v2c-1.65 0-3 1.35-3 3v5c0 .55.45 1 1 1s1-.45 1-1v-1h18v1c0 .55.45 1 1 1s1-.45 1-1v-5c0-1.65-1.35-3-3-3zm-2 0H5V7c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v2z",
  tint: "M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2C20 10.48 17.33 6.55 12 2z",
  hiking: "M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.56-.89-1.68-1.25-2.65-.84L6 8.3V13h2V9.6l1.8-.7z",
  heart: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
  users: "M16 4c0-1.11-.89-2-2-2s-2 .89-2 2 .89 2 2 2 2-.89 2-2zm4 18v-6c0-2.5-3.5-4-8-4s-8 1.5-8 4v6h16zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM7.5 6C8.33 6 9 5.33 9 4.5S8.33 3 7.5 3 6 3.67 6 4.5 6.67 6 7.5 6zm1 7.5C8.5 14.33 9.17 15 10 15s1.5-.67 1.5-1.5S10.83 12 10 12s-1.5.67-1.5 1.5zM22 20v-2c0-1.5-1.5-2.5-4-2.5-.17 0-.33.01-.5.03.58.78 1 1.63 1 2.47v2h3.5z",
  blind: "M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm9 7h-6v13h-2v-6h-2v6H9V9H3V7h18v2z",
  user: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
  userFriends: "M16 4c0-1.11-.89-2-2-2s-2 .89-2 2 .89 2 2 2 2-.89 2-2zm4 18v-6c0-2.5-3.5-4-8-4s-8 1.5-8 4v6h16zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM7.5 6C8.33 6 9 5.33 9 4.5S8.33 3 7.5 3 6 3.67 6 4.5 6.67 6 7.5 6zm1 7.5C8.5 14.33 9.17 15 10 15s1.5-.67 1.5-1.5S10.83 12 10 12s-1.5.67-1.5 1.5zM22 20v-2c0-1.5-1.5-2.5-4-2.5-.17 0-.33.01-.5.03.58.78 1 1.63 1 2.47v2h3.5z",
  paw: "M4.5 13c1.2 0 2.3-.6 2.96-1.6.65-1 1.04-2.4 1.04-3.9C8.5 5.8 6.7 4 4.5 4S.5 5.8.5 7.5c0 1.5.39 2.9 1.04 3.9C2.2 12.4 3.3 13 4.5 13zm15 0c1.2 0 2.3-.6 2.96-1.6.65-1 1.04-2.4 1.04-3.9C23.5 5.8 21.7 4 19.5 4S15.5 5.8 15.5 7.5c0 1.5.39 2.9 1.04 3.9.66 1 1.76 1.6 2.96 1.6zm-7.5 1.5c1.93 0 3.5-1.57 3.5-3.5S14.43 7.5 12.5 7.5 9 9.07 9 11s1.57 3.5 3.5 3.5zm0 1c-2.33 0-7 1.17-7 3.5V20h14v-1.5c0-2.33-4.67-3.5-7-3.5z",
  child: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2 2.9.23 5.09 2.52 5.48 5.36L18 14.5c-.55 0-1 .45-1 1v1.89z",
  chevronDown: "M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z",
  chevronUp: "M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z",
  landmark: "M12 2L2 7v1h20V7L12 2zm-8 6v11h16V8H4zm2 2h12v7H6v-7z",
  tree: "M16.5 12c1.38 0 2.49-1.12 2.49-2.5S17.88 7 16.5 7c-.39 0-.76.11-1.08.29C14.85 6.53 14.02 6 13 6s-1.85.53-2.42 1.29C10.26 7.11 9.89 7 9.5 7 8.12 7 7.01 8.12 7.01 9.5S8.12 12 9.5 12h7zm-1 1H8.5v7h2v-3h3v3h2v-7z",
  water: "M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2C20 10.48 17.33 6.55 12 2z",
  shoppingBag: "M19 7h-3V6c0-2.76-2.24-5-5-5S6 3.24 6 6v1H3c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM8 6c0-1.66 1.34-3 3-3s3 1.34 3 3v1H8V6zm0 3h2v2c0 .55.45 1 1 1s1-.45 1-1V9h2v2c0 .55.45 1 1 1s1-.45 1-1V9h2l-1 9H7l-1-9h2z",
  university: "M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z",
  binoculars: "M19.5 8c-.8 0-1.5.7-1.5 1.5v1.64l-1-.64L19.5 8zm-15 0L7 10.5l-1 .64V9.5C6 8.7 5.3 8 4.5 8zM12 11L7.5 8h1L12 10.5 15.5 8h1L12 11zm7.5 2.5c.8 0 1.5-.7 1.5-1.5s-.7-1.5-1.5-1.5S18 11.2 18 12s.7 1.5 1.5 1.5zm-15 0C5.3 13.5 6 12.8 6 12s-.7-1.5-1.5-1.5S3 11.2 3 12s.7 1.5 1.5 1.5z",
  star: "M12 2l3.09 6.26L22 9l-5 4.87 1.18 6.88L12 17.77l-6.18 2.98L7 14.87 2 9l6.91-1.09L12 2z",
  edit: "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",
  plus: "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z",
  location: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
  play: "M8 5v14l11-7z",
  pause: "M6 19h4V5H6v14zm8-14v14h4V5h-4z",
  campfire: "M12 2c-1.5 0-2.5 1-2.5 2.5 0 .8.3 1.5.8 2-.8.3-1.3 1.1-1.3 2 0 1.2.8 2.2 2 2.5v9c0 1.1.9 2 2 2s2-.9 2-2v-9c1.2-.3 2-1.3 2-2.5 0-.9-.5-1.7-1.3-2 .5-.5.8-1.2.8-2C14.5 3 13.5 2 12 2z"
};

// Create icon components
const FaUtensils = (props) => <IconSVG path={icons.utensils} {...props} />;
const FaConciergeBell = (props) => <IconSVG path={icons.bell} {...props} />;
const FaParking = (props) => <IconSVG path={icons.parking} {...props} />;
const FaTshirt = (props) => <IconSVG path={icons.shirt} {...props} />;
const FaUserTie = (props) => <IconSVG path={icons.userTie} {...props} />;
const FaHotel = (props) => <IconSVG path={icons.hotel} {...props} />;
const FaSuitcase = (props) => <IconSVG path={icons.suitcase} {...props} />;
const FaFirstAid = (props) => <IconSVG path={icons.firstAid} {...props} />;
const FaVideo = (props) => <IconSVG path={icons.video} {...props} />;
const FaHotTub = (props) => <IconSVG path={icons.hotTub} {...props} />;
const FaFire = (props) => <IconSVG path={icons.fire} {...props} />;
const FaWifi = (props) => <IconSVG path={icons.wifi} {...props} />;
const FaCouch = (props) => <IconSVG path={icons.couch} {...props} />;
const FaTint = (props) => <IconSVG path={icons.tint} {...props} />;
const FaHiking = (props) => <IconSVG path={icons.hiking} {...props} />;
const FaHeart = (props) => <IconSVG path={icons.heart} {...props} />;
const FaUsers = (props) => <IconSVG path={icons.users} {...props} />;
const FaBlind = (props) => <IconSVG path={icons.blind} {...props} />;
const FaUser = (props) => <IconSVG path={icons.user} {...props} />;
const FaUserFriends = (props) => <IconSVG path={icons.userFriends} {...props} />;
const FaPaw = (props) => <IconSVG path={icons.paw} {...props} />;
const FaChild = (props) => <IconSVG path={icons.child} {...props} />;
const FaChevronDown = (props) => <IconSVG path={icons.chevronDown} {...props} />;
const FaChevronUp = (props) => <IconSVG path={icons.chevronUp} {...props} />;
const FaLandmark = (props) => <IconSVG path={icons.landmark} {...props} />;
const FaTree = (props) => <IconSVG path={icons.tree} {...props} />;
const FaWater = (props) => <IconSVG path={icons.water} {...props} />;
const FaShoppingBag = (props) => <IconSVG path={icons.shoppingBag} {...props} />;
const FaUniversity = (props) => <IconSVG path={icons.university} {...props} />;
const FaBinoculars = (props) => <IconSVG path={icons.binoculars} {...props} />;
const FaStar = (props) => <IconSVG path={icons.star} {...props} />;
const FaEdit = (props) => <IconSVG path={icons.edit} {...props} />;
const FaPlus = (props) => <IconSVG path={icons.plus} {...props} />;
const FaPlay = (props) => <IconSVG path={icons.play} {...props} />;
const FaPause = (props) => <IconSVG path={icons.pause} {...props} />;
const MdPower = (props) => <IconSVG path={icons.power} {...props} />;
const GiCampfire = (props) => <IconSVG path={icons.campfire} {...props} />;
const IoLocationSharp = (props) => <IconSVG path={icons.location} {...props} />;

const amenitiesList = [
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

const tagsList = [
  { label: "Backpackers", icon: <FaHiking /> },
  { label: "Couple Friendly", icon: <FaHeart /> },
  { label: "Family Friendly", icon: <FaUsers /> },
  { label: "Senior Citizen Friendly", icon: <FaBlind /> },
  { label: "Solo Traveler Friendly", icon: <FaUser /> },
  { label: "Group Friendly", icon: <FaUserFriends /> },
  { label: "Pet Friendly", icon: <FaPaw /> },
  { label: "Child Friendly", icon: <FaChild /> },
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

// Mock components for demo
// const AddRoom = ({ hotelId, setHotelPresent, setCounter }) => (
//   <div className="p-8 w-96">
//     <h2 className="text-2xl font-bold mb-4 text-gray-800">Add Room</h2>
//     <p className="text-gray-600 mb-4">Hotel ID: {hotelId}</p>
//     <div className="flex gap-2">
//       <button 
//         onClick={() => { setHotelPresent(); setCounter(); }}
//         className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//       >
//         Save
//       </button>
//       <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
//         Cancel
//       </button>
//     </div>
//   </div>
// );

// const EditHotelModal = ({ hotel, onClose, setCounter }) => (
//   <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50">
//     <div className="bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto p-8 w-96">
//       <h2 className="text-2xl font-bold mb-4 text-gray-800">Edit Hotel</h2>
//       <p className="text-gray-600 mb-4">Hotel: {hotel.name}</p>
//       <div className="flex gap-2">
//         <button 
//           onClick={() => { setCounter(); onClose(); }}
//           className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//         >
//           Update
//         </button>
//         <button 
//           onClick={onClose}
//           className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
//         >
//           Cancel
//         </button>
//       </div>
//     </div>
//   </div>
// );

const MediaCarousel = ({ images, videoUrl }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef(null);

  const validImages = images?.filter(
    (url) => url && url !== "null" && url !== "undefined" && url.trim() !== ""
  ) || [];

  const validVideoUrl =
    videoUrl &&
      videoUrl !== null &&
      videoUrl !== undefined &&
      videoUrl !== "null" &&
      videoUrl !== "undefined" &&
      videoUrl.trim() !== ""
      ? videoUrl
      : null;

  const slides = [...validImages];
  if (validVideoUrl) {
    slides.push(validVideoUrl);
  }

  const totalSlides = slides.length;
  const showCarousel = totalSlides > 1;

  const toggleVideoPlay = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  if (totalSlides === 0) {
    return (
      <div className="w-full h-64 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center">
        <p className="text-gray-500">No media available</p>
      </div>
    );
  }

  const currentSlide = slides[currentIndex];
  const isVideo = currentSlide === validVideoUrl;

  return (
    <div className="relative w-full h-64 rounded-xl overflow-hidden group">
      {isVideo ? (
        <div className="relative w-full h-full">
          <video
            ref={videoRef}
            src={currentSlide}
            className="w-full h-full object-cover"
            onPlay={() => setIsVideoPlaying(true)}
            onPause={() => setIsVideoPlaying(false)}
          />
          <button
            onClick={toggleVideoPlay}
            className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors"
          >
            <div className="bg-white/90 rounded-full p-3 hover:bg-white transition-colors">
              {isVideoPlaying ? (
                <FaPause className="text-gray-800 text-xl" />
              ) : (
                <FaPlay className="text-gray-800 text-xl ml-1" />
              )}
            </div>
          </button>
        </div>
      ) : (
        <img
          src={currentSlide}
          alt="Hotel"
          className="w-full h-full object-cover"
        />
      )}

      {showCarousel && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <FaChevronUp className="rotate-[-90deg] text-gray-800" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <FaChevronUp className="rotate-90 text-gray-800" />
          </button>

          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? 'bg-white' : 'bg-white/50'
                  }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const roomTemplate = (room) => (
  <div className="px-2">
    <RoomCard room={room} />
  </div>
);

const HotelCard = ({ hotel = {}, setCounter }) => {
  const [expanded, setExpanded] = useState(false);
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [roomModal, setRoomModal] = useState(false);
  const [showAllRooms, setShowAllRooms] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [roomCounter, setRoomCounter] = useState(false);
  const backdropRef = useRef();
  const [rooms, setRooms] = useState([]);
  const dispatch = useDispatch();
  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current) {
      setRoomModal(false);
    }
  };

  // Get amenity details with icons
  const getAmenityWithIcon = (amenity) => {
    const amenityDetail = amenitiesList.find(a => a.id === amenity.id);
    return amenityDetail || { icon: <FaStar />, label: amenity.name };
  };

  // Get tag details with icons
  const getTagWithIcon = (tagName) => {
    const tagDetail = tagsList.find(t => t.label === tagName);
    return tagDetail || { icon: <FaStar />, label: tagName };
  };

  // Get attraction icon
  const getAttractionIcon = (type) => {
    const attraction = attractionTypes.find(a => a.type === type);
    return attraction?.icon || <FaStar />;
  };

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
  }, [roomCounter])

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 max-w-full">
        {/* Header Section */}
        <div className="p-6">
          {/* Media Carousel */}
          <div className="pb-4">
            <MediaCarousel images={hotel.imageUrls} videoUrl={hotel.videoUrl} />
          </div>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{hotel.name || 'Hotel Name'}</h2>
              <div className="flex items-center text-gray-600 mb-2">
                <IoLocationSharp className="mr-2 text-red-500" />
                <span className="text-sm">
                  {hotel.address || ''}{hotel.location?.area ? `, ${hotel.location.area}` : ''}{hotel.location?.city ? `, ${hotel.location.city}` : ''}{hotel.location?.state ? `, ${hotel.location.state}` : ''}{hotel.location?.pincode ? ` - ${hotel.location.pincode}` : ''}
                </span>
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => setRoomModal(true)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                title="Add Room"
              >
                <FaPlus className="text-sm" />
              </button>
              <button
                onClick={() => setShowEditModal(true)}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white p-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg"
                title="Edit Hotel"
              >
                <FaEdit className="text-sm" />
              </button>
            </div>
          </div>

          {/* About Section */}
          <div className="pt-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">About</h3>
            <div className="space-y-2">
              <p className="text-gray-700 leading-relaxed">
                {hotel.about ? (
                  aboutExpanded
                    ? hotel.about
                    : hotel.about.length > 150
                      ? `${hotel.about.substring(0, 150)}...`
                      : hotel.about
                ) : 'No description available'}
              </p>
              {hotel.about && hotel.about.length > 150 && (
                <button
                  onClick={() => setAboutExpanded(!aboutExpanded)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                >
                  {aboutExpanded ? 'Show less' : 'Show more'}
                </button>
              )}
            </div>
          </div>

          {/* Amenities Preview */}
          <div className="pt-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {hotel.amenities && hotel.amenities.length > 0 ? (
                <>
                  {hotel.amenities.slice(0, expanded ? hotel.amenities.length : 4).map((amenity, index) => {
                    const amenityDetail = getAmenityWithIcon(amenity);
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 px-3 py-2 rounded-full text-sm border border-blue-100"
                      >
                        <span className="text-blue-600">{amenityDetail.icon}</span>
                        <span className="font-medium">{amenityDetail.label}</span>
                      </div>
                    );
                  })}
                  {!expanded && hotel.amenities.length > 4 && (
                    <div className="bg-gray-100 text-gray-600 px-3 py-2 rounded-full text-sm">
                      +{hotel.amenities.length - 4} more
                    </div>
                  )}
                </>
              ) : (
                <div className="text-gray-500 text-sm">No amenities listed</div>
              )}
            </div>
          </div>

          {/* Tags Preview */}
          <div className="pt-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {hotel.tags && hotel.tags.length > 0 ? (
                <>
                  {hotel.tags.slice(0, expanded ? hotel.tags.length : 3).map((tag, index) => {
                    const tagDetail = getTagWithIcon(tag);
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 px-3 py-2 rounded-full text-sm border border-purple-100"
                      >
                        <span className="text-purple-600">{tagDetail.icon}</span>
                        <span className="font-medium">{tagDetail.label}</span>
                      </div>
                    );
                  })}
                  {!expanded && hotel.tags.length > 3 && (
                    <div className="bg-gray-100 text-gray-600 px-3 py-2 rounded-full text-sm">
                      +{hotel.tags.length - 3} more
                    </div>
                  )}
                </>
              ) : (
                <div className="text-gray-500 text-sm">No tags available</div>
              )}
            </div>
          </div>

          {/* Expand/Collapse Button */}
          <div className="pt-6 flex justify-center">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 px-6 py-3 rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <span className="font-medium">
                {expanded ? 'Show Less' : 'Show More'}
              </span>
              {expanded ? (
                <FaChevronUp className="text-sm" />
              ) : (
                <FaChevronDown className="text-sm" />
              )}
            </button>
          </div>
        </div>

        {/* Expanded Content */}
        {expanded && (
          <div className="border-t border-gray-100 p-6 bg-gradient-to-br from-gray-50 to-white">
            {/* Nearby Attractions */}
            {hotel.nearbyAttractions && hotel.nearbyAttractions.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Nearby Attractions</h3>
                <div className="grid gap-3">
                  {hotel.nearbyAttractions.map((attraction, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm border border-gray-100"
                    >
                      <div className="text-orange-500 text-lg">
                        {getAttractionIcon(attraction.type)}
                      </div>
                      <div className="flex-1">
                        <span className="font-medium text-gray-800">{attraction.name || 'Unknown Attraction'}</span>
                        {attraction.distance && (
                          <span className="text-gray-500 text-sm ml-2">
                            ({attraction.distance})
                          </span>
                        )}
                      </div>
                      <div className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                        {(attraction.type || 'other').toLowerCase()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Complete Amenities List (when expanded) */}
            {expanded && hotel.amenities && hotel.amenities.length > 4 && (

              <div className="pt-2">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">All Amenities</h3>
                <div className="grid grid-cols-2 gap-2">
                  {hotel.amenities.slice(4).map((amenity, index) => {
                    const amenityDetail = getAmenityWithIcon(amenity);
                    return (
                      <div
                        key={index + 4}
                        className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm border border-gray-100"
                      >
                        <span className="text-blue-600">{amenityDetail.icon}</span>
                        <span className="text-gray-800 text-sm font-medium">{amenityDetail.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="border-t border-gray-100 pt-6 max-w-full">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Rooms ({rooms.length})</h3>
              </div>

              {rooms.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No rooms available</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rooms.map((room, index) => (
                    <RoomCard key={room.id || index} room={room} />
                  ))}
                </div>
                // <div className="space-y-6">
                //   {(showAllRooms ? rooms : rooms.slice(0, 3)).map((room, index) => (
                //     <RoomCard key={room.id || index} room={room} />
                //   ))}

                //   {rooms.length > 3 && (
                //     <div className="flex justify-center mt-4">
                //       <button
                //         onClick={() => setShowAllRooms(!showAllRooms)}
                //         className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                //       >
                //         {showAllRooms ? "Show Less" : `Show All ${rooms.length} Rooms`}
                //       </button>
                //     </div>
                //   )}
                // </div>

              )}

            </div>
          </div>
        )}
      </div>

      {/* Add Room Modal */}
      {roomModal && (
        <div
          ref={backdropRef}
          onClick={handleBackdropClick}
          className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto p-6"
          >
            <AddRoom
              hotelId={hotel.id || 'unknown'}
              setHotelPresent={() => setRoomModal(false)}
              setCounter={() => setRoomCounter(!roomCounter)}
            />
          </div>
        </div>
      )}

      {/* Edit Hotel Modal */}
      {showEditModal && (
        <EditHotelModal
          hotel={hotel}
          onClose={() => setShowEditModal(false)}
          setCounter={setCounter}
        />
      )}
    </>
  );
};

export default HotelCard;