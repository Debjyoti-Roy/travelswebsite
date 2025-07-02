import React, { useState, useEffect } from "react";
import { auth, provider } from "../auth/firebase";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import {
  Box,
  Button,
  Divider,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import google from "./../assets/google.png";
import { FaFingerprint } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile, registerUser } from "../Redux/store/userSlice";
import { BsTelephone } from "react-icons/bs";
import { FiPhone } from "react-icons/fi";
import { getCookie } from "../Cookie/Cookie";
import toast from "react-hot-toast";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500, // increased width to make it large
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

  const handleClose = () => {
    setShowModal(false);
    setLogin("login");
  };

  const refreshTokenTimer = (user) => {
    setInterval(async () => {
      const refreshedToken = await user.getIdToken(true);
      localStorage.setItem("token", refreshedToken);
      // window.dispatchEvent(new Event("tokenUpdated"));
      console.log("Token refreshed");
    }, 50 * 60 * 1000);
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
            console.log(token)

            const pulledData = await dispatch(
              fetchUserProfile({ uid: uid, token: token })
            );

            console.log(pulledData);

            if (pulledData.payload?.status === 200) {
              console.log(pulledData.payload?.data);
              setUserData(pulledData.payload?.data);

              // Save to cookie
              document.cookie = `userData=${encodeURIComponent(
                JSON.stringify(pulledData.payload?.data)
              )}; path=/; max-age=2592000`;

              refreshTokenTimer(currentUser);
              console.log("Existing user");
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
        }else{
          const token = await currentUser.getIdToken();
            localStorage.setItem("token", token)
            refreshTokenTimer(currentUser)
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

    console.log(thunkResponse);

    if (thunkResponse.payload?.status === 201) {
      const refreshedToken = await currentuser.getIdToken(true);
      console.log(refreshedToken);
      localStorage.setItem("token", refreshedToken);
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
    console.log(token);
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
        console.log(currentUser.phoneNumber);
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
          localStorage.setItem("token", initialtoken)
          window.dispatchEvent(new Event("tokenUpdated"));
          document.cookie = `userData=${encodeURIComponent(
            JSON.stringify(pulledData.payload?.data)
          )}; path=/; max-age=2592000`;
          refreshTokenTimer(currentUser);
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

  return (
    <div className="Nav sticky top-0 z-50 shadow">
      <div className="NavSection">
        <h2 className="Navspan Navtext">Ino Travels</h2>
        <ul className="NavOptions Navtext">
          <li>Home</li>
          <li>About</li>
          <li>Contact us</li>
          {!user ? (
            <button onClick={() => setShowModal(true)} className="LoginBtn">
              Login
            </button>
          ) : (
            // <li onClick={() => auth.signOut()}>Logout</li>
            <button onClick={() => {auth.signOut()
              localStorage.removeItem("token")
              window.dispatchEvent(new Event("tokenUpdated"));
            }} className="LoginBtn">
              Logout
            </button>
          )}
        </ul>
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
                        className={`border p-2 rounded focus:outline-none ${
                          error2 ? "border-red-500" : "border-gray-300"
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
