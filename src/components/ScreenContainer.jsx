/**
 * ScreenContainer — upload area inside each device.
 * Shows a placeholder icon + label. On click opens a file picker.
 * Once an image is loaded, it's displayed with object-fit: contain (no cropping).
 * Hovering over a loaded image re-shows the upload overlay so the user can replace it.
 */
import { useState, useRef, useCallback, useEffect } from 'react';

export default function ScreenContainer({ label, icon }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [hasImage, setHasImage] = useState(false);
  const fileRef = useRef(null);

  // Revoke previous Blob URL on unmount or when replaced
  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  const handleUploadClick = useCallback(() => {
    fileRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Revoke old URL to free memory
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setHasImage(true);
    // Reset input so re-selecting the same file triggers onChange
    e.target.value = '';
  }, [imageUrl]);

  return (
    <div className={`screen-container relative w-full h-full ${hasImage ? 'has-image' : ''}`}>
      {/* Uploaded image — always fully visible (contain, no crop) */}
      {hasImage && (
        <img
          className="absolute inset-0 w-full h-full z-[1]"
          style={{ objectFit: 'contain', objectPosition: 'center' }}
          src={imageUrl}
          alt={`${label} screenshot`}
          draggable={false}
        />
      )}
      {/* Click overlay: visible by default, hidden after upload, shown again on hover */}
      <div
        className="upload-placeholder absolute inset-0 flex flex-col items-center justify-center gap-[7px] bg-black/30 cursor-pointer transition-all hover:bg-black/15 z-[2]"
        onClick={handleUploadClick}
        title="Click to upload screenshot"
      >
        {icon}
        <span className="text-[9px] text-white/40 text-center leading-[1.4]">{label}</span>
        {!hasImage && (
          <span className="text-[8px] text-white/25 mt-[2px]">click to upload</span>
        )}
      </div>
      {/* Hidden file input — triggered by clicking the placeholder */}
      <input
        ref={fileRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
}
