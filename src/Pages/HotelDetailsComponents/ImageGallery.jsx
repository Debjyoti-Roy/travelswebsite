import React, { useState } from "react";
import useImagePreview from "./useImagePreview";
import ImagePreviewModal from "./ImagePreviewModal";

// import { useState } from "react";

// const ImageGallery = ({ imageUrls = [] }) => {
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     const {
//         isOpen,
//         previewImage,
//         openPreview,
//         closePreview,
//     } = useImagePreview();

//     // Sample data for demonstration
//     const sampleImages = [
//         "https://picsum.photos/400/600?random=1",
//         "https://picsum.photos/400/400?random=2",
//         "https://picsum.photos/400/800?random=3",
//         "https://picsum.photos/400/500?random=4",
//         "https://picsum.photos/400/700?random=5",
//         "https://picsum.photos/400/450?random=6",
//         "https://picsum.photos/400/650?random=7",
//         "https://picsum.photos/400/550?random=8",
//     ];

//     const images = imageUrls.length > 0 ? imageUrls : sampleImages;

//     if (images.length === 0) return null;

//     const displayImages = images.slice(0, 5);

//     return (
//         <div className="w-full mx-auto p-4">
//             {/* <h1 className="text-3xl font-bold text-center mb-8">Images</h1> */}

//             {/* Case 1: Single Image */}
//             {images.length === 1 ? (
//                 <img
//                     src={images[0]}
//                     alt="Gallery"
//                     className="rounded-lg w-full max-h-[500px] object-contain mx-auto"
//                 />
//             ) : (
//                 <>
//                     {/* Case 2: Masonry layout for 2-5 images */}
//                     <div className="masonry-grid columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
//                         {displayImages.map((url, idx) => (
//                             <div className={`item-${idx + 1}`} onClick={() => openPreview(url)} key={idx}>
//                                 <img style={{ objectFit: 'cover', width: '100%', height: '100%' }} src={url} alt={`Image ${idx + 1}`} />
//                             </div>
//                         ))}
//                     </div>

//                     {/* Case 3: More than 5 images — Show All button */}
//                     {images.length > 5 && (
//                         <div className="text-center mt-8">
//                             <button
//                                 onClick={() => setIsModalOpen(true)}
//                                 className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-md"
//                             >
//                                 Show All ({images.length} images)
//                             </button>
//                         </div>
//                     )}
//                 </>
//             )}

//             <ImagePreviewModal
//                 isOpen={isOpen}
//                 imageUrl={previewImage}
//                 onClose={closePreview}
//             />

//             {/* Modal */}
//             {isModalOpen && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
//                     <div className="bg-white w-[95vw] max-w-7xl max-h-[95vh] overflow-y-auto p-6 rounded-xl relative">
//                         <button
//                             className="absolute top-4 right-4 z-10 bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold transition-colors duration-200"
//                             onClick={() => setIsModalOpen(false)}
//                         >
//                             ×
//                         </button>
//                         <h2 className="text-2xl font-semibold mb-6 pr-12">All Images ({images.length})</h2>

//                         {/* Masonry layout in modal */}
//                         <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
//                             {images.map((url, idx) => (
//                                 <div key={idx} className="break-inside-avoid mb-4">
//                                     <img
//                                         src={url}
//                                         alt={`Image ${idx + 1}`}
//                                         className="w-full rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
//                                     />
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ImageGallery;
const ImageGallery = ({ imageUrls = [] }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { isOpen, previewImage, openPreview, closePreview } = useImagePreview();

    const sampleImages = [
        "https://picsum.photos/400/600?random=1",
        "https://picsum.photos/400/400?random=2",
        "https://picsum.photos/400/800?random=3",
        "https://picsum.photos/400/500?random=4",
        "https://picsum.photos/400/700?random=5",
        "https://picsum.photos/400/450?random=6",
    ];

    const images = imageUrls.length > 0 ? imageUrls : sampleImages;
    if (images.length === 0) return null;

    const displayImages = images.slice(0, 5);

    // Get className for different counts
    const getGridClass = (count) => {
        if (count === 5) return "masonry-grid grid-5"; // keep your current layout
        return "responsive-grid"; // generic responsive grid for 2, 3, 4
    };

    return (
        <div className="w-full mx-auto p-4">
            {images.length === 1 ? (
                <img
                    src={images[0]}
                    alt="Gallery"
                    className="rounded-lg w-full max-h-[500px] object-contain mx-auto"
                />
            ) : (
                <>
                    <div
                        className={
                            images.length === 2
                                ? "layout-two"
                                : images.length === 3
                                    ? "layout-three"
                                    : images.length === 4
                                        ? "layout-four"
                                        : getGridClass(displayImages.length) // grid-5 or responsive
                        }
                    >
                        {displayImages.map((url, idx) => (
                            <div
                                key={idx}
                                className={
                                    images.length === 5 ? `item-${idx + 1}` : "" // only for 5 images
                                }
                                onClick={() => openPreview(url)}
                            >
                                <img
                                    src={url}
                                    alt={`Image ${idx + 1}`}
                                    style={{ objectFit: "cover", width: "100%", height: "100%" }}
                                />
                            </div>
                        ))}
                    </div>



                    {images.length > 5 && (
                        <div className="text-center mt-8">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium shadow-md"
                            >
                                Show All ({images.length} images)
                            </button>
                        </div>
                    )}
                </>
            )}

            <ImagePreviewModal isOpen={isOpen} imageUrl={previewImage} onClose={closePreview} />

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
                    <div className="bg-white w-[95vw] max-w-7xl max-h-[95vh] overflow-y-auto p-6 rounded-xl relative">
                        <button
                            className="absolute top-4 right-4 z-10 bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold transition-colors duration-200"
                            onClick={() => setIsModalOpen(false)}
                        >
                            ×
                        </button>
                        <h2 className="text-2xl font-semibold mb-6 pr-12">All Images ({images.length})</h2>
                        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                            {images.map((url, idx) => (
                                <div key={idx} className="break-inside-avoid mb-4">
                                    <img
                                        src={url}
                                        alt={`Image ${idx + 1}`}
                                        className="w-full rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default ImageGallery;