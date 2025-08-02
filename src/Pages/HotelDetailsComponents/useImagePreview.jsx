// hooks/useImagePreview.js
import { useState } from "react";

const useImagePreview = () => {
  const [previewImage, setPreviewImage] = useState(null);

  const openPreview = (url) => setPreviewImage(url);
  const closePreview = () => setPreviewImage(null);

  return {
    isOpen: !!previewImage,
    previewImage,
    openPreview,
    closePreview,
  };
};

export default useImagePreview;
