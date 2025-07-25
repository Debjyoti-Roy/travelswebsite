import React, { useState } from "react";
import { FiPlus, FiMinus, FiX } from "react-icons/fi";
import { storage } from "../../auth/firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { updateRoomFeatures } from "../../Redux/store/hotelSlice";
// import { updateRoomDetails } from "../../Redux/store/hotelSlice"; // Uncomment and implement if not present

const EditRoomModal = ({ room, onClose, onSuccess, updateRoomDetails }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState(room.name || "");
  const [totalRooms, setTotalRooms] = useState(room.totalRooms || 1);
  const [maxOccupancy, setMaxOccupancy] = useState(room.maxOccupancy || 1);
  const [features, setFeatures] = useState(room.features ? [...room.features] : [""]);
  const [pricePerNight, setPricePerNight] = useState(room.pricePerNight || "");
  const [imageUrls, setImageUrls] = useState(room.imageUrls ? [...room.imageUrls] : []);
  const [imagePreviews, setImagePreviews] = useState(room.imageUrls ? [...room.imageUrls] : []);
  const [imageFiles, setImageFiles] = useState([]); // For new uploads
  const [toBeDeletedImages, setToBeDeletedImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Track original data for change detection
  const original = React.useRef({
    name: room.name,
    totalRooms: room.totalRooms,
    maxOccupancy: room.maxOccupancy,
    features: JSON.stringify(room.features || []),
    pricePerNight: room.pricePerNight,
    imageUrls: JSON.stringify(room.imageUrls || []),
  });

  // Image upload logic
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files).slice(0, 2 - imageUrls.length);
    const newUrls = [];
    for (let file of files) {
      const imageRef = ref(storage, `rooms/${name.replace(/\s+/g, '').toLowerCase()}/images/${file.name}_${Date.now()}`);
      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);
      newUrls.push(url);
    }
    setImageUrls((prev) => [...prev, ...newUrls]);
    setImagePreviews((prev) => [...prev, ...newUrls]);
    setImageFiles((prev) => [...prev, ...files]);
  };

  // Deferred deletion logic
  const handleRemoveImage = (index) => {
    const url = imageUrls[index];
    setToBeDeletedImages((prev) => [...prev, url]);
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Features logic
  const handleFeatureChange = (idx, value) => {
    setFeatures((prev) => prev.map((f, i) => (i === idx ? value : f)));
  };
  const handleAddFeature = () => setFeatures((prev) => [...prev, ""]);
  const handleRemoveFeature = (idx) => setFeatures((prev) => prev.filter((_, i) => i !== idx));

  // Change detection for payload
  const getUpdatePayload = () => {
    const payload = {};
    if (name !== original.current.name) payload.name = name;
    if (totalRooms !== original.current.totalRooms) payload.totalRooms = totalRooms;
    if (maxOccupancy !== original.current.maxOccupancy) payload.maxOccupancy = maxOccupancy;
    if (JSON.stringify(features) !== original.current.features) payload.features = features.filter(f => f.trim() !== "");
    if (pricePerNight !== original.current.pricePerNight) payload.pricePerNight = pricePerNight;
    if (JSON.stringify(imageUrls) !== original.current.imageUrls) payload.imageUrls = imageUrls;
    return payload;
  };

  // Submit logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = getUpdatePayload();
    if (Object.keys(payload).length === 0) {
      toast("No changes to update.");
      setSubmitting(false);
      return;
    }
    try {
      // You may need to implement updateRoomDetails in your Redux slice
      const token = localStorage.getItem("token");
      const res = await dispatch(updateRoomFeatures({ id: room.id, features: payload, token: token }));
      if (res && res.payload && (res.payload.status === 200 || res.payload.status === 201)) {
        // Delete images from Firebase only after success
        for (const url of toBeDeletedImages) {
          try {
            const path = decodeURIComponent(url.split("/o/")[1].split("?alt=")[0]);
            const fileRef = ref(storage, path);
            await deleteObject(fileRef);
          } catch {}
        }
        setToBeDeletedImages([]);
        toast.success("Room updated successfully!");
        setSubmitting(false);
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      } else {
        // API failed, restore preview
        setImageUrls((prev) => [...prev, ...toBeDeletedImages]);
        setImagePreviews((prev) => [...prev, ...toBeDeletedImages]);
        setToBeDeletedImages([]);
        console.log("update failed")
        toast.error("Update failed");
        setSubmitting(false);
      }
    } catch (err) {
      setImageUrls((prev) => [...prev, ...toBeDeletedImages]);
      setImagePreviews((prev) => [...prev, ...toBeDeletedImages]);
      setToBeDeletedImages([]);
      console.log("update failed")
      toast.error("Update failed");
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-0 overflow-y-auto max-h-[90vh] relative">
        <button onClick={onClose} className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-200 text-gray-600"><FiX size={22} /></button>
        <form onSubmit={handleSubmit} className="flex flex-col gap-8 p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 pb-2">Edit Room</h2>
          <input
            type="text"
            placeholder="Room Type (Name)"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
            required
          />
          <div className="flex flex-col md:flex-row md:items-center md:gap-8 gap-6">
            <div className="flex items-center gap-4 p-2">
              <label className="w-32 font-medium text-gray-700">Total Rooms</label>
              <button type="button" onClick={() => setTotalRooms(v => Math.max(1, v - 1))} className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 transition"><FiMinus /></button>
              <span className="w-8 text-center text-lg font-semibold">{totalRooms}</span>
              <button type="button" onClick={() => setTotalRooms(v => v + 1)} className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 transition"><FiPlus /></button>
            </div>
            <div className="flex items-center gap-4 p-2">
              <label className="w-32 font-medium text-gray-700">Max Occupancy</label>
              <button type="button" onClick={() => setMaxOccupancy(v => Math.max(1, v - 1))} className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 transition"><FiMinus /></button>
              <span className="w-8 text-center text-lg font-semibold">{maxOccupancy}</span>
              <button type="button" onClick={() => setMaxOccupancy(v => v + 1)} className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 transition"><FiPlus /></button>
            </div>
          </div>
          <div className="p-2">
            <label className="block font-medium text-gray-700 pb-2">Features</label>
            <div className="flex flex-col gap-3">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={`Feature ${idx + 1}`}
                    value={feature}
                    onChange={e => handleFeatureChange(idx, e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
                  />
                  {features.length > 1 && (
                    <button type="button" onClick={() => handleRemoveFeature(idx)} className="text-red-500 hover:text-red-700"><FiX /></button>
                  )}
                </div>
              ))}
              <button type="button" onClick={handleAddFeature} className="text-blue-600 hover:underline text-sm">+ Add Feature</button>
            </div>
          </div>
          <input
            type="number"
            placeholder="Price Per Night"
            value={pricePerNight}
            onChange={e => setPricePerNight(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
            required
          />
          <div className="p-2">
            <h3 className="text-lg font-semibold text-gray-800 pb-2">Image Upload <span className="text-red-500">*</span></h3>
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-4">
                {imagePreviews?.map((preview, idx) => (
                  <div key={idx} className="relative bg-gray-100 rounded-lg overflow-hidden shadow w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.5rem)]">
                    <img src={preview} alt={`Preview ${idx}`} className="w-full h-44 object-contain rounded" />
                    <button type="button" onClick={() => handleRemoveImage(idx)} className="absolute top-2 right-2 bg-[#2589f3] text-white rounded-full p-1 hover:bg-[#5dacf2] transition-all"><FiX size={16} /></button>
                  </div>
                ))}
              </div>
              {imageUrls.length < 2 && (
                <input type="file" accept="image/*" onChange={handleImageChange} className="w-full p-3 border border-gray-300 rounded-lg bg-white shadow-sm" multiple />
              )}
            </div>
            <p className="text-sm text-gray-500 pt-2">Minimum 1 image required, maximum 2 allowed.</p>
          </div>
          <div className="flex justify-end gap-3 mt-8">
            <button type="button" onClick={onClose} className="px-6 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
            <button type="submit" disabled={submitting} className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">{submitting ? "Saving..." : "Save Changes"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRoomModal; 