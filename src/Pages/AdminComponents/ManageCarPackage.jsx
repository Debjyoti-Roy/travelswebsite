import React, { useState } from "react";
import AddCarPackage from "./AddCarPackage";

const ManageCarPackage = () => {
  const [activeTab, setActiveTab] = useState("add");

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      {/* Tabs Header */}
      <div className="flex border-b border-gray-300 mb-6">
        <button
          onClick={() => setActiveTab("add")}
          className={`px-6 py-2 font-medium ${
            activeTab === "add"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          Add Car Package
        </button>
        <button
          onClick={() => setActiveTab("manage")}
          className={`px-6 py-2 font-medium ${
            activeTab === "manage"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          Manage Car Package
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "add" && (
        //   <div>
        //     <h2 className="text-xl font-semibold mb-4">Add Car Package</h2>
        //     {/* Add Car Package form here */}
        //     <p className="text-gray-600">Form for adding car package goes here...</p>
        //   </div>
        <AddCarPackage />
        )}
        {activeTab === "manage" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Manage Car Package</h2>
            {/* Manage Car Package table/list here */}
            <p className="text-gray-600">List of car packages goes here...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCarPackage;
