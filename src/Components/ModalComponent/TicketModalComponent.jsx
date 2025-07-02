import React from "react";
import { IoMdClose } from "react-icons/io";

const TicketModalComponent = ({ ticketId, submittedOn, category, response, priority, onClose }) => {
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl w-full max-w-md">
        <div className="bg-blue-600 text-white text-center py-4 relative">
          <h2 className="text-lg font-semibold">
            Query Submitted Successfully!
          </h2>
          <p className="text-sm">
            Your query has been received and is being processed
          </p>

          {/* Cross button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-white hover:text-gray-300 transition"
          >
            <IoMdClose size={20} />
          </button>
        </div>

        <div className="w-full py-6 flex justify-center">
          <div className="w-[90%] bg-blue-50 rounded-lg">
            <p className="text-gray-600 text-xs pt-2 mb-1 text-center">
              YOUR TICKET ID
            </p>
            <h2 className="text-3xl font-bold text-blue-600 pb-6 text-center">
              {ticketId}
            </h2>

            {/* Thin blue line */}
            <div className="w-full flex justify-center">
              <div className="w-[90%] border-b-2 border-blue-100  mx-auto mb-4"></div>
            </div>

            {/* 2x2 grid */}
            <div className="w-full flex justify-center">
              <div className="w-[90%]  pt-6 pb-6">
                <div className="bg-blue-50 rounded grid grid-cols-2 gap-2">
                  <div className="bg-blue-50 rounded p-2 flex flex-col ">
                    <span className="text-sm text-gray-600">Submitted on</span>
                    <span className="text-md font-medium text-gray-800">
                      {submittedOn}
                    </span>
                  </div>
                  <div className="bg-blue-50 rounded p-2 flex flex-col ">
                    <span className="text-sm text-gray-600">Priority</span>
                    <span className="text-md font-medium text-gray-800">
                      {priority}
                    </span>
                  </div>
                  <div className="bg-blue-50 rounded p-2 flex flex-col ">
                    <span className="text-sm text-gray-600">Category</span>
                    <span className="text-md font-medium text-gray-800">
                      {category}
                    </span>
                  </div>
                  <div className="bg-blue-50 rounded p-2 flex flex-col ">
                    <span className="text-sm text-gray-600">
                      Estimated Response
                    </span>
                    <span className="text-md font-medium text-gray-800">
                     {response}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* </div> */}
      </div>
    </div>
  );
};

export default TicketModalComponent;
