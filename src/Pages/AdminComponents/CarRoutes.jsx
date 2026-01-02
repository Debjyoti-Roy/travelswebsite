import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllRoutes, getAllLocations, addRoutes, deleteRoute, updateRoute } from '../../Redux/store/routeSlice';
import { FaEye, FaPlus, FaTimes, FaEdit, FaTrash } from 'react-icons/fa';
import CreatableSelect from 'react-select/creatable';
import toast from 'react-hot-toast';

const CarRoutes = () => {
  const dispatch = useDispatch();
  const {
    allRoutes,
    allRoutesLoading,
    allRoutesError,
    allLocations,
    allLocationsLoading,
    loading,
    error,
    success,
    deleteRouteLoading,
    deleteRouteError,
    deleteRouteSuccess,
    updateRouteLoading,
    updateRouteError,
    updateRouteSuccess,
  } = useSelector((state) => state.routes);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [routeToEdit, setRouteToEdit] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    basePrice: '',
    perKmRate: '',
    isActive: true,
  });

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    basePrice: '',
    perKmRate: '',
    numberOfPeople: '',
    pickUpLocations: [{ id: null, name: '', lat: '', lng: '' }],
    dropLocations: [{ id: null, name: '', lat: '', lng: '' }],
    active: true,
  });

  useEffect(() => {
    dispatch(getAllRoutes());
    dispatch(getAllLocations());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      toast.success('Route added successfully');
      setAddModalOpen(false);
      resetForm();
      dispatch(getAllRoutes());
    }
    if (error) {
      toast.error(error.message || 'Failed to add route');
    }
  }, [success, error, dispatch]);

  useEffect(() => {
    if (deleteRouteSuccess) {
      toast.success('Route deleted successfully');
      dispatch(getAllRoutes());
    }
    if (deleteRouteError) {
      toast.error(deleteRouteError.message || 'Failed to delete route');
    }
  }, [deleteRouteSuccess, deleteRouteError, dispatch]);

  useEffect(() => {
    if (updateRouteSuccess) {
      toast.success('Route updated successfully');
      setEditModalOpen(false);
      setRouteToEdit(null);
      dispatch(getAllRoutes());
    }
    if (updateRouteError) {
      toast.error(updateRouteError.message || 'Failed to update route');
    }
  }, [updateRouteSuccess, updateRouteError, dispatch]);

  const resetForm = () => {
    setFormData({
      name: '',
      basePrice: '',
      perKmRate: '',
      numberOfPeople: '',
      pickUpLocations: [{ id: null, name: '', lat: '', lng: '' }],
      dropLocations: [{ id: null, name: '', lat: '', lng: '' }],
      active: true,
    });
  };

  const handleViewRoute = (route) => {
    setSelectedRoute(route);
    setViewModalOpen(true);
  };

  const handleEditRoute = (route) => {
    setRouteToEdit(route);
    setEditFormData({
      name: route.name || '',
      basePrice: route.basePrice || '',
      perKmRate: route.perKmRate || '',
      isActive: route.active !== undefined ? route.active : true,
    });
    setEditModalOpen(true);
  };

  const handleDeleteRoute = async (routeId) => {
    if (window.confirm('Are you sure you want to delete this route?')) {
      try {
        await dispatch(deleteRoute({ id: routeId })).unwrap();
      } catch (err) {
        console.error('Error deleting route:', err);
      }
    }
  };

  const handleUpdateRoute = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const updateData = {
      name: editFormData.name,
      basePrice: parseFloat(editFormData.basePrice),
      perKmRate: parseFloat(editFormData.perKmRate),
      isActive: editFormData.isActive,
    };

    try {
      await dispatch(updateRoute({ routeData: updateData, id: routeToEdit.id })).unwrap();
    } catch (err) {
      console.error('Error updating route:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddPickupLocation = () => {
    setFormData({
      ...formData,
      pickUpLocations: [...formData.pickUpLocations, { id: null, name: '', lat: '', lng: '' }],
    });
  };

  const handleRemovePickupLocation = (index) => {
    const newLocations = formData.pickUpLocations.filter((_, i) => i !== index);
    setFormData({ ...formData, pickUpLocations: newLocations });
  };

  const handleAddDropLocation = () => {
    setFormData({
      ...formData,
      dropLocations: [...formData.dropLocations, { id: null, name: '', lat: '', lng: '' }],
    });
  };

  const handleRemoveDropLocation = (index) => {
    const newLocations = formData.dropLocations.filter((_, i) => i !== index);
    setFormData({ ...formData, dropLocations: newLocations });
  };

  const handlePickupLocationChange = (index, selectedOption) => {
    const newLocations = [...formData.pickUpLocations];
    
    if (!selectedOption) {
      // Cleared selection
      newLocations[index] = { id: null, name: '', lat: '', lng: '' };
    } else {
      // Check if it's an existing location (has numeric id) or new one
      const location = allLocations.find(loc => loc.id === selectedOption.value);
      if (location) {
        // Selected from dropdown - auto-fill id, lat, lng
        newLocations[index] = {
          id: location.id,
          name: location.name,
          lat: location.lat,
          lng: location.lng,
        };
      } else {
        // Creating new option - set name, id is null, lat/lng need manual entry
        newLocations[index] = {
          id: null,
          name: selectedOption.value || selectedOption.label,
          lat: newLocations[index].lat || '',
          lng: newLocations[index].lng || '',
        };
      }
    }
    
    setFormData({ ...formData, pickUpLocations: newLocations });
  };

  const handleDropLocationChange = (index, selectedOption) => {
    const newLocations = [...formData.dropLocations];
    
    if (!selectedOption) {
      // Cleared selection
      newLocations[index] = { id: null, name: '', lat: '', lng: '' };
    } else {
      // Check if it's an existing location (has numeric id) or new one
      const location = allLocations.find(loc => loc.id === selectedOption.value);
      if (location) {
        // Selected from dropdown - auto-fill id, lat, lng
        newLocations[index] = {
          id: location.id,
          name: location.name,
          lat: location.lat,
          lng: location.lng,
        };
      } else {
        // Creating new option - set name, id is null, lat/lng need manual entry
        newLocations[index] = {
          id: null,
          name: selectedOption.value || selectedOption.label,
          lat: newLocations[index].lat || '',
          lng: newLocations[index].lng || '',
        };
      }
    }
    
    setFormData({ ...formData, dropLocations: newLocations });
  };

  const handlePickupLocationInputChange = (index, field, value) => {
    const newLocations = [...formData.pickUpLocations];
    newLocations[index] = { ...newLocations[index], [field]: value };
    setFormData({ ...formData, pickUpLocations: newLocations });
  };

  const handleDropLocationInputChange = (index, field, value) => {
    const newLocations = [...formData.dropLocations];
    newLocations[index] = { ...newLocations[index], [field]: value };
    setFormData({ ...formData, dropLocations: newLocations });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Prepare data for submission
    const submitData = {
      name: formData.name,
      basePrice: parseFloat(formData.basePrice),
      perKmRate: parseFloat(formData.perKmRate),
      numberOfPeople: Number(formData.numberOfPeople),
      pickUpLocations: formData.pickUpLocations.map(loc => ({
        id: loc.id || 0,
        name: loc.name,
        lat: parseFloat(loc.lat) || 0,
        lng: parseFloat(loc.lng) || 0,
      })),
      dropLocations: formData.dropLocations.map(loc => ({
        id: loc.id || 0,
        name: loc.name,
        lat: parseFloat(loc.lat) || 0,
        lng: parseFloat(loc.lng) || 0,
      })),
      active: formData.active,
    };

    try {
      await dispatch(addRoutes(submitData)).unwrap();
    } catch (err) {
      console.error('Error adding route:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Prepare options for CreatableSelect
  const locationOptions = useMemo(() => {
    if (!allLocations || allLocations.length === 0) return [];
    return allLocations.map(loc => ({
      value: loc.id,
      label: loc.name,
    }));
  }, [allLocations]);

  // Get current value for CreatableSelect
  const getPickupLocationValue = (index) => {
    const loc = formData.pickUpLocations[index];
    if (loc && loc.name) {
      // If it has an id, use id as value, otherwise use name
      if (loc.id !== null && loc.id !== undefined) {
        return { value: loc.id, label: loc.name };
      }
      return { value: loc.name, label: loc.name };
    }
    return null;
  };

  const getDropLocationValue = (index) => {
    const loc = formData.dropLocations[index];
    if (loc && loc.name) {
      // If it has an id, use id as value, otherwise use name
      if (loc.id !== null && loc.id !== undefined) {
        return { value: loc.id, label: loc.name };
      }
      return { value: loc.name, label: loc.name };
    }
    return null;
  };

  return (
    <div className="min-h-screen p-6">
      {/* Header with Add Route Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Car Routes</h2>
        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          <FaPlus /> Add Route
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-700 text-left">
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Base Price</th>
              <th className="p-3">Per Km Rate</th>
              <th className="p-3">Pickup Locations</th>
              <th className="p-3">Drop Locations</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allRoutesLoading && (
              <tr>
                <td colSpan={8} className="p-4 text-center text-gray-500">
                  Loading routes...
                </td>
              </tr>
            )}
            {allRoutesError && (
              <tr>
                <td colSpan={8} className="p-4 text-center text-red-500">
                  Error: {allRoutesError.message || 'Failed to load routes'}
                </td>
              </tr>
            )}
            {!allRoutesLoading && !allRoutesError && (!allRoutes || allRoutes.length === 0) && (
              <tr>
                <td colSpan={8} className="p-4 text-center text-gray-500">
                  No routes found
                </td>
              </tr>
            )}
            {!allRoutesLoading &&
              !allRoutesError &&
              allRoutes &&
              Array.isArray(allRoutes) &&
              allRoutes.length > 0 &&
              allRoutes.map((route) => (
                <tr key={route.id} className="hover:bg-gray-50 transition">
                  <td className="p-3">{route.id}</td>
                  <td className="p-3 font-semibold">{route.name}</td>
                  <td className="p-3">₹{route.basePrice}</td>
                  <td className="p-3">₹{route.perKmRate}</td>
                  <td className="p-3 text-sm">
                    {route.pickUpLocations?.length || 0} location(s)
                  </td>
                  <td className="p-3 text-sm">
                    {route.dropLocations?.length || 0} location(s)
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        route.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {route.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleViewRoute(route)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded transition"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleEditRoute(route)}
                        className="p-2 text-green-500 hover:bg-green-50 rounded transition"
                        title="Edit Route"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteRoute(route.id)}
                        disabled={deleteRouteLoading}
                        className="p-2 text-red-500 hover:bg-red-50 rounded transition disabled:opacity-50"
                        title="Delete Route"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* View Route Modal */}
      {viewModalOpen && selectedRoute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setViewModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700"
            >
              <FaTimes className="h-5 w-5" />
            </button>
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-4">Route Details</h3>
              <div className="space-y-4">
                <div>
                  <strong>ID:</strong> {selectedRoute.id}
                </div>
                <div>
                  <strong>Name:</strong> {selectedRoute.name}
                </div>
                <div>
                  <strong>Base Price:</strong> ₹{selectedRoute.basePrice}
                </div>
                <div>
                  <strong>Per Km Rate:</strong> ₹{selectedRoute.perKmRate}
                </div>
                <div>
                  <strong>Status:</strong>{' '}
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      selectedRoute.active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {selectedRoute.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div>
                  <strong>Pickup Locations:</strong>
                  <ul className="list-disc pl-6 mt-2">
                    {selectedRoute.pickUpLocations?.map((loc, idx) => (
                      <li key={idx} className="mt-1">
                        {loc.name} (Lat: {loc.lat}, Lng: {loc.lng})
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong>Drop Locations:</strong>
                  <ul className="list-disc pl-6 mt-2">
                    {selectedRoute.dropLocations?.map((loc, idx) => (
                      <li key={idx} className="mt-1">
                        {loc.name} (Lat: {loc.lat}, Lng: {loc.lng})
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Route Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => {
                setAddModalOpen(false);
                resetForm();
              }}
              className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700"
            >
              <FaTimes className="h-5 w-5" />
            </button>
            <form onSubmit={handleSubmit} className="p-6">
              <h3 style={{marginBottom: '10px'}} className="text-2xl font-bold mb-4">Add New Route</h3>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-1">Route Name *</label>
                  <input
                    type="text"
                    style={{marginBottom: '10px'}}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Base Price */}
                <div>
                  <label className="block text-sm font-medium mb-1">Base Price *</label>
                  <input
                    type="number"
                    style={{marginBottom: '10px'}}
                    step="0.01"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Per Km Rate */}
                <div>
                  <label className="block text-sm font-medium mb-1">Per Km Rate *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.perKmRate}
                    style={{marginBottom: '10px'}}
                    onChange={(e) => setFormData({ ...formData, perKmRate: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                {/* Number of People */}
                <div>
                  <label className="block text-sm font-medium mb-1">Number of People *</label>
                  <select
                    value={formData.numberOfPeople}
                    style={{marginBottom: '20px'}}
                    onChange={(e) => setFormData({ ...formData, numberOfPeople: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Number of People</option>
                    <option value="4">4</option>
                    <option value="6">6</option>
                  </select>
                </div>

                {/* Pickup Locations */}
                <div style={{marginBottom: '20px'}}>
                  <div style={{marginBottom: '10px'}} className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium">Pickup Locations *</label>
                    <button
                      type="button"
                      onClick={handleAddPickupLocation}
                      className="text-blue-500 hover:text-blue-700 text-sm flex"
                    >
                      <FaPlus /> <div className='text-sm'> Add Location</div>
                    </button>
                  </div>
                  {formData.pickUpLocations.map((loc, index) => (
                    <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Location {index + 1}</span>
                        {formData.pickUpLocations.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemovePickupLocation(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTimes />
                          </button>
                        )}
                      </div>
                      <div className="mb-2">
                        <label className="block text-xs text-gray-600 mb-1">Location Name *</label>
                        <CreatableSelect
                          options={locationOptions}
                          value={getPickupLocationValue(index)}
                          onChange={(option) => handlePickupLocationChange(index, option)}
                          placeholder="Select or create location"
                          isClearable
                          className="text-sm"
                        />
                      </div>
                      {loc.id === null && (
                        <>
                          <div className="mb-2">
                            <label className="block text-xs text-gray-600 mb-1">Latitude *</label>
                            <input
                              type="number"
                              step="any"
                              value={loc.lat}
                              onChange={(e) =>
                                handlePickupLocationInputChange(index, 'lat', e.target.value)
                              }
                              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required={loc.id === null}
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Longitude *</label>
                            <input
                              type="number"
                              step="any"
                              value={loc.lng}
                              onChange={(e) =>
                                handlePickupLocationInputChange(index, 'lng', e.target.value)
                              }
                              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required={loc.id === null}
                            />
                          </div>
                        </>
                      )}
                      {loc.id !== null && (
                        <div className="text-xs text-gray-500 mt-2">
                          ID: {loc.id} | Lat: {loc.lat} | Lng: {loc.lng}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Drop Locations */}
                <div style={{marginBottom: '10px'}}>
                  <div style={{marginBottom: '10px'}} className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium">Drop Locations *</label>
                    <button
                      type="button"
                      onClick={handleAddDropLocation}
                      className="text-blue-500 hover:text-blue-700 text-sm flex"
                    >
                      <FaPlus /> <div className='text-sm'> Add Location</div>
                    </button>
                  </div>
                  {formData.dropLocations.map((loc, index) => (
                    <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Location {index + 1}</span>
                        {formData.dropLocations.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveDropLocation(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTimes />
                          </button>
                        )}
                      </div>
                      <div className="mb-2">
                        <label className="block text-xs text-gray-600 mb-1">Location Name *</label>
                        <CreatableSelect
                          options={locationOptions}
                          value={getDropLocationValue(index)}
                          onChange={(option) => handleDropLocationChange(index, option)}
                          placeholder="Select or create location"
                          isClearable
                          className="text-sm"
                        />
                      </div>
                      {loc.id === null && (
                        <>
                          <div className="mb-2">
                            <label className="block text-xs text-gray-600 mb-1">Latitude *</label>
                            <input
                              type="number"
                              step="any"
                              value={loc.lat}
                              onChange={(e) =>
                                handleDropLocationInputChange(index, 'lat', e.target.value)
                              }
                              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required={loc.id === null}
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Longitude *</label>
                            <input
                              type="number"
                              step="any"
                              value={loc.lng}
                              onChange={(e) =>
                                handleDropLocationInputChange(index, 'lng', e.target.value)
                              }
                              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required={loc.id === null}
                            />
                          </div>
                        </>
                      )}
                      {loc.id !== null && (
                        <div className="text-xs text-gray-500 mt-2">
                          ID: {loc.id} | Lat: {loc.lat} | Lng: {loc.lng}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Active Status */}
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium">Active</span>
                  </label>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setAddModalOpen(false);
                      resetForm();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Submitting...' : 'Add Route'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Route Modal */}
      {editModalOpen && routeToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => {
                setEditModalOpen(false);
                setRouteToEdit(null);
              }}
              className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700"
            >
              <FaTimes className="h-5 w-5" />
            </button>
            <form onSubmit={handleUpdateRoute} className="p-6">
              <h3 className="text-2xl font-bold mb-4">Edit Route</h3>

              {/* Read-only details */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3 text-gray-700">Route Details (Read-only)</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>ID:</strong> {routeToEdit.id}
                  </div>
                  <div>
                    <strong>Number of People:</strong> {routeToEdit.numberOfPeople || 'N/A'}
                  </div>
                  <div className="col-span-2">
                    <strong>Pickup Locations:</strong>
                    <ul className="list-disc pl-6 mt-1">
                      {routeToEdit.pickUpLocations?.map((loc, idx) => (
                        <li key={idx} className="text-xs">
                          {loc.name} (Lat: {loc.lat}, Lng: {loc.lng})
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="col-span-2">
                    <strong>Drop Locations:</strong>
                    <ul className="list-disc pl-6 mt-1">
                      {routeToEdit.dropLocations?.map((loc, idx) => (
                        <li key={idx} className="text-xs">
                          {loc.name} (Lat: {loc.lat}, Lng: {loc.lng})
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Editable fields */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-700 mb-3">Editable Fields</h4>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-1">Route Name *</label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Base Price */}
                <div>
                  <label className="block text-sm font-medium mb-1">Base Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editFormData.basePrice}
                    onChange={(e) => setEditFormData({ ...editFormData, basePrice: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Per Km Rate */}
                <div>
                  <label className="block text-sm font-medium mb-1">Per Km Rate *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editFormData.perKmRate}
                    onChange={(e) => setEditFormData({ ...editFormData, perKmRate: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Active Status */}
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editFormData.isActive}
                      onChange={(e) => setEditFormData({ ...editFormData, isActive: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium">Active</span>
                  </label>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setEditModalOpen(false);
                      setRouteToEdit(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || updateRouteLoading}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting || updateRouteLoading ? 'Updating...' : 'Update Route'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarRoutes;
