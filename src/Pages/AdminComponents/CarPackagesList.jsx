// import React from 'react'

// const CarPackagesList = () => {
//   return (
//     <div>CarPackagesList</div>
//   )
// }

// export default CarPackagesList
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeCarPackageStatus, getAllCarPackages, getCarPackageDetails, getStates } from "../../Redux/store/adminCarSlice";
import toast from "react-hot-toast";
import { Dialog, Transition } from "@headlessui/react";
import { FaTimes } from "react-icons/fa";
import EditPackageForm from "./EditPackageForm";
import DetailsPage from "./DetailsPage";
// import { getAllCarPackages } from "../../redux/slices/stateSlice";

const CarPackagesList = () => {
  const dispatch = useDispatch();
  const { carPackages, pagination, loading, error } = useSelector(
    (state) => state.admincar
  );
  const { carPackageDetails, loading2, error2 } = useSelector((state) => state.admincar);
  const { states = [], statesloading, stateserror } = useSelector((state) => state.admincar);

  useEffect(() => {
    dispatch(getStates());
  }, [dispatch]);


  const [page, setPage] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const size = 5; // 👈 number of items per page

  useEffect(() => {
    dispatch(getAllCarPackages({ page, size }));
  }, [dispatch, page]);

  const changeStatus = async (sts, id) => {
    // console.log(sts + " " + id)
    dispatch(changeCarPackageStatus({ id: id, status: sts }))
      .unwrap()
      .then((res) => {
        toast.success("Car package status changed successfully");
        dispatch(getAllCarPackages({ page, size }));
      })
      .catch((err) => {
        toast.error("Failed to change status.");
        dispatch(getAllCarPackages({ page, size }));
      });
  }

  const [packageDetails, setPackageDetails] = useState({})
  const viewDetails = async (id) => {

    dispatch(getCarPackageDetails({ id: id }));
    // setPackageDetails(carPackageDetails)
    setIsOpen(true);


  }


  const [isEditing, setIsEditing] = useState(false)





  const closeModal = () => {
    setIsOpen(false)
    setIsEditing(false)
  };
  return (
    <>
      {isOpen ? <DetailsPage carPackageDetails={carPackageDetails} isOpen={()=>setIsOpen(false)} onEditBasic={async(id)=>await viewDetails(id)} /> : (
        <>


          <div className="p-6">
            {/* <h2 className="text-2xl font-bold mb-4">Car Packages</h2> */}

            {loading && <p className="text-gray-500">Loading...</p>}
            {error && <p className="text-red-500">Error: {error}</p>}

            {!loading && !error && carPackages.length === 0 && (
              <p className="text-gray-600">No packages found.</p>
            )}

            {!loading && !error && carPackages.length > 0 && (
              <div className="space-y-4">
                {carPackages.map((pkg) => (
                  <div
                    key={pkg.packageId}
                    className="flex bg-white shadow rounded-lg overflow-hidden border border-gray-200"
                    style={{ marginBottom: "16px" }}
                  >
                    {/* Thumbnail */}
                    {pkg.thumbnailUrl && (
                      <div className="flex-shrink-0">
                        <img
                          src={pkg.thumbnailUrl}
                          alt={pkg.title}
                          className="w-48 h-full object-cover rounded-l-lg"
                        />
                      </div>
                    )}

                    {/* Card Body */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      {/* Header with title + button */}
                      <div className="flex justify-between items-start" style={{ marginBottom: "8px" }}>
                        <h3 className="text-lg font-bold text-gray-800">
                          {pkg.title}
                        </h3>
                        <div className="flex gap-1">
                          <button
                            className="px-3 py-1 text-sm rounded bg-blue-500 text-white hover:bg-blue-600"
                            onClick={() => {
                              // console.log(pkg.packageId)
                              viewDetails(pkg.packageId)
                              // setPackageDetails(pkg)
                              setIsOpen(true)
                            }}
                          >
                            View Details
                          </button>
                          <button
                            className={`px-3 py-1 text-sm rounded ${pkg.isActive
                              ? "bg-red-500 text-white hover:bg-red-600"
                              : "bg-green-500 text-white hover:bg-green-600"
                              }`}
                            onClick={() => {
                              if (pkg.isActive) {
                                changeStatus(false, pkg.packageId)
                              } else {
                                changeStatus(true, pkg.packageId)
                              }
                            }}
                          >
                            {pkg.isActive ? "Deactivate" : "Activate"}
                          </button>
                        </div>
                      </div>

                      {/* Description */}
                      <p
                        className="text-sm text-gray-600"
                        style={{ marginBottom: "12px" }}
                      >
                        {pkg.description}
                      </p>

                      {/* Meta Info */}
                      <div className="grid grid-cols-2 gap-y-1 text-sm text-gray-700">
                        <div>
                          <strong>Duration:</strong> {pkg.durationDays} days
                        </div>
                        <div>
                          <strong>Pickup:</strong> {pkg.pickupLocation}
                        </div>
                        <div>
                          <strong>Drop:</strong> {pkg.dropLocation}
                        </div>
                        <div>
                          <strong>Destination:</strong> {pkg.destination?.name},{" "}
                          {pkg.destination?.state}
                        </div>
                        <div className="col-span-2">
                          <strong>Status:</strong>{" "}
                          {pkg.isActive ? (
                            <span className="text-green-600 font-medium">Active</span>
                          ) : (
                            <span className="text-red-600 font-medium">Not Active</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}



            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={pagination.pageNumber === 0}
                className={`px-4 py-2 rounded-lg ${pagination.pageNumber === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
              >
                Prev
              </button>

              <span className="text-sm text-gray-700">
                Page {pagination.pageNumber + 1} of {pagination.totalPages}
              </span>

              <button
                onClick={() =>
                  setPage((p) => (!pagination.last ? p + 1 : p))
                }
                disabled={pagination.last}
                className={`px-4 py-2 rounded-lg ${pagination.last
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
      {/* <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
         
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-100/70 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">

            <div className="flex min-h-full items-center justify-center p-6">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-5xl min-w-5xl transform overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-2xl transition-all">
                  
                  <div className="max-h-[80vh] min-h-[80vh] overflow-y-auto">
                    {!isEditing ? (



                      <>

                        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
                          <Dialog.Title
                            as="h3"
                            className="text-2xl font-bold leading-6 text-gray-900"
                          >
                            {carPackageDetails?.title}
                          </Dialog.Title>
                          <button
                            onClick={closeModal}
                            className="text-gray-500 hover:text-gray-700 transition cursor-pointer"
                          >
                            <FaTimes className="h-5 w-5" />
                          </button>
                        </div>


                        <div className="p-6">

                          {carPackageDetails?.thumbnailUrl && (
                            <img
                              src={carPackageDetails.thumbnailUrl}
                              alt={carPackageDetails.title}
                              className="w-full h-64 object-cover rounded-lg border border-gray-200 mb-6"
                            />
                          )}

                          
                          <p className="text-gray-700 mb-4 leading-relaxed">
                            {carPackageDetails?.description}
                          </p>

                          
                          <div className="grid grid-cols-2 gap-4 mb-6 text-sm border border-gray-100 rounded-lg p-4 bg-gray-50">
                            <div>
                              <strong>Duration:</strong> {carPackageDetails?.durationDays} days
                            </div>
                            <div>
                              <strong>Pickup:</strong> {carPackageDetails?.pickupLocation}
                            </div>
                            <div>
                              <strong>Drop:</strong> {carPackageDetails?.dropLocation}
                            </div>
                            <div>
                              <strong>Destination:</strong>{" "}
                              {carPackageDetails?.destination?.name},{" "}
                              {carPackageDetails?.destination?.state}
                            </div>
                          </div>

                          
                          {carPackageDetails?.carDetails?.length > 0 && (
                            <div className="mb-6">
                              <h4 className="font-semibold text-lg mb-2">Available Cars</h4>
                              {carPackageDetails.carDetails.map((car) => (
                                <div
                                  key={car.carId}
                                  className="border border-gray-200 bg-white p-4 rounded-lg mb-3 shadow-sm"
                                >
                                  <p className="font-medium">
                                    {car.carName} ({car.carType}) - {car.capacity} Seats, Luggage:{" "}
                                    {car.luggageCapacity}
                                  </p>
                                  <ul className="list-disc pl-5 text-sm text-gray-600 mt-1">
                                    {car.carPrices.map((price) => (
                                      <li key={price.seasonPriceId}>
                                        {price.startMonth} to {price.endMonth}: ₹{price.price}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          )}

                          
                          {carPackageDetails?.itineraries?.length > 0 && (
                            <div style={{ marginTop: "1vh" }} className="mb-6">
                              <h4 className="font-semibold text-lg mb-2"> Itinerary</h4>
                              <div className="grid grid-cols-2 gap-4">
                                {carPackageDetails.itineraries.map((it) => (
                                  <div
                                    key={it.itineraryId}
                                    className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm"
                                  >
                                    {it.imageUrl && (
                                      <img
                                        src={it.imageUrl}
                                        alt={it.title}
                                        className="w-full h-40 object-cover border-b border-gray-200"
                                      />
                                    )}
                                    <div className="p-3">
                                      <p className="font-bold text-gray-800">
                                        Day {it.dayNumber}: {it.title}
                                      </p>
                                      <p className="text-sm text-gray-600">{it.description}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          
                          <div style={{ marginTop: "1vh" }} className="grid grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-semibold mb-2 text-green-700">Included</h4>
                              <ul className="list-disc pl-5 text-sm text-green-700">
                                {carPackageDetails?.includedFeatures?.map((f) => (
                                  <li key={f.inclusionId}>{f.description}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2 text-red-700"> Excluded</h4>
                              <ul className="list-disc pl-5 text-sm text-red-700">
                                {carPackageDetails?.excludedFeatures?.map((f) => (
                                  <li key={f.inclusionId}>{f.description}</li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          
                          <div className="mt-6 flex justify-end">
                            <button
                              className="px-5 py-2 cursor-pointer bg-blue-800 text-white rounded-lg hover:bg-gray-700 transition"
                              onClick={() => setIsEditing(true)}
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <EditPackageForm
                        carPackageDetails={carPackageDetails}
                        isOpen={isOpen}
                      />
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition> */}
    </>
  );
};

export default CarPackagesList;
