import React, { useEffect, useRef, useState } from "react";
import { getCookie } from "../Cookie/Cookie";
import { IoMdCloudUpload } from "react-icons/io";
import { FiCheck, FiEdit, FiX } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserQueries, uploadProfileDetails, uploadProfileImage } from "../Redux/store/profileSlice";
import toast from "react-hot-toast";
import { QueryStatus } from "./ProfileComponents/statusEnum";

// const InfoRow = ({ label, value, isPlaceholder = false }) => (
//   <div
//     className={`
//       flex justify-between items-center py-4 px-4 border-b border-gray-200
//       rounded-lg transition-all duration-300
//       hover:bg-gray-50 hover:shadow-md hover:scale-[1.02]
//     `}
//   >
//     <span className="block text-2xl text-gray-500">{label}</span>
//     <div className="flex gap-[5px]">
//       <span
//         className={`block text-2xl font-medium ${isPlaceholder ? "text-gray-400 italic" : "text-gray-800"
//           }`}
//       >
//         {value}
//       </span>
//       <button
//         className="ml-4 text-gray-400 hover:text-gray-600 transition"
//       >
//         <FiEdit className="text-2xl" />
//       </button>
//     </div>
//   </div>
// );
const InfoRow = ({ label, value, isPlaceholder = false, onConfirm }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");

  const handleEdit = () => {
    setIsEditing(true);
    setInputValue(value || "");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setInputValue(value || "");
  };

  const handleConfirm = () => {
    setIsEditing(false);
    if (onConfirm) {
      onConfirm(label, inputValue);
    }
  };

  return (
    <div
      className={`
        flex flex-col md:flex-row justify-between items-center py-4 px-4 border-b border-gray-200
        rounded-lg transition-all duration-300
        hover:bg-gray-50 hover:shadow-md hover:scale-[1.02]
      `}
    >
      <span className="block text-2xl text-gray-500">{label}</span>

      {isEditing ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="border-b border-gray-300 outline-none text-2xl font-medium px-1"
          />
          <button onClick={handleConfirm} className="text-green-500 hover:text-green-700">
            <FiCheck className="text-2xl" />
          </button>
          <button onClick={handleCancel} className="text-red-500 hover:text-red-700">
            <FiX className="text-2xl" />
          </button>
        </div>
      ) : (
        <div className="flex  gap-[5px] items-center">
          <span
            className={`block md:text-2xl text-lg text-center font-medium ${isPlaceholder ? "text-gray-400 italic" : "text-gray-800"}`}
          >
            {value}
          </span>
          <button
            onClick={handleEdit}
            className="ml-2 text-gray-400 hover:text-gray-600 transition"
          >
            <FiEdit className="text-2xl" />
          </button>
        </div>
      )}
    </div>
  );
};
const InfoRow3 = ({ label, value, isPlaceholder = false }) => (
  <div
    className={`
      flex flex-col md:flex-row justify-between items-center py-4 px-4 border-b border-gray-200
      rounded-lg transition-all duration-300
      hover:bg-gray-50 hover:shadow-md hover:scale-[1.02]
    `}
  >
    <span className="block text-2xl text-gray-500">{label}</span>
    <div className="flex gap-[5px]">
      <span
        className={`block md:text-2xl text-lg text-center text-2xl font-medium ${isPlaceholder ? "text-gray-400 italic" : "text-gray-800"
          }`}
      >
        {value}
      </span>
    </div>
  </div>
);
const InfoRow2 = ({ label, value, isPlaceholder = false }) => (
  <div
    className={`
      flex flex-col md:flex-row justify-between items-center py-4 px-4 
      rounded-lg transition-all duration-300
      hover:bg-gray-50 hover:shadow-md hover:scale-[1.02]
    `}
  >
    <span className="block text-2xl text-gray-500">{label}</span>
    <div className="flex gap-[5px]">
      <span
        className={`block md:text-2xl text-lg text-center text-2xl font-medium ${isPlaceholder ? "text-gray-400 italic" : "text-gray-800"
          }`}
      >
        {value}
      </span>

    </div>
  </div>
);


const Profile = () => {
  const [profileData, setProfileData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(name || "");
  const [activeTab, setActiveTab] = useState(QueryStatus.OPEN);
  const [currentPage, setCurrentPage] = useState(0);
  const [tokenExpired, setTokenExpired] = useState(false)
  const dispatch = useDispatch();
  const { queries, queriesLoading, queriesError } = useSelector((state) => state.profile);

  const [expandedCards, setExpandedCards] = useState({});

  const toggleExpand = (id) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };


  // Destructure query data safely
  const content = queries?.content || [];
  const totalPages = queries?.totalPages || 1;
  const pageNumber = queries?.pageNumber || 0;

  // Fetch data on tab change or page change
  useEffect(() => {
    const token = localStorage.getItem("token");
    dispatch(fetchUserQueries({ token, page: currentPage, size: 5, status: activeTab }));
    if (queriesError) {
      setTokenExpired(true)
    }
  }, [activeTab, currentPage, dispatch]);

  const statuses = [QueryStatus.ALL, QueryStatus.OPEN, QueryStatus.IN_PROGRESS, QueryStatus.RESOLVED, QueryStatus.CLOSED];

  const handleTabClick = (status) => {
    setActiveTab(status);
    setCurrentPage(0);
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (pageNumber + 1 < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };


  const handleEdit = () => {
    setIsEditing(true);
    setInputValue(profileData.name || "");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setInputValue(profileData.name || "");
  };

  const fileInputRef = useRef(null);

  useEffect(() => {
    const cookieData = getCookie("userData");
    const jsonData = JSON.parse(cookieData);
    setProfileData(jsonData);
    console.log(jsonData.name)
    setInputValue(jsonData.name)
    const token = localStorage.getItem("token")
    // setToken(token)
  }, []);

  const firstLetter = profileData.name
    ? profileData.name.charAt(0).toUpperCase()
    : "?";

  const formattedDate = new Date(profileData.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const ticketCreatedAt = (date) => {
    if (!date) return "N/A";

    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) return "Invalid date";

    return parsed.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const addressValue = profileData.address ?? "Add your address";
  const isAddressPlaceholder = !profileData.address;

  const handleButtonClick = () => {
    fileInputRef.current.click(); // trigger file picker
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Dispatch upload thunk
      const token = localStorage.getItem("token")
      const resultAction = await dispatch(uploadProfileImage({ file, token }));


      console.log(resultAction)
      if (uploadProfileImage.fulfilled.match(resultAction)) {
        const newImageUrl = resultAction.payload.data;

        // Get the userData cookie
        const cookies = document.cookie.split("; ");
        const userDataCookie = cookies.find((row) => row.startsWith("userData="));

        if (userDataCookie) {
          const value = userDataCookie.split("=")[1];
          const decoded = JSON.parse(decodeURIComponent(value));

          // Update imageUrl
          decoded.imageUrl = newImageUrl;

          // Stringify and encode again
          const updatedCookieValue = encodeURIComponent(JSON.stringify(decoded));

          // Overwrite the cookie
          document.cookie = `userData=${updatedCookieValue}; path=/;`;
          const updatedProfileData = {
            ...profileData,
            imageUrl: newImageUrl ?? null,
          };

          setProfileData(updatedProfileData);
          window.dispatchEvent(new Event("tokenUpdated"));

          console.log("Updated userData cookie:", decoded);
        }
      } else {
        toast.error("Not Submitted", {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
      }
    }
  };



  const handleConfirm = async (label, newValue) => {
    console.log("Confirmed value for:", label, newValue);
    let label2 = ""
    if (label === "Phone number") {
      label2 = "phone"
    } else if (label === "Address") {
      label2 = "address"
    } else {
      label2 = "name"
    }
    const newValue2 = {
      [label2]: newValue
    }
    console.log(newValue2)
    const token = localStorage.getItem("token")
    console.log(token)
    const resultAction = await dispatch(uploadProfileDetails({ data: newValue2, token }));
    if (uploadProfileDetails.fulfilled.match(resultAction)) {
      // console.log(resultAction.payload.data)

      // Determine your label3 dynamically
      // Example
      let label3 = "";
      if (label2 === "phone") {
        label3 = "phoneNumber";
      } else if (label2 === "address") {
        label3 = "address";
      } else if (label2 === "name") {
        label3 = "name";
      } else if (label2 === "email") {
        label3 = "email";
      }
      // Add more mappings if needed

      // Get the new value from API response
      const newValue = resultAction.payload.data[label3];
      console.log("New value for cookie update:", newValue);

      // Get userData cookie
      const cookies = document.cookie.split("; ");
      const userDataCookie = cookies.find((row) => row.startsWith("userData="));

      if (userDataCookie) {
        const value = userDataCookie.split("=")[1];
        const decoded = JSON.parse(decodeURIComponent(value));

        // Update only this field
        decoded[label3] = newValue;

        // Save back to cookie
        const updatedCookieValue = encodeURIComponent(JSON.stringify(decoded));
        document.cookie = `userData=${updatedCookieValue}; path=/;`;

        console.log("Updated userData cookie:", decoded);
        window.dispatchEvent(new Event("tokenUpdated"));
        // Optionally, also update local state
        setProfileData(decoded);
      }


    } else {
      toast.error("Not Submitted", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }


  };



  const handleSave = () => {
    setIsEditing(false);
    // if (onConfirm) {
    handleConfirm("name", inputValue);
    // }
  };

  const truncate = (text, limit = 100) => {
    if (!text) return "";
    return text.length > limit ? text.slice(0, limit) + "..." : text;
  };

  const formatRelativeTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  };


  return (<>
    {tokenExpired && (
      <div className="min-h-screen bg-[#f5f5f5]">Something Went Wrong</div>
    )}
    {!tokenExpired && (

      <div className="min-h-screen bg-[#f5f5f5]">

        <div className="w-full  flex justify-center px-4 py-12">
          <div className="md:w-[61%] w-[90%] flex flex-col gap-[20px] justify-center">
            <div className="w-full bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">


              <div className="relative group mb-4">
                {profileData.imageUrl ? (
                  <img
                    src={profileData.imageUrl}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-blue-500 text-white flex items-center justify-center text-4xl font-bold shadow-md">
                    {firstLetter}
                  </div>
                )}

                {/* Overlay button */}
                <div
                  onClick={handleButtonClick}
                  className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-80 transition">
                  <button
                    className="flex items-center gap-1 text-white text-sm font-medium"

                    type="button"
                  >
                    <IoMdCloudUpload className="text-lg" /> Upload
                  </button>
                </div>

                {/* Hidden file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>

              <div className="flex items-center gap-2 py-3">
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="border-b border-gray-300 outline-none text-4xl font-bold px-1"
                    />
                    <button onClick={handleSave} className="text-green-500 hover:text-green-700">
                      <FiCheck className="text-2xl" />
                    </button>
                    <button onClick={handleCancel} className="text-red-500 hover:text-red-700">
                      <FiX className="text-2xl" />
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="text-4xl font-bold text-gray-900">{profileData.name}</h2>
                    <button onClick={handleEdit} className="text-gray-400 hover:text-gray-600 transition">
                      <FiEdit className="text-2xl" />
                    </button>
                  </>
                )}
              </div>
              <p className="text-xl pb-2 text-gray-500 mb-6 ">Your profile details</p>

              {/* Info Section */}
              <div className="w-full flex flex-col gap-4 bg-[#fafafa] rounded-xl p-4 shadow-inner">
                <InfoRow3 label="Email address" value={profileData.email} />
                <InfoRow label="Phone number" value={profileData.phoneNumber} onConfirm={handleConfirm} />
                <InfoRow
                  label="Address"
                  value={addressValue}
                  isPlaceholder={isAddressPlaceholder}
                  onConfirm={handleConfirm}
                />
                <InfoRow2 label="Created At" value={formattedDate} />
              </div>

              {/* Footer Text */}
              <p className="text-xs text-gray-400 text-center pt-6 mt-6">
                Your personal information is securely stored and used only to enhance your experience.
              </p>
            </div>



            <div className="w-full bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
              <div className="w-full">
                <div className="w-full flex justify-between border-b border-gray-200 py-4">
                  <div className="text-4xl font-bold">Your Queries</div>
                </div>

                {/* Tabs */}
                <div className="flex space-x-4 mt-4 border-b border-gray-200 overflow-x-auto">
                  {statuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => handleTabClick(status)}
                      className={`py-2 px-4 whitespace-nowrap ${activeTab === status
                        ? "border-b-2 border-blue-500 text-blue-500"
                        : "text-gray-500 hover:text-blue-500"
                        }`}
                    >
                      {status.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="pt-6 w-full">
                {queriesLoading && <p>Loading queries...</p>}
                {queriesError && <p className="text-red-500">Error: {queriesError}</p>}

                {!queriesLoading && content && content.length > 0 ? (
                  content.map((item) => (
                    <div
                      key={item.ticketId}
                      onClick={() => toggleExpand(item.ticketId)}
                      className="border border-gray-200 p-5 rounded-xl shadow-sm mb-4 bg-white transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-blue-500 hover:bg-blue-50 cursor-pointer"
                    >
                      <div className="flex justify-between items-start">
                        {/* Left content */}
                        <div className="flex-1">
                          <p className="text-sm text-gray-500 mb-1">
                            Ticket ID: <span className="font-medium">{item.ticketId}</span>
                          </p>
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.subject}</h3>
                          <p className="text-gray-700 mb-2">
                            {expandedCards[item.ticketId] ? item.message : truncate(item.message, 100)}
                          </p>
                        </div>

                        {/* Right content (status and dates) */}
                        <div className="flex flex-col items-end ml-4 text-right">
                          <span
                            className={`inline-block px-3 py-1 text-xs font-medium rounded-full mb-2
                    ${item.status === "OPEN"
                                ? "bg-green-100 text-green-700"
                                : item.status === "IN_PROGRESS"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : item.status === "RESOLVED"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-gray-200 text-gray-600"
                              }
                  `}
                          >
                            {item.status.replace("_", " ")}
                          </span>
                          <p className="text-xs text-gray-500">Created at: {ticketCreatedAt(item.createdAt)}</p>
                          <p className="text-xs text-gray-400">Updated at: {formatRelativeTime(item.updatedAt)}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  !queriesLoading && <p>No queries found.</p>
                )}
              </div>


              {/* Pagination */}
              <div className="w-full flex items-center justify-between pt-6">
                {/* Prev button */}
                <button
                  onClick={handlePrevPage}
                  className={`px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 ${pageNumber === 0 ? "invisible pointer-events-none" : ""}`}
                >
                  ← Prev
                </button>

                {/* Page text */}
                <span>
                  Page {pageNumber + 1} of {totalPages}
                </span>

                {/* Next button */}
                <button
                  onClick={handleNextPage}
                  className={`px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 ${pageNumber + 1 >= totalPages ? "invisible pointer-events-none" : ""}`}
                >
                  Next →
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    )}
  </>
  );
};

export default Profile;