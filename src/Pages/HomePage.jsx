import React, { useEffect, useRef, useState } from "react";
import Search from "./HomePageComponents/Search";
import Query from "./HomePageComponents/Query";
import { fetchPartnerProfile } from "../Redux/store/partnerSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const topRef = useRef(null);
  const navigate = useNavigate()

  const dispatch = useDispatch();

  const partnerState = useSelector((state) => state.partner);
  const [status, setStatus] = useState(401)
  const [rejectionStatus, setRejectionStatus] = useState("")

  useEffect(() => {
    const partner = async () => {
      const token = localStorage.getItem("token")
      let res
      if (token) {

        res = await dispatch(fetchPartnerProfile({ token }))
      }
      console.log(res.payload)
      setRejectionStatus(res?.payload?.data?.status)

      if (res?.payload?.status) {

        setStatus(res?.payload?.status)
      }
    }
    window.addEventListener("tokenUpdated", partner);

    // Also run once on mount (in case already logged in/out)
    partner();

    return () => window.removeEventListener("tokenUpdated", partner);
  }, [])


  // const [hasNavigated, setHasNavigated] = useState(false);

useEffect(() => {
  const hasNavigated = JSON.parse(localStorage.getItem("navigation") || "false");
  if (!hasNavigated && status === 200 && rejectionStatus === "APPROVED") {
    navigate("/partnerdashboard");
    // setHasNavigated(true); // prevent future auto-navigations
    localStorage.setItem("navigation", JSON.stringify(true));
  } else if (!hasNavigated) {
    // Only scroll if we haven't navigated yet
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
      <Search ref={topRef} />
      <Query />
    </>
  );
};

export default HomePage;
