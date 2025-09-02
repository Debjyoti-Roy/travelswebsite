import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getStates, updateCarPackage } from '../../../Redux/store/adminCarSlice';
import CreatableSelect from "react-select/creatable";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import toast from 'react-hot-toast';

const BasicDetails = ({ carPackageDetails, basicClose }) => {
    // const dispatch = useDispatch();
    const [basic, setBasic] = useState({
        title: '',
        description: '',
        durationDays: '',
        thumbnailFile: null,
        thumbnailPreview: '',
        pickupLocation: '',
        dropLocation: '',
        destinationName: '',
        destinationState: '',
        includedFeatures: [{ id: null, desc: '' }],
        excludedFeatures: [{ id: null, desc: '' }],
    });
    const [submitting, setSubmitting] = useState(false);
    const dispatch = useDispatch();
    const { states = [], statesloading, stateserror } = useSelector((state) => state.admincar);
    const storage = getStorage();

    useEffect(() => {
        dispatch(getStates());
    }, [dispatch]);

    useEffect(() => {
        if (carPackageDetails) {
            setBasic({
                title: carPackageDetails.title || "",
                durationDays: carPackageDetails.durationDays || 0,
                description: carPackageDetails.description || "",
                thumbnailPreview: carPackageDetails.thumbnailUrl || null,
                pickupLocation: carPackageDetails.pickupLocation || "",
                dropLocation: carPackageDetails.dropLocation || "",
                destinationName: carPackageDetails.destination?.name || "",
                destinationState: carPackageDetails.destination?.state || "",
                includedFeatures: carPackageDetails.includedFeatures?.map(f => ({
                    id: f.inclusionId,
                    desc: f.description
                })) || [{ id: null, desc: '' }],
                excludedFeatures: carPackageDetails.excludedFeatures?.map(f => ({
                    id: f.inclusionId,
                    desc: f.description
                })) || [{ id: null, desc: '' }],
            });
        }
    }, [carPackageDetails]);

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

    const handleBasicChange = (field, value) => {
        setBasic((prev) => ({ ...prev, [field]: value }));
    };

    const handleBasicImage = (file) => {
        if (!file) return;
        const preview = URL.createObjectURL(file);
        setBasic((prev) => ({ ...prev, thumbnailFile: file, thumbnailPreview: preview }));
    };

    const handleFeatureChange = (type, idx, value) => {
        setBasic((prev) => {
            const copy = [...prev[type]];
            copy[idx] = { ...copy[idx], desc: value };
            return { ...prev, [type]: copy };
        });
    };

    const addFeature = (type) => {
        setBasic((prev) => ({ ...prev, [type]: [...prev[type], { id: null, desc: '' }] }));
    };

    const removeFeature = (type, idx) => {
        setBasic((prev) => {
            const copy = [...prev[type]];
            // Remove the element completely from the array
            copy.splice(idx, 1);
            return { ...prev, [type]: copy.length ? copy : [{ id: null, desc: '' }] };
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

            // Check and add changed basic fields
            if (basic.title !== carPackageDetails.title) {
                payload.title = basic.title.trim();
            }
            if (basic.description !== carPackageDetails.description) {
                payload.description = basic.description.trim();
            }
            if (basic.pickupLocation !== carPackageDetails.pickupLocation) {
                payload.pickupLocation = basic.pickupLocation.trim();
            }
            if (basic.dropLocation !== carPackageDetails.dropLocation) {
                payload.dropLocation = basic.dropLocation.trim();
            }
            if (basic.destinationName !== carPackageDetails.destination?.name) {
                payload.destination = {
                    name: basic.destinationName.trim(),
                    state: basic.destinationState.trim(),
                };
            } else if (basic.destinationState !== carPackageDetails.destination?.state) {
                payload.destination = {
                    name: basic.destinationName.trim(),
                    state: basic.destinationState.trim(),
                };
            }

            // Handle thumbnail image
            if (basic.thumbnailFile) {
                const thumbnailUrl = await uploadFileMock(basic.thumbnailFile, basic.title.trim());
                uploadedPaths.push(thumbnailUrl);
                payload.thumbnailUrl = thumbnailUrl;

                // Mark old image for deletion
                if (carPackageDetails.thumbnailUrl) {
                    oldImagesToDelete.push(carPackageDetails.thumbnailUrl);
                }
            }

            // Handle features - track removed features separately
            const originalIncludedFeatures = carPackageDetails.includedFeatures || [];
            const originalExcludedFeatures = carPackageDetails.excludedFeatures || [];

            // Get current features (only non-empty ones)
            const currentIncludedFeatures = basic.includedFeatures
                .filter(f => f.desc && f.desc.trim())
                .map(f => {
                    if (f.id) {
                        return { inclusionId: f.id, description: f.desc.trim() };
                    } else {
                        return { description: f.desc.trim() };
                    }
                });

            const currentExcludedFeatures = basic.excludedFeatures
                .filter(f => f.desc && f.desc.trim())
                .map(f => {
                    if (f.id) {
                        return { inclusionId: f.id, description: f.desc.trim() };
                    } else {
                        return { description: f.desc.trim() };
                    }
                });

            // Find removed features (features that were in original but not in current)
            const removedIncludedFeatures = originalIncludedFeatures
                .filter(original => !currentIncludedFeatures.some(current =>
                    current.inclusionId === original.inclusionId
                ))
                .map(f => ({ inclusionId: f.inclusionId }));

            const removedExcludedFeatures = originalExcludedFeatures
                .filter(original => !currentExcludedFeatures.some(current =>
                    current.inclusionId === original.inclusionId
                ))
                .map(f => ({ inclusionId: f.inclusionId }));

            // Combine current and removed features
            const finalIncludedFeatures = [...currentIncludedFeatures, ...removedIncludedFeatures];
            const finalExcludedFeatures = [...currentExcludedFeatures, ...removedExcludedFeatures];

            // Only add features if they have actually changed
            const hasIncludedFeaturesChanged = JSON.stringify(finalIncludedFeatures) !== JSON.stringify(originalIncludedFeatures);
            const hasExcludedFeaturesChanged = JSON.stringify(finalExcludedFeatures) !== JSON.stringify(originalExcludedFeatures);

            if (hasIncludedFeaturesChanged) {
                payload.includedFeatures = finalIncludedFeatures;
            }
            if (hasExcludedFeaturesChanged) {
                payload.excludedFeatures = finalExcludedFeatures;
            }

            
            dispatch(updateCarPackage({formData:payload}))
                .unwrap()
                .then((res) => {
                    setSubmitting(false);
                    toast.success("Car package updated successfully");
                    
                    if (oldImagesToDelete?.length) {
                        deleteFiles(oldImagesToDelete);
                    }
                    basicClose()
                })
                .catch(async (err) => {
                    
                    setSubmitting(false);
                    if (uploadedPaths?.length) {
                        await deleteFiles(uploadedPaths);
                    }
                    toast.error("Failed to update car package");
                    basicClose()
                });

        } catch (error) {
            setSubmitting(false);
            await deleteFiles(uploadedPaths);
            console.error('Error updating basic details:', error);
        }
    };

    return (
        <section className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex flex-col">
                    <span className="font-medium mb-1">Title*</span>
                    <input
                        type="text"
                        value={basic.title}
                        onChange={(e) => handleBasicChange("title", e.target.value)}
                        placeholder="Package title"
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-300"
                    />
                </label>

                <label className="flex flex-col">
                    <span className="font-medium mb-1">Duration (days)*</span>
                    <input
                        type="number"
                        disabled
                        min={1}
                        value={basic.durationDays}
                        onChange={(e) => handleBasicChange("durationDays", e.target.value)}
                        placeholder="e.g., 5"
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-300"
                    />
                </label>

                <label className="flex flex-col md:col-span-2">
                    <span className="font-medium mb-1">Description*</span>
                    <textarea
                        rows={4}
                        value={basic.description}
                        onChange={(e) => handleBasicChange("description", e.target.value)}
                        placeholder="Describe the package"
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-300"
                    />
                </label>

                <label className="flex flex-col md:col-span-2">
                    {basic.thumbnailPreview && (
                        <div className="mt-2">
                            <img
                                src={basic.thumbnailPreview}
                                alt="thumbnail preview"
                                className="max-w-[200px] rounded-lg shadow"
                            />
                        </div>
                    )}
                    <span className="font-medium mb-1">Thumbnail Image*</span>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleBasicImage(e.target.files?.[0])}
                        className="border border-gray-300 rounded-lg"
                    />
                </label>

                <label className="flex flex-col">
                    <span className="font-medium mb-1">Pickup Location(s)* (comma-separated)</span>
                    <input
                        type="text"
                        value={basic.pickupLocation}
                        onChange={(e) => handleBasicChange("pickupLocation", e.target.value)}
                        placeholder="City/Address"
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-300"
                    />
                </label>

                <label className="flex flex-col">
                    <span className="font-medium mb-1">Drop Location(s)* (comma-separated)</span>
                    <input
                        type="text"
                        value={basic.dropLocation}
                        onChange={(e) => handleBasicChange("dropLocation", e.target.value)}
                        placeholder="City/Address"
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-300"
                    />
                </label>

                <label className="flex flex-col">
                    <span className="font-medium mb-1">Destination Name*</span>
                    <input
                        type="text"
                        value={basic.destinationName}
                        onChange={(e) => handleBasicChange("destinationName", e.target.value)}
                        placeholder="e.g., Manali"
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-300"
                    />
                </label>

                <label className="flex flex-col">
                    <span className="font-medium mb-1">Destination State*</span>
                    <CreatableSelect
                        options={states.map((s) => ({ value: s, label: s }))}
                        value={
                            basic.destinationState
                                ? { value: basic.destinationState, label: basic.destinationState }
                                : null
                        }
                        onChange={(selectedOption) =>
                            handleBasicChange(
                                "destinationState",
                                selectedOption ? selectedOption.value : ""
                            )
                        }
                        placeholder="Type or pick a state"
                        isClearable
                    />
                </label>
            </div>

            <div style={{ marginTop: "2vh" }} className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Included Features (optional)</h3>
                {basic.includedFeatures.map((f, i) => (
                    <div style={{ marginBottom: "1vh" }} key={`inc-${i}`} className="flex gap-2 mb-2">
                        <input
                            type="text"
                            value={f.desc}
                            onChange={(e) =>
                                handleFeatureChange("includedFeatures", i, e.target.value)
                            }
                            placeholder="e.g., Breakfast"
                            className="flex-1 border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-300"
                        />
                        <button
                            type="button"
                            onClick={() => removeFeature("includedFeatures", i)}
                            className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                        >
                            Remove
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() => addFeature("includedFeatures")}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                    Add more
                </button>
            </div>

            <div style={{ marginTop: "2vh" }} className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Excluded Features (optional)</h3>
                {basic.excludedFeatures.map((f, i) => (
                    <div style={{ marginBottom: "1vh" }} key={`exc-${i}`} className="flex gap-2 mb-2">
                        <input
                            type="text"
                            value={f.desc}
                            onChange={(e) =>
                                handleFeatureChange("excludedFeatures", i, e.target.value)
                            }
                            placeholder="e.g., Airfare"
                            className="flex-1 border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-300"
                        />
                        <button
                            type="button"
                            onClick={() => removeFeature("excludedFeatures", i)}
                            className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                        >
                            Remove
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() => addFeature("excludedFeatures")}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                    Add more
                </button>
            </div>

            {/* Submit Button */}
            <div style={{ marginTop: "2vh" }} className="flex justify-end mt-8">
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className={`px-6 py-2 rounded-lg text-white transition ${submitting
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

export default BasicDetails