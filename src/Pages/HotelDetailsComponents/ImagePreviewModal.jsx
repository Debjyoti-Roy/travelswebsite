// components/ImagePreviewModal.jsx
import React from "react";

const ImagePreviewModal = ({ isOpen, imageUrl, onClose }) => {
  if (!isOpen || !imageUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="relative max-w-5xl w-full max-h-[90vh] rounded-xl overflow-hidden">
        <button
          className="absolute top-4 right-4 bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold z-10"
          onClick={onClose}
        >
          ×
        </button>
        <img
          src={imageUrl}
          alt="Preview"
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};

export default ImagePreviewModal;
