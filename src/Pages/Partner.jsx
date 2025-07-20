import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPartnerProfile, registerPartner } from '../Redux/store/partnerSlice';
import { useNavigate } from 'react-router-dom';

const Partner = () => {
    const options = ["Hotel", "Car", "Guest house"];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fade, setFade] = useState(true);
    const [loggedIn, setLoggedIn] = useState(false)
    const [name, setName] = useState("");
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [gst, setGst] = useState("")
    const [pan, setPan] = useState("")
    const [address, setAddress] = useState("")
    const [status, setStatus] = useState(401)
    const [rejectionStatus, setRejectionStatus] = useState("")
    const [reason, setReason] = useState("")

    const navigate = useNavigate()

    const dispatch = useDispatch();

    const partnerState = useSelector((state) => state.partner);
    const { loading, error, partnerData } = partnerState;

    const registerRef = useRef(null);

    const handleScrollToRegister = () => {
        registerRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const partner = async () => {
            const token = localStorage.getItem("token")
            let res
            if (token) {

                res = await dispatch(fetchPartnerProfile({ token }))
            }
            console.log(res.payload)
            setRejectionStatus(res?.payload?.data?.status)
            if (res?.payload.data?.status === "REJECTED") {
                setReason(res?.payload.data?.rejectionReason)
            }
            if (res?.payload?.status) {

                setStatus(res?.payload?.status)
            }
        }
        window.addEventListener("tokenUpdated", partner);

        // Also run once on mount (in case already logged in/out)
        partner();

        return () => window.removeEventListener("tokenUpdated", partner);
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false); // Start fade-out
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % options.length);
                setFade(true); // Start fade-in
            }, 300); // Duration of fade-out
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleTokenUpdate = () => {
            const newToken = localStorage.getItem("token");
            //   setToken(newToken);
            if (newToken) {

                const cookies = document.cookie.split("; ");
                const userDataCookie = cookies.find((row) =>
                    row.startsWith("userData=")
                );

                if (userDataCookie) {
                    setLoggedIn(true);
                    const value = userDataCookie.split("=")[1];
                    const decoded = JSON.parse(decodeURIComponent(value));
                    // console.log(decoded);
                    setName(decoded.name)
                    setEmail(decoded.email)
                    setAddress(decoded.address || "")
                    setPhone(decoded.phoneNumber || "")
                } else {
                    // console.log("userData cookie not found");
                }
            } else {
                setLoggedIn(false)
                // console.log(1)
            }
        };

        // Listen for custom event
        window.addEventListener("tokenUpdated", handleTokenUpdate);

        // Also run once on mount (in case already logged in/out)
        handleTokenUpdate();

        return () => window.removeEventListener("tokenUpdated", handleTokenUpdate);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault()

        const newData = {
            address: address,
            panNumber: pan,
            gstNumber: gst,
            phone: phone
        }
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

        if (!panRegex.test(newData.panNumber)) {

            toast.error("Invalid PAN number", {
                style: {
                    borderRadius: "10px",
                    background: "#333",
                    color: "#fff",
                },
            });
        } else if (!gstRegex.test(newData.gstNumber)) {
            toast.error("Invalid Gst number", {
                style: {
                    borderRadius: "10px",
                    background: "#333",
                    color: "#fff",
                },
            });
        } else {
            // console.log(newData)
            const token = localStorage.getItem("token");

            const result = await dispatch(registerPartner({ newData, token }));
            // console.log(registerPartner.fulfilled.match(result))
            if (registerPartner.fulfilled.match(result)) {
                // console.log(partnerData)
                toast.success("Request Submitted Successfully!!", {
                    style: {
                        borderRadius: "10px",
                        background: "#333",
                        color: "#fff",
                    },
                });
            } else {
                // console.log(result.payload)
                toast.error(result.payload.message, {
                    style: {
                        borderRadius: "10px",
                        background: "#333",
                        color: "#fff",
                    },
                });
            }
        }
    }
    return (
        <div className="min-h-screen bg-[#f5f5f5]">

            {/* Header section */}
            <div className="h-[40vh]">
                <div className="w-full h-full bg-gradient-to-r from-[#2589f3] via-[#4ea3f8] to-[#5dacf2] flex justify-center">
                    <div className="md:w-[61%] w-[90%] flex flex-col gap-4 justify-center relative">
                        <div className="rounded-xl px-6 py-8">
                            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 leading-snug">
                                List your
                                <br />
                                <span
                                    className={`text-[#0036ac] inline-block transition-opacity duration-500 ease-in-out ${fade ? "opacity-100" : "opacity-0"
                                        }`}
                                >
                                    {options[currentIndex]}
                                </span>
                                <br />
                                on our website
                            </h1>

                            <p className="text-white text-sm md:text-lg pt-3 max-w-xl">
                                Join our network of premium hotels and resorts to reach millions of travelers across India.
                            </p>
                        </div>

                        {/* Register Button */}
                        <div className="absolute right-4">
                            <button
                                onClick={handleScrollToRegister}
                                className="bg-white text-[#2589f3] font-semibold mb-5 px-6 py-3 rounded-full shadow-md transition-all duration-300 hover:bg-[#2589f3] hover:text-white hover:shadow-lg hover:scale-105"
                            >
                                {status === 200 ? "See your status" : "Register Now"}
                            </button>

                        </div>
                    </div>
                </div>
            </div>
            {/* Why Section */}
            <div className="min-h-[50vh]">
                <div className="w-full flex justify-center px-4 py-12">
                    <div className="md:w-[60%] w-[90%] flex flex-col gap-8 justify-center">

                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">
                            Why register your property with us?
                        </h2>

                        <ul className="flex flex-col gap-6">
                            <li className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                                <h3 className="text-xl font-semibold text-[#2589f3] mb-2">Maximize your revenue</h3>
                                <p className="text-gray-600">
                                    Fill more rooms and vehicles year-round with flexible pricing and real-time booking support.
                                </p>
                            </li>
                            <li className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                                <h3 className="text-xl font-semibold text-[#2589f3] mb-2">Seamless management</h3>
                                <p className="text-gray-600">
                                    Easily handle availability, bookings, and guest communication in one simple dashboard.
                                </p>
                            </li>
                            <li className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                                <h3 className="text-xl font-semibold text-[#2589f3] mb-2">Dedicated support</h3>
                                <p className="text-gray-600">
                                    Get personal assistance and marketing guidance from our experienced partner success team.
                                </p>
                            </li>
                        </ul>

                    </div>
                </div>
            </div>


            {/* Register Section */}
            <div ref={registerRef} className="min-h-[30vh] bg-white">
                {loggedIn ? (
                    <>
                        {status === 200 && rejectionStatus === "PENDING" ? (
                            <div className="w-full h-full justify-center gap-5 flex flex-col items-center px-4 py-12">
                                <h2 className="text-2xl md:text-4xl text-center font-bold text-gray-800 mb-4">
                                    Your registration is <span className="text-yellow-500">pending approval</span> ✨
                                </h2>
                                <p className="text-gray-600 text-center max-w-md">
                                    We’re thrilled to have you join our exclusive network. Hang tight — our team is reviewing your application to help you unlock a world of new opportunities.
                                </p>
                            </div>
                        ) : status === 200 && rejectionStatus === "REJECTED" ? (
                            <div className="w-full h-full justify-center gap-5 flex flex-col items-center px-4 py-12">
                                <h2 className="text-2xl md:text-4xl text-center font-bold text-gray-800 mb-4">
                                    Your application has been <span className="text-red-600">rejected</span>
                                </h2>
                                <p className="text-gray-600 text-center max-w-md">
                                    {reason || "Unfortunately, your application didn’t meet our criteria at this time. You can update your details and try again later!"}
                                </p>
                            </div>
                        ) : status === 200 && rejectionStatus === "APPROVED" ? (
                            <div className="w-full h-full justify-center gap-5 flex flex-col items-center px-4 py-12">
                                <h2 className="text-2xl md:text-4xl text-center font-bold text-gray-800 mb-4">
                                    🎉 Congratulations! You’re <span className="text-green-500">approved</span>!
                                </h2>
                                <p className="text-gray-600 text-center max-w-md">
                                    Your property has been successfully approved and is now part of our exclusive network. Get ready to welcome more guests and grow your business with us!
                                </p>
                                <button
                                    onClick={() => navigate("/partnerdashboard")}
                                    type="button"
                                    className="w-[58%] cursor-pointer bg-[#2589f3] text-white font-semibold py-3 rounded-full shadow-md transition-all duration-300 hover:bg-[#0036ac] hover:shadow-lg hover:scale-105"
                                >
                                    Go to Dashboard
                                </button>
                            </div>
                        ) : (
                            status === 404 || status === 401 && (
                                <div className="w-full flex justify-center px-4 py-12">
                                    <div className="md:w-[60%] w-[90%] bg-gray-50 rounded-xl shadow-xl p-8 flex flex-col gap-6">
                                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">
                                            Register Your Property
                                        </h2>
                                        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                                            <input
                                                type="text"
                                                placeholder="Name"
                                                required
                                                value={name}
                                                readOnly
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2589f3] transition"
                                            />
                                            <input
                                                type="email"
                                                placeholder="Email"
                                                required
                                                readOnly
                                                value={email}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2589f3] transition"
                                            />
                                            <input
                                                type="tel"
                                                placeholder="Phone Number"
                                                required
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2589f3] transition"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Address"
                                                required
                                                value={address}
                                                onChange={(e) => setAddress(e.target.value)}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2589f3] transition"
                                            />
                                            <input
                                                type="text"
                                                placeholder="GST Number"
                                                required
                                                value={gst}
                                                onChange={(e) => setGst(e.target.value)}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2589f3] transition"
                                            />
                                            <input
                                                type="text"
                                                placeholder="PAN Number"
                                                required
                                                value={pan}
                                                onChange={(e) => setPan(e.target.value)}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2589f3] transition"
                                            />
                                            <button
                                                type="submit"
                                                className="cursor-pointer bg-[#2589f3] text-white font-semibold py-3 rounded-full shadow-md transition-all duration-300 hover:bg-[#0036ac] hover:shadow-lg hover:scale-105"
                                            >
                                                Register Now
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            )
                        )}
                    </>
                ) : (
                    <div className="w-full h-full flex justify-center items-center px-4 py-20">
                        <div className="bg-white w-[60%] rounded-xl flex flex-col gap-4 text-center">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                                Please log in to get started
                            </h2>
                            <p className="text-gray-600 text-base md:text-lg w-full mx-auto">
                                You need to log in to register your property and access your partner dashboard. Start your journey with us today and unlock new opportunities for your business!
                            </p>
                        </div>
                    </div>


                )}

            </div>
        </div>

    )
}

export default Partner