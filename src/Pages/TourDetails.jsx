import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../auth/firebase';
import LoginModal from '../Components/LoginModal';
import { getTourDetails } from '../Redux/store/tourPackageSlice';
import { MdArrowForward, MdAutorenew, MdHotel, MdLocationOn, MdOutlineCancel, MdSupportAgent } from 'react-icons/md';
import { Carousel } from 'react-responsive-carousel';
import { FaCarSide } from 'react-icons/fa';

const TourDetails = () => {
    const location = useLocation();
    const navigate = useNavigate()
    const { state } = location;
    const urlParams = new URLSearchParams(window.location.search);
    let urlState = {};

    if (urlParams.get("carPackage")) {
        try {
            const data2 = JSON.parse(
                decodeURIComponent(atob(urlParams.get("carPackage")))
            );
            const data = {
                id: data2.packageId,
                travelDate: data2.travelDate
            }
            urlState = data
        } catch (e) {
            urlState = {};
        }
    } else {
        console.log("No carPackage found in URL");
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

    //LOGIN KHOTOM
    const [bookingData, setBookingData] = useState({})
    const handleBookNow = (applicablePrice, car) => {
        const [day, month, year] = currentState.travelDate.split("-");
        const formattedDate = `${year}-${month}-${day}`;

        const book = {
            seasonId: applicablePrice.seasonPriceId,
            journeyStartDate: formattedDate,
        };
        const modalDataShow = {
            book,
            applicablePrice,
            car
        }
        setBookingData(modalDataShow)


        const user = auth.currentUser;
        if (user) {

            setShowModal2(true);
        } else {

            setShowModal(true);

        }
    };
    const [mnth, setMnth] = useState()
    useEffect(() => {
        const [day, month, year] = state.travelDate.split("-");
        setMnth(month)
    }, [state])
    const getDetails = useCallback(() => {
        dispatch(getTourDetails({ id: currentState.id }));
    }, [dispatch, currentState])
    useEffect(() => {
        getDetails()
        console.log(currentState)
    }, [getTourDetails])

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
            <div className="relative h-[450px] w-full">
                <img
                    src={tourDetails?.thumbnailUrl}
                    alt="package thumbnail"
                    className="h-full w-full object-cover"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

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
                </div>
            </div>
            <div className="flex justify-center">
                <div className="lg:w-[70%] w-full flex justify-center flex-col">

                    {/* <div className="p-4 md:p-8 bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen">
                        <div className="space-y-12 max-w-7xl mx-auto" style={{ marginTop: "40px", marginBottom: "40px" }}>
                            {tourDetails?.tourPackageTypes?.map((pkg, index) => (
                                <div
                                    key={pkg.id || index}
                                    className="grid grid-cols-1 lg:grid-cols-3 gap-10 p-8 rounded-3xl shadow-2xl 
                   bg-white/60 backdrop-blur-lg border border-gray-200 
                   hover:shadow-3xl hover:scale-[1.03] transition-all duration-500"
                                    style={{ margin: "20px 0" }}
                                >
                                    
                                    <div className="lg:col-span-1 flex flex-col gap-8">
                                        {(pkg.sampleHotelImageUrls?.length > 0 || pkg.sampleCarImageUrls?.length > 0) && (
                                            <div>
                                                <h3 className="text-2xl font-bold text-gray-900 mb-4 border-l-4 border-purple-500 pl-3">
                                                    Sample Hotels & Cars
                                                </h3>
                                                <Carousel
                                                    showThumbs={false}
                                                    autoPlay
                                                    infiniteLoop
                                                    showStatus={false}
                                                    interval={4000}
                                                    className="rounded-2xl overflow-hidden shadow-lg"
                                                >
                                                    {[...(pkg.sampleHotelImageUrls || []), ...(pkg.sampleCarImageUrls || [])].map(
                                                        (url, i) => (
                                                            <div key={`sample-${i}`} className="aspect-square">
                                                                <img
                                                                    src={url}
                                                                    alt={`Sample ${i + 1}`}
                                                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                                                />
                                                            </div>
                                                        )
                                                    )}
                                                </Carousel>
                                            </div>
                                        )}
                                    </div>

                                    <div className="lg:col-span-2 flex flex-col">
                                        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
                                            {pkg.tourType} Package
                                        </h2>
                                        <p className="text-gray-700 italic text-lg mb-6">
                                            {pkg.carTypes} & {pkg.hotelType} Hotel
                                        </p>

                                        {pkg.seasonPrices?.length > 0 && (
                                            <div className="mt-8">
                                                <h3 className="text-2xl font-semibold text-gray-800 mb-5 border-b pb-2">
                                                    Seasonal Pricing
                                                </h3>
                                                <div className="space-y-4">
                                                    {pkg.seasonPrices.map((season, i) =>
                                                        season.isActive && (
                                                            <div
                                                                key={i}
                                                                className="flex items-center justify-between p-5 rounded-xl 
                 bg-gradient-to-r from-gray-50 to-gray-100 
                 border border-gray-200 shadow-sm hover:shadow-md transition-all"
                                                            >
                                                                <div className="font-medium text-gray-700 text-md">
                                                                    {getMonthName(season.startMonth)}
                                                                    <span className="mx-2 text-gray-500"> to </span>
                                                                    {getMonthName(season.endMonth)}
                                                                </div>
                                                                <div className="flex items-center gap-5">
                                                                    <span className="text-xl font-bold text-gray-900">
                                                                        ₹{season.price.toLocaleString("en-IN")}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )
                                                    )}

                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div> */}


                    {/* Cars Section */}
                    {/* <div className="max-w-full mx-auto px-6 pb-3 pt-8">
                        <h2 className="text-3xl font-semibold pb-6 text-gray-800">
                            Available Cars
                        </h2>

                        <div className="space-y-6">
                            {tourDetails.carDetails.map((car) => {
                                const applicablePrice = travelMonth
                                    ? car.carPrices.find(
                                        (p) => travelMonth >= p.startMonth && travelMonth <= p.endMonth
                                    )
                                    : null;

                                return (
                                    <div
                                        key={car.carId}
                                        className="relative border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition bg-white flex flex-col md:flex-row"
                                    >
                                        <div className="flex-1 pr-4">
                                            <h3 className="text-xl font-bold text-gray-800">{car.carName}</h3>
                                            <p className="text-gray-600 mt-1 text-sm md:text-base">
                                                Type: {car.carType} | Capacity: {car.capacity} | Luggage:{" "}
                                                {car.luggageCapacity}
                                            </p>
                                            <p className="text-gray-600 text-sm">
                                                AC: {car.acAvailable ? "Yes" : "No"}
                                            </p>
                                            {car.notes && (
                                                <p className="text-gray-500 text-md mt-2 italic">{car.notes}</p>
                                            )}
                                        </div>

                                        <div className="flex flex-col items-end justify-between mt-4 md:mt-0 md:w-40">
                                            <div className="text-right">
                                                <p className="text-gray-500 text-sm">Price</p>
                                                {applicablePrice ? (
                                                    <p className="text-blue-600 font-semibold text-lg">
                                                        ₹{applicablePrice.price}
                                                    </p>
                                                ) : (
                                                    <p className="text-gray-400 italic text-sm">
                                                        No price available
                                                    </p>
                                                )}
                                            </div>

                                            <button onClick={() => handleBookNow(applicablePrice, car)} className="cursor-pointer mt-3 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow">
                                                Book Now
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                    </div> */}
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
                                    key={day.itineraryId}
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
                                                <button className="cursor-pointer px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
                                                    Book Now →
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* <div className="p-4 md:p-8 bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen">
                        <div className="space-y-12 max-w-7xl mx-auto" style={{ marginTop: "40px", marginBottom: "40px" }}>
                            {tourDetails?.tourPackageTypes?.map((pkg, index) => (
                                <div
                                    key={pkg.id || index}
                                    className="grid grid-cols-1 lg:grid-cols-3 gap-10 p-8 rounded-3xl shadow-2xl 
                   bg-white/60 backdrop-blur-lg border border-gray-200 
                   hover:shadow-3xl hover:scale-[1.03] transition-all duration-500"
                                    style={{ margin: "20px 0" }}
                                >
                                    
                                    <div className="lg:col-span-1 flex flex-col gap-8">
                                        {(pkg.sampleHotelImageUrls?.length > 0 || pkg.sampleCarImageUrls?.length > 0) && (
                                            <div>
                                                <h3 className="text-2xl font-bold text-gray-900 mb-4 border-l-4 border-purple-500 pl-3">
                                                    Sample Hotels & Cars
                                                </h3>
                                                <Carousel
                                                    showThumbs={false}
                                                    // autoPlay
                                                    infiniteLoop
                                                    showStatus={false}
                                                    interval={4000}
                                                    className="rounded-2xl overflow-hidden shadow-lg"
                                                >
                                                    {[...(pkg.sampleHotelImageUrls || []), ...(pkg.sampleCarImageUrls || [])].map(
                                                        (url, i) => (
                                                            <div key={`sample-${i}`} className="aspect-square">
                                                                <img
                                                                    src={url}
                                                                    alt={`Sample ${i + 1}`}
                                                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                                                />
                                                            </div>
                                                        )
                                                    )}
                                                </Carousel>
                                            </div>
                                        )}
                                    </div>

                                    <div className="lg:col-span-2 flex flex-col">
                                        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
                                            {pkg.tourType} Package
                                        </h2>
                                        <p className="text-gray-700 italic text-lg mb-6">
                                            {pkg.carTypes} & {pkg.hotelType} Hotel
                                        </p>

                                        {pkg.seasonPrices?.length > 0 && (
                                            <div className="mt-8">
                                                <h3 className="text-2xl font-semibold text-gray-800 mb-5 pb-2">
                                                    Seasonal Pricing
                                                </h3>
                                                <div className="space-y-4">
                                                    {pkg.seasonPrices
                                                        .filter(
                                                            (season) =>
                                                                season.isActive &&
                                                                mnth >= season.startMonth &&
                                                                mnth <= season.endMonth
                                                        )
                                                        .map((season, i) => (
                                                            <div
                                                                key={i}
                                                                className="flex items-center justify-between p-5 rounded-xl 
                 bg-gradient-to-r from-gray-50 to-gray-100 
                 border border-gray-200 shadow-sm hover:shadow-md transition-all"
                                                            >
                                                                <div className="flex items-center gap-5">
                                                                    <span className="text-xl font-bold text-gray-900">
                                                                        ₹{season.price.toLocaleString("en-IN")}
                                                                    </span>
                                                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                                                                        Book Now
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}

                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div> */}



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
            {/* {showModal2 && bookingData && (
                <div
                    className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4"
                    onClick={() => setShowModal2(false)}
                >
                    <div
                        className="bg-white rounded-xl w-full max-w-3xl shadow-xl overflow-y-auto max-h-[90vh] mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
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
                            <p className="text-gray-600 text-sm mt-1">
                                Please review your booking details
                            </p>
                        </div>
                        <div className="bg-white overflow-hidden">
                            <div className="px-8 py-6 border-b border-gray-100">
                                <h4 className="text-3xl font-bold text-gray-900 mb-3">
                                    {bookingData.car?.carName}
                                </h4>
                                <div className="flex items-center  space-x-4">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                        {bookingData.car?.carType}
                                    </span>
                                    {bookingData.car?.acAvailable ? (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            AC Available
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-50 text-gray-600 border border-gray-200">
                                            No AC
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="px-8 py-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col items-center text-center space-y-4">
                                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h6 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Capacity</h6>
                                            <p className="text-2xl font-bold text-blue-600 mt-1">
                                                {bookingData.car?.capacity}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {bookingData.car?.capacity === 1 ? 'Passenger' : 'Passengers'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center text-center space-y-4">
                                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h6 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Luggage</h6>
                                            <p className="text-2xl font-bold text-blue-600 mt-1">
                                                {bookingData.car?.luggageCapacity}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {bookingData.car?.luggageCapacity === 1 ? 'Large bag' : 'Large bags'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {bookingData.car?.notes && (
                                <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
                                    <div className="flex items-start space-x-3">
                                        <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div>
                                            <h6 className="text-sm font-semibold text-gray-900 mb-1">Additional Information</h6>
                                            <p className="text-gray-700 text-sm leading-relaxed">
                                                {bookingData.car?.notes}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="px-6 py-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Season Info</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                                <div>
                                    <p className="text-sm text-gray-600">Travel Date</p>
                                    <p className="font-semibold">{bookingData.book?.journeyStartDate}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Number of days</p>
                                    <p className="font-semibold">{carDetails.durationDays}</p>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Price Breakdown</h3>
                            <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                <span className="text-gray-700 font-medium">Total Price</span>
                                <span className="text-xl font-bold text-green-600">
                                    ₹{bookingData.applicablePrice.price?.toLocaleString()}
                                </span>
                            </div>

                            <div className="flex justify-between items-center mt-3">
                                <span className="text-gray-700 font-medium">Pay Now</span>
                                <span className="text-lg font-bold text-orange-600">
                                    ₹{Math.max(499, bookingData.applicablePrice.price * 0.1).toLocaleString()}
                                </span>
                            </div>

                            <div className="flex justify-between items-center mt-2">
                                <span className="text-gray-700 font-medium">Remaining Amount</span>
                                <span className="text-lg font-bold text-blue-600">
                                    ₹{(bookingData.applicablePrice.price - Math.max(499, bookingData.applicablePrice.price * 0.1)).toLocaleString()}
                                </span>
                            </div>
                        </div>

                        
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
                        </div>
                    </div>
                </div>
            )} */}
            {/* {bookingModal && (
                <CarPackageSuccessModal
                    bookingId={bookPackageData.bookingGroupCode}
                    paidAt={paidAt}
                    total={bookPackageData.initialAmount}
                    travelDate={state.travelDate}
                    numberofdays={carDetails.durationDays}
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
            )} */}

        </div>
    )
}

export default TourDetails