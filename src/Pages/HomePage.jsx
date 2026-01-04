// import React, { useEffect, useRef, useState } from "react";
// import Search from "./HomePageComponents/Search";
// import Query from "./HomePageComponents/Query";
// import { fetchPartnerProfile } from "../Redux/store/partnerSlice";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";

// const HomePage = () => {
//   const topRef = useRef(null);
//   const navigate = useNavigate()

//   const dispatch = useDispatch();

//   const partnerState = useSelector((state) => state.partner);
//   const [status, setStatus] = useState(401)
//   const [rejectionStatus, setRejectionStatus] = useState("")

//   useEffect(() => {
//     const partner = async () => {
//       const token = localStorage.getItem("token")
//       let res
//       if (token) {

//         res = await dispatch(fetchPartnerProfile({ token }))
//       }
//       console.log(res.payload)
//       setRejectionStatus(res?.payload?.data?.status)

//       if (res?.payload?.status) {

//         setStatus(res?.payload?.status)
//       }
//     }
//     window.addEventListener("tokenUpdated", partner);

    
//     partner();

//     return () => window.removeEventListener("tokenUpdated", partner);
//   }, [])

//   useEffect(() => {
//     let isRefreshing = false;
  
//     const beforeUnloadHandler = () => {
//       if (!isRefreshing) {
//         localStorage.setItem("navigation", JSON.stringify(false));
//       }
//     };
  
//     const visibilityChangeHandler = () => {
      
//       if (document.visibilityState === "hidden") {
        
//         isRefreshing = true;
//         setTimeout(() => {
//           isRefreshing = false;
//         }, 1000);
//       }
//     };
  
//     window.addEventListener("beforeunload", beforeUnloadHandler);
//     document.addEventListener("visibilitychange", visibilityChangeHandler);
  
//     return () => {
//       window.removeEventListener("beforeunload", beforeUnloadHandler);
//       document.removeEventListener("visibilitychange", visibilityChangeHandler);
//     };
//   }, []);
  

// useEffect(() => {
//   const hasNavigated = JSON.parse(localStorage.getItem("navigation") || "false");
//   if (!hasNavigated && status === 200 && rejectionStatus === "APPROVED") {
//     navigate("/partnerdashboard");
//     localStorage.setItem("navigation", JSON.stringify(true));
//   } else if (!hasNavigated) {
//     if (topRef.current) {
//       const navbarHeight = 80;
//       const elementTop = topRef.current.getBoundingClientRect().top + window.scrollY;
//       window.scrollTo({
//         top: elementTop - navbarHeight,
//         behavior: "smooth",
//       });
//     }
//   }
// }, [status, rejectionStatus, navigate]);



//   return (
//     <>
//       <Search ref={topRef} />
//       <Query />
//     </>
//   );
// };

// export default HomePage;
import React, { useEffect, useRef, useState } from "react";
import Search from "./HomePageComponents/Search";
import Query from "./HomePageComponents/Query";
import { fetchPartnerProfile } from "../Redux/store/partnerSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import About from "./HomePageComponents/About";
import RecentSearches from "./HomePageComponents/RecentSearches";

const HomePage = () => {
  const topRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [pickupFlag, setPickupFlag] = useState(false);
  const [pickupRoutesDetails, setPickupRoutesDetails] = useState({});

  const partnerState = useSelector((state) => state.partner);
  const [status, setStatus] = useState(401);
  const [rejectionStatus, setRejectionStatus] = useState("");
  const [selectedTab, setSelectedTab] = useState("");

  // Runs only when the tab is opened for the first time
  useEffect(() => {
    if (!sessionStorage.getItem("tabInitialized")) {
      // First time tab opened
      sessionStorage.setItem("tabInitialized", "true");
      localStorage.setItem("navigation", JSON.stringify(false));
    }

    const partner = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const res = await dispatch(fetchPartnerProfile({ token }));
        setRejectionStatus(res?.payload?.data?.status);
        if (res?.payload?.status) {
          setStatus(res?.payload?.status);
        }
      }
    };

    window.addEventListener("tokenUpdated", partner);
    partner();

    return () => window.removeEventListener("tokenUpdated", partner);
  }, [dispatch]);

  // Check conditions and navigate only once
  useEffect(() => {
    const hasNavigated = JSON.parse(localStorage.getItem("navigation") || "false");

    if (!hasNavigated && status === 200 && rejectionStatus === "APPROVED") {
      navigate("/partnerdashboard");
      localStorage.setItem("navigation", JSON.stringify(true));
    } else if (!hasNavigated) {
      // Scroll to topRef if navigation not done
      if (topRef.current) {
        const navbarHeight = 80;
        const elementTop = topRef.current.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: elementTop - navbarHeight,
          behavior: "smooth",
        });
      }
    }
  }, [status, rejectionStatus, navigate]);

  return (
    <>
      <Search ref={topRef} selectedTab={selectedTab} setSelectedTab={setSelectedTab} setPickFlag={setPickupFlag} setPickupRoutesDetails={setPickupRoutesDetails} />
      <RecentSearches selectedTab={selectedTab} pickupFlag={pickupFlag} pickupRoutesDetails={pickupRoutesDetails} />
      <About />
      <Query />
    </>
  );
};

export default HomePage;
