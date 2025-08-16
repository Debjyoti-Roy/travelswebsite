import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { auth, provider } from "../auth/firebase";
import { signInWithPopup } from "firebase/auth";
import { fetchUserProfile, registerUser } from "../Redux/store/userSlice";
import { confirmPayment } from "../Redux/store/paymentSlice";
import toast from "react-hot-toast";
import LoginModal from "../Components/LoginModal";
import PaymentSuccessfullModal from "./ModalComponent/PaymentSuccessfullModal";
import PaymentFailedModal from "./ModalComponent/PaymentFailModal";

const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
//   const orderId = searchParams.get("orderId");
  const bookingCode = searchParams.get("bookingCode");
  
  // Login state
  const [showModal, setShowModal] = useState(false);
  const [login, setLogin] = useState("login");
  const [phone, setPhone] = useState("");
  const [error2, setError] = useState(false);
  const [currentuser, setCurrentUser] = useState({});
  const [initialToken, setInitialToken] = useState();
  const [user, setUser] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [userData, setUserData] = useState();
  const [orderId, setOrderId]=useState(searchParams.get("orderId"))

  // Payment state
  const [bookingId, setBookingId] = useState(searchParams.get("bookingCode"));
  const [razorpayId, setRazorpayId] = useState("");
  const [totalAmt, setTotalAmount] = useState("");
  const [bookingModal, setBookingModal] = useState(false);
  const [failModal, setFailModal] = useState(false);
  const [paidAt, setPaidAt] = useState("");
  
  const { paymentLoading, paymentStatus, paymentError } = useSelector((state) => state.payment);

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (orderId) {
        if (user) {
          // User is logged in
          console.log("User is logged in:", user.email);
          setShowModal(false);
          openRazorpay(orderId);
        } else {
          // User is not logged in
          console.log("User is not logged in");
          setShowModal(true);
        }
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, [orderId]);

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
      // Proceed with payment after successful login
      openRazorpay(orderId);
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
      // Proceed with payment after successful login
      openRazorpay(orderId);
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
          // Proceed with payment after successful login
          openRazorpay(orderId);
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

    if (res.payload.status == 200 || res.payload.status == 409) {
      setPaidAt(res.payload.data?.paidAt);
      setBookingModal(true);
    } else {
      setFailModal(true);
    }
  };

  const openRazorpay = (orderId) => {
    const cookies = document.cookie.split("; ");
    const userDataCookie = cookies.find((row) =>
      row.startsWith("userData=")
    );
    
    // if (!userDataCookie) {
    //   toast.error("User data not found. Please login again.", {
    //     style: {
    //       borderRadius: "10px",
    //       background: "#333",
    //       color: "#fff",
    //     },
    //   });
    //   return;
    // }

    const value = userDataCookie.split("=")[1];
    const decoded = JSON.parse(decodeURIComponent(value));
    
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      name: "INO TRAVELS",
      description: "Hotel Booking Payment",
      order_id: orderId,

      handler: async function (response) {
        await handlePaymentConfirm(
          response.razorpay_payment_id, 
          response.razorpay_order_id, 
          response.razorpay_signature
        );
      },
      
      modal: {
        ondismiss: () => {
          toast.error("Payment was cancelled.", {
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
        },
      },

      prefill: {
        name: decoded.name,
        email: decoded.email,
        contact: (!decoded.phoneNumber || decoded.phoneNumber === "" || decoded.phoneNumber === "NA") ? null : decoded.phoneNumber,
      },

      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  if (!orderId || !bookingCode) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Invalid Payment Request</h1>
          <p className="text-gray-600 mb-6">Missing order ID or booking code.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Complete Your Payment</h1>
          <p className="text-gray-600">Please login to proceed with your hotel booking payment</p>
        </div>

        <div className="space-y-4 text-left">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Order ID</p>
            <p className="font-semibold text-gray-800">{orderId}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Booking Code</p>
            <p className="font-semibold text-gray-800">{bookingCode}</p>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={() => setShowModal(true)}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Login to Continue
          </button>
        </div>
      </div> */}

      {/* Login Modal */}
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

      {/* Payment Success Modal */}
      {bookingModal && (
        <PaymentSuccessfullModal
          bookingId={bookingId}
          checkIn={""}
          checkOut={""}
          total={1}
          paidAt={paidAt}
          onClose={() => {
            setShowModal(false)
            setBookingModal(false);
            setBookingId("");
            navigate("/");
          }}
        />
      )}

      {/* Payment Failed Modal */}
      {failModal && (
        <PaymentFailedModal
          onClose={() => {
            setFailModal(false);
            setBookingId("");
          }}
        />
      )}
    </div>
  );
};

export default PaymentPage;
