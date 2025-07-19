import React, { useState } from "react";
import { FiPlus, FiMinus, FiX } from "react-icons/fi";
import { storage } from "../../auth/firebase";
import { v4 as uuidv4 } from "uuid";
import { ref, uploadBytesResumable, getDownloadURL, uploadBytes, deleteObject } from "firebase/storage";
import { useDispatch } from "react-redux";
import { addRooms } from "../../Redux/store/hotelSlice";
import toast from "react-hot-toast";

const AddRoom = ({ hotelId, setHotelPresent, setIsLoading }) => {
  // console.log(hotelId)
  const initialRoom = {
    id: uuidv4(),
    name: "",
    totalRooms: 1,
    maxOccupancy: 1,
    features: [""],
    price: "",
    imageFiles: [],
    imagePreviews: [],
  };

  const [rooms, setRooms] = useState([initialRoom]);
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch()

  const handleAddRoomSection = () => {
    setRooms([...rooms, { ...initialRoom, id: uuidv4() }]);
  };

  const handleRemoveRoomSection = (id) => {
    if (rooms.length === 1) return;
    setRooms(rooms.filter((r) => r.id !== id));
  };



  const handleImageChange = (e, roomId) => {
    const files = Array.from(e.target.files).slice(0, 2);

    setRooms((prev) =>
      prev.map((room) => {
        if (room.id === roomId) {
          // Combine old and new files
          const newFiles = [...room.imageFiles, ...files].slice(0, 2);
          const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
          return { ...room, imageFiles: newFiles, imagePreviews: newPreviews };
        }
        return room;
      })
    );
  };

  const handleRemoveImage = (roomId, indexToRemove) => {
    setRooms((prev) =>
      prev.map((room) => {
        if (room.id === roomId) {
          const updatedFiles = [...room.imageFiles];
          const updatedPreviews = [...room.imagePreviews];
          updatedFiles.splice(indexToRemove, 1);
          updatedPreviews.splice(indexToRemove, 1);
          return { ...room, imageFiles: updatedFiles, imagePreviews: updatedPreviews };
        }
        return room;
      })
    );
  };


  const handleFeatureChange = (roomId, index, value) => {
    setRooms((prev) =>
      prev.map((room) => {
        if (room.id === roomId) {
          const newFeatures = [...room.features];
          newFeatures[index] = value;
          return { ...room, features: newFeatures };
        }
        return room;
      })
    );
  };

  const handleAddFeature = (roomId) => {
    setRooms((prev) =>
      prev.map((room) =>
        room.id === roomId
          ? { ...room, features: [...room.features, ""] }
          : room
      )
    );
  };

  const uploadRoomImages = async (roomName, imageFiles) => {
    const urls = [];
    const formattedName = roomName ? roomName.replace(/\s+/g, '').toLowerCase() : "";

    for (let file of imageFiles) {
      const imageRef = ref(storage, `hotels/${formattedName}/images/${file.name}_${Date.now()}`);
      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);
      urls.push(url);
    }

    return urls;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    if (setIsLoading) setIsLoading(true);

    const finalData = [];

    for (const room of rooms) {
      if (room.imageFiles.length === 0) {
        alert("At least one image is required for each room");
        setSubmitting(false);
        return;
      }

      const imageUrls = await uploadRoomImages(room.name, room.imageFiles);

      finalData.push({
        name: room.name,
        totalRooms: room.totalRooms,
        maxOccupancy: room.maxOccupancy,
        features: room.features.filter((f) => f.trim() !== ""),
        price: parseFloat(room.price),
        imageUrls,
      });
    }


    // console.log("🔥 Final Room Data:", finalData);

    // You can now send finalData to your backend or further process it
    const token = localStorage.getItem("token")
    const res = await dispatch(addRooms({ token: token, roomsData: finalData, partnerId: hotelId }))
    if (res.payload.status === 201) {
      setSubmitting(false);
      if (setIsLoading) setIsLoading(false);
      toast.success("Rooms Added Successfully", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      setHotelPresent(true) // This will trigger the callback to close modal
    } else {
      setSubmitting(false);
      if (setIsLoading) setIsLoading(false);
      toast.error("Error Creating Room!!", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };
  const featureExamples = [
    "Attached Bathroom with Geyser",
    "Queen Size Bed 7x6",
    "Snowy Mountain View",
    "Private Balcony",
    "Mini Fridge & Coffee Maker"
  ];


  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-3xl mt-10">
      <h1 className="text-4xl font-bold text-center text-gray-800 pb-6">Add Rooms</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-12">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="border border-gray-200 rounded-2xl p-8 relative bg-gray-50"
          >
            {rooms.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveRoomSection(room.id)}
                className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-all duration-200"
              >
                <FiX size={20} />
              </button>
            )}
            <div className="flex flex-col gap-6">
              <input
                type="text"
                placeholder="Room Type (Name)"
                value={room.name}
                onChange={(e) =>
                  setRooms((prev) =>
                    prev.map((r) =>
                      r.id === room.id ? { ...r, name: e.target.value } : r
                    )
                  )
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
                required
              />

              <div className="flex flex-col md:flex-row md:items-center md:gap-8 gap-6">
                <div className="flex items-center gap-4 p-2">
                  <label className="w-32 font-medium text-gray-700">Total Rooms</label>
                  <button
                    type="button"
                    onClick={() =>
                      setRooms((prev) =>
                        prev.map((r) =>
                          r.id === room.id && r.totalRooms > 1
                            ? { ...r, totalRooms: r.totalRooms - 1 }
                            : r
                        )
                      )
                    }
                    className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 transition"
                  >
                    <FiMinus />
                  </button>
                  <span className="w-8 text-center text-lg font-semibold">{room.totalRooms}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setRooms((prev) =>
                        prev.map((r) =>
                          r.id === room.id
                            ? { ...r, totalRooms: r.totalRooms + 1 }
                            : r
                        )
                      )
                    }
                    className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 transition"
                  >
                    <FiPlus />
                  </button>
                </div>

                <div className="flex items-center gap-4 p-2">
                  <label className="w-32 font-medium text-gray-700">Max Occupancy</label>
                  <button
                    type="button"
                    onClick={() =>
                      setRooms((prev) =>
                        prev.map((r) =>
                          r.id === room.id && r.maxOccupancy > 1
                            ? { ...r, maxOccupancy: r.maxOccupancy - 1 }
                            : r
                        )
                      )
                    }
                    className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 transition"
                  >
                    <FiMinus />
                  </button>
                  <span className="w-8 text-center text-lg font-semibold">{room.maxOccupancy}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setRooms((prev) =>
                        prev.map((r) =>
                          r.id === room.id
                            ? { ...r, maxOccupancy: r.maxOccupancy + 1 }
                            : r
                        )
                      )
                    }
                    className="p-2 border border-gray-300 rounded-full hover:bg-gray-100 transition"
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>

              <div className="p-2">
                <label className="block font-medium text-gray-700 pb-2">Features</label>
                <div className="flex flex-col gap-3">
                  {room.features.map((feature, idx) => (
                    <input
                      key={idx}
                      type="text"
                      placeholder={`e.g., ${featureExamples[idx % featureExamples.length]}`}
                      value={feature}
                      onChange={(e) => handleFeatureChange(room.id, idx, e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAddFeature(room.id)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    + Add Feature
                  </button>
                </div>
              </div>

              <input
                type="number"
                placeholder="Price"
                value={room.price}
                onChange={(e) =>
                  setRooms((prev) =>
                    prev.map((r) =>
                      r.id === room.id ? { ...r, price: e.target.value } : r
                    )
                  )
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
                required
              />

              <div className="p-2">
                <h3 className="text-lg font-semibold text-gray-800 pb-2">
                  Image Upload <span className="text-red-500">*</span>
                </h3>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap gap-4">
                    {room.imagePreviews?.map((preview, idx) => (
                      <div
                        key={idx}
                        className="relative bg-gray-100 rounded-lg overflow-hidden shadow w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.5rem)]"
                      >
                        <img
                          src={preview}
                          alt={`Preview ${idx}`}
                          className="w-full h-44 object-contain rounded"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(room.id, idx)}
                          className="absolute top-2 right-2 bg-[#2589f3] text-white rounded-full p-1 hover:bg-[#5dacf2] transition-all"
                        >
                          <FiX size={16} />
                        </button>
                        <span className="block text-center text-sm text-gray-700 break-words p-1">
                          {room.imageFiles[idx]?.name}
                        </span>
                      </div>
                    ))}
                  </div>


                  {room.imageFiles.length < 2 && (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, room.id)}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white shadow-sm"
                      multiple
                    />
                  )}
                </div>
                <p className="text-sm text-gray-500 pt-2">
                  Minimum 1 image required, maximum 2 allowed.
                </p>
              </div>
            </div>
          </div>
        ))}
        <div className="flex flex-col md:flex-row gap-[5px]">

          <button
            type="button"
            onClick={handleAddRoomSection}
            className="w-full md:w-1/2 mx-auto block cursor-pointer bg-[#80D8C3] text-white font-semibold py-3 rounded-full shadow-md transition-all duration-300 hover:bg-green-900 hover:shadow-lg"
          >
            + Add More Room
          </button>

          <button
            type="submit"
            disabled={submitting}
            className={`w-full md:w-1/2 mx-auto block cursor-pointer bg-[#2589f3] text-white font-semibold py-3 rounded-full shadow-md transition-all duration-300 hover:bg-[#0036ac] hover:shadow-lg ${submitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {submitting ? "Submitting..." : "Submit Rooms"}
          </button>
        </div>
      </form>
    </div>

  );
};

export default AddRoom;
