import React, { useState } from "react";
import PackagesSearch from "./PackagesSearch";
import Hotelsearch from "./Hotelsearch";
// import img from "../assets/FrontImage.jpg"
import img from "../../assets/FrontImage.jpg"
import CarRental from "./CarRental";

const Search = () => {
  const [tab, setTab] = useState("Package");
  const [pic, setPic] = useState("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1600' height='900' viewBox='0 0 1600 900'%3E%3Crect fill='%232589f3' width='1600' height='900'/%3E%3Cpolygon fill='%234ea3f8' points='957 450 539 900 1396 900'/%3E%3Cpolygon fill='%235dacf2' points='957 450 872.9 900 1396 900'/%3E%3Cpolygon fill='%2367b8f5' points='-60 900 398 662 816 900'/%3E%3Cpolygon fill='%2372c4f7' points='337 900 398 662 816 900'/%3E%3Cpolygon fill='%237dd0f9' points='1203 546 1552 900 876 900'/%3E%3Cpolygon fill='%2388dcfb' points='1203 546 1552 900 1162 900'/%3E%3Cpolygon fill='%2393e8fd' points='641 695 886 900 367 900'/%3E%3Cpolygon fill='%239ef4ff' points='587 900 641 695 886 900'/%3E%3Cpolygon fill='%23a9ffff' points='1710 900 1401 632 1096 900'/%3E%3Cpolygon fill='%23b4ffff' points='1710 900 1401 632 1365 900'/%3E%3Cpolygon fill='%23bfffff' points='1210 900 971 687 725 900'/%3E%3Cpolygon fill='%23caffff' points='943 900 1210 900 971 687'/%3E%3C/svg%3E")
  return (
    <>
      <div className="hero-section">
        <img src={pic} alt="Hero" className="hero-img" />
        {/* <div className="absolute inset-0 bg-gradient-to-r from-[#2589f3]/100 via-[#4ea3f8]/100 to-[#5dacf2]/100"></div> */}
        <div className="hero-text">
          <h1>Discover Your Next Adventure</h1>
          <p>
            Explore breathtaking destinations and create memories that last a
            lifetime.
          </p>

          <div className="searchSection">
            <div className="tabs">
              <button
                className={` firstbutton ${tab === "Package" ? "Selected" : "packageButton text-black"
                  } `}
                onClick={() => setTab("Package")}
              >
                Packages
              </button>
              <button
                className={` ${tab === "Hotels" ? "Selected" : "packageButton text-black"}`}
                onClick={() => setTab("Hotels")}
              >
                Hotels
              </button>
              <button
                className={` lastbutton ${tab === "Cars" ? "Selected" : "packageButton text-black"}`}
                onClick={() => setTab("Cars")}
              >
                Cars
              </button>
            </div>
            <div className="selectsection">
              {tab === "Package" && <PackagesSearch />}
              {tab === "Hotels" && <Hotelsearch />}
              {tab === "Cars" && <CarRental />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;
