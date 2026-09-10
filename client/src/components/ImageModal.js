import React, { useEffect } from "react";

const ImageModal = ({ src, alt, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="image-modal" role="dialog" aria-modal="true" onClick={onClose}>
      <button className="image-modal-close" type="button" onClick={onClose} aria-label="Close image">
        &times;
      </button>
      <img src={src} alt={alt} onClick={(event) => event.stopPropagation()} />
    </div>
  );
};

export default ImageModal;
