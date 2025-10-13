// import React, { useEffect } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { getAllPartnerRequests } from '../../Redux/store/adminPartnerSlice';

// const ManagePartners = () => {
//     const { requests, loading, error } = useSelector((state) => state.adminPartner);
//     const dispatch = useDispatch()
//     useEffect(() => {
//       dispatch(getAllPartnerRequests())
//     }, [])
//     useEffect(() => {
//       console.log(requests)
//     }, [requests])
    
    
//     return (
//         <div className='min-h-screen p-6'>ManagePartners</div>
//     )
// }

// export default ManagePartners
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPartnerRequests } from "../../Redux/store/adminPartnerSlice";

const ManagePartners = () => {
  const dispatch = useDispatch();
  const { requests, loading, error } = useSelector((state) => state.adminPartner);

  useEffect(() => {
    dispatch(getAllPartnerRequests());
  }, [dispatch]);

  useEffect(() => {
    console.log(requests);
  }, [requests]);

  const handleAccept = (id) => {
    console.log("Accepted:", id);
  };

  const handleReject = (id) => {
    console.log("Rejected:", id);
  };

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-semibold mb-6">Manage Partner Requests</h1>

      {loading && (
        <div className="text-center text-gray-500 py-6">Loading...</div>
      )}

      {error && (
        <div className="text-center text-red-500 py-6">
          Error: {error.toString()}
        </div>
      )}

      {!loading && !error && (
        <div className="overflow-x-auto bg-white rounded-xl shadow-md">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-700 text-left">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3">GST No.</th>
                <th className="p-3">PAN No.</th>
                <th className="p-3">Address</th>
                <th className="p-3">Submitted At</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {requests.length > 0 ? (
                requests.map((partner) => (
                  <tr
                    key={partner.id}
                    className="hover:bg-gray-50 transition border-b"
                  >
                    <td className="p-3 font-semibold flex items-center gap-3">
                      {partner.imageUrl && (
                        <img
                          src={partner.imageUrl}
                          alt={partner.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      )}
                      {partner.name}
                    </td>
                    <td className="p-3 text-sm">{partner.email}</td>
                    <td className="p-3 text-sm">{partner.phoneNumber}</td>
                    <td className="p-3 text-sm">{partner.gstNumber}</td>
                    <td className="p-3 text-sm">{partner.panNumber}</td>
                    <td className="p-3 text-sm">{partner.address}</td>
                    <td className="p-3 text-sm">
                      {new Date(partner.submittedAt).toLocaleString()}
                    </td>
                    <td className="p-3 flex gap-2 justify-center">
                      <button
                        onClick={() => handleAccept(partner.id)}
                        className="px-4 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(partner.id)}
                        className="px-4 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="p-4 text-center text-gray-500">
                    No partner requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManagePartners;
