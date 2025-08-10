import { fromURL, blobToURL } from 'image-resize-compress';

export const handleURL = async (imageUrl) => {
  const quality = 80;
  const width = 'auto';
  const height = 'auto';
  const format = 'jpeg';

  try {
    const resizedBlob = await fromURL(imageUrl, quality, width, height, format);
    return await blobToURL(resizedBlob);
  } catch (error) {
    console.warn("Resize failed for:", imageUrl, error);
    return imageUrl; // fallback to original
  }
};
