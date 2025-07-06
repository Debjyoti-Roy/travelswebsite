import React, { useState } from "react";
import { places } from "./Places";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Hotelsearch = () => {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [showGuestOptions, setShowGuestOptions] = useState(false);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  return (
    <div className="package-search-container">
      <h2 className="title">Find Your Hotels</h2>
      <div className="form-grid2">
        <select className="input-field first">
          <option value="">Select Location</option>
          {places.map((place, index) => (
            <option key={index} value={place.name}>
              {place.name}
            </option>
          ))}
        </select>

        <DatePicker
          selectsRange
          startDate={startDate}
          endDate={endDate}
          onChange={(update) => {
            setStartDate(update[0]);
            setEndDate(update[1]);
          }}
          isClearable={true}
          placeholderText="Select Check-in - Check-out"
          className="input-field date"
          popperPlacement="bottom-start"
          popperClassName="custom-datepicker"
        />

        <div className="guest-selector-wrapper">
          <div
            className="input-field"
            onClick={() => setShowGuestOptions(!showGuestOptions)}
          >
            {`${adults} Adults${
              children > 0 ? ` · ${children} Children` : ""
            } · ${rooms} Rooms`}
          </div>

          {showGuestOptions && (
            <div className="guest-dropdown">
              <div className="guest-row">
                <span>Adults</span>
                <button onClick={() => setAdults(Math.max(1, adults - 1))}>
                  -
                </button>
                <span>{adults}</span>
                <button onClick={() => setAdults(adults + 1)}>+</button>
              </div>

              <div className="guest-row">
                <span>Children</span>
                <button onClick={() => setChildren(Math.max(0, children - 1))}>
                  -
                </button>
                <span>{children}</span>
                <button onClick={() => setChildren(children + 1)}>+</button>
              </div>

              <div className="guest-row">
                <span>Rooms</span>
                <button onClick={() => setRooms(Math.max(1, rooms - 1))}>
                  -
                </button>
                <span>{rooms}</span>
                <button onClick={() => setRooms(rooms + 1)}>+</button>
              </div>
            </div>
          )}
        </div>
        <button className="search-button">Search</button>
      </div>
    </div>
  );
};

export default Hotelsearch;
