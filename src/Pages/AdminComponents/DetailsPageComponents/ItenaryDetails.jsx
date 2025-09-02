import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { updateCarPackage } from '../../../Redux/store/adminCarSlice';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import toast from 'react-hot-toast';

const ItenaryDetails = ({ carPackageDetails, itenaryClose }) => {
    const [itineraries, setItineraries] = useState([
        { title: '', description: '', imageFile: null, imagePreview: '' }
    ]);
    const [submitting, setSubmitting] = useState(false);
    const dispatch = useDispatch();
    const storage = getStorage();

    useEffect(() => {
        if (carPackageDetails && carPackageDetails.itineraries) {
            setItineraries(
                carPackageDetails.itineraries.map(it => ({
                    title: it.title,
                    description: it.description,
                    imagePreview: it.imageUrl,
                    itineraryId: it.itineraryId,
                }))
            );
        } else {
            setItineraries([]);
        }
    }, [carPackageDetails])

    const uploadFileMock = async (file, title) => {
        try {
            const fileRef = ref(storage, `car-package/${title}/${file.name}`);
            await uploadBytes(fileRef, file);
            const url = await getDownloadURL(fileRef);
            return url;
        } catch (error) {
            console.error("File upload failed:", error);
            throw error;
        }
    };

    const deleteFiles = async (paths = []) => {
        for (let path of paths) {
            try {
                await deleteObject(ref(storage, path));
            } catch (err) {
                console.warn("Failed to delete file:", path, err);
            }
        }
    };

    const updateItineraryField = (index, field, value) => {
        setItineraries((prev) => {
            const copy = [...prev];
            copy[index] = { ...copy[index], [field]: value };
            return copy;
        });
    };

    const handleItineraryImage = (index, file) => {
        if (!file) return;
        const preview = URL.createObjectURL(file);
        setItineraries((prev) => {
            const copy = [...prev];
            copy[index] = { ...copy[index], imageFile: file, imagePreview: preview };
            return copy;
        });
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        const uploadedPaths = [];
        const oldImagesToDelete = [];

        try {
            // Build payload with only changed data
            const payload = {
                packageId: carPackageDetails.packageId,
            };

            // Handle itineraries with image uploads
            const itinerariesWithUrls = [];
            for (let i = 0; i < itineraries.length; i++) {
                const it = itineraries[i];
                const originalIt = carPackageDetails.itineraries?.[i];
                
                let imageUrl = it.imagePreview;
                
                // If new image file is selected, upload it
                if (it.imageFile) {
                    imageUrl = await uploadFileMock(it.imageFile, carPackageDetails.title.trim());
                    uploadedPaths.push(imageUrl);
                    
                    // Mark old image for deletion if it exists
                    if (originalIt?.imageUrl) {
                        oldImagesToDelete.push(originalIt.imageUrl);
                    }
                }

                // Check if any field has changed
                const hasChanged = 
                    it.title !== originalIt?.title ||
                    it.description !== originalIt?.description ||
                    it.imageFile; // New image uploaded

                if (hasChanged) {
                    itinerariesWithUrls.push({
                        title: it.title,
                        description: it.description,
                        imageUrl,
                        itineraryId: it.itineraryId || 0,
                    });
                } else {
                    // Keep original itinerary if no changes
                    itinerariesWithUrls.push({
                        title: originalIt.title,
                        description: originalIt.description,
                        imageUrl: originalIt.imageUrl,
                        itineraryId: originalIt.itineraryId,
                    });
                }
            }

            // Only add itineraries if there are changes
            const hasAnyChanges = itinerariesWithUrls.some((it, index) => {
                const originalIt = carPackageDetails.itineraries?.[index];
                return (
                    it.title !== originalIt?.title ||
                    it.description !== originalIt?.description ||
                    it.imageUrl !== originalIt?.imageUrl
                );
            });

            if (hasAnyChanges) {
                payload.itineraries = itinerariesWithUrls;
            }
            // Call API
            dispatch(updateCarPackage({ formData: payload }))
                .unwrap()
                .then((res) => {
                    setSubmitting(false);
                    toast.success("Itineraries updated successfully");
                    
                    // Delete old images after successful update
                    if (oldImagesToDelete.length > 0) {
                        deleteFiles(oldImagesToDelete);
                    }
                    itenaryClose();
                })
                .catch(async (err) => {
                    setSubmitting(false);
                    
                    // Delete new images if API fails
                    if (uploadedPaths.length > 0) {
                        await deleteFiles(uploadedPaths);
                    }
                    toast.error("Failed to update itineraries");
                    itenaryClose();
                });

        } catch (error) {
            setSubmitting(false);
            
            // Delete new images if any error occurs
            if (uploadedPaths.length > 0) {
                await deleteFiles(uploadedPaths);
            }
            console.error('Error updating itineraries:', error);
        }
    };

    return (
        <section className="p-4">
            <h2 className="text-xl font-semibold mb-2">Itineraries</h2>
            {/* <p className="text-gray-600 mb-4">
                Number of days: <b>{Number(basic.durationDays) || 0}</b>
            </p> */}

            {itineraries && itineraries.length > 0 ? itineraries.map((it, idx) => (
                <div
                    key={idx}
                    className=" rounded-xl pb-2 mb-4"
                >
                    <div className="mb-2 font-semibold text-gray-800">Day {idx + 1}</div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Title */}
                        <label className="flex flex-col md:col-span-2">
                            <span className="font-medium mb-1">Title*</span>
                            <input
                                type="text"
                                value={it.title}
                                onChange={(e) =>
                                    updateItineraryField(idx, "title", e.target.value)
                                }
                                placeholder="Itinerary title"
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-300"
                            />
                        </label>

                        {/* Image */}
                        <label className="flex flex-col md:col-span-2">
                            <span className="font-medium mb-1">Image*</span>
                            {it.imagePreview && (
                                <div className="mt-2">
                                    <img
                                        src={it.imagePreview}
                                        alt={`itinerary-${idx}`}
                                        className="max-w-[200px] rounded-lg shadow"
                                    />
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    handleItineraryImage(idx, e.target.files?.[0])
                                }
                                className="border border-gray-300 rounded-lg"
                            />

                        </label>

                        {/* Description */}
                        <label className="flex flex-col md:col-span-2">
                            <span className="font-medium mb-1">Description*</span>
                            <textarea
                                rows={3}
                                value={it.description}
                                onChange={(e) =>
                                    updateItineraryField(idx, "description", e.target.value)
                                }
                                placeholder="Details for the day"
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-300"
                            />
                        </label>
                    </div>
                </div>
            )) : (
                <div className="text-center text-gray-500 py-8">
                    No itineraries available
                </div>
            )}

            {/* Submit Button */}
            <div style={{ marginTop: "2vh" }} className="flex justify-end mt-8">
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className={`px-6 py-2 rounded-lg text-white transition ${
                        submitting
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-500 hover:bg-green-600"
                    }`}
                >
                    {submitting ? "Submitting..." : "Submit Changes"}
                </button>
            </div>
        </section>
    )
}

export default ItenaryDetails