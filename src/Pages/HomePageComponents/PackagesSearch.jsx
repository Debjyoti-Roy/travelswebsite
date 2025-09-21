import React, { useEffect, useState } from "react";
import { FaMapPin, FaCalendar } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { getDestinations } from "../../Redux/store/carPackageSlice";

const CustomDateInput = React.forwardRef(({ value, onClick, placeholder }, ref) => (
  <div
    onClick={onClick}
    ref={ref}
    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-md cursor-pointer flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <FaCalendar className="absolute left-3 text-blue-500 w-5 h-5" />
    <span className={value ? "text-black" : "text-gray-400"}>
      {value || placeholder}
    </span>
  </div>
));

const PackagesSearch = () => {
  const navigate = useNavigate();
  const [travelDate, setTravelDate] = useState(null);
  const [from, setFrom] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [dest, setDest] = useState([])
  

  const dispatch = useDispatch();
  const { destinations } = useSelector((state) => state.carPackage);
  useEffect(() => {
    dispatch(getDestinations());
  }, [dispatch]);
  useEffect(() => {
    if (destinations.length) {
      const processedDestinations = [
        ...new Set(
          destinations.flatMap((item) =>
            item.split(",").map((part) => part.trim())
          )
        ),
      ];
      setDest(processedDestinations)
    }
  }, [destinations])

  // Suggestive input for places
  const handleInputChange = (e) => {
    const value = e.target.value;
    setFrom(value);

    if (value.length > 0) {
      const filtered = dest.filter((d) =>
        d.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (value) => {
    setFrom(value);
    setShowSuggestions(false);
  };

  const handleSubmit = () => {
    if (!from || !travelDate) {
      toast.error("Please select both destination and date", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      return;
    }

    const formatDate = (date) => {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    };

    const myData = {
      location: from,
      travelDate: formatDate(travelDate),
    };

    // console.log(myData);
    navigate("/tourpackagesearch", { state: myData })
    // console.log(state)
  };

  return (
    <div className="package-search-container">
      <h2 className="flex lg:justify-start justify-center font-bold lg:pl-[15px] text-2xl text-black pt-[5px] pb-[5px]">
        Find Your Package
      </h2>
      <div className="flex w-full lg:p-[10px] p-2">
        <div className="w-full mx-auto flex flex-col lg:flex-row gap-4 lg:gap-2 items-center">

          {/* Destination Suggestive Input */}
          <div className="flex-1 w-full relative">
            <label className="block flex pb-1 text-md font-medium mb-1">Destination</label>
            <div className="relative">
              <FaMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5" />
              <input
                type="text"
                value={from}
                onChange={handleInputChange}
                onFocus={() => from && setShowSuggestions(true)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Destination"
              />
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-10 bg-white border border-gray-200 rounded-xl mt-1 w-full max-h-40 overflow-y-auto shadow-lg">
                  {suggestions.map((s, index) => (
                    <li
                      key={index}
                      onClick={() => handleSuggestionClick(s)}
                      className="px-4 py-2 cursor-pointer hover:bg-blue-100 text-left"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Travel Date */}
          <div className="flex-1 w-full">
            <label className="block text-md font-medium mb-1 flex pb-1">Date</label>
            <div className="relative">
              <DatePicker
                selected={travelDate}
                onChange={(date) => setTravelDate(date)}
                minDate={new Date()}
                isClearable
                placeholderText="Select Date"
                customInput={<CustomDateInput />}
                popperPlacement="bottom-start"
                popperClassName="custom-datepicker"
                className="w-full"
              />
            </div>
          </div>
          <div className="h-full w-full lg:w-auto flex items-end">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 flex w-full lg:w-auto justify-center items-end text-white rounded-xl px-6 py-3 text-md font-medium hover:bg-blue-700 transition"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackagesSearch;
