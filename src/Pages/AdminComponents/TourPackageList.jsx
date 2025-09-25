import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { changeTourPackageStatus, getTourDetails, getTours } from '../../Redux/store/adminTourSlice'
import toast from 'react-hot-toast'
import TourDetails from './TourDetails'

const TourPackageList = () => {
  const dispatch = useDispatch()
  const [page, setPage] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const size = 5; // 👈 number of items per page
  // const [conyt]
  const { tourData, pagination, tourLoading, tourError, tourDetails, tourDetailsError, tourDetailsLoading, tourDetailsStatus } = useSelector((state) => state.adminTour)
  useEffect(() => {
    dispatch(getTours({ page, size }))
  }, [dispatch, page])

  useEffect(() => {
    console.log(tourData)
  }, [tourData])

  const changeStatus = async (sts, id) => {
    try {
      const push = await dispatch(changeTourPackageStatus({ id, status: sts }));
      if (changeTourPackageStatus.fulfilled.match(push)) {
        toast.success("Tour package status changed successfully");
        dispatch(getTours({ page, size }));
      } else {
        toast.error("Failed to change status.");
        dispatch(getTours({ page, size }));
      }

    } catch (err) {
      toast.error("Failed to change status.");
      dispatch(getTours({ page, size }));
    }
  };

  const viewDetails = async (id) => {
    dispatch(getTourDetails({ id: id }));
    setIsOpen(true);
  }

  return (
    <>
      {isOpen ? <TourDetails tourPackageDetails={tourDetails} isOpen={() => setIsOpen(false)} onEdit={async (id) => await viewDetails(id)} /> : (
        <>
          <div className="p-6">
            {/* <h2 className="text-2xl font-bold mb-4">Car Packages</h2> */}

            {tourLoading && <p className="text-gray-500">Loading...</p>}
            {tourError && <p className="text-red-500">Error: {tourError}</p>}

            {!tourLoading && !tourError && tourData.length === 0 && (
              <p className="text-gray-600">No packages found.</p>
            )}

            {!tourLoading && !tourError && tourData.length > 0 && (
              <div className="space-y-4">
                {tourData.map((pkg) => (
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
    </>
  )
}

export default TourPackageList