// import React from 'react'

// const CarPackagesList = () => {
//   return (
//     <div>CarPackagesList</div>
//   )
// }

// export default CarPackagesList
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeCarPackageStatus, getAllCarPackages } from "../../Redux/store/adminCarSlice";
import toast from "react-hot-toast";
// import { getAllCarPackages } from "../../redux/slices/stateSlice";

const CarPackagesList = () => {
  const dispatch = useDispatch();
  const { carPackages, pagination, loading, error } = useSelector(
    (state) => state.admincar
  );

  const [page, setPage] = useState(0);
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

  return (
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
              className="flex bg-white shadow rounded-lg overflow-hidden border"
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
  );
};

export default CarPackagesList;
