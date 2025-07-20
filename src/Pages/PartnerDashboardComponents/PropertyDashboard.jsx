import React, { useEffect, useState } from "react";
import HotelCard from "./HotelCard";
import ManageProperties from "./ManageProperties";
import AddRoom from "./AddRoom";
// import HotelCard from "./HotelCard"; // adjust import path if needed

const PropertyDashboard = ({ hotelList }) => {
  const [showModal, setShowModal] = useState(false);
  const [currentStep, setCurrentStep] = useState("hotel"); // "hotel" or "room"
  const [hotelId, setHotelId] = useState(null);
  const [hotelPresent, setHotelPresent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // console.log(hotelList);
  }, [hotelList]);

  const handleAddHotel = () => {
    setShowModal(true);
    setCurrentStep("hotel");
    setHotelId(null);
    setHotelPresent(false);
    setIsLoading(false);
  };

  const handleHotelCreated = (newHotelId) => {
    setHotelId(newHotelId);
    setCurrentStep("room");
    setIsLoading(false);
  };

  const handleRoomAdded = () => {
    setShowModal(false);
    setCurrentStep("hotel");
    setHotelId(null);
    setHotelPresent(false);
    setIsLoading(false);
    // Refresh the hotel list by triggering a re-render
    window.location.reload();
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentStep("hotel");
    setHotelId(null);
    setHotelPresent(false);
    setIsLoading(false);
  };

  return (
    <div className="p-2 lg:p-6 bg-gray-50 min-h-screen">
      {/* Header with Add Hotel Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Property Dashboard</h1>
        <button
          onClick={handleAddHotel}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Hotel
        </button>
      </div>

      <div className="grid gap-8">
        {hotelList && hotelList.length > 0 ? (
          hotelList.map((hotel, index) => (
            <div key={index} className="w-[55%] md:w-full lg:w-full">
              <HotelCard key={index} hotel={hotel} />
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <p className="text-gray-600 text-lg mb-4">No hotels found.</p>
            <p className="text-gray-500 mb-6">Click "Add Hotel" to get started!</p>
            <button
              onClick={handleAddHotel}
              className="bg-blue-600 flex w-full md:w-auto justify-center
            items-end text-white rounded-xl px-6 py-3 text-sm font-medium hover:bg-blue-700 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Your First Hotel
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-7xl h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {currentStep === "hotel" ? "Add New Hotel" : "Add Rooms"}
                </h2>
                {/* Step Indicator */}
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    currentStep === "hotel" ? "bg-blue-600 text-white" : "bg-green-500 text-white"
                  }`}>
                    1
                  </div>
                  <div className="w-8 h-1 bg-gray-300"></div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    currentStep === "room" ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-600"
                  }`}>
                    2
                  </div>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-auto relative">
              {isLoading && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Processing...</p>
                  </div>
                </div>
              )}
              {currentStep === "hotel" ? (
                
                <ManageProperties 
                  setRoom={handleHotelCreated}
                  setHotelId={setHotelId}
                  setIsLoading={setIsLoading}
                />
              ) : (
                <AddRoom 
                  hotelId={hotelId}
                  setHotelPresent={handleRoomAdded}
                  setIsLoading={setIsLoading}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDashboard;
