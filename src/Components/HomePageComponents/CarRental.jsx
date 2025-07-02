import React, { useState } from "react";
import { places } from "./Places";
import DatePicker from "react-datepicker";

const CarRental = () => {
  const [travelDate, setTravelDate] = useState();
  const [endDate, setEndDate] = useState();
  const [passengers, setPassengers] = useState(1);
  const [showPassengerOptions, setShowPassengerOptions] = useState(false);
  return (
    <div className="package-search-container">
      <h2 className="title">Rent Your Car</h2>
      <div className="form-grid3">
        <select className="input-field first">
          <option value="">From</option>
          {places.map((place, index) => (
            <option key={index} value={place.name}>
              {place.name}
            </option>
          ))}
        </select>
        <select className="input-field">
          <option value="">To</option>
          {places.map((place, index) => (
            <option key={index} value={place.name}>
              {place.name}
            </option>
          ))}
        </select>
        <DatePicker
          selected={travelDate}
          onChange={(date) => {
            setTravelDate(date);
          }}
          isClearable={true}
          placeholderText="Select Date"
          className="input-field date"
          popperPlacement="bottom-start"
          popperClassName="custom-datepicker"
        />

        <div className="guest-selector-wrapper">
          <div
            className="input-field"
            onClick={() => setShowPassengerOptions(!showPassengerOptions)}
          >
            {`${passengers} Passenger${passengers > 1 ? "s" : ""}`}
          </div>

          {showPassengerOptions && (
            <div className="guest-dropdown">
              <div className="guest-row">
                {/* <span>Passengers</span> */}
                <button
                  onClick={() => setPassengers(Math.max(1, passengers - 1))}
                  disabled={passengers <= 1}
                >
                  -
                </button>
                <span>{passengers}</span>
                <button
                  onClick={() => setPassengers(Math.min(7, passengers + 1))}
                  disabled={passengers >= 7}
                >
                  +
                </button>
              </div>
            </div>
          )}
        </div>
        <button className="search-button">Search</button>
      </div>
    </div>
  );
};

export default CarRental;
