import React, { useEffect, useRef, useState } from 'react'
import AddTourPackage from './AddTourPackage';
import TourPackageList from './TourPackageList';

const ManageTourPackage = () => {
    const [activeTab, setActiveTab] = useState("manage");
    const [tabRef, setTabRef] = useState(0)
    const topRef = useRef(null);
    useEffect(() => {
        if (topRef.current) {
            const navbarHeight = 80; // px height of your navbar
            const elementTop = topRef.current.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
                top: elementTop - navbarHeight,
                behavior: "smooth",
            });
        }
    }, [tabRef]);
    return (
        <div ref={topRef} className="min-h-screen p-6 bg-gray-100">
            <div className="flex border-b border-gray-300 mb-6">

                <button
                    onClick={() => setActiveTab("manage")}
                    className={`px-6 py-2 font-medium ${activeTab === "manage"
                        ? "border-b-2 border-blue-600 text-blue-600"
                        : "text-gray-600 hover:text-blue-600"
                        }`}
                >
                    Manage Tour Package
                </button>
                <button
                    onClick={() => setActiveTab("add")}
                    className={`px-6 py-2 font-medium ${activeTab === "add"
                        ? "border-b-2 border-blue-600 text-blue-600"
                        : "text-gray-600 hover:text-blue-600"
                        }`}
                >
                    Add Tour Package
                </button>
            </div>

            {/* Tab Content */}
            <div>
                {activeTab === "add" && (
                    <AddTourPackage setTabRef={(e) => setTabRef(e)} />
                )}
                {activeTab === "manage" && (
                    <TourPackageList />
                )}
            </div>
        </div>
    )
}

export default ManageTourPackage