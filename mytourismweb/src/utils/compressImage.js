import imageCompression from "browser-image-compression";

const compressImage = async (imageFile) => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1024,
    useWebWorker: true,
  };

  try {
    const compressedImage = await imageCompression(imageFile, options);
    return compressedImage;
  } catch (error) {
    console.error("Image compression failed:", error);
    return imageFile; // fallback to original image if compression fails
  }
};

export default compressImage;
