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
import { FaBoxOpen, FaCar, FaHotel } from "react-icons/fa";

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

const Search = () => {
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

  // Pick one random image only once per reload
  const randomImg = useMemo(() => {
    const index = Math.floor(Math.random() * images.length);
    return images[index];
  }, []);
  const [tab, setTab] = useState("Package");
  const [pic, setPic] = useState("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1600' height='900' viewBox='0 0 1600 900'%3E%3Crect fill='%232589f3' width='1600' height='900'/%3E%3Cpolygon fill='%234ea3f8' points='957 450 539 900 1396 900'/%3E%3Cpolygon fill='%235dacf2' points='957 450 872.9 900 1396 900'/%3E%3Cpolygon fill='%2367b8f5' points='-60 900 398 662 816 900'/%3E%3Cpolygon fill='%2372c4f7' points='337 900 398 662 816 900'/%3E%3Cpolygon fill='%237dd0f9' points='1203 546 1552 900 876 900'/%3E%3Cpolygon fill='%2388dcfb' points='1203 546 1552 900 1162 900'/%3E%3Cpolygon fill='%2393e8fd' points='641 695 886 900 367 900'/%3E%3Cpolygon fill='%239ef4ff' points='587 900 641 695 886 900'/%3E%3Cpolygon fill='%23a9ffff' points='1710 900 1401 632 1096 900'/%3E%3Cpolygon fill='%23b4ffff' points='1710 900 1401 632 1365 900'/%3E%3Cpolygon fill='%23bfffff' points='1210 900 971 687 725 900'/%3E%3Cpolygon fill='%23caffff' points='943 900 1210 900 971 687'/%3E%3C/svg%3E")
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
              {/* <div className="flex justify-start w-full border-b border-gray-300">
                <button
                  onClick={() => setTab("Package")}
                  className={`flex items-center gap-2 px-5 py-5  border-b-2 transition-all duration-300
      ${tab === "Package" ? "border-blue-500 text-blue-500" : "border-transparent text-gray-600 hover:text-blue-400"}
    `}
                >
                  <FaBoxOpen size={18} />
                  <span className="hidden md:inline">Packages</span>
                </button>

                <button
                  onClick={() => setTab("Hotels")}
                  className={`flex items-center gap-2 px-5 py-5  border-b-2 transition-all duration-300
      ${tab === "Hotels" ? "border-blue-500 text-blue-500" : "border-transparent text-gray-600  hover:text-blue-400"}
    `}
                >
                  <FaHotel size={18} className={${tab === 'hotels' ? 'text-blue-500' : ''}} />
                  <span className="hidden md:inline">Hotels</span>
                </button>

                <button
                  onClick={() => setTab("Cars")}
                  className={`flex items-center gap-2 px-5 py-5  border-b-2 transition-all duration-300
      ${tab === "Cars" ? "border-blue-500 text-blue-500" : "border-transparent text-gray-600 hover:text-blue-400"}
    `}
                >
                  <FaCar size={18} />
                  <span className="hidden md:inline">Cars</span>
                </button>
              </div> */}
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
                </div>



              </div>

              <div className="selectsection">
                {tab === "Package" && <PackagesSearch />}
                {tab === "Hotels" && <Hotelsearch />}
                {tab === "Cars" && <CarRental />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;