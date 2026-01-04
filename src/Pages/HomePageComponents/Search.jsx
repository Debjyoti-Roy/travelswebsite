import React, { useEffect, useMemo, useRef, useState } from "react";
import PackagesSearch from "./PackagesSearch";
import Hotelsearch from "./Hotelsearch";
// import img from "../assets/FrontImage.jpg"
import img from "../../assets/FrontImage.jpg"
import img2 from "../../assets/bg1.jpg"
import img3 from "../../assets/bg2.jpg"
import img4 from "../../assets/bg3.jpg"
import img5 from "../../assets/bg4.jpg"
import CarRental from "./CarRental";
import { FaBoxOpen, FaCar, FaHotel, FaMapMarkerAlt } from "react-icons/fa";
import Pickup from "./Pickup";

function TabButton({ label, Icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 select-none
  ${active ? "bg-white text-blue-600 shadow-md border border-blue-50" : "text-gray-600 hover:text-blue-500"}`}
      aria-pressed={active}
    >
      <Icon size={16} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

const Search = ({ selectedTab, setSelectedTab, setPickFlag, setPickupRoutesDetails }) => {
  const topRef = useRef(null);

  useEffect(() => {
    const navbarHeight = 80;
    const elementTop = topRef.current.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: elementTop - navbarHeight,
      behavior: "smooth",
    });

  }, []);
  const images = [img, img2, img3, img4, img5];
  const randomImg = useMemo(() => {
    const index = Math.floor(Math.random() * images.length);
    return images[index];
  }, []);
  const [tab, setTab] = useState("Package");
  const [pickupFlag, setPickupFlag] = useState(false);
  const [pickRoutesDetails, setPickRoutesDetails] = useState({});
  useEffect(() => {
    setSelectedTab(tab);
  }, [tab]);
  useEffect(() => {
    setPickFlag(pickupFlag);  
  }, [pickupFlag]);
  useEffect(() => {
    setPickupRoutesDetails(pickRoutesDetails);
  }, [pickRoutesDetails]);
  return (
    <>
      <div ref={topRef} className="hero-section">
        <img src={randomImg} alt="Hero" className="hero-img" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
        <div className="hero-text">
          <h1>Discover Your Next Adventure</h1>
          <p>
            Explore breathtaking destinations and create memories that last a
            lifetime.
          </p>

          {/* <div className="searchSection"> */}
          <div className="pt-5">
            <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl border border-gray-100">
              <div className="flex items-center gap-3 p-3 sm:p-4 border-b border-gray-200">
                <div className="flex items-center gap-2 bg-white/60 rounded-full p-1 shadow-inner">
                  <TabButton
                    label="Packages"
                    Icon={FaBoxOpen}
                    active={tab === "Package"}
                    onClick={() => setTab("Package")}
                  />
                  <TabButton
                    label="Hotels"
                    Icon={FaHotel}
                    active={tab === "Hotels"}
                    onClick={() => setTab("Hotels")}
                  />
                  <TabButton
                    label="Cars"
                    Icon={FaCar}
                    active={tab === "Cars"}
                    onClick={() => setTab("Cars")}
                  />
                  <TabButton
                    label="Pickup"
                    Icon={FaMapMarkerAlt}
                    active={tab === "Pickup"}
                    onClick={() => setTab("Pickup")}
                  />
                </div>



              </div>

              <div className="selectsection">
                {tab === "Package" && <PackagesSearch />}
                {tab === "Hotels" && <Hotelsearch />}
                {tab === "Cars" && <CarRental />}
                {tab === "Pickup" && <Pickup setPickupFlag={setPickupFlag} setPickRoutesDetails={setPickRoutesDetails} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;