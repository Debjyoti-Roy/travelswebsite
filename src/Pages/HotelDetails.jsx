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
    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm cursor-pointer flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <FaCalendar className="absolute left-3 text-blue-500 w-5 h-5" />
    <span className={value ? "text-black" : "text-gray-400"}>
      {value || placeholder}
    </span>
  </div>
));

const allocateRooms = (rooms, totalPeople) => {
  const sortedRooms = [...rooms].sort((a, b) => b.maxOccupancy - a.maxOccupancy);
  let assignedPeople = 0;
  const selectedMap = {};

  for (const room of sortedRooms) {
    let available = room.totalRooms;
    while (assignedPeople < totalPeople && available > 0) {
      if (!selectedMap[room.id]) {
        selectedMap[room.id] = { room, count: 1 };
      } else {
        selectedMap[room.id].count++;
      }
      assignedPeople += room.maxOccupancy;
      available--;
    }
  }

  if (assignedPeople < totalPeople) return null;

  return Object.values(selectedMap);
};


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
    <div className="p-4 w-full md:w-full mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Select Rooms to Book</h2>
      <table className="min-w-full text-sm border-separate border-spacing-y-6">
        <thead>
          <tr>
            <th className="text-left px-2">Room Details</th>
            <th className="text-center px-2"># Rooms</th>
          </tr>
        </thead>
        <tbody>
          {hotelRooms.map((room) => {
            const selectedCount = selectedRooms[room.id] || 0;
            const currentIndex = imageIndexes[room.id] || 0;
            const totalImages = room.imageUrls.length;

            return (
              <tr
                key={room.id}
                className="relative bg-white rounded-xl overflow-hidden border-l-4 border-blue-500"
              >
                <td className="p-4 align-top">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative w-full md:w-48 h-32 rounded overflow-hidden group">
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
                          className="w-full h-full object-cover rounded transition-transform duration-300 group-hover:scale-105"
                        />
                      )}
                    </div>
                    <div className="flex flex-col justify-between text-gray-700 w-full">
                      <h3 className="inline-block bg-gradient-to-r from-blue-500 to-blue-400 text-white px-3 py-1 rounded-full text-sm font-semibold mb-2 self-start">
                        {room.name}
                      </h3>
                      <ul className="list-disc list-inside text-gray-600 text-xs">
                        {room.features.map((feature, i) => (
                          <li key={i}>{feature}</li>
                        ))}
                      </ul>
                      <div className="text-xs mt-2 bg-gray-100 p-2 rounded">
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
                </td>
                <td className="p-4 text-center align-top">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleRoomChange(room.id, selectedCount - 1, room.totalRooms)}
                      disabled={selectedCount <= 0}
                      className={`px-2 py-1 border rounded ${selectedCount <= 0
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
                      className={`px-2 py-1 border rounded ${selectedCount >= room.totalRooms
                        ? "text-gray-400 border-gray-300 cursor-not-allowed"
                        : "text-gray-700 border-gray-400 hover:bg-gray-100"
                        }`}
                    >
                      +
                    </button>
                  </div>
                </td>

              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="mt-8 p-4 bg-gray-50 rounded flex flex-col md:flex-row md:justify-between md:items-center border border-gray-200">
        <div>
          <p className="text-base font-medium">
            Total People Covered:{" "}
            <span className="font-bold">{summary.totalCapacity}</span>
          </p>
          <p className="text-base font-medium">
            Booking for:{" "}
            <span className="font-bold">{totalPeople}</span>
          </p>
          <p className="text-base font-medium">
            Number of Days: <span className="font-bold">{numberofDays}</span>
          </p>
        </div>
        <div className='flex flex-col gap-[5px]'>
          <p className="text-xl font-bold text-green-600">
            Grand Total: ₹{summary.totalCost}
          </p>
          <div className="flex flex-col justify-end w-full md:w-auto self-stretch pb-[2px]">
            <button
              onClick={handleBookNow2}
              className="bg-blue-600 w-full md:w-auto justify-center cursor-pointer
      text-white rounded-xl px-6 py-3 text-sm font-medium hover:bg-blue-700 transition"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};



const HotelDetails = () => {
  // console.log("HotelDetails function body running");

  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get parameters from URL if state is not available
  const urlParams = new URLSearchParams(window.location.search);
  const urlState = {
    id: urlParams.get('id'),
    checkIn: urlParams.get('checkIn'),
    checkOut: urlParams.get('checkOut'),
    total: parseInt(urlParams.get('total')) || 1,
    room: parseInt(urlParams.get('room')) || 1,
    location: urlParams.get('location')
  };
  
  // Use state if available, otherwise use URL parameters
  const currentState = state || urlState;
  const [hotel, setHotelData] = useState({});
  const [numberofDays, setnumberofDays] = useState()
  const [showFull, setShowFull] = useState(false);
  const [text, setText] = useState()
  const [amenities, setAmenititeslist] = useState([])
  const [nearbyAttractions, setNearbyAttractions] = useState([])


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

  const [bookingData, setBookingData] = useState(null);
  const [bookingData2, setBookingData2] = useState(null);
  const [showModal2, setShowModal2] = useState(false);


  //Booking
  const [bookingId, setBookingId] = useState("")
  const [razorpayId, setRazorpayId] = useState("")
  const [totalAmt, setTotalAmount] = useState("")
  const [bookingModal, setBookingModal] = useState(false)
  const [failModal, setFailModal] = useState(false)
  const [paidAt, setPaidAt]=useState("")
  const { paymentLoading, paymentStatus, paymentError } = useSelector((state) => state.payment);


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


  useEffect(() => {
    if (showInfo && iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      // Approximate height of tooltip
      const tooltipHeight = 300;

      if (spaceBelow < tooltipHeight && spaceAbove > tooltipHeight) {
        setShowAbove(true);
      } else {
        setShowAbove(false);
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
            // console.log(htl.payload.data?.nearbyAttractions);
            setNearbyAttractions(htl.payload.data?.nearbyAttractions)
            setHotelRooms(htl.payload.data?.rooms)
            setAmenititeslist(htl.payload.data?.amenities)
            setAdults(currentState.total)
            setStartDate(currentState.checkIn)
            setEndDate(currentState.checkOut)
            setHotelData(htl.payload.data);
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

  const allocatedRooms = useMemo(() => {
    if (!hotel?.rooms || !totalPeople) return [];
    return allocateRooms(hotel.rooms, totalPeople);
  }, [hotel, totalPeople]);

  // Move early returns AFTER effects
  if (!currentState || !currentState.id || !currentState.checkIn || !currentState.checkOut) {
    return <div className="min-h-screen flex items-center justify-center">Invalid request: Missing required parameters. Please ensure you have a valid hotel ID, check-in, and check-out dates.</div>;
  }

  if (!hotel || Object.keys(hotel).length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">Loading hotel details...</div>
    );
  }

  const grandTotal = allocatedRooms.reduce(
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
      checkIn: startDate ? startDate : currentState.checkIn,
      checkOut: endDate ? endDate : currentState.checkOut,
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
      window.location.reload();
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
    if (res.payload.status == 200) {
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
    const options = {
      key: "rzp_test_sFH5KQrMKB8Kp9", // ⭐ replace with your Razorpay Key ID
      name: "INO TRAVELS",
      description: "Hotel Booking Payment",
      order_id: orderId,

      handler: async function (response) {
        // console.log("Payment successful!", response);

        // Send to backend for verification
        // Example: verifyPayment(response)
        await handlePaymentConfirm(response.razorpay_payment_id, response.razorpay_order_id, response.razorpay_signature)
      },

      //       const verifyPayment = async (response) => {
      //   const res = await api.post("/verify-payment", {
      //     payment_id: response.razorpay_payment_id,
      //     order_id: response.razorpay_order_id,
      //     signature: response.razorpay_signature,
      //   });

      //   console.log("Payment verification response:", res);
      // };


      // prefill: {
      //   name: "Guest Name",
      //   email: "guest@example.com",
      //   contact: "9999999999",
      // },

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
    <div className="w-full bg-gray-50">
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

        <div className="lg:w-[60%] w-full flex justify-center flex-col">



          {/* Rooms Section */}

          <div className="max-w-6xl mx-auto px-6 pb-3 pt-8">
            <h2 className="text-2xl font-semibold pb-6 text-gray-800">
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
                          <h3 className="text-lg font-bold text-gray-800">
                            {count} × {room.name}
                          </h3>
                          <p className="text-gray-600 text-sm mt-1">Max Occupancy: {room.maxOccupancy}</p>
                          <p className="text-gray-600 text-sm">Beds: {room.bedsDescription ?? "—"}</p>
                          <ul className="list-disc list-inside text-gray-500 text-sm mt-2 space-y-1">
                            {room.features.map((feat, idx) => (
                              <li key={idx}>{feat}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-4 md:mt-0 md:ml-6 text-right">
                          <p className="text-gray-600 text-sm">Price per night</p>
                          <p className="text-blue-600 font-semibold text-lg">₹{room.pricePerNight}</p>
                          <p className="mt-1 text-gray-800 font-bold">Total: ₹{totalPrice}/Night</p>
                        </div>
                      </div>
                    );

                  })}
                  <div className="mt-6 border-t border-gray-200 pt-4 flex flex-col md:flex-row md:justify-between items-center">
                    <div className="text-xl flex items-center gap-[2px] font-bold text-gray-800">
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
                          <div
                            className={`absolute ${showAbove ? "bottom-8" : "top-8"
                              } left-0 bg-white border border-blue-100 shadow-2xl p-3 rounded-xl w-80 text-gray-700 z-50 space-y-2 transition-all`}
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
                        Book Now
                      </button>
                    </div>
                  </div>

                </div>


              )}
            </div>
          </div>
          <div className="max-w-6xl mx-auto px-6 pt-10 pb-5">
            <h2 className="text-2xl font-semibold pb-6 text-gray-800">About the Hotel</h2>
            <div className="flex flex-wrap gap-2">
              {hotel.tags?.map((tag, i) => (
                <span
                  key={i}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="pt-2">
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
            <h3 className="font-semibold text-2xl text-gray-800 pt-5 pb-6">Facilities that this hotel offers</h3>
            <div className="grid grid-cols-4 gap-2 pt-2">
              {hotel.amenities.map((a, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-1 px-2 py-2 rounded-full text-xs font-medium border border-gray-200"
                >
                  <div className="text-xl text-blue-700 p-1 rounded-lg bg-blue-100 flex-shrink-0">
                    {getAmenityIcon(a.name)}
                  </div>
                  <div className="truncate">
                    {a.name}
                  </div>
                </span>
              ))}
            </div>
          </div>
          <div className="package-search-container">
            <div className="flex gap-[10px] w-full md:p-4">
              <div className="flex-[1.5] w-full">
                <label className="block text-sm font-medium mb-1 flex pb-1">Dates</label>
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
                <label className="block text-sm font-medium mb-1 flex pb-1">Guests & Rooms</label>
                <div
                  onClick={() => setShowGuestOptions(!showGuestOptions)}
                  className="relative w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      text-white rounded-xl px-6 py-3 text-sm font-medium hover:bg-blue-700 transition"
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
            <h2 className="text-2xl font-bold pb-6 text-gray-800">Our Premium Guest-First Cancellation Policy</h2>

            <div className="flex items-start gap-3 pb-6">
              <MdOutlineCancel size={26} className="text-blue-500 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold">Flexible & Hassle-Free Cancellations</h3>
                <p className="text-gray-700 text-sm pt-2">
                  At <strong>{hotel?.name}</strong>, we understand that plans can change, and we want to offer you flexibility and peace of mind.

                  We provide <strong>free cancellation up to 1 month before your scheduled check-in</strong>. If your plans change closer to your arrival date, you can still cancel up to <strong>15 days before check-in and receive a 50% refund</strong>.

                  For cancellations made <strong>within 1 week of check-in</strong>, we are unable to offer a refund, as your room and personalized arrangements have already been prepared.

                  This policy is designed to give you clear options at every stage, allowing you to book with confidence and adjust as needed.


                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 pb-6">
              <MdAutorenew size={26} className="text-blue-500 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold">Easy & Transparent Refunds</h3>
                <p className="text-gray-700 text-sm pt-2">
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
                <h3 className="text-lg font-semibold">24/7 Dedicated Guest Support</h3>
                <p className="text-gray-700 text-sm pt-2">
                  We know that questions or last-minute changes don’t always fit within business hours. That’s why our guest support
                  team is available around the clock to assist with any modifications, special requests, or travel emergencies.
                  From helping you secure a last-minute upgrade to arranging a late check-out, we are here to make sure your experience
                  remains effortless and truly memorable. Your comfort is not just our priority — it is our promise.
                </p>
              </div>
            </div>
          </div>


          <div className="bg-gray-50 p-8 w-full rounded-xl mx-auto pt-8">
            <h2 className="text-2xl font-bold pb-4 text-gray-800">Nearby Attractions</h2>
            <div className="space-y-4">
              {nearbyAttractions?.length === 0 ? (
                <p className="text-gray-500 text-sm">No nearby attractions available.</p>
              ) : (
                nearbyAttractions.map((attraction, index) => {
                  const Icon = iconMap[attraction.type] || MdPlace;
                  return (
                    <div key={index} className="flex items-center gap-3 bg-white p-3 rounded-md">
                      <Icon size={24} className="text-blue-500 flex-shrink-0" />
                      <div>
                        <h3 className="text-base font-medium text-gray-700">{attraction.name}</h3>
                        <p className="text-gray-500 text-sm">{attraction.distance} away</p>
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
              className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50"
              onClick={() => setShowModal2(false)}
            >
              <div
                className="bg-white p-6 rounded-xl w-full max-w-3xl shadow-xl overflow-y-auto max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Booking Summary</h2>

                <div className="mb-6 text-gray-700">
                  <p><strong>Check-In Date:</strong> {currentState.checkIn}</p>
                  <p><strong>Check-Out Date:</strong> {currentState.checkOut}</p>
                  <p><strong>Total Guests:</strong> {currentState.total}</p>
                </div>

                {bookingData.map((item, index) => {
                  const nights = numberofDays || 1;
                  const subtotal = item.room.pricePerNight * item.count * nights;

                  return (
                    <div
                      key={index}
                      className="border border-gray-200 p-4 rounded-lg mb-6 shadow-sm bg-gray-50"
                    >
                      <h3 className="text-lg font-bold text-blue-600 mb-2">{item.room.name}</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
                        {/* <p><strong>Room ID:</strong> {item.room.id}</p> */}
                        <p><strong>Number of Rooms Booked:</strong> {item.count}</p>
                        <p><strong>Max Occupancy per Room:</strong> {item.room.maxOccupancy}</p>
                        <p><strong>Available Rooms:</strong> {item.room.totalRooms}</p>
                        <p><strong>Price per Night:</strong> ₹{item.room.pricePerNight}</p>
                        <p><strong>Total Nights:</strong> {nights}</p>
                        <p><strong>Subtotal:</strong> ₹{subtotal}</p>
                      </div>

                      <div className="mt-3">
                        <p className="font-medium text-gray-800">Features:</p>
                        <ul className="list-disc list-inside text-gray-600 text-sm">
                          {item.room.features.map((feature, i) => (
                            <li key={i}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}

                <div className="border-t border-gray-200 pt-4 text-right">
                  <p className="text-xl font-bold text-green-600">
                    Grand Total: ₹
                    {bookingData.reduce(
                      (acc, item) => acc + item.room.pricePerNight * item.count * (numberofDays || 1),
                      0
                    )}
                  </p>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => {
                      // console.log("Final booking confirmed!", bookingData);
                      handleBook()
                      setShowModal2(false);
                    }}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                  >
                    Confirm Booking
                  </button>
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