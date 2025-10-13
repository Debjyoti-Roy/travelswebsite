import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../auth/firebase';
import LoginModal from '../Components/LoginModal';
import { getTourDetails, sendPrivateEnquire, sendPublicEnquire } from '../Redux/store/tourPackageSlice';
import { MdArrowForward, MdAutorenew, MdHotel, MdLocationOn, MdOutlineCancel, MdSupportAgent } from 'react-icons/md';
import { Carousel } from 'react-responsive-carousel';
import { FaCarSide } from 'react-icons/fa';
import TourPackageShare from '../Components/TourPackageShare';
import { fetchUserProfile, registerUser } from '../Redux/store/userSlice';
import TourPackageSuccessModal from './ModalComponent/TourPackageSuccessModal';
import PaymentFailedModal from './ModalComponent/PaymentFailModal';

const TourDetails = () => {
    const location = useLocation();
    const navigate = useNavigate()
    const { state } = location;
    const urlParams = new URLSearchParams(window.location.search);
    let urlState = {};

    if (urlParams.get("tourPackage")) {
        try {
            const data2 = JSON.parse(
                decodeURIComponent(atob(urlParams.get("tourPackage")))
            );
            const data = {
                id: data2.id,
                travelDate: data2.travelDate
            }
            urlState = data
        } catch (e) {
            urlState = {};
        }
    } else {
        // console.log("No carPackage found in URL");
    }
    const currentState = state || urlState
    const dispatch = useDispatch()
    const { tourDetails, tourDetailsLoading, tourDetailsError, tourDetailsStatus } = useSelector((state) => state.tourPackage)
    const [showModal2, setShowModal2] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [paidAt, setPaidAt] = useState("")
    const [bookingModal, setBookingModal] = useState(false)
    const [failModal, setFailModal] = useState(false)
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
        if (thunkResponse.payload?.status === 201) {
            const refreshedToken = await currentuser.getIdToken(true);
            localStorage.setItem("token", refreshedToken);
            setUser(pulledData.payload?.data);
            document.cookie = `userData=${encodeURIComponent(
                JSON.stringify(pulledData.payload?.data)
            )}; path=/; max-age=2592000`;
            window.dispatchEvent(new Event("tokenUpdated"));
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
        if (thunkResponse.payload?.status === 201) {
            const refreshedToken = await currentUser.getIdToken(true);
            localStorage.setItem("token", refreshedToken);
            setUser(pulledData.payload?.data);
            document.cookie = `userData=${encodeURIComponent(
                JSON.stringify(pulledData.payload?.data)
            )}; path=/; max-age=2592000`;
            window.dispatchEvent(new Event("tokenUpdated"));
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
            setInitialToken(initialtoken);

            if (isNewUser) {
                if (
                    currentUser.phoneNumber === "" ||
                    currentUser.phoneNumber === undefined ||
                    currentUser.phoneNumber === null
                ) {
                    setLogin("phone");
                    setCurrentUser(currentUser);
                } else {
                    setShowModal(false);
                    phoneNumberChange2(
                        currentUser,
                        currentUser.phoneNumber,
                        initialtoken
                    );
                }
            } else {
                const uid = currentUser.uid;
                const pulledData = await dispatch(
                    fetchUserProfile({ uid: uid, token: initialtoken })
                );
                if (pulledData.payload?.status === 200) {
                    setUserData(pulledData.payload?.data);
                    localStorage.setItem("token", initialtoken);
                    document.cookie = `userData=${encodeURIComponent(
                        JSON.stringify(pulledData.payload?.data)
                    )}; path=/; max-age=2592000`;
                    window.dispatchEvent(new Event("tokenUpdated"));
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
        } catch (error) {
            console.error("Google login failed:", error);
        } finally {
            setIsLoggingIn(false);
        }
    };

    //Inquire
    const [loggedIn, setLoggedIn] = useState(false);
    const [name, setName] = useState("");
    const [contact, setContact] = useState("");
    const [numberofPeople, setNumberofPeople] = useState("0")
    const [note, setNote] = useState("")
    const [errors, setErrors] = useState({});
    const [enquireDetails, setEnquireDetails] = useState({})
    // const [bookingModal, setBookingModal]=useState(false)
    const [bookingId, setBookingId] = useState("")
    // const [paidAt, setPaidAt]=useState("")
    const [total, setTotal] = useState("")
    const [queryType, setQueryType] = useState()
    const [message, setMessage] = useState("")
    useEffect(() => {
        const handleTokenUpdate = () => {
            const newToken = localStorage.getItem("token");
            // setToken(newToken);
            if (newToken) {
                setLoggedIn(true);
                const cookies = document.cookie.split("; ");
                const userDataCookie = cookies.find((row) =>
                    row.startsWith("userData=")
                );

                if (userDataCookie) {
                    const value = userDataCookie.split("=")[1];
                    const decoded = JSON.parse(decodeURIComponent(value));
                    console.log(decoded);
                    setName(decoded.name);
                    if (decoded.phoneNumber && decoded.phoneNumber !== "") {
                        setContact(decoded.phoneNumber);
                    } else {
                        setContact(decoded.email);
                    }
                } else {
                    console.log("userData cookie not found");
                }
            } else {
                setContact("");
                setName("");
                setLoggedIn(false);
            }
        };

        // Listen for custom event
        window.addEventListener("tokenUpdated", handleTokenUpdate);

        // Also run once on mount (in case already logged in/out)
        handleTokenUpdate();

        return () => window.removeEventListener("tokenUpdated", handleTokenUpdate);
    }, []);


    //LOGIN KHOTOM
    //Booking
    const [bookingPrice, setBookingPrice] = useState("")
    const [pkg, setPkg] = useState({})
    const validate = () => {
        const newErrors = {};
        if (!name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!contact.trim()) {
            newErrors.contact = "Contact is required";
        } else {
            // Email regex OR phone regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const phoneRegex = /^[0-9]{10}$/;
            if (!emailRegex.test(contact) && !phoneRegex.test(contact)) {
                newErrors.contact = "Enter a valid email or 10-digit phone number";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleEnquire = async () => {
        if (validate()) {
            // setShowModal2(false);
            const [day, month, year] = currentState.travelDate.split("-");
            const formattedDate = `${year}-${month}-${day}`;
            const data = {
                name: name,
                contact: contact,
                packageId: tourDetails.id,
                journeyDate: formattedDate,
                noOfPeople: numberofPeople,
                tourType: pkg.tourType,
                note: note
            }
            // console.log(data)
            const user = auth.currentUser;
            if (user) {
                const token = localStorage.getItem('token')
                const push = await dispatch(sendPrivateEnquire({ token: token, body: data }))
                //    if (sendPublicQuery.fulfilled.match(push))
                if (sendPrivateEnquire.fulfilled.match(push)) {

                    //createdAt
                    // : 
                    // "2025-09-24T02:20:51.330836"
                    // message
                    // : 
                    // "I am interested in booking the \"Darjeeling Weekend Getaway 3D/2N\" package.\n\nDetails:\nPreferred Travel Date(s): 2025-09-27,\nNumber of Travelers: 4,\nPackage Type: BUDGET,\nAny special requirements: YES\n"
                    // queryType
                    // : 
                    // "PACKAGE"
                    // status
                    // : 
                    // "OPEN"
                    // subject
                    // : 
                    // "Booking Enquiry for: Darjeeling Weekend Getaway 3D/2N"
                    // ticketId
                    // : 
                    // "TPB-20250924-KN3LYA"
                    // updatedAt
                    // : 
                    // "2025-09-24T02:20:51.330896"
                    const pushedData = push.payload.data
                    setBookingId(pushedData.ticketId)
                    setQueryType(pushedData.queryType)
                    setMessage(pushedData.subject)
                    setShowModal2(false)
                    setBookingModal(true)
                } else {
                    setShowModal(false)
                    setFailModal(true)
                }
            } else {
                const push = await dispatch(sendPublicEnquire({ body: data }))
                if (sendPublicEnquire.fulfilled.match(push)) {
                    console.log(push.payload.data)
                    const pushedData = push.payload.data
                    setBookingId(pushedData.ticketId)
                    setQueryType(pushedData.queryType)
                    setShowModal2(false)
                    setBookingModal(true)
                } else {
                    setShowModal(false)
                    setFailModal(true)
                }

            }
        }
    };
    const handleBookNow = (price, packageDet) => {
        setBookingPrice(price)
        setPkg(packageDet)
        // const user = auth.currentUser;
        // if (user) {

        setShowModal2(true);
        // } else {
        // setShowModal(true);

        // }
    };
    //Booking khotom
    const [mnth, setMnth] = useState()
    useEffect(() => {
        const [day, month, year] = currentState.travelDate.split("-");
        setMnth(month)
    }, [state])
    const getDetails = useCallback(() => {
        dispatch(getTourDetails({ id: currentState.id }));
    }, [dispatch, currentState])
    useEffect(() => {
        getDetails()
        // console.log(currentState)
    }, [getTourDetails])

    //Booking

    useEffect(() => {
        console.log("numberOfPeople:", numberofPeople, "type:", typeof numberofPeople);
    }, [numberofPeople]);




    const getMonthName = (monthNumber) => {
        const date = new Date();
        date.setMonth(monthNumber - 1); // JS months are 0-indexed
        return date.toLocaleString('default', { month: 'long' });
    };

    // const { tourDetails, tourDetailsLoading, tourDetailsError, tourDetailsStatus } = useSelector((state) => state.tourPackage)
    const travelMonth = currentState?.travelDate
        ? parseInt(currentState.travelDate.split("-")[1], 10)
        : null;

    const pickupPoints = tourDetails?.pickupLocation?.split(",").map((p) => p.trim()) || [];
    const dropPoints = tourDetails?.dropLocation?.split(",").map((d) => d.trim()) || [];

    if (tourDetailsLoading) return <p>Loading...</p>;
    if (tourDetailsError) return <p className="text-red-600">{tourDetailsError}</p>;
    if (!tourDetails || tourDetails.length === 0) return <p>No details available</p>;
    return (
        <div className="w-full bg-gray-50">
            {/* Package Header */}
            <div className="hero-section">
            {/* <div className="relative h-[350px] w-full "> */}
                <img
                    style={{ marginTop: "-8vh" }}
                    src={tourDetails?.thumbnailUrl}
                    alt="package thumbnail"
                    className="hero-img"
                    // className="h-full w-full object-cover"
                />
                <div className='absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent'></div>

                {/* Text Content */}
                <div className="absolute bottom-6 left-6 right-6 text-white drop-shadow-lg flex justify-between">
                    <div>

                        <h1 className="text-3xl md:text-5xl font-bold">
                            {tourDetails?.title}
                        </h1>

                        {/* Destination */}
                        {tourDetails?.destination && (
                            <p className="mt-2 text-sm md:text-lg flex items-center gap-2">
                                <span className="font-medium">Destination:</span>
                                <span className="font-semibold text-blue-200">
                                    {tourDetails.destination.name}
                                </span>
                                <span className="text-gray-200 text-sm">
                                    ({tourDetails.destination.state})
                                </span>
                            </p>
                        )}
                    </div>

                    {/* <CarShareButton carPackage={carDetails} travelDate={currentState.travelDate} className="self-start md:self-end" /> */}
                    <TourPackageShare tourPackage={tourDetails} travelDate={currentState.travelDate} className="self-start md:self-end" />
                </div>
            </div>
            <div className="flex justify-center">
                <div className="lg:w-[70%] w-full flex justify-center flex-col">
                    <div className="max-w-full mx-auto px-6 pb-6 pt-8">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-indigo-100 rounded-2xl shadow-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-6">

                            {/* Pickup */}
                            <div className="flex flex-col gap-2 flex-1">
                                <div className="flex items-center justify-center gap-2 text-blue-600 font-semibold">
                                    <MdLocationOn size={20} />
                                    <span>Pickup</span>
                                </div>
                                <div className="flex justify-center flex-wrap gap-2">
                                    {pickupPoints?.map((p, i) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1 text-sm bg-white border border-blue-200 text-blue-700 rounded-full shadow-sm hover:bg-blue-100 transition"
                                        >
                                            {p}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Arrow */}
                            <div className="text-indigo-500">
                                <MdArrowForward size={28} />
                            </div>

                            {/* Drop */}
                            <div className="flex flex-col gap-2 flex-1">
                                <div className="flex items-center justify-center gap-2 text-green-600 font-semibold">
                                    <MdLocationOn size={20} />
                                    <span>Drop</span>
                                </div>
                                <div className="flex justify-center flex-wrap gap-2">
                                    {dropPoints?.map((d, i) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1 text-sm bg-white border border-green-200 text-green-700 rounded-full shadow-sm hover:bg-green-100 transition"
                                        >
                                            {d}
                                        </span>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>


                    {/* Itineraries */}
                    <div className="w-full mx-auto px-6 pt-10 pb-5">
                        <h2 className="text-3xl font-bold pb-12 text-gray-800">Itinerary</h2>

                        <div className="relative border-l-4 border-blue-500 pl-6 space-y-16">
                            {/* Journey Start */}
                            <div className="absolute -left-[4px] top-0 transform -translate-x-full bg-white px-3 py-1 rounded-full shadow text-blue-600 font-semibold">
                                Journey Start
                            </div>

                            {tourDetails?.itineraries?.map((day, idx) => (
                                <div
                                    key={idx}
                                    className={`relative flex flex-col md:flex-row gap-5 items-center md:items-stretch ${idx % 2 === 1 ? "md:flex-row-reverse" : ""
                                        }`}
                                >
                                    {/* Day marker */}
                                    <div className="absolute -left-[46px] top-5 w-10 h-10 bg-gradient-to-r from-[#2589f3] via-[#4ea3f8] to-[#5dacf2] text-white font-bold rounded-full flex items-center justify-center shadow-lg">
                                        {day.dayNumber}
                                    </div>

                                    {/* Image */}
                                    <div className="md:w-1/2 rounded-2xl overflow-hidden shadow-xl transform hover:scale-102 transition-transform duration-500">
                                        <img
                                            src={day.imageUrl}
                                            alt={day.title}
                                            className="w-full h-[300px] object-cover"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="md:w-1/2 rounded-2xl p-6 flex flex-col justify-center relative z-10">
                                        <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                                            Day {day.dayNumber}:{" "}
                                            <span className="text-blue-600">{day.title}</span>
                                        </h3>
                                        <p className="text-gray-700 leading-relaxed text-lg">
                                            {day.description}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {/* Journey End */}
                            <div className="absolute -left-[4px] bottom-0 transform -translate-x-full bg-white px-3 py-1 rounded-full shadow text-blue-600 font-semibold">
                                Journey End
                            </div>
                        </div>
                    </div>





                    {/* Included / Excluded Features */}
                    <div className="px-6 py-8 bg-gray-50 rounded-xl">
                        <h2 className="text-3xl font-bold pb-4 text-gray-800">Package Details</h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold text-xl pb-2">Included</h3>
                                <ul className="list-disc list-inside text-gray-600 space-y-1">
                                    {tourDetails?.included?.map((f, ind) => (
                                        <li key={ind}>{f}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold text-xl pb-2">Excluded</h3>
                                <ul className="list-disc list-inside text-gray-600 space-y-1">
                                    {tourDetails?.excluded?.map((f, ind) => (
                                        <li key={ind}>{f}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className='p-4'>
                        <div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto"
                        // style={{ marginTop: "40px", marginBottom: "40px" }}
                        >
                            {tourDetails?.tourPackageTypes?.map((pkg, index) => {
                                const activePrice =
                                    pkg.seasonPrices?.find(
                                        (season) => season.isActive && mnth >= season.startMonth && mnth <= season.endMonth
                                    )?.price || pkg.seasonPrices?.[0]?.price || 0;

                                return (
                                    <div
                                        key={pkg.id || index}
                                        className="rounded-3xl bg-white overflow-hidden border border-gray-200 hover:shadow-2xl hover:scale-[1.02] transition-all duration-500"
                                    >
                                        <Carousel
                                            showThumbs={false}
                                            infiniteLoop
                                            showStatus={false}
                                            interval={4000}
                                            className="rounded-2xl overflow-hidden shadow-lg"
                                        >

                                            {[...(pkg.sampleHotelImageUrls || []), ...(pkg.sampleCarImageUrls || [])].map(
                                                (url, i) => (
                                                    <div key={`sample-${i}`} className="h-52 w-full aspect-square">
                                                        <img
                                                            src={url}
                                                            alt={`Sample ${i + 1}`}
                                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                                        />
                                                    </div>
                                                )
                                            )}
                                        </Carousel>



                                        {/* Content */}
                                        <div className="p-6 flex flex-col h-full">
                                            {/* Title */}
                                            <h2 className="text-xl font-bold text-gray-900 mb-2">
                                                {pkg.tourType.toUpperCase()} Package
                                            </h2>

                                            {/* <p className="text-gray-600 text-sm mb-6">
                                                {pkg.hotelType} • {pkg.carTypes}
                                            </p> */}
                                            <div className="flex items-center gap-3 mb-3">
                                                <MdHotel className="text-blue-600 text-xl" />
                                                <span className="text-gray-800">
                                                    <span className="font-semibold">Accommodation</span>
                                                    <br />
                                                    <span className="text-gray-600">{pkg.hotelType}</span>
                                                </span>
                                            </div>

                                            {/* Transportation */}
                                            <div className="flex items-center gap-3 mb-6">
                                                <FaCarSide className="text-green-600 text-xl" />
                                                <span className="text-gray-800">
                                                    <span className="font-semibold">Transportation</span>
                                                    <br />
                                                    <span className="text-gray-600">{pkg.carTypes}</span>
                                                </span>
                                            </div>

                                            {/* Price + Button */}
                                            <div className="flex items-center justify-between mt-auto">
                                                <span className="text-lg font-bold text-gray-900">
                                                    ₹{activePrice.toLocaleString("en-IN")}
                                                </span>
                                                <button onClick={() => handleBookNow(activePrice.toLocaleString("en-IN"), pkg)} className="cursor-pointer px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
                                                    Book Now →
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    {/* Cancellation / Refund Policy (like hotel theme) */}
                    <div className="bg-gray-50 p-8 rounded-xl mx-auto mt-8">
                        <h2 className="text-3xl font-bold pb-6 text-gray-800">Our Premium Cancellation Policy</h2>

                        <div className="flex items-start gap-3 pb-6">
                            <MdOutlineCancel size={26} className="text-blue-500 flex-shrink-0" />
                            <div>
                                <h3 className="text-xl font-semibold">Flexible & Hassle-Free Cancellations</h3>
                                <p className="text-gray-700 text-lg pt-2">
                                    100% refund for cancellations made 10 days or more before your scheduled trip.
                                    No refund for cancellations made within 10 days.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 pb-6">
                            <MdAutorenew size={26} className="text-blue-500 flex-shrink-0" />
                            <div>
                                <h3 className="text-xl font-semibold">Easy & Transparent Refunds</h3>
                                <p className="text-gray-700 text-lg pt-2">
                                    Eligible refunds will be processed within <strong>5–7 business days</strong> to your original payment method.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 pb-2">
                            <MdSupportAgent size={26} className="text-blue-500 flex-shrink-0" />
                            <div>
                                <h3 className="text-xl font-semibold">24/7 Guest Support</h3>
                                <p className="text-gray-700 text-lg pt-2">
                                    Our support team is available 24/7 to assist with any modifications, emergencies, or travel requests.
                                </p>
                            </div>
                        </div>
                    </div>

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
            {showModal2 && (
                <div
                    className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4"
                    onClick={() => setShowModal2(false)}
                >
                    <div
                        className="bg-white rounded-xl w-full max-w-3xl shadow-xl overflow-y-auto max-h-[90vh] mx-4"
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

                        {/* Package Details */}
                        <div className="px-8 py-6 border-b border-gray-100">
                            <h4 className="text-3xl font-bold text-gray-900 mb-3">{pkg.tourType} Package</h4>
                            <div className="flex items-center space-x-4">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                    {pkg.carTypes}
                                </span>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200">
                                    {pkg.hotelType}
                                </span>
                            </div>
                        </div>

                        {/* Images */}
                        <div className="px-8 py-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {pkg.sampleCarImageUrls?.[0] && (
                                <div className="rounded-lg overflow-hidden border">
                                    <img
                                        src={pkg.sampleCarImageUrls[0]}
                                        alt="Car"
                                        className="w-full h-48 object-cover"
                                    />
                                    <p className="text-center py-2 text-gray-700 font-medium">Car Sample</p>
                                </div>
                            )}
                            {pkg.sampleHotelImageUrls?.[0] && (
                                <div className="rounded-lg overflow-hidden border">
                                    <img
                                        src={pkg.sampleHotelImageUrls[0]}
                                        alt="Hotel"
                                        className="w-full h-48 object-cover"
                                    />
                                    <p className="text-center py-2 text-gray-700 font-medium">Hotel Sample</p>
                                </div>
                            )}
                        </div>

                        {/* User Info */}
                        <div className="px-8 py-6 border-t border-gray-200">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        disabled={loggedIn}
                                        className={`mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.name ? "border-red-500" : "border-gray-300"
                                            }`}
                                    />
                                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                </div>

                                {/* Contact */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Contact (Email or Phone)
                                    </label>
                                    <input
                                        type="text"
                                        value={contact}
                                        onChange={(e) => setContact(e.target.value)}
                                        disabled={loggedIn}
                                        className={`mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.contact ? "border-red-500" : "border-gray-300"
                                            }`}
                                    />
                                    {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact}</p>}
                                </div>

                                {/* Number of People */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Number of People</label>
                                    <input
                                        type="number"
                                        value={numberofPeople}
                                        onChange={(e) => setNumberofPeople(e.target.value ? parseInt(e.target.value) : "")}
                                        className={`mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.numberofPeople ? "border-red-500" : "border-gray-300"
                                            }`}
                                    />
                                    {errors.numberofPeople && (
                                        <p className="text-red-500 text-sm mt-1">{errors.numberofPeople}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className='px-8 py-6'>
                            <label className="block text-sm font-medium text-gray-700">Any Special Request? (Optional)</label>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                rows={3}
                                className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none border-gray-300"
                                placeholder="Add any special requests or notes..."
                            />
                        </div>
                        {/* Price Breakdown */}
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Price</h3>
                            <div className="flex justify-between items-center py-3">
                                <span className="text-gray-700 font-medium">Price per Person</span>
                                <span className="text-xl font-bold text-green-600">
                                    ₹{bookingPrice.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-xl">
                            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                                <button
                                    onClick={() => setShowModal2(false)}
                                    className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleEnquire}
                                    disabled={(!name || !contact || numberofPeople === "" || numberofPeople === "0" || numberofPeople === 0)}
                                    className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Enquire
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {bookingModal && (
                <TourPackageSuccessModal
                    bookingId={bookingId}
                    queryType={queryType}
                    total={bookingPrice}
                    message={message}
                    travelDate={currentState.travelDate}
                    numberofpeople={numberofPeople}
                    onClose={() => {
                        setBookingModal(false)
                        navigate("/")
                    }}
                />
            )}
            {failModal && (
                <PaymentFailedModal
                    onClose={() => {
                        setFailModal(false)
                    }}
                />
            )}

        </div>
    )
}

export default TourDetails