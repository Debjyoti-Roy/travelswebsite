// import React, { useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { getTourAwaiting, getTourAwaitingByStatus } from '../../Redux/store/adminTourSlice'

// const ManageTourBookings = () => {
//   const [status, setStatus] = useState("IN_PROGRESS")
//   const [tab, setTab] = useState("Open")
//   const { tourAwaiting, tourAwaitingLoading, tourAwaitingError, tourAwaitingByStatus, tourAwaitingLoadingByStatus, tourAwaitingErrorByStatus } = useSelector((state) => state.adminTour)
//   const dispatch = useDispatch()
//   useEffect(() => {
//     dispatch(getTourAwaiting());


//     const interval = setInterval(() => {
//       dispatch(getTourAwaiting());
//     }, 300000);


//     return () => clearInterval(interval);
//   }, [dispatch]);


//   useEffect(() => {
//     console.log(tourAwaiting)
//   }, [tourAwaiting])

//   useEffect(() => {
//     if (tab !== "Open") {
//       if (tab === "In Progress") {
//         dispatch(getTourAwaitingByStatus({ queryStatus: "IN_PROGRESS" }))
//       } else if (tab === "Resolved") {
//         dispatch(getTourAwaitingByStatus({ queryStatus: "RESOLVED" }))
//       } else if (tab === "Closed") {
//         dispatch(getTourAwaitingByStatus({ queryStatus: "CLOSED" }))
//       }
//     }
//   }, [tab])



//   return (
//     <div>ManageTourBookings</div>
//   )
// }

// export default ManageTourBookings
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  changeTourAwaitingStatus,
  getTourAwaiting,
  getTourAwaitingByStatus,
} from "../../Redux/store/adminTourSlice";

const ManageTourBookings = () => {
  const [tab, setTab] = useState("Open");
  const {
    tourAwaiting,
    tourAwaitingLoading,
    tourAwaitingError,
    tourAwaitingByStatus,
    tourAwaitingLoadingByStatus,
    tourAwaitingErrorByStatus,
  } = useSelector((state) => state.adminTour);

  const dispatch = useDispatch();

  // Fetch initial data + refresh every 5 mins
  useEffect(() => {
    dispatch(getTourAwaiting());
    const interval = setInterval(() => {
      dispatch(getTourAwaiting());
    }, 300000);
    return () => clearInterval(interval);
  }, [dispatch]);

  // Fetch data by tab
  useEffect(() => {
    if (tab !== "Open") {
      let queryStatus;
      if (tab === "In Progress") queryStatus = "IN_PROGRESS";
      if (tab === "Resolved") queryStatus = "RESOLVED";
      if (tab === "Closed") queryStatus = "CLOSED";

      dispatch(getTourAwaitingByStatus(queryStatus));
    }
  }, [tab, dispatch]);

  //changestatuses
  const handleInProgress = async (id) => {
    const update = await dispatch(changeTourAwaitingStatus({ ticketId: id, queryStatus: "IN_PROGRESS" }))
    if (changeTourAwaitingStatus.fulfilled.match(update)) {
      dispatch(getTourAwaiting());
    } else {
      dispatch(getTourAwaiting());
    }
  }
  const handleConfirm = async (id) => {
    const update = await dispatch(changeTourAwaitingStatus({ ticketId: id, queryStatus: "RESOLVED" }))
    if (changeTourAwaitingStatus.fulfilled.match(update)) {
      dispatch(getTourAwaiting());
      if (tab !== "Open") {
        let queryStatus;
        if (tab === "In Progress") queryStatus = "IN_PROGRESS";
        if (tab === "Resolved") queryStatus = "RESOLVED";
        if (tab === "Closed") queryStatus = "CLOSED";

        dispatch(getTourAwaitingByStatus(queryStatus));
      }
    } else {
      dispatch(getTourAwaiting());
      if (tab !== "Open") {
        let queryStatus;
        if (tab === "In Progress") queryStatus = "IN_PROGRESS";
        if (tab === "Resolved") queryStatus = "RESOLVED";
        if (tab === "Closed") queryStatus = "CLOSED";

        dispatch(getTourAwaitingByStatus(queryStatus));
      }
    }
  }
  const handleCancel = async (id) => {
    const update = await dispatch(changeTourAwaitingStatus({ ticketId: id, queryStatus: "CLOSED" }))
    if (changeTourAwaitingStatus.fulfilled.match(update)) {
      dispatch(getTourAwaiting());
      if (tab !== "Open") {
        let queryStatus;
        if (tab === "In Progress") queryStatus = "IN_PROGRESS";
        if (tab === "Resolved") queryStatus = "RESOLVED";
        if (tab === "Closed") queryStatus = "CLOSED";

        dispatch(getTourAwaitingByStatus(queryStatus));
      }
    } else {
      dispatch(getTourAwaiting());
      if (tab !== "Open") {
        let queryStatus;
        if (tab === "In Progress") queryStatus = "IN_PROGRESS";
        if (tab === "Resolved") queryStatus = "RESOLVED";
        if (tab === "Closed") queryStatus = "CLOSED";

        dispatch(getTourAwaitingByStatus(queryStatus));
      }
    }
  }

  // Pick correct dataset depending on tab
  const data =
    tab === "Open"
      ? tourAwaiting
      : tourAwaitingByStatus || [];

  const loading =
    tab === "Open" ? tourAwaitingLoading : tourAwaitingLoadingByStatus;

  const error =
    tab === "Open" ? tourAwaitingError : tourAwaitingErrorByStatus;

  // Actions render logic
  const renderActions = (booking) => {
    if (tab === "Open") {
      return (
        <button
          onClick={async() => await handleInProgress(booking.ticketId)}
          // onClick={() => console.log("Move to In Progress", booking.ticketId)}
          className="cursor-pointer px-4 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm"
        >
          In Progress
        </button>
      );
    }
    if (tab === "In Progress") {
      return (
        <div className="flex gap-2 justify-center">
          <button
            onClick={async() => await handleConfirm(booking.ticketId)}
            // onClick={() => console.log("Confirm", booking.ticketId)}
            className="cursor-pointer px-4 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm"
          >
            Confirm
          </button>
          <button
            onClick={async() => handleCancel(booking.ticketId)}
            // onClick={() => console.log("Cancel", booking.ticketId)}
            className="cursor-pointer px-4 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
          >
            Cancel
          </button>
        </div>
      );
    }
    if (tab === "Resolved") {
      return (
        <button
        onClick={async() => handleCancel(booking.ticketId)}
          className="cursor-pointer px-4 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
        >
          Cancel
        </button>
      );
    }
    return null; // Closed → no action
  };

  return (
    <div className="p-6">
      {/* Tabs */}
      <div style={{marginBottom:'5px'}} className="flex gap-4 mb-6">
        {["Open", "In Progress", "Resolved", "Closed"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg font-medium ${tab === t
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-700 text-left">
              <th className="p-3">Subject</th>
              <th className="p-3">Status</th>
              <th className="p-3">Ticket ID</th>
              <th className="p-3">Query Type</th>
              <th className="p-3">Message</th>
              {tab !== "Closed" && <th className="p-3 text-center">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((booking) => (
              <tr
                key={booking.ticketId}
                className="hover:bg-gray-50 transition"
              >
                <td className="p-3 font-semibold">{booking.subject}</td>
                <td className="p-3">{booking.status}</td>
                <td className="p-3">{booking.ticketId}</td>
                <td className="p-3">{booking.queryType}</td>
                <td className="p-3 text-sm">{booking.message}</td>
                {tab !== "Closed" && (
                  <td className="p-3 text-center">{renderActions(booking)}</td>
                )}
              </tr>
            ))}

            {/* States */}
            {data.length === 0 && !loading && !error && (
              <tr>
                <td
                  colSpan={tab !== "Closed" ? 6 : 5}
                  className="p-4 text-center text-gray-500"
                >
                  No bookings found
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td
                  colSpan={tab !== "Closed" ? 6 : 5}
                  className="p-4 text-center text-gray-500"
                >
                  Loading bookings...
                </td>
              </tr>
            )}
            {error && (
              <tr>
                <td
                  colSpan={tab !== "Closed" ? 6 : 5}
                  className="p-4 text-center text-red-500"
                >
                  Failed to load bookings
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageTourBookings;
