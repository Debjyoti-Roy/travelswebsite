import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { bookRooms, fetchHotel } from '../Redux/store/hotelSlice';
import { IoIosInformationCircleOutline } from "react-icons/io";
import { FaCalendar, FaChevronLeft, FaChevronRight, FaConciergeBell, FaCouch, FaFire, FaFirstAid, FaHotel, FaHotTub, FaParking, FaSuitcase, FaTint, FaTshirt, FaUsers, FaUserTie, FaUtensils, FaVideo, FaWifi } from 'react-icons/fa';
import { MdAccessTime, MdAutorenew, MdOutlineCancel, MdPower, MdSupportAgent, MdVerified } from 'react-icons/md';
import { GiCampfire } from 'react-icons/gi';
import DatePicker from 'react-datepicker';
import {
  MdLocationCity,
  MdPark,
  MdWater,
  MdShoppingCart,
  MdMuseum,
  MdLandscape,
  MdPlace
} from "react-icons/md";
import { auth, provider } from '../auth/firebase';
import { signInWithPopup } from 'firebase/auth';
import { fetchUserProfile, registerUser } from '../Redux/store/userSlice';
import toast from 'react-hot-toast';
import LoginModal from '../Components/LoginModal';
import { confirmPayment } from '../Redux/store/paymentSlice';
import PaymentSuccessfullModal from './ModalComponent/PaymentSuccessfullModal';
import PaymentFailedModal from './ModalComponent/PaymentFailModal';
import ShareButton from '../Components/ShareButton';
import ImageGallery from './HotelDetailsComponents/ImageGallery';
import { Skeleton } from '@mui/material';

const iconMap = {
  MONUMENT: MdLocationCity,
  PARK: MdPark,
  LAKE: MdWater,
  MARKET: MdShoppingCart,
  MUSEUM: MdMuseum,
  VIEWPOINT: MdLandscape,
  OTHER: MdPlace
};

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



const CustomDateInput = React.forwardRef(({ value, onClick, placeholder }, ref) => (
  <div
    onClick={onClick}
    ref={ref}
    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-lg cursor-pointer flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <FaCalendar className="absolute left-3 text-blue-500 w-5 h-5" />
    <span className={value ? "text-black" : "text-gray-400"}>
      {value || placeholder}
    </span>
  </div>
));

// const allocateRooms = (rooms, totalPeople) => {
//   const sortedRooms = [...rooms].sort((a, b) => b.maxOccupancy - a.maxOccupancy);
//   let assignedPeople = 0;
//   const selectedMap = {};

//   for (const room of sortedRooms) {
//     let available = room.totalRooms;
//     while (assignedPeople < totalPeople && available > 0) {
//       if (!selectedMap[room.id]) {
//         selectedMap[room.id] = { room, count: 1 };
//       } else {
//         selectedMap[room.id].count++;
//       }
//       assignedPeople += room.maxOccupancy;
//       available--;
//     }
//   }

//   if (assignedPeople < totalPeople) return null;

//   return Object.values(selectedMap);
// };
const allocateRooms_func = (rooms, totalPeople) => {
  console.log("ROOOOMMM  ISSSS", rooms)
  if (rooms === undefined || !rooms.length) return null;
  console.log(rooms)
  console.log(totalPeople)
  const sortedRooms = [...rooms].sort((a, b) => b.maxOccupancy - a.maxOccupancy);
  let remainingPeople = totalPeople;
  const selectedMap = {};

  for (const room of sortedRooms) {
    let available = room.totalRooms;

    while (remainingPeople > 0 && available > 0) {
      if (!selectedMap[room.id]) {
        selectedMap[room.id] = { room, count: 1 };
      } else {
        selectedMap[room.id].count++;
      }
      remainingPeople -= room.maxOccupancy;
      available--;
    }

    if (remainingPeople <= 0) break;
  }

  return remainingPeople <= 0 ? Object.values(selectedMap) : null;
};



//if(allocateRooms_func(filteredRooms, totalPeople)===null){
//    return allocateRooms(hotel.rooms, totalPeople)
//}else{  return  allocateRooms(filteredRooms, totalPeople); }



const RoomSelectionTable = ({ hotelRooms, numberofDays, totalPeople, handleBookNow }) => {
  const [selectedRooms, setSelectedRooms] = useState({});
  const [imageIndexes, setImageIndexes] = useState({});

  const handleRoomChange = (roomId, value, maxAvailable) => {
    let num = parseInt(value, 10);
    if (isNaN(num) || num < 0) num = 0;
    if (num > maxAvailable) num = maxAvailable;
    setSelectedRooms((prev) => ({ ...prev, [roomId]: num }));
  };

  const handleNextImage = (roomId, total) => {
    setImageIndexes((prev) => ({
      ...prev,
      [roomId]: (prev[roomId] || 0) + 1 >= total ? 0 : (prev[roomId] || 0) + 1,
    }));
  };

  const handlePrevImage = (roomId, total) => {
    setImageIndexes((prev) => ({
      ...prev,
      [roomId]: (prev[roomId] || 0) - 1 < 0 ? total - 1 : (prev[roomId] || 0) - 1,
    }));
  };

  const summary = useMemo(() => {
    let totalCost = 0;
    let totalCapacity = 0;

    hotelRooms.forEach((room) => {
      const count = selectedRooms[room.id] || 0;
      totalCost += room.pricePerNight * count * numberofDays;
      totalCapacity += room.maxOccupancy * count;
    });

    return { totalCost, totalCapacity };
  }, [selectedRooms, hotelRooms, numberofDays]);

  const prepareBookingData = () => {
    const bookingData = [];

    hotelRooms.forEach((room) => {
      const count = selectedRooms[room.id] || 0;
      if (count > 0) {
        bookingData.push({
          count,
          room
        });
      }
    });

    return bookingData;
  };
  const handleBookNow2 = () => {
    const bookingData = prepareBookingData();
    // console.log("Booking Data:", bookingData);
    handleBookNow(bookingData);

    // You can do anything with bookingData here (e.g., show modal, send to backend, etc.)
  };


  return (
    // <div className="p-4 w-full md:w-full mx-auto">
    //   <h2 className="text-3xl font-bold mb-6 text-gray-800">Select Rooms to Book</h2>
    //   <table className="min-w-full text-sm border-separate border-spacing-y-6">
    //     <tbody>
    //       {hotelRooms.map((room) => {
    //         const selectedCount = selectedRooms[room.id] || 0;
    //         const currentIndex = imageIndexes[room.id] || 0;
    //         const totalImages = room.imageUrls.length;

    //         return (
    //           <tr
    //             key={room.id}
    //             className="relative bg-white rounded-xl overflow-hidden border-l-4 border-blue-500"
    //           >
    //             <td className="p-4 align-top">
    //               <div className="flex flex-col md:flex-row gap-4">
    //                 <div className="relative w-full md:w-82 min-h-58 max-h-58 rounded overflow-hidden group">
    //                   {totalImages > 1 ? (
    //                     <>
    //                       <img
    //                         src={room.imageUrls[currentIndex]}
    //                         alt={room.name}
    //                         className="w-full h-full object-cover rounded transition-transform duration-300 group-hover:scale-105"
    //                       />
    //                       <button
    //                         onClick={() => handlePrevImage(room.id, totalImages)}
    //                         className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white text-gray-600 rounded-full p-2 hover:bg-gray-100 border"
    //                       >
    //                         <FaChevronLeft size={20} />
    //                       </button>
    //                       <button
    //                         onClick={() => handleNextImage(room.id, totalImages)}
    //                         className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-gray-600 rounded-full p-2 hover:bg-gray-100 border"
    //                       >
    //                         <FaChevronRight size={20} />
    //                       </button>
    //                     </>
    //                   ) : (
    //                     <img
    //                       src={room.imageUrls[0]}
    //                       alt={room.name}
    //                       className="w-full min-h-58 max-h-58 object-cover rounded transition-transform duration-300 group-hover:scale-105"
    //                     />
    //                   )}
    //                 </div>

    //                 <div className="flex flex-col justify-between text-gray-700 w-full">
    //                   <div>

    //                     <h3 className="inline-block bg-gradient-to-r text-center md:text-left from-blue-500 to-blue-400 text-white px-3 py-1 rounded-full text-lg font-semibold mb-2 self-start">
    //                       {room.name}
    //                     </h3>
    //                     <ul className="pt-2 list-disc list-outside text-gray-600 text-lg pl-5">
    //                       {room.features.map((feature, i) => (
    //                         <li key={i}>{feature}</li>
    //                       ))}
    //                     </ul>

    //                   </div>
    //                   <div className="text-lg mt-2 bg-gray-100 p-2 rounded">
    //                     <span className="block">
    //                       <strong>Max Occupancy:</strong> {room.maxOccupancy}
    //                     </span>
    //                     <span className="block">
    //                       <strong>Available:</strong> {room.totalRooms}
    //                     </span>
    //                     <span className="block">
    //                       <strong>Price/Night:</strong> ₹{room.pricePerNight}
    //                     </span>
    //                   </div>
    //                 </div>
    //               </div>
    //             </td>
    //             <td className="p-4 text-center md:align-top align-middle">
    //               <div className="flex items-center justify-center gap-2">
    //                 <button
    //                   onClick={() => handleRoomChange(room.id, selectedCount - 1, room.totalRooms)}
    //                   disabled={selectedCount <= 0}
    //                   className={`px-2 py-1 border rounded ${selectedCount <= 0
    //                     ? "text-gray-400 border-gray-300 cursor-not-allowed"
    //                     : "text-gray-700 border-gray-400 hover:bg-gray-100"
    //                     }`}
    //                 >
    //                   –
    //                 </button>
    //                 <span className="min-w-[20px] text-center font-medium">{selectedCount}</span>
    //                 <button
    //                   onClick={() => handleRoomChange(room.id, selectedCount + 1, room.totalRooms)}
    //                   disabled={selectedCount >= room.totalRooms}
    //                   className={`px-2 py-1 border rounded ${selectedCount >= room.totalRooms
    //                     ? "text-gray-400 border-gray-300 cursor-not-allowed"
    //                     : "text-gray-700 border-gray-400 hover:bg-gray-100"
    //                     }`}
    //                 >
    //                   +
    //                 </button>
    //               </div>
    //             </td>

    //           </tr>
    //         );
    //       })}
    //     </tbody>
    //   </table>

    //   <div className="mt-8 p-4 bg-gray-50 rounded flex flex-col md:flex-row md:justify-between md:items-center border border-gray-200">
    //     <div>
    //       <p className="text-base font-medium">
    //         Total People Covered:{" "}
    //         <span className="font-bold">{summary.totalCapacity}</span>
    //       </p>
    //       <p className="text-base font-medium">
    //         Booking for:{" "}
    //         <span className="font-bold">{totalPeople}</span>
    //       </p>
    //       <p className="text-base font-medium">
    //         Number of Days: <span className="font-bold">{numberofDays}</span>
    //       </p>
    //     </div>
    //     <div className='flex flex-col gap-[5px]'>
    //       <p className="text-xl font-bold text-green-600">
    //         Grand Total: ₹{summary.totalCost}
    //       </p>
    //       <div className="flex flex-col justify-end w-full md:w-auto self-stretch pb-[2px]">
    //         <button
    //           onClick={handleBookNow2}
    //           className="bg-blue-600 w-full md:w-auto justify-center cursor-pointer
    //   text-white rounded-xl px-6 py-3 text-sm font-medium hover:bg-blue-700 transition"
    //         >
    //           Book Now
    //         </button>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div className="p-4 w-full md:w-full mx-auto">
      <h2 style={{ marginBottom: '10px' }} className="text-3xl font-bold mb-6 text-gray-800">Select Rooms to Book</h2>

      <div className="space-y-6">
        {hotelRooms.map((room) => {
          const selectedCount = selectedRooms[room.id] || 0;
          const currentIndex = imageIndexes[room.id] || 0;
          const totalImages = room.imageUrls.length;

          return (
            <div
              key={room.id}
              style={{ marginBottom: '10px' }}
              className="relative bg-white rounded-xl overflow-hidden border-l-4 border-blue-500 p-4 flex flex-col md:flex-row gap-4"
            >
              {/* Left Section */}
              <div className="flex flex-col md:flex-row gap-4 w-full">
                <div className="relative w-full md:w-82 min-h-58 max-h-58 rounded overflow-hidden group">
                  {totalImages > 1 ? (
                    <>
                      <img
                        src={room.imageUrls[currentIndex]}
                        alt={room.name}
                        className="w-full h-full object-cover rounded transition-transform duration-300 group-hover:scale-105"
                      />
                      <button
                        onClick={() => handlePrevImage(room.id, totalImages)}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white text-gray-600 rounded-full p-2 hover:bg-gray-100 border"
                      >
                        <FaChevronLeft size={20} />
                      </button>
                      <button
                        onClick={() => handleNextImage(room.id, totalImages)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-gray-600 rounded-full p-2 hover:bg-gray-100 border"
                      >
                        <FaChevronRight size={20} />
                      </button>
                    </>
                  ) : (
                    <img
                      src={room.imageUrls[0]}
                      alt={room.name}
                      className="w-full min-h-58 max-h-58 object-cover rounded transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                </div>

                <div className="flex flex-col justify-between text-gray-700 w-full">
                  <div>
                    <h3 className="inline-block bg-gradient-to-r text-center md:text-left from-blue-500 to-blue-400 text-white px-3 py-1 rounded-full text-lg font-semibold mb-2 self-start">
                      {room.name}
                    </h3>
                    <ul className="pt-2 list-disc list-outside text-gray-600 text-lg pl-5">
                      {room.features.map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="text-lg mt-2 bg-gray-100 p-2 rounded">
                    <span className="block">
                      <strong>Max Occupancy:</strong> {room.maxOccupancy}
                    </span>
                    <span className="block">
                      <strong>Available:</strong> {room.totalRooms}
                    </span>
                    <span className="block">
                      <strong>Price/Night:</strong> ₹{room.pricePerNight}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Section (Buttons) */}
              <div className="flex items-center md:justify-center justify-start  gap-2 md:flex-row md:justify-start md:items-start">
                <button
                  onClick={() => handleRoomChange(room.id, selectedCount - 1, room.totalRooms)}
                  disabled={selectedCount <= 0}
                  className={`px-3 py-1 border rounded ${selectedCount <= 0
                    ? "text-gray-400 border-gray-300 cursor-not-allowed"
                    : "text-gray-700 border-gray-400 hover:bg-gray-100"
                    }`}
                >
                  –
                </button>
                <span className="min-w-[20px] text-center font-medium">{selectedCount}</span>
                <button
                  onClick={() => handleRoomChange(room.id, selectedCount + 1, room.totalRooms)}
                  disabled={selectedCount >= room.totalRooms}
                  className={`px-3 py-1 border rounded ${selectedCount >= room.totalRooms
                    ? "text-gray-400 border-gray-300 cursor-not-allowed"
                    : "text-gray-700 border-gray-400 hover:bg-gray-100"
                    }`}
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Section */}
      <div className="mt-8 p-4 bg-gray-50 rounded flex flex-col md:flex-row md:justify-between md:items-center border border-gray-200">
        <div>
          <p className="text-base font-medium">
            Total People Covered: <span className="font-bold">{summary.totalCapacity}</span>
          </p>
          <p className="text-base font-medium">
            Booking for: <span className="font-bold">{totalPeople}</span>
          </p>
          <p className="text-base font-medium">
            Number of Days: <span className="font-bold">{numberofDays}</span>
          </p>
        </div>
        <div className="flex flex-col gap-[5px] mt-4 md:mt-0">
          <p className="text-xl font-bold text-green-600">
            Grand Total: ₹{summary.totalCost}
          </p>
          <div className="flex flex-col justify-end w-full md:w-auto self-stretch pb-[2px]">
            <button
              onClick={handleBookNow2}
              className="bg-blue-600 w-full md:w-auto justify-center cursor-pointer text-white rounded-xl px-6 py-3 text-sm font-medium hover:bg-blue-700 transition"
            >
              Reserve Now
            </button>
          </div>
        </div>
      </div>
    </div>

  );
};



const HotelDetails = () => {
  // console.log("HotelDetails function body running");

  // ⬅️ run again when `hotel` data changes


  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get parameters from URL if state is not available
  const urlParams = new URLSearchParams(window.location.search);
  let urlState = {};
  if (urlParams.get('data')) {
    try {
      urlState = JSON.parse(decodeURIComponent(atob(urlParams.get('data'))));
    } catch (e) {
      urlState = {};
    }
  } else {
    urlState = {
      id: urlParams.get('id'),
      checkIn: urlParams.get('checkIn'),
      checkOut: urlParams.get('checkOut'),
      total: parseInt(urlParams.get('total')) || 1,
      room: parseInt(urlParams.get('room')) || 1,
      location: urlParams.get('location'),
      startingPrice: urlParams.get('startingPrice') ? parseInt(urlParams.get('startingPrice')) : undefined
    };
  }

  // Use state if available, otherwise use URL parameters
  const currentState = state || urlState;
  const [hotel, setHotelData] = useState({});
  const [numberofDays, setnumberofDays] = useState()
  const [showFull, setShowFull] = useState(false);
  const [text, setText] = useState()
  const [amenities, setAmenititeslist] = useState([])
  const [nearbyAttractions, setNearbyAttractions] = useState([])

  const topRef = useRef(null);

  useEffect(() => {
    if (hotel && topRef.current) {
      const navbarHeight = 80;
      const elementTop = topRef.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementTop - navbarHeight,
        behavior: "smooth",
      });
    }
  }, [hotel]);


  const [showInfo, setShowInfo] = useState(false);
  const [showAbove, setShowAbove] = useState(false);
  const iconRef = useRef();

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [showGuestOptions, setShowGuestOptions] = useState(false);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [hotelRooms, setHotelRooms] = useState([])
  const [imageUrls, setImageUrls] = useState([])

  const [bookingData, setBookingData] = useState(null);
  const [bookingData2, setBookingData2] = useState(null);
  const [showModal2, setShowModal2] = useState(false);


  //Booking
  const [bookingId, setBookingId] = useState("")
  const [razorpayId, setRazorpayId] = useState("")
  const [totalAmt, setTotalAmount] = useState("")
  const [bookingModal, setBookingModal] = useState(false)
  const [failModal, setFailModal] = useState(false)
  const [paidAt, setPaidAt] = useState("")
  const { paymentLoading, paymentStatus, paymentError } = useSelector((state) => state.payment);
  // const [tooltipPosition, setTooltipPosition] = useState("right"); // default position



  //Login
  const [showModal, setShowModal] = useState(false);
  const [login, setLogin] = useState("login");
  const [phone, setPhone] = useState("");
  const [error2, setError] = useState(false);
  const [currentuser, setCurrentUser] = useState({});
  const [initialToken, setInitialToken] = useState();
  const [user, setUser] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [userData, setUserData] = useState();

  const handleClose = () => {
    setShowModal(false);
    setLogin("login");
  };
  const handleChange = (e) => {
    const value = e.target.value;
    setPhone(value);

    if (value.length === 10) {
      const regex = /^[6-9]\d{9}$/;
      if (regex.test(value)) {
        setError(false);
      } else {
        setError(true);
      }
    } else {
      setError(false);
    }
  };

  const phoneNumberChange = async (phone) => {
    const userData = {
      uid: currentuser.uid,
      name: currentuser.displayName || "",
      email: currentuser.email || "",
      phoneNumber: phone || "",
      imageUrl: currentuser.photoURL || "",
      role: "USER",
    };

    const thunkResponse = await dispatch(
      registerUser({ data: userData, token: initialToken })
    );

    // console.log(thunkResponse);

    if (thunkResponse.payload?.status === 201) {
      const refreshedToken = await currentuser.getIdToken(true);
      // console.log(refreshedToken);
      localStorage.setItem("token", refreshedToken);
      setUser(pulledData.payload?.data);
      document.cookie = `userData=${encodeURIComponent(
        JSON.stringify(pulledData.payload?.data)
      )}; path=/; max-age=2592000`;
      window.dispatchEvent(new Event("tokenUpdated"));
      // refreshTokenTimer(currentuser);
      setShowModal(false);
    } else {
      const user = auth.currentUser;
      document.cookie = "userData=; path=/; max-age=0";
      await user.delete();
      setShowModal(false);
      toast.error("Some Problem Occurred!!", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

  const phoneNumberChange2 = async (currentUser, phone, token) => {
    // console.log(token);
    const userData = {
      uid: currentUser.uid,
      name: currentUser.displayName || "",
      email: currentUser.email || "",
      phoneNumber: phone || "",
      imageUrl: currentUser.photoURL || "",
      role: "USER",
    };

    const thunkResponse = await dispatch(
      registerUser({ data: userData, token: token })
    );

    // console.log(thunkResponse);

    if (thunkResponse.payload?.status === 201) {
      const refreshedToken = await currentUser.getIdToken(true);
      // console.log(refreshedToken);
      localStorage.setItem("token", refreshedToken);
      setUser(pulledData.payload?.data);
      document.cookie = `userData=${encodeURIComponent(
        JSON.stringify(pulledData.payload?.data)
      )}; path=/; max-age=2592000`;
      window.dispatchEvent(new Event("tokenUpdated"));
      // refreshTokenTimer(currentuser);
      setShowModal(false);
    } else {
      const user = auth.currentUser;
      document.cookie = "userData=; path=/; max-age=0";
      await user.delete();
      setShowModal(false);
      toast.error("Some Problem Occurred!!", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };


  const handleGoogleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const currentUser = result.user;

      const isNewUser = result._tokenResponse?.isNewUser;

      const initialtoken = result._tokenResponse.idToken;
      // console.log(currentUser);
      // console.log()
      setInitialToken(initialtoken);

      if (isNewUser) {
        // console.log(currentUser.phoneNumber);
        if (
          currentUser.phoneNumber === "" ||
          currentUser.phoneNumber === undefined ||
          currentUser.phoneNumber === null
        ) {
          setLogin("phone");
          setCurrentUser(currentUser);
        } else {
          setShowModal(false);
          // console.log(initialtoken);
          phoneNumberChange2(
            currentUser,
            currentUser.phoneNumber,
            initialtoken
          );
        }
      } else {
        // console.log(result);
        // const user = auth.currentUser;
        // await user.delete();
        const uid = currentUser.uid;
        const pulledData = await dispatch(
          fetchUserProfile({ uid: uid, token: initialtoken })
        );
        // console.log(pulledData);
        // console.log(initialtoken);
        if (pulledData.payload?.status === 200) {
          // console.log(pulledData.payload?.data);p
          setUserData(pulledData.payload?.data);
          // localStorage.setItem("userData", pulledData.payload?.data);
          localStorage.setItem("token", initialtoken);
          document.cookie = `userData=${encodeURIComponent(
            JSON.stringify(pulledData.payload?.data)
          )}; path=/; max-age=2592000`;
          // refreshTokenTimer(currentUser);
          window.dispatchEvent(new Event("tokenUpdated"));
          // console.log("Existing user");
          setShowModal(false);
        } else {
          auth.signOut();
          setShowModal(false);
          document.cookie = "userData=; path=/; max-age=0";
          toast.error("Some Problem Occurred!!", {
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
        }
      }

      // setShowModal(false);
    } catch (error) {
      console.error("Google login failed:", error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  //LOGIN KHOTOM


  // useEffect(() => {
  //   if (showInfo && iconRef.current) {
  //     const rect = iconRef.current.getBoundingClientRect();
  //     const spaceBelow = window.innerHeight - rect.bottom;
  //     const spaceAbove = rect.top;

  //     // Approximate height of tooltip
  //     const tooltipHeight = 300;

  //     if (spaceBelow < tooltipHeight && spaceAbove > tooltipHeight) {
  //       setShowAbove(true);
  //     } else {
  //       setShowAbove(false);
  //     }
  //   }
  // }, [showInfo]);
  const [tooltipPosition, setTooltipPosition] = useState("left");

  useEffect(() => {
    if (showInfo && iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const spaceRight = window.innerWidth - rect.right;
      const spaceLeft = rect.left;

      const tooltipHeight = 300;
      const tooltipWidth = 320; // matches w-80

      // Decide vertical position
      setShowAbove(spaceBelow < tooltipHeight && spaceAbove > tooltipHeight);

      // Small screen fallback — center tooltip
      if (window.innerWidth <= tooltipWidth) {
        setTooltipPosition("center");
      }
      // Normal left/right detection
      else if (spaceRight < tooltipWidth && spaceLeft > tooltipWidth) {
        setTooltipPosition("left");
      } else {
        setTooltipPosition("right");
      }
    }
  }, [showInfo]);




  useEffect(() => {
    // console.log("HELLO");
  }, []);

  useEffect(() => {
    // console.log("state in effect", currentState);
    if (currentState.checkIn && currentState.checkOut) {
      const checkIn = new Date(currentState.checkIn);
      const checkOut = new Date(currentState.checkOut);

      const diffTime = checkOut - checkIn;
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      // console.log(diffDays);

      setnumberofDays(diffDays)
    }
  }, [currentState]);

  useEffect(() => {
    if (currentState && currentState.id && currentState.checkIn && currentState.checkOut) {
      const job = async () => {
        try {
          const htl = await dispatch(fetchHotel({ checkIn: currentState.checkIn, checkOut: currentState.checkOut, id: currentState.id }));
          // console.log(htl);
          if (htl.payload && htl.payload.status == 200) {
            console.log(htl.payload.data?.imageUrls);
            setImageUrls(htl.payload.data?.imageUrls)
            setNearbyAttractions(htl.payload.data?.nearbyAttractions)
            setHotelRooms(htl.payload.data?.rooms)
            setAmenititeslist(htl.payload.data?.amenities)
            setAdults(currentState.total)
            setStartDate(currentState.checkIn)
            setEndDate(currentState.checkOut)
            setHotelData(htl.payload.data);
            console.log(htl.payload.data.videoUrl)
            setText(htl.payload.data.about)
          } else {
            // console.log("Fetch did not return status 200:", htl.payload);
          }
        } catch (error) {
          console.error("Error in fetchHotel:", error);
        }
      };

      job();
    }
  }, [currentState, dispatch]);

  let limit = 500

  const totalPeople = currentState?.total || 1;

  const filteredRooms = useMemo(() => {
    if (!hotel?.rooms || !currentState?.startingPrice) return hotel?.rooms || [];

    return hotel.rooms.filter(room => room.pricePerNight <= currentState.startingPrice);
  }, [hotel, currentState]);

  // const allocatedRooms = useMemo(() => {
  //   if (!filteredRooms || !totalPeople) return [];
  //   // return allocateRooms_func(filteredRooms, totalPeople);
  //   console.log(filteredRooms)
  //   const allocation = allocateRooms_func(filteredRooms, totalPeople)

  //   if (allocation === null) {
  //     return allocateRooms_func(hotel.rooms, totalPeople)
  //   } else { return allocation; }
  // }, [filteredRooms, totalPeople]);
  const allocatedRooms = useMemo(() => {
    if (!filteredRooms || !totalPeople) return [];

    const allocation = allocateRooms_func(filteredRooms, totalPeople)
      ?? allocateRooms_func(hotel.rooms, totalPeople);

    return allocation || [];
  }, [filteredRooms, totalPeople]);


  // Move early returns AFTER effects
  if (!currentState || !currentState.id || !currentState.checkIn || !currentState.checkOut) {
    return <div className="min-h-screen flex items-center justify-center">Invalid request: Missing required parameters. Please ensure you have a valid hotel ID, check-in, and check-out dates.</div>;
  }

  // if (!hotel || Object.keys(hotel).length === 0) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">Loading hotel details...</div>
  //   );
  // }
  if (!hotel || Object.keys(hotel).length === 0) {
    return (
      <div className="min-h-screen w-full bg-gray-50">
        {/* Hero Skeleton */}
        <div className="relative h-[450px] w-full">
          <Skeleton variant="rectangular" width="100%" height="100%" />
          <div className="absolute bottom-6 left-6 right-6">
            <Skeleton variant="text" width="60%" height={40} />
            <Skeleton variant="text" width="40%" height={25} />
          </div>
        </div>

        {/* About Section */}
        <div className="px-6 pt-8 pb-4 w-full max-w-7xl mx-auto">
          <Skeleton variant="text" width="40%" height={35} className="mb-4" />
          <Skeleton variant="rectangular" height={120} className="rounded-lg" />

          {/* Rooms Placeholder */}
          <div className="pt-10 space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-white p-4 rounded-xl shadow-sm">
                <Skeleton variant="text" width="50%" height={30} />
                <Skeleton variant="text" width="30%" height={20} className="mt-2" />
                <Skeleton variant="text" width="70%" height={20} className="mt-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }


  const grandTotal = allocatedRooms?.reduce(
    (acc, roomObj) => acc + roomObj.room.pricePerNight * roomObj.count,
    0
  );

  const totalAmount = grandTotal * numberofDays;

  const isLong = text.length > limit;
  const displayedText = showFull ? text : text.slice(0, limit);

  const getAmenityIcon = (name) => {
    const amenity = amenitiesList.find(item => item.label === name);
    return amenity ? amenity.icon : null;
  };

  const handleSearch = () => {
    // Calculate total people
    // console.log(startDate)


    const totalPeople = adults

    // Create new state object
    const newState = {
      ...currentState,
      checkIn: startDate ? new Date(startDate).toISOString().split("T")[0] : currentState.checkIn,
      checkOut: endDate ? new Date(endDate).toISOString().split("T")[0] : currentState.checkOut,
      total: totalPeople,
      room: rooms,
    };

    // Navigate to same page with new state
    navigate(".", { state: newState });

    // Optionally force reload if needed
    window.location.reload();
  };

  //   const handleBookNow = (rooms) => {
  //     console.log(rooms)
  //   const user = auth.currentUser;

  //   if (user) {
  //     console.log(1); // user is logged in
  //   } else {
  //     console.log(0); // user not logged in
  //     setShowModal(true)
  //     window.location.reload();
  //   }
  // };
  const handleBookNow = (rooms) => {
    // console.log("Rooms array from child:", rooms);

    const newBookingData = {
      roomBookings: rooms.map((item) => ({
        roomId: item.room.id,
        checkInDate: currentState.checkIn,
        checkOutDate: currentState.checkOut,
        numberOfRooms: item.count,
        numberOfGuests: currentState.total
      }))
    };

    // console.log("Prepared Booking Data JSON:", newBookingData);
    setBookingData2(newBookingData)
    setBookingData(rooms);

    const user = auth.currentUser;
    if (user) {
      // console.log(1); // user is logged in
      setShowModal2(true); // show modal
    } else {
      // console.log(0); // user not logged in
      setShowModal(true);
      // window.location.reload();
    }
  };

  const handlePaymentConfirm = async (paymentId, razorpayOrderId, razorpaySignature) => {
    const token = localStorage.getItem("token");

    const res = await dispatch(
      confirmPayment({
        token,
        razorpayPaymentId: paymentId,
        razorpayOrderId: razorpayOrderId,
        razorpaySignature: razorpaySignature,
      })
    );
    console.log(res)
    if (res.payload.status == 200 || res.payload.status == 409) {
      // console.log(res.payload.data)
      setPaidAt(res.payload.data?.paidAt)
      setBookingModal(true)
      // console.log("SUCCESSFULL")
    } else {
      // console.log("NOT SUCCESSFULL")
      setFailModal(true)
    }
  };

  const openRazorpay = (orderId) => {
    const cookies = document.cookie.split("; ");
    const userDataCookie = cookies.find((row) =>
      row.startsWith("userData=")
    );
    const value = userDataCookie.split("=")[1];
    const decoded = JSON.parse(decodeURIComponent(value));
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY, // ⭐ replace with your Razorpay Key ID
      name: "INO TRAVELS",
      description: "Hotel Booking Payment",
      order_id: orderId,

      handler: async function (response) {
        // console.log("Payment successful!", response);

        // Send to backend for verification
        // Example: verifyPayment(response)
        await handlePaymentConfirm(response.razorpay_payment_id, response.razorpay_order_id, response.razorpay_signature)
      },
      modal: {
        ondismiss: () => {
          // Called when user closes the Razorpay popup
          toast.error("Booking not confirmed. Payment was cancelled.", {
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
        },
      },

      //       const verifyPayment = async (response) => {
      //   const res = await api.post("/verify-payment", {
      //     payment_id: response.razorpay_payment_id,
      //     order_id: response.razorpay_order_id,
      //     signature: response.razorpay_signature,
      //   });

      //   console.log("Payment verification response:", res);
      // };


      prefill: {
        name: decoded.name,
        email: decoded.email,
        contact: (!decoded.phoneNumber || decoded.phoneNumber === "" || decoded.phoneNumber === "NA") ? null : decoded.phoneNumber,
      },

      // notes: {
      //   booking_id: "OptionalBookingId",
      // },

      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };


  const handleBook = async () => {
    // console.log(bookingData2)
    // console.log()
    const token = localStorage.getItem("token")
    const book = await dispatch(bookRooms({ hotelId: currentState.id, roomBookings: bookingData2.roomBookings, token: token }))
    // console.log(book)
    if (book.payload.status == 200) {
      const data = book.payload.data;
      console.log(data)
      setBookingId(data?.bookingGroupCode)
      setRazorpayId(data?.razorpayOrderId)
      // console.log(book.payload.data)

      openRazorpay(data?.razorpayOrderId);
    }
  }

  // const handleBookNow = (selectedRooms, hotelRooms, state) => {
  //   const user = auth.currentUser;

  //   // Build roomBookings array
  //   const roomBookings = Object.entries(selectedRooms).map(([roomId, count]) => {
  //     return {
  //       roomId: parseInt(roomId),
  //       checkInDate: state.checkIn,
  //       checkOutDate: state.checkOut,
  //       numberOfRooms: count,
  //       numberOfGuests: state.total,
  //     };
  //   });

  //   console.log("roomBookings JSON:", JSON.stringify({ roomBookings }, null, 2));

  //   if (user) {
  //     console.log(1); // logged in
  //     // Optionally show modal or continue booking here
  //   } else {
  //     console.log(0); // not logged in
  //     setShowModal(true);
  //     // Optionally reload or navigate here
  //     window.location.reload();
  //   }
  // };





  return (
    <div ref={topRef} className="w-full bg-gray-50">
      {/* Hero Image */}
      <div className="relative h-[450px] w-full">
        {hotel && hotel.videoUrl ? (
          <video autoPlay muted loop className="h-full w-full object-cover">
            <source src={hotel.videoUrl} type="video/mp4" />
          </video>
        ) : (
          <img

            src={hotel?.imageUrls[0]}
            alt={hotel?.name}
            className="h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold">{hotel?.name}</h1>
              <p className="mt-2 text-sm md:text-base">{hotel?.address}</p>
            </div>
            <ShareButton hotel={hotel} className="self-start md:self-end" />
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="flex justify-center">

        <div className="lg:w-[70%] w-full flex justify-center flex-col">



          {/* Rooms Section */}

          <div className="max-w-full mx-auto px-6 pb-3 pt-8">
            <h2 className="text-3xl font-semibold pb-6 text-gray-800">
              Recommended Rooms allocated for {totalPeople} {totalPeople > 1 ? "people" : "person"}
            </h2>

            <div className='flex flex-col gap-[10px]'>
              {allocatedRooms === null ? (
                <div className="text-red-600 font-medium bg-red-50 p-4 rounded-lg shadow">
                  Sorry, no rooms available to accommodate {totalPeople} people.
                </div>
              ) : (
                <div className="space-y-6">
                  {allocatedRooms.map((roomObj, i) => {
                    const room = roomObj.room;
                    const count = roomObj.count;
                    const totalPrice = room.pricePerNight * count;

                    return (
                      <div
                        key={i}
                        className="border border-gray-200 p-4 shadow-sm hover:shadow transition bg-white flex flex-col md:flex-row md:justify-between"
                      >
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-800">
                            {count} × {room.name}
                          </h3>
                          <p className="text-gray-600 text-md mt-1">Max Occupancy: {room.maxOccupancy}</p>
                          {/* <p className="text-gray-600 text-sm">Beds: {room.bedsDescription ?? "—"}</p> */}
                          <ul className="list-disc list-inside text-gray-500 text-md mt-2 space-y-1">
                            {room.features.map((feat, idx) => (
                              <li key={idx}>{feat}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-4 md:mt-0 md:ml-6 text-right">
                          <p className="text-gray-600 text-md">Price per night</p>
                          <p className="text-blue-600 font-semibold text-xl">₹{room.pricePerNight}</p>
                          <p className="mt-1 text-gray-800 font-bold">Total: ₹{totalPrice}/Night</p>
                        </div>
                      </div>
                    );

                  })}
                  
                  <div className="mt-6 border-t border-gray-200 pt-4 flex flex-col md:flex-row md:justify-between items-center">
                    <div className="text-2xl flex items-center gap-[2px] font-bold text-gray-800">
                      <div>

                        Total Amount: ₹{grandTotal * numberofDays}
                      </div>
                      {/* <IoIosInformationCircleOutline className='text-blue-500' /> */}
                      <div className="relative inline-block">
                        <IoIosInformationCircleOutline
                          ref={iconRef}
                          className="text-blue-500 text-2xl cursor-pointer"
                          onMouseEnter={() => setShowInfo(true)}
                          onMouseLeave={() => setShowInfo(false)}
                        />

                        {showInfo && (
                          // <div
                          //   className={`absolute ${showAbove ? "bottom-8" : "top-8"} ${tooltipPosition === "right" ? "right-0" : "left-0"
                          //     } bg-white border border-blue-100 shadow-2xl p-3 rounded-xl w-80 text-gray-700 z-50 space-y-2 transition-all`}
                          // >
                          <div
                            className={`absolute ${showAbove ? "bottom-8" : "top-8"} 
    ${tooltipPosition === "right" ? "right-0" : ""} 
    ${tooltipPosition === "left" ? "left-0" : ""} 
    ${tooltipPosition === "center" ? "left-1/2 -translate-x-1/2 w-[90vw]" : "w-80"}
    bg-white border border-blue-100 shadow-2xl p-3 rounded-xl text-gray-700 z-50 space-y-2 transition-all overflow-auto max-h-[90vh]`}
                          >



                            <h3 className="text-base font-semibold text-blue-600">Booking Summary</h3>



                            <div className="border-t border-gray-200 pt-1 text-sm leading-tight">
                              <p className="font-medium mb-1">Room Details:</p>
                              {allocatedRooms.map((room, index) => (
                                <div key={index} className="bg-gray-50 p-1.5 rounded mb-1">
                                  <p className="font-semibold">{room.room.name}</p>
                                  <p>Rooms: {room.count}</p>
                                  <p>Rate/night: ₹{room.room.pricePerNight}</p>
                                  <p>Subtotal: ₹{room.count * room.room.pricePerNight * numberofDays}</p>
                                </div>
                              ))}
                            </div>

                            <div className="border-t border-gray-200 pt-1 text-sm leading-tight">
                              <p className='flex justify-between'>
                                <span className="font-medium">Nights:</span> <span>{numberofDays}</span>
                              </p>
                              <p className='flex justify-between'>
                                <span className="font-medium">Total amount/night:</span> <span> ₹{grandTotal}</span>
                              </p>
                            </div>

                            <div className="border-t border-gray-200 pt-1 text-sm leading-tight">
                              <p className="flex justify-between font-semibold text-base">
                                <span>Total:</span>
                                <span>₹{totalAmount}</span>
                              </p>
                            </div>
                          </div>
                        )}

                      </div>
                    </div>
                    <div className="flex flex-col justify-end w-full md:w-auto self-stretch pb-[2px]">
                      <button
                        onClick={() => handleBookNow(allocatedRooms)}
                        className="bg-blue-600 w-full md:w-auto justify-center cursor-pointer
      text-white rounded-xl px-6 py-3 text-sm font-medium hover:bg-blue-700 transition"
                      >
                        Reserve Now
                      </button>
                    </div>
                  </div>
                  <div className="w-full rounded-2xl p-4 sm:p-6">
  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
    Booking & Advance Fee Policy
  </h3>
  
  <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
    To place a booking request, a small{" "}
    <span className="font-medium text-gray-900">advance fee</span> is required.
    We'll review availability and confirm your request within{" "}
    <span className="font-medium text-gray-900">24 hours</span>.
  </p>
  
  <ul className="space-y-3 sm:space-y-2.5 mb-4">
    <li className="flex items-start gap-3">
      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
      <span className="text-sm sm:text-base text-gray-700 leading-relaxed">
        If approved, you'll receive a payment link by email/SMS.
      </span>
    </li>
    
    <li className="flex items-start gap-3">
      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
      <span className="text-sm sm:text-base text-gray-700 leading-relaxed">
        You'll have{" "}
        <span className="font-semibold text-gray-900">48 hours</span> to
        complete the full payment.
      </span>
    </li>
    
    <li className="flex items-start gap-3">
      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
      <span className="text-sm sm:text-base text-gray-700 leading-relaxed">
        If payment isn't completed in time, your request will be{" "}
        <span className="font-semibold text-gray-900">automatically cancelled</span>{" "}
        and the advance fee becomes{" "}
        <span className="font-semibold text-gray-900">non-refundable</span>.
      </span>
    </li>
    
    <li className="flex items-start gap-3">
      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
      <span className="text-sm sm:text-base text-gray-700 leading-relaxed">
        You can cancel within the 48-hour window and get a{" "}
        <span className="font-semibold text-gray-900">full refund</span>{" "}
        of the advance fee.
      </span>
    </li>
  </ul>
  
  <div className="rounded-xl bg-gray-50 p-4 sm:p-3">
    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
      <span className="font-medium text-gray-700">Tip:</span> Keep an eye on your inbox/SMS for the payment link to secure your
      booking on time. You can pay via the link or from the website from My
      Booking section.
    </p>
  </div>
</div>


                </div>


              )}
            </div>
          </div>
          {/* Image Grid */}
          {/* <div></div> */}
          <ImageGallery imageUrls={imageUrls} />
          {/* About the Hotel */}
          <div className="w-full mx-auto px-6 pt-10 pb-5">
            <h2 className="text-3xl font-semibold pb-6 text-gray-800">About the Hotel</h2>
            <div className="flex flex-wrap gap-2">
              {hotel.tags?.map((tag, i) => (
                <span
                  key={i}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-md font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="pt-2 text-lg">
              <p className="text-gray-600 leading-relaxed">
                {displayedText}
                {isLong && !showFull && "..."}
              </p>
              {isLong && (
                <button
                  onClick={() => setShowFull(!showFull)}
                  className="text-blue-500 font-medium mt-1 hover:underline"
                >
                  {showFull ? "Show less" : "Show more"}
                </button>
              )}
            </div>
          </div>
          <div className='pb-4 px-6'>
            <h3 className="font-semibold text-3xl text-gray-800 pt-5 pb-6">Facilities that this hotel offers</h3>
            <div className="grid md:grid-cols-4 grid-cols-2 gap-2 pt-2">
              {hotel.amenities.map((a, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-1 px-2 py-2 rounded-full text-xs font-medium border border-gray-200"
                >
                  <div className="text-2xl text-blue-700 p-1 rounded-lg bg-blue-100 flex-shrink-0">
                    {getAmenityIcon(a.name)}
                  </div>
                  <div className="truncate text-xl">
                    {a.name}
                  </div>
                </span>
              ))}
            </div>
          </div>
          <div className="package-search-container">
            <div className="flex flex-col md:flex-row p-6 md:p-0 gap-[10px] w-full md:p-4">
              <div className="flex-[1.5] w-full">
                <label className="block text-lg font-medium mb-1 flex pb-1">Dates</label>
                <div className="relative">
                  <DatePicker
                    selectsRange
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(update) => {
                      setStartDate(update[0]);
                      setEndDate(update[1]);
                    }}
                    isClearable
                    placeholderText="Check-in - Check-out"
                    customInput={<CustomDateInput />}
                    popperPlacement="bottom-start"
                    popperClassName="custom-datepicker"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="relative flex-1 w-full">
                <label className="block text-lg font-medium mb-1 flex pb-1">Guests & Rooms</label>
                <div
                  onClick={() => setShowGuestOptions(!showGuestOptions)}
                  className="relative w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-lg cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <FaUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5" />
                  {`${adults} Adults${children > 0 ? ` · ${children} Children` : ""} · ${rooms} Rooms`}
                </div>

                {showGuestOptions && (
                  <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg p-4 z-10">
                    <div className="flex justify-between items-center mb-2">
                      <span>People</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setAdults(Math.max(1, adults - 1))}
                          className="w-8 h-8 rounded-full bg-gray-200 text-lg flex items-center justify-center"
                        >
                          -
                        </button>
                        <span>{adults}</span>
                        <button
                          onClick={() => setAdults(adults + 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 text-lg flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Rooms</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setRooms(Math.max(1, rooms - 1))}
                          className="w-8 h-8 rounded-full bg-gray-200 text-lg flex items-center justify-center"
                        >
                          -
                        </button>
                        <span>{rooms}</span>
                        <button
                          onClick={() => setRooms(rooms + 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 text-lg flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-end w-full md:w-auto self-stretch pb-[2px]">
                <button
                  onClick={handleSearch}
                  className="bg-blue-600 w-full md:w-auto justify-center cursor-pointer
      text-white rounded-xl px-6 py-3 text-lg font-medium hover:bg-blue-700 transition"
                >
                  Search
                </button>
              </div>

            </div>
          </div>

          <RoomSelectionTable
            hotelRooms={hotelRooms}
            numberofDays={numberofDays}
            totalPeople={currentState.total}
            handleBookNow={(e) => handleBookNow(e)}
          />

          <div className="bg-gray-50 p-8 rounded-xl mx-auto">
            <h2 className="text-3xl font-bold pb-6 text-gray-800">Our Premium Guest-First Cancellation Policy</h2>

            <div className="flex items-start gap-3 pb-6">
              <MdOutlineCancel size={26} className="text-blue-500 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold">Flexible & Hassle-Free Cancellations</h3>
                <p className="text-gray-700 text-lg pt-2">
                  At <strong>{hotel?.name}</strong>, we strive to offer clarity and fairness in all bookings.

                  We provide a <strong>100% refund for cancellations made 10 days or more before your scheduled arrival</strong>. This gives you the flexibility to change your plans with peace of mind.

                  However, <strong>no refund will be provided for cancellations made within 10 days of the arrival date</strong>, as preparations for your stay would have already been initiated.

                  In the event of <strong>natural disasters or force majeure situations</strong> (such as floods, landslides, earthquakes, or government-imposed restrictions), <strong>no refunds will be processed</strong>, regardless of the cancellation date.

                  This policy ensures transparency while helping us maintain the quality of service and arrangements we commit to every guest.
                </p>

              </div>
            </div>

            <div className="flex items-start gap-3 pb-6">
              <MdAutorenew size={26} className="text-blue-500 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold">Easy & Transparent Refunds</h3>
                <p className="text-gray-700 text-lg pt-2">
                  We believe that the refund process should be as smooth and seamless as your stay with us. Eligible refunds will be
                  processed to your original payment method within <strong>5–7 business days</strong>, ensuring no unnecessary delays.
                  You will receive timely email updates at each step, so you’re never left wondering about the status. Our commitment
                  to transparency and reliability means you can always count on us for a stress-free experience.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 pb-2">
              <MdSupportAgent size={26} className="text-blue-500 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold">24/7 Dedicated Guest Support</h3>
                <p className="text-gray-700 text-lg pt-2">
                  We know that questions or last-minute changes don’t always fit within business hours. That’s why our guest support
                  team is available around the clock to assist with any modifications, special requests, or travel emergencies.
                  From helping you secure a last-minute upgrade to arranging a late check-out, we are here to make sure your experience
                  remains effortless and truly memorable. Your comfort is not just our priority — it is our promise.
                </p>
              </div>
            </div>
          </div>


          <div className="bg-gray-50 p-8 w-full rounded-xl mx-auto pt-8">
            <h2 className="text-3xl font-bold pb-4 text-gray-800">Nearby Attractions</h2>
            <div className="space-y-4">
              {nearbyAttractions?.length === 0 ? (
                <p className="text-gray-500 text-lg">No nearby attractions available.</p>
              ) : (
                nearbyAttractions.map((attraction, index) => {
                  const Icon = iconMap[attraction.type] || MdPlace;
                  return (
                    <div key={index} className="flex items-center gap-3 bg-white p-3 rounded-md">
                      <Icon size={30} className="text-blue-500 flex-shrink-0" />
                      <div>
                        <h3 className="text-base text-lg font-medium text-gray-700">{attraction.name}</h3>
                        <p className="text-gray-500 text-md text-sm">{attraction.distance} away</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <LoginModal
            showModal={showModal}
            handleClose={handleClose}
            login={login}
            handleGoogleLogin={handleGoogleLogin}
            error2={error2}
            phoneNumberChange={(e) => phoneNumberChange(e)}
            phone={phone}
            handleChange={(e) => handleChange(e)}
          />

          {showModal2 && bookingData && (
            <div
              className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4"
              onClick={() => setShowModal2(false)}
            >
              <div
                className="bg-white rounded-xl w-full max-w-4xl shadow-xl overflow-y-auto max-h-[90vh] mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800">Booking Summary</h2>
                    <button
                      onClick={() => setShowModal2(false)}
                      className="text-gray-400 hover:text-gray-600 text-2xl font-light"
                    >
                      ×
                    </button>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">Please review your booking details</p>
                </div>

                {/* Booking Info Cards */}
                <div className="px-6 py-4 bg-blue-50 border-b border-gray-200">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center sm:text-left">
                      <p className="text-sm font-medium text-gray-600">Check-in</p>
                      <p className="text-lg font-semibold text-gray-900">{currentState.checkIn}</p>
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-sm font-medium text-gray-600">Check-out</p>
                      <p className="text-lg font-semibold text-gray-900">{currentState.checkOut}</p>
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="text-sm font-medium text-gray-600">Guests</p>
                      <p className="text-lg font-semibold text-gray-900">{currentState.total} guests</p>
                    </div>
                  </div>
                </div>

                {/* Room Details */}
                <div className="px-6 py-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Selection</h3>

                  {bookingData.map((item, index) => {
                    const nights = numberofDays || 1;
                    const subtotal = item.room.pricePerNight * item.count * nights;
                    return (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50"
                      >
                        {/* Room Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold text-blue-600 mb-2 sm:mb-0">{item.room.name}</h4>
                          <div className="text-right">
                            <p className="text-xl font-bold text-green-600">₹{subtotal.toLocaleString()}</p>
                            <p className="text-sm text-gray-600">Total for {nights} night{nights > 1 ? 's' : ''}</p>
                          </div>
                        </div>

                        {/* Room Details Grid */}
                        <div className="grid grid-cols-3 gap-4 mb-4 w-full">
                          <div className="flex flex-col items-start text-left">
                            <p className="text-sm self-center text-center text-gray-600">Rooms</p>
                            <p className="font-semibold text-gray-900 self-center">{item.count}</p>
                          </div>

                          <div className="flex flex-col items-center text-center">
                            <p className="text-sm text-gray-600">Max Guests</p>
                            <p className="font-semibold text-gray-900">{item.room.maxOccupancy}</p>
                          </div>

                          <div className="flex flex-col items-end ">
                            <p className="text-sm self-center text-gray-600">Per Night</p>
                            <p className="font-semibold text-gray-900 self-center">
                              ₹{item.room.pricePerNight.toLocaleString()}
                            </p>
                          </div>
                        </div>


                      </div>
                    );
                  })}
                </div>

                {/* Price Breakdown */}
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Price Breakdown</h3>

                  {/* Total */}
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-700 font-medium">Total Amount</span>
                    <span className="text-xl font-bold text-green-600">
                      ₹{bookingData.reduce((acc, item) => acc + item.room.pricePerNight * item.count * (numberofDays || 1), 0).toLocaleString()}
                    </span>
                  </div>

                  {/* Payment Details */}
                  <div className="space-y-3 mt-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-gray-700 font-medium">Pay Now</span>
                        <p className="text-sm text-gray-600">To Generate a Booking Request</p>
                      </div>
                      <span className="text-lg font-bold text-orange-600">
                        ₹{(() => {
                          const total = bookingData.reduce((acc, item) => acc + item.room.pricePerNight * item.count * (numberofDays || 1), 0);
                          return Math.max(499, total * 0.1).toLocaleString();
                        })()}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-gray-700 font-medium">Remaining Amount</span>
                        <p className="text-sm text-gray-600">Pay after approval</p>
                      </div>
                      <span className="text-lg font-bold text-blue-600">
                        ₹{(() => {
                          const total = bookingData.reduce((acc, item) => acc + item.room.pricePerNight * item.count * (numberofDays || 1), 0);
                          const advance = Math.max(499, total * 0.1);
                          return (total - advance).toLocaleString();
                        })()}
                      </span>
                    </div>
                  </div>

                  {/* Highlighted Payment */}
                  <div style={{ marginTop: '10px' }} className="mt-4 bg-orange-100 border border-orange-200 rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row justify-between items-center">
                      <div className="mb-2 sm:mb-0 text-center sm:text-left">
                        <p className="text-lg font-bold text-orange-700">
                          Amount to Pay Now: ₹{(() => {
                            const total = bookingData.reduce((acc, item) => acc + item.room.pricePerNight * item.count * (numberofDays || 1), 0);
                            return Math.max(499, total * 0.1).toLocaleString();
                          })()}
                        </p>
                        {/* <p className="text-sm text-orange-600">Secure your booking instantly</p> */}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-xl">
                  <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                    <button
                      onClick={() => setShowModal2(false)}
                      className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        handleBook();
                        setShowModal2(false);
                      }}
                      className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      Confirm Payment
                    </button>
                  </div>

                  {/* Mobile Payment Summary */}
                  <div className="block sm:hidden mt-3 pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Amount to pay now:</span>
                      <span className="font-bold text-orange-600">
                        ₹{(() => {
                          const total = bookingData.reduce((acc, item) => acc + item.room.pricePerNight * item.count * (numberofDays || 1), 0);
                          return Math.max(499, total * 0.1).toLocaleString();
                        })()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
      {bookingModal && (
        <PaymentSuccessfullModal
          bookingId={bookingId}
          checkIn={currentState.checkIn}
          checkOut={currentState.checkOut}
          total={currentState.total}
          paidAt={paidAt}
          onClose={() => {
            setBookingModal(false)
            setBookingId("")
            navigate("/")
          }}
        />
      )}
      {failModal && (
        <PaymentFailedModal
          onClose={() => {
            setFailModal(false)
            setBookingId("")
            // navigate("/")
          }}
        />
      )}
    </div>
  );
};


export default HotelDetails