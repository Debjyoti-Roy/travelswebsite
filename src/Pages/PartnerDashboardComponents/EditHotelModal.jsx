import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useDispatch } from "react-redux";
import { updateHotelDetails } from "../../Redux/store/hotelSlice";
import { storage } from "../../auth/firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import statesJson from "../../assets/ade5836fae0ac40531e6afb111d61870-4fe8c90e127060d55ad3c7d6d603d13528450e5b/india-states-and-districts.json";
import { FaUtensils, FaConciergeBell, FaParking, FaTshirt, FaUserTie, FaHotel, FaSuitcase, FaFirstAid, FaVideo, FaHotTub, FaFire, FaWifi, FaCouch, FaTint, FaHiking, FaHeart, FaUsers, FaBlind, FaUser, FaUserFriends, FaPaw, FaChild } from "react-icons/fa";
import { MdPower } from "react-icons/md";
import { GiCampfire } from "react-icons/gi";
import { MdDelete, MdAdd } from "react-icons/md";

const amenitiesList = [
  { id: 1, label: "On-site Restaurant / Kitchen", icon: <FaUtensils /> },
  { id: 2, label: "Room Service", icon: <FaConciergeBell /> },
  { id: 3, label: "Power Backup", icon: <MdPower /> },
  { id: 4, label: "Parking Facility", icon: <FaParking /> },
  { id: 5, label: "Laundry Service", icon: <FaTshirt /> },
  { id: 6, label: "Caretaker on Site", icon: <FaUserTie /> },
  { id: 7, label: "Reception", icon: <FaHotel /> },
  { id: 8, label: "Luggage Storage", icon: <FaSuitcase /> },
  { id: 9, label: "First Aid Kit", icon: <FaFirstAid /> },
  { id: 10, label: "CCTV Surveillance", icon: <FaVideo /> },
  { id: 11, label: "Hot Water", icon: <FaHotTub /> },
  { id: 12, label: "Room Heater", icon: <FaFire /> },
  { id: 13, label: "Wi-Fi", icon: <FaWifi /> },
  { id: 14, label: "Bonfire Facility", icon: <GiCampfire /> },
  { id: 15, label: "Seating Area", icon: <FaCouch /> },
  { id: 16, label: "Water Purifier", icon: <FaTint /> },
];
const tagsList = [
  { id: 1, label: "Backpackers", icon: <FaHiking /> },
  { id: 2, label: "Couple Friendly", icon: <FaHeart /> },
  { id: 3, label: "Family Friendly", icon: <FaUsers /> },
  { id: 4, label: "Senior Citizen Friendly", icon: <FaBlind /> },
  { id: 5, label: "Solo Traveler Friendly", icon: <FaUser /> },
  { id: 6, label: "Group Friendly", icon: <FaUserFriends /> },
  { id: 7, label: "Pet Friendly", icon: <FaPaw /> },
  { id: 8, label: "Child Friendly", icon: <FaChild /> },
];
const attractionTypes = [
  "MONUMENT",
  "PARK",
  "LAKE",
  "MARKET",
  "MUSEUM",
  "VIEWPOINT",
  "OTHER",
];
const statesData = statesJson.states.map((s) => ({ value: s.state, label: s.state }));

const MAX_IMAGES = 5;

const EditHotelModal = ({ hotel, onClose, onSuccess, setCounter }) => {
  useEffect(() => {
    console.log(hotel);
  }, [hotel]);
  const dispatch = useDispatch();
  const [tab, setTab] = useState("basic");
  const [basicDetails, setBasicDetails] = useState({
    name: hotel.name || "",
    about: hotel.about || "",
    address: hotel.address || "",
    state: hotel.location?.state || "",
    district: hotel.location?.district || "",
    city: hotel.location?.city || "",
    pincode: hotel.location?.pincode || "",
    area: hotel.location?.area || "",
    latitude: hotel.latitude || "",
    longitude: hotel.longitude || "",
  });
  // For image preview, keep URLs only
  const [mediaImages, setMediaImages] = useState(hotel.imageUrls ? [...hotel.imageUrls] : []);
const [mediaImagesPreview, setMediaImagesPreview] = useState(hotel.imageUrls ? [...hotel.imageUrls] : []);
const [mediaVideo, setMediaVideo] = useState(hotel.videoUrl || "");
const [mediaVideoPreview, setMediaVideoPreview] = useState(hotel.videoUrl || "");
const [toBeDeletedImages, setToBeDeletedImages] = useState([]);
const [toBeDeletedVideo, setToBeDeletedVideo] = useState(null);

  // Fix amenities and tags initialization
  const [selectedAmenities, setSelectedAmenities] = useState(
    hotel.amenities ? hotel.amenities.map(a => Number(a.id)) : []
  );
  const [selectedTags, setSelectedTags] = useState(
    hotel.tags
      ? hotel.tags
          .map(tagName => {
            const tagObj = tagsList.find(t => t.label === tagName);
            return tagObj ? tagObj.id : null;
          })
          .filter(Boolean)
      : []
  );
  const [attractions, setAttractions] = useState(hotel.nearbyAttractions ? [...hotel.nearbyAttractions] : []);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Track original data for change detection
  const original = React.useRef({
    basicDetails: { ...basicDetails },
    mediaImages: [...mediaImages],
    mediaVideo,
    selectedTags: [...selectedTags],
    selectedAmenities: [...selectedAmenities],
    attractions: [...attractions],
  });

  // Tab switching is always allowed
  const handleTabChange = (targetTab) => setTab(targetTab);

  // Image/video upload/delete logic
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file && mediaImages.length < MAX_IMAGES) {
      const formattedName = basicDetails.name ? basicDetails.name.replace(/\s+/g, '').toLowerCase() : "";
      const imageRef = ref(storage, `hotels/${formattedName}/images/${file.name}_${Date.now()}`);
      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);
      setMediaImages((prev) => [...prev, url]);
      setMediaImagesPreview((prev) => [...prev, url]);
    }
  };
  // Image/video remove logic (deferred deletion)
  const handleRemoveImage = (index) => {
    const url = mediaImages[index];
    setToBeDeletedImages((prev) => [...prev, url]);
    setMediaImages((prev) => prev.filter((_, i) => i !== index));
    setMediaImagesPreview((prev) => prev.filter((_, i) => i !== index));
  };
  const handleVideoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formattedName = basicDetails.name ? basicDetails.name.replace(/\s+/g, '').toLowerCase() : "";
      const videoRef = ref(storage, `hotels/${formattedName}/videos/${file.name}_${Date.now()}`);
      await uploadBytes(videoRef, file);
      const url = await getDownloadURL(videoRef);
      setMediaVideo(url);
      setMediaVideoPreview(url);
    }
  };
  // Video remove logic (deferred deletion)
  const handleRemoveVideo = () => {
    setToBeDeletedVideo(mediaVideo);
    setMediaVideo("");
    setMediaVideoPreview("");
  };

  // Change detection for payload
  const getUpdatePayload = () => {
    const payload = {};
    // Basic details
    Object.keys(basicDetails).forEach((key) => {
      if (basicDetails[key] !== original.current.basicDetails[key]) {
        payload[key] = basicDetails[key];
      }
    });
    // Location: always send full object if any location field changed
    const locKeys = ["state", "district", "city", "area", "pincode", "latitude", "longitude"];
    const locChanged = locKeys.some((k) => basicDetails[k] !== original.current.basicDetails[k]);
    if (locChanged) {
      payload.location = {
        state: basicDetails.state,
        district: basicDetails.district,
        city: basicDetails.city,
        area: basicDetails.area,
        pincode: basicDetails.pincode,
        latitude: basicDetails.latitude,
        longitude: basicDetails.longitude,
      };
      locKeys.forEach((k) => delete payload[k]);
    }
    // Images: if changed, send full array
    if (JSON.stringify(mediaImages) !== JSON.stringify(original.current.mediaImages)) {
      payload.media = payload.media || {};
      payload.media.imageUrls = mediaImages;
      payload.media.videoUrl = original.current.mediaVideo;
    }
    if (mediaVideo !== original.current.mediaVideo) {
      payload.media = payload.media || {};
      payload.media.imageUrls = original.current.mediaImages;
      payload.media.videoUrl = mediaVideo;
    }
    
    // Tags
    if (JSON.stringify(selectedTags) !== JSON.stringify(original.current.selectedTags)) {
      payload.tagIds = selectedTags;
    }
    // Amenities
    if (JSON.stringify(selectedAmenities) !== JSON.stringify(original.current.selectedAmenities)) {
      payload.amenityIds = selectedAmenities;
    }
    // Attractions: if changed, send full array
    if (JSON.stringify(attractions) !== JSON.stringify(original.current.attractions)) {
      payload.nearbyAttractions = attractions;
    }
    return payload;
  };

  const handleSubmit = async () => {
    setSubmitLoading(true);
    const payload = getUpdatePayload();
    if (Object.keys(payload).length === 0) {
      toast("No changes to update.");
      setSubmitLoading(false);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await dispatch(updateHotelDetails({ hotelId: hotel.id, payload, token }));
      // Only delete from Firebase if API is successful
      if (res && res.payload && (res.payload.status === 200 || res.payload.status === 201)) {
        // Delete images
        setCounter()
        for (const url of toBeDeletedImages) {
          try {
            const path = decodeURIComponent(url.split("/o/")[1].split("?alt=")[0]);
            const fileRef = ref(storage, path);
            await deleteObject(fileRef);
          } catch {}
        }
        // Delete video
        if (toBeDeletedVideo) {
          try {
            const path = decodeURIComponent(toBeDeletedVideo.split("/o/")[1].split("?alt=")[0]);
            const fileRef = ref(storage, path);
            await deleteObject(fileRef);
          } catch {}
        }
        setToBeDeletedImages([]);
        setToBeDeletedVideo(null);
        toast.success("Hotel updated successfully!");
        setSubmitLoading(false);
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      } else {
        // API failed, restore preview
        setMediaImages((prev) => [...prev, ...toBeDeletedImages]);
        setMediaImagesPreview((prev) => [...prev, ...toBeDeletedImages]);
        if (toBeDeletedVideo) {
          setMediaVideo(toBeDeletedVideo);
          setMediaVideoPreview(toBeDeletedVideo);
        }
        setToBeDeletedImages([]);
        setToBeDeletedVideo(null);
        toast.error("Update failed");
        setSubmitLoading(false);
      }
    } catch (err) {
      // API failed, restore preview
      setMediaImages((prev) => [...prev, ...toBeDeletedImages]);
      setMediaImagesPreview((prev) => [...prev, ...toBeDeletedImages]);
      if (toBeDeletedVideo) {
        setMediaVideo(toBeDeletedVideo);
        setMediaVideoPreview(toBeDeletedVideo);
      }
      setToBeDeletedImages([]);
      setToBeDeletedVideo(null);
      toast.error("Update failed");
      setSubmitLoading(false);
    }
  };

  // --- UI ---
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl p-0 overflow-y-auto max-h-[90vh] relative flex min-h-[600px]">
        <button onClick={onClose} className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-200 text-gray-600"><FiX size={22} /></button>
        {/* Sidebar */}
        <div className="flex flex-col w-1/4 border-r border-gray-300 min-w-[200px] bg-gray-50">
          <button className={`p-4 text-left ${tab === "basic" ? "bg-blue-500 text-white" : ""}`} onClick={() => handleTabChange("basic")}>Basic Details</button>
          <button className={`p-4 text-left ${tab === "media" ? "bg-blue-500 text-white" : ""}`} onClick={() => handleTabChange("media")}>Media Upload</button>
          <button className={`p-4 text-left ${tab === "attractions" ? "bg-blue-500 text-white" : ""}`} onClick={() => handleTabChange("attractions")}>Additional Details</button>
        </div>
        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {tab === "basic" && (
            <form className="flex flex-col gap-5 bg-white p-1 rounded-2xl w-full mx-auto">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Hotel Name</label>
                <input type="text" value={basicDetails.name} onChange={e => setBasicDetails({ ...basicDetails, name: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Hotel Address</label>
                <input type="text" value={basicDetails.address} onChange={e => setBasicDetails({ ...basicDetails, address: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">About</label>
                <textarea value={basicDetails.about} onChange={e => setBasicDetails({ ...basicDetails, about: e.target.value })} rows={3} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">State</label>
                <Select options={statesData} value={statesData.find(opt => opt.value === basicDetails.state)} onChange={option => setBasicDetails({ ...basicDetails, state: option.value })} placeholder="Select state" isSearchable className="rounded-lg focus:outline-none" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">District</label>
                <input type="text" value={basicDetails.district} onChange={e => setBasicDetails({ ...basicDetails, district: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">City</label>
                <input type="text" value={basicDetails.city} onChange={e => setBasicDetails({ ...basicDetails, city: e.target.value })} className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Area</label>
                <input type="text" value={basicDetails.area} onChange={e => setBasicDetails({ ...basicDetails, area: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Pincode</label>
                <input type="text" value={basicDetails.pincode} onChange={e => setBasicDetails({ ...basicDetails, pincode: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Latitude</label>
                <input type="text" value={basicDetails.latitude} onChange={e => setBasicDetails({ ...basicDetails, latitude: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Longitude</label>
                <input type="text" value={basicDetails.longitude} onChange={e => setBasicDetails({ ...basicDetails, longitude: e.target.value })} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" />
              </div>
            </form>
          )}
          {tab === "media" && (
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Image Upload</h3>
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-4">
                    {mediaImagesPreview?.map((preview, index) => (
                      <div key={index} className="relative bg-gray-100 rounded overflow-hidden">
                        <img src={preview} alt={`Preview ${index}`} className="w-full h-48 object-contain rounded" />
                        <button onClick={() => handleRemoveImage(index)} className="absolute top-1 right-1 bg-[#2589f3] text-white rounded-full p-1 hover:bg-[#5dacf2]">
                          <FiX size={16} className="text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                  {mediaImages.length < MAX_IMAGES && (
                    <input type="file" accept="image/*" onChange={handleImageChange} className="w-full p-2 border border-gray-300 rounded" />
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-2">Maximum 5 images allowed.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Video Upload</h3>
                {mediaVideoPreview && (
                  <div className="relative w-full max-w-xs bg-gray-100 rounded overflow-hidden mb-4">
                    <video src={mediaVideoPreview} controls className="w-full h-48 object-contain rounded" />
                    <button onClick={handleRemoveVideo} className="absolute top-1 right-1 bg-[#2589f3] text-white rounded-full p-1 hover:bg-red-600">
                      <FiX size={16} />
                    </button>
                  </div>
                )}
                {!mediaVideoPreview && (
                  <input type="file" accept="video/*" onChange={handleVideoChange} className="w-full p-2 border border-gray-300 rounded" />
                )}
              </div>
            </div>
          )}
          {tab === "attractions" && (
            <div className="space-y-8 flex flex-col gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Tags</h3>
                <div className="flex flex-wrap gap-3">
                  {tagsList.map((tag) => (
                    <button key={tag.id} onClick={() => setSelectedTags((prev) => prev.includes(tag.id) ? prev.filter((t) => t !== tag.id) : [...prev, tag.id])} className={`flex items-center gap-2 px-4 py-2 rounded-full border transition ${selectedTags.includes(tag.id) ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"}`}>{tag.icon}<span className="text-sm font-medium">{tag.label}</span></button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Amenities</h3>
                <div className="flex flex-wrap gap-3">
                  {amenitiesList.map((amenity) => (
                    <button key={amenity.id} onClick={() => setSelectedAmenities((prev) => prev.includes(amenity.id) ? prev.filter((a) => a !== amenity.id) : [...prev, amenity.id])} className={`flex items-center gap-2 px-4 py-2 rounded-full border transition ${selectedAmenities.includes(amenity.id) ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"}`}>{amenity.icon}<span className="text-sm font-medium">{amenity.label}</span></button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3 flex flex-col md:flex-row pb-3 flex items-center justify-between"><div className="pb-2">Nearby Attractions</div><button onClick={() => setAttractions((prev) => prev.length < 3 ? [...prev, { name: "", description: "", type: "", distance: "" }] : prev)} disabled={attractions.length >= 3} type="button" className={`cursor-pointer text-center mt-2 md:mt-0 text-sm md:text-lg w-full md:w-1/4 flex items-center justify-center bg-[#2589f3] text-white font-semibold py-2 px-4 rounded-full shadow-md transition-all duration-300 hover:bg-[#0036ac] hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}><MdAdd size={20} /><span className="ml-2">Add</span></button></h3>
                {attractions.map((attraction, index) => (
                  <div key={index} className="rounded-lg p-4 mb-4 bg-white relative">
                    <button onClick={() => setAttractions((prev) => prev.filter((_, i) => i !== index))} className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition"><MdDelete size={20} /></button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input type="text" value={attraction.name} onChange={e => setAttractions((prev) => prev.map((a, i) => i === index ? { ...a, name: e.target.value } : a))} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-400" placeholder="Enter name" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select value={attraction.type} onChange={e => setAttractions((prev) => prev.map((a, i) => i === index ? { ...a, type: e.target.value } : a))} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-400"><option value="">Select type</option>{attractionTypes.map((type) => (<option key={type} value={type}>{type}</option>))}</select>
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea value={attraction.description} onChange={e => setAttractions((prev) => prev.map((a, i) => i === index ? { ...a, description: e.target.value } : a))} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-400" placeholder="Enter description"></textarea>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Distance (optional)</label>
                      <input type="text" value={attraction.distance} onChange={e => setAttractions((prev) => prev.map((a, i) => i === index ? { ...a, distance: e.target.value } : a))} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-400" placeholder="e.g., 2 km" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex justify-end gap-3 mt-8">
            <button onClick={onClose} className="px-6 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
            <button onClick={handleSubmit} disabled={submitLoading} className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">{submitLoading ? "Saving..." : "Save Changes"}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditHotelModal; 