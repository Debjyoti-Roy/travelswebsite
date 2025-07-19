import React, { useState, useEffect, useRef } from "react";
import { auth, provider } from "../auth/firebase";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { Box, Modal } from "@mui/material";
import google from "./../assets/google.png";
import {
  FaClipboardList,
  FaFingerprint,
  FaQuestionCircle,
  FaUser,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile, registerUser } from "../Redux/store/userSlice";
import {
  FiClipboard,
  FiHelpCircle,
  FiLogOut,
  FiPhone,
  FiUser,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const Navbar = () => {
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const dispatch = useDispatch();
  const { loading, userInfo, error } = useSelector((state) => state.user);
  const [login, setLogin] = useState("login");
  // const [phone, setPhone] = useState("");
  const [error2, setError] = useState(false);
  const [phoneNumberfunctions, setPhoneNumberFunctions] = useState(false);
  const [currentuser, setCurrentUser] = useState({});
  const [initialToken, setInitialToken] = useState();
  const [userData, setUserData] = useState();
  const [userDetails, setUserDetails] = useState({});
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // const []

  const handleClose = () => {
    setShowModal(false);
    setLogin("login");
  };

  const refreshTokenTimer = (user) => {
    setInterval(async () => {
      const refreshedToken = await user.getIdToken(true);
      localStorage.setItem("token", refreshedToken);
      // window.dispatchEvent(new Event("tokenUpdated"));
      // console.log("Token refreshed");
    }, 40 * 60 * 1000);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Check if "userData" cookie exists
        const hasUserDataCookie = document.cookie
          .split(";")
          .some((c) => c.trim().startsWith("userData="));

        if (!hasUserDataCookie) {
          try {
            const uid = currentUser.uid;
            const token = await currentUser.getIdToken();
            // console.log(token);

            const pulledData = await dispatch(
              fetchUserProfile({ uid: uid, token: token })
            );

            // console.log(pulledData);

            if (pulledData.payload?.status === 200) {
              // console.log(pulledData.payload?.data);
              setUserData(pulledData.payload?.data);

              // Save to cookie
              document.cookie = `userData=${encodeURIComponent(
                JSON.stringify(pulledData.payload?.data)
              )}; path=/; max-age=2592000`;

              refreshTokenTimer(currentUser);
              // console.log("Existing user");
              setShowModal(false);
            } else {
              await auth.signOut();
              setShowModal(false);
              document.cookie = "userData=; path=/; max-age=0";
            }
          } catch (error) {
            console.error("Error while fetching user profile:", error);
            await auth.signOut();
            setShowModal(false);
          }
        } else {
          const token = await currentUser.getIdToken();
          localStorage.setItem("token", token);
          refreshTokenTimer(currentUser);
        }
      } else {
        setUser(null);
        document.cookie = "userData=; path=/; max-age=0";
      }
    });

    return () => unsubscribe();
  }, []);

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
      console.log(refreshedToken);
      localStorage.setItem("token", refreshedToken);
      setUser(thunkResponse.payload?.data);
      document.cookie = `userData=${encodeURIComponent(
        JSON.stringify(pulledData.payload?.data)
      )}; path=/; max-age=2592000`;
      window.dispatchEvent(new Event("tokenUpdated"));
      refreshTokenTimer(currentuser);
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

    console.log(thunkResponse);

    if (thunkResponse.payload?.status === 201) {
      const refreshedToken = await currentUser.getIdToken(true);
      console.log(refreshedToken);
      localStorage.setItem("token", refreshedToken);
      setUser(thunkResponse.payload?.data);
      document.cookie = `userData=${encodeURIComponent(
        JSON.stringify(pulledData.payload?.data)
      )}; path=/; max-age=2592000`;
      window.dispatchEvent(new Event("tokenUpdated"));
      refreshTokenTimer(currentuser);
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
          console.log(initialtoken);
          phoneNumberChange2(
            currentUser,
            currentUser.phoneNumber,
            initialtoken
          );
        }
      } else {
        console.log(result);
        // const user = auth.currentUser;
        // await user.delete();
        const uid = currentUser.uid;
        const pulledData = await dispatch(
          fetchUserProfile({ uid: uid, token: initialtoken })
        );
        console.log(pulledData);
        console.log(initialtoken);
        if (pulledData.payload?.status === 200) {
          // console.log(pulledData.payload?.data);p
          setUserData(pulledData.payload?.data);
          // localStorage.setItem("userData", pulledData.payload?.data);
          localStorage.setItem("token", initialtoken);
          document.cookie = `userData=${encodeURIComponent(
            JSON.stringify(pulledData.payload?.data)
          )}; path=/; max-age=2592000`;
          refreshTokenTimer(currentUser);
          window.dispatchEvent(new Event("tokenUpdated"));
          console.log("Existing user");
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

  useEffect(() => {
    const handleUser = () => {
      const newToken = localStorage.getItem("token");
      if (newToken) {
        console.log("NAVBAR 1");
        const cookies = document.cookie.split("; ");
        const userDataCookie = cookies.find((row) =>
          row.startsWith("userData=")
        );

        if (userDataCookie) {
          const value = userDataCookie.split("=")[1];
          const decoded = JSON.parse(decodeURIComponent(value));
          console.log(decoded);
          setUserDetails(decoded);
        } else {
          console.log("userData cookie not found");
        }
      } else {
        console.log("NAVBAR 2");
        localStorage.removeItem("token");
        document.cookie =
          "userData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      }
    };

    window.addEventListener("tokenUpdated", handleUser);

    handleUser();

    return () => window.removeEventListener("tokenUpdated", handleUser);
  }, []);

  useEffect(() => {
    console.log(userDetails.imageUrl);
  }, [userDetails.imageUrl]);

  return (
    <div className="Nav sticky top-0 z-50 shadow">
      <div className="NavSection">
        {/* Desktop Layout - Single Row */}
        <div className="hidden lg:flex justify-between items-center">
          <h2 className="Navspan Navtext">Ino Travels</h2>
          <ul className="NavOptions Navtext">
            <li onClick={() => {
              navigate("/")
            }} className="cursor-pointer relative text-gray-700 hover:text-blue-600 transition-colors duration-300 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full">
              Home
            </li>
            <li className="cursor-pointer relative text-gray-700 hover:text-blue-600 transition-colors duration-300 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full">
              About
            </li>
            <li className="cursor-pointer relative text-gray-700 hover:text-blue-600 transition-colors duration-300 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full">
              Contact us
            </li>
            <li
              onClick={() => {
                navigate("/partner")
              }}
              className="cursor-pointer relative text-gray-700 hover:text-blue-600 transition-colors duration-300 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full">
              Be a Partner
            </li>
            {!user ? (
              <button onClick={() => setShowModal(true)} className="LoginBtn">
                Login
              </button>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="focus:outline-none"
                >
                  {userDetails.imageUrl && userDetails.imageUrl !== "" ? (
                    <img
                      src={userDetails.imageUrl}
                      alt="user"
                      className="w-[34px] h-[34px] rounded-full object-cover border border-gray-300"
                    />
                  ) : (
                    <div className="w-[34px] h-[34px] rounded-full bg-blue-500 flex items-center justify-center border border-gray-300">
                      <span className="text-white font-semibold">
                        {userDetails.name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                  )}
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                    {/* Header */}
                    <div className="flex items-center gap-3 p-4 border-b border-gray-100 bg-gray-50">
                      {userDetails.imageUrl && userDetails.imageUrl !== "" ? (
                        <img
                          src={userDetails.imageUrl}
                          alt="user"
                          className="w-12 h-12 rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center border border-gray-200">
                          <span className="text-white font-semibold text-lg">
                            {userDetails.name?.charAt(0).toUpperCase() || "U"}
                          </span>
                        </div>
                      )}

                      <div>
                        <p className="font-semibold text-gray-800">
                          {userDetails.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {userDetails.email}
                        </p>
                      </div>
                    </div>

                    {/* Options */}
                    <div className="flex flex-col">
                      <button
                        onClick={() => {
                          navigate("/profile")
                          setShowDropdown(false)
                        }}
                        className="px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition"
                      >
                        <FiUser className="text-gray-500 text-lg" />
                        My Profile
                      </button>

                      <button
                      onClick={() => {
                          navigate("/mybookings")
                          setShowDropdown(false)
                        }
                        }
                       className="px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition">
                        <FiClipboard className="text-gray-500 text-lg" />
                        My Bookings
                      </button>

                      <button
                        
                        className="px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition">
                        <FiHelpCircle className="text-gray-500 text-lg" />
                        Help & Center
                      </button>

                      <hr className="my-1 border-gray-200" />

                      <button
                        onClick={() => {
                          auth.signOut();
                          localStorage.removeItem("token");
                          window.dispatchEvent(new Event("tokenUpdated"));
                          setShowDropdown(false);
                        }}
                        className="px-4 py-2 text-left hover:bg-gray-50 text-red-500 flex items-center gap-2 transition"
                      >
                        <FiLogOut className="text-red-500 text-lg" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ul>
        </div>

        {/* Mobile/Tablet Layout - Two Rows */}
        <div className="lg:hidden">
          {/* First Row - Logo and Login/User */}
          <div className="flex justify-between items-center py-3">
            <h2 className="Navspan Navtext">Ino Travels</h2>
            {!user ? (
              <button onClick={() => setShowModal(true)} className="LoginBtn">
                Login
              </button>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="focus:outline-none"
                >
                  {userDetails.imageUrl && userDetails.imageUrl !== "" ? (
                    <img
                      src={userDetails.imageUrl}
                      alt="user"
                      className="w-[34px] h-[34px] rounded-full object-cover border border-gray-300"
                    />
                  ) : (
                    <div className="w-[34px] h-[34px] rounded-full bg-blue-500 flex items-center justify-center border border-gray-300">
                      <span className="text-white font-semibold">
                        {userDetails.name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                  )}
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                    {/* Header */}
                    <div className="flex items-center gap-3 p-4 border-b border-gray-100 bg-gray-50">
                      {userDetails.imageUrl && userDetails.imageUrl !== "" ? (
                        <img
                          src={userDetails.imageUrl}
                          alt="user"
                          className="w-12 h-12 rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center border border-gray-200">
                          <span className="text-white font-semibold text-lg">
                            {userDetails.name?.charAt(0).toUpperCase() || "U"}
                          </span>
                        </div>
                      )}

                      <div>
                        <p className="font-semibold text-gray-800">
                          {userDetails.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {userDetails.email}
                        </p>
                      </div>
                    </div>

                    {/* Options */}
                    <div className="flex flex-col">
                      <button
                        onClick={() => {
                          navigate("/profile")
                          setShowDropdown(false)
                        }}
                        className="px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition"
                      >
                        <FiUser className="text-gray-500 text-lg" />
                        My Profile
                      </button>

                      <button
                      onClick={() => {
                          navigate("/mybookings")
                          setShowDropdown(false)
                        }
                        }
                       className="px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition">
                        <FiClipboard className="text-gray-500 text-lg" />
                        My Bookings
                      </button>

                      <button
                        
                        className="px-4 py-2 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition">
                        <FiHelpCircle className="text-gray-500 text-lg" />
                        Help & Center
                      </button>

                      <hr className="my-1 border-gray-200" />

                      <button
                        onClick={() => {
                          auth.signOut();
                          localStorage.removeItem("token");
                          window.dispatchEvent(new Event("tokenUpdated"));
                          setShowDropdown(false);
                        }}
                        className="px-4 py-2 text-left hover:bg-gray-50 text-red-500 flex items-center gap-2 transition"
                      >
                        <FiLogOut className="text-red-500 text-lg" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Second Row - Navigation Menu */}
          <div className="flex justify-center pb-3">
            <ul className="NavOptions Navtext mobile-nav">
              <li onClick={() => {
                navigate("/")
              }} className="cursor-pointer relative text-gray-700 hover:text-blue-600 transition-colors duration-300 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full whitespace-nowrap">
                Home
              </li>
              <li className="cursor-pointer relative text-gray-700 hover:text-blue-600 transition-colors duration-300 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full whitespace-nowrap">
                About
              </li>
              <li className="cursor-pointer relative text-gray-700 hover:text-blue-600 transition-colors duration-300 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full whitespace-nowrap">
                Contact us
              </li>
              <li
                onClick={() => {
                  navigate("/partner")
                }}
                className="cursor-pointer relative text-gray-700 hover:text-blue-600 transition-colors duration-300 after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all after:duration-300 hover:after:w-full whitespace-nowrap">
                Be a Partner
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Modal
        open={showModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="moadalHeader">
            <div className="modalHeader-text">
              <h1 className="text-2xl text-semibold text-white">Welcome</h1>
              <p className="text-white">Sign in to continue</p>
            </div>
          </div>
          {login === "login" && (
            <div className="ModalContent">
              <div className="ModalContentText">
                <div className="content h-[50%]">
                  <FaFingerprint className="finger" />

                  <h3>One Click Google sign in</h3>
                  <span>Sign in securely with google</span>
                </div>
                <button
                  className="googleButton bg-[#fff] w-[80%]"
                  onClick={handleGoogleLogin}
                >
                  <div className="googlediv">
                    <img src={google} className="GoogleImage" alt="google" />
                    <p className="text-[#555}">Sign in with Google</p>
                  </div>
                </button>
              </div>
            </div>
          )}
          {login === "phone" && (
            <div className="ModalContent">
              <div className="ModalContentText">
                <div className="content h-full">
                  {/* <FaFingerprint className="finger" /> */}
                  <FiPhone className="finger" />

                  <h3>Please enter yor Phone Number for future reference</h3>
                  <div className="flex flex-col gap-[5px] w-[80%]">
                    <div className="flex flex-col  w-full">
                      <input
                        type="text"
                        value={phone}
                        onChange={handleChange}
                        placeholder="Phone Number"
                        className={`border p-2 rounded focus:outline-none ${error2 ? "border-red-500" : "border-gray-300"
                          }`}
                      />
                      {error2 && (
                        <span className="text-red-500 text-sm mt-1">
                          Please enter a valid 10-digit phone number
                        </span>
                      )}
                    </div>
                    <div className="flex gap-[5px] w-full">
                      <button
                        className="googleButton bg-[#2589f3] w-1/2"
                        onClick={() => {
                          phoneNumberChange("");
                        }}
                      >
                        <div className="googlediv">
                          <p className="text-white">Skip</p>
                        </div>
                      </button>
                      <button
                        className="googleButton bg-[#fff] w-1/2"
                        onClick={() => {
                          phoneNumberChange(phone);
                        }}
                      >
                        <div className="googlediv">
                          <p className="text-[#555]">Submit</p>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default Navbar;
