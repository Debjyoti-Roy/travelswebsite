import React, { useEffect, useState } from "react";
import { places } from "./Places";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { FaCalendar, FaMapPin, FaUsers } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { getLocations } from "../../Redux/store/hotelSlice";
import { addDays } from "date-fns";

const CustomDateInput = React.forwardRef(({ value, onClick, placeholder }, ref) => (
  <div
    onClick={onClick}
    ref={ref}
    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm cursor-pointer flex items-center focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <FaCalendar className="absolute left-3 text-blue-500 w-5 h-5" />
    <span className={value ? "text-black" : "text-gray-400"}>
      {value || placeholder}
    </span>
  </div>
));

const Hotelsearch = () => {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [showGuestOptions, setShowGuestOptions] = useState(false);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [location, setLocation] = useState("")
  const [locationOptions, setLocationOptions] = useState([])
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const formattedDate = (dateString) => {
    const date = new Date(dateString);

    const formattedDate = date.toISOString().split("T")[0];

    return formattedDate

  }

  const handleSearch = () => {
    console.log(formattedDate(startDate))
    console.log(formattedDate(endDate))
    const total = adults + children
    console.log(total)
    const myData = {
      location: location,
      startDate: formattedDate(startDate),
      endDate: formattedDate(endDate),
      rooms: rooms,
      total: total
    };

    navigate("/hotelsearch", { state: myData });
  }

  useEffect(() => {
    const job = async () => {
      const options = await dispatch(getLocations())
      console.log(options.payload.data)
      if (options.payload.status === 200) {
        setLocationOptions(options.payload.data)
      }
    }
    job()
  }, [])

  const tomorrow = addDays(new Date(), 1);



  return (
    <div className="package-search-container">
      <h2 className="flex lg:justify-start justify-center font-bold lg:pl-6 text-2xl text-black pt-5 pb-3">Find Your Perfect Stay</h2>
      <div className="flex w-full lg:p-4">

        <div className="w-full mx-auto bg-white rounded-3xl px-3 py-2 flex flex-col lg:flex-row gap-4 lg:gap-2 items-center">
          <div className="flex-1 w-full">
            <label className="block flex pb-1 text-sm font-medium mb-1">Location</label>
            <div className="relative">
              <FaMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5" />
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Location</option>
                {locationOptions.map((place, index) => (
                  <option key={index} value={place}>
                    {place}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex-[1.5] w-full">
            <label className="block text-sm font-medium mb-1 flex pb-1">Dates</label>
            <div className="relative">
              <DatePicker
                selectsRange
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => {
                  setStartDate(update[0]);
                  setEndDate(update[1]);
                }}
                minDate={tomorrow} // 👈 this ensures you can't pick a date before tomorrow
                isClearable
                placeholderText="Check-in - Check-out"
                customInput={<CustomDateInput />}
                popperPlacement="bottom-start"
                popperClassName="custom-datepicker"
                className="w-full"
              />
            </div>
          </div>


          <div className="relative flex-1 w-full">
            <label className="block text-sm font-medium mb-1 flex pb-1">Guests & Rooms</label>
            <div
              onClick={() => setShowGuestOptions(!showGuestOptions)}
              className="relative w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <FaUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5" />
              <span className="flex lg:justify-center justify-start">

                {`${adults} Adults${children > 0 ? ` · ${children} Children` : ""} · ${rooms} Rooms`}
              </span>
            </div>

            {showGuestOptions && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg p-4 z-10">
                <div className="flex justify-between items-center mb-2">
                  <span>Adults</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      className="w-8 h-8 rounded-full bg-gray-200 text-lg flex items-center justify-center"
                    >
                      -
                    </button>
                    <span>{adults}</span>
                    <button
                      onClick={() => setAdults(adults + 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 text-lg flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-2">
                  <span>Children</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      className="w-8 h-8 rounded-full bg-gray-200 text-lg flex items-center justify-center"
                    >
                      -
                    </button>
                    <span>{children}</span>
                    <button
                      onClick={() => setChildren(children + 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 text-lg flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span>Rooms</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setRooms(Math.max(1, rooms - 1))}
                      className="w-8 h-8 rounded-full bg-gray-200 text-lg flex items-center justify-center"
                    >
                      -
                    </button>
                    <span>{rooms}</span>
                    <button
                      onClick={() => setRooms(rooms + 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 text-lg flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="h-full w-full lg:w-auto flex items-end">

            <button
              onClick={handleSearch}
              className="bg-blue-600 flex w-full lg:w-auto justify-center
            items-end text-white rounded-xl px-6 py-3 text-sm font-medium hover:bg-blue-700 transition"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hotelsearch;
