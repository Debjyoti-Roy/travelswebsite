import React, { useState } from "react";
import PackagesSearch from "./PackagesSearch";
import Hotelsearch from "./Hotelsearch";
// import img from "../assets/FrontImage.jpg"
import img from "../../assets/FrontImage.jpg"
import CarRental from "./CarRental";

const Search = () => {
  const [tab, setTab] = useState("Package");
  return (
    <>
      <div className="hero-section">
        <img src={img} alt="Hero" className="hero-img" />
        <div className="hero-text">
          <h1>Discover Your Next Adventure</h1>
          <p>
            Explore breathtaking destinations and create memories that last a
            lifetime.
          </p>

          <div className="searchSection">
            <div className="tabs">
              <button
                className={` firstbutton ${
                  tab === "Package" ? "Selected" : "packageButton text-black"
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
