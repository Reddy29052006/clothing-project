/**
 * Helper to resolve image URLs from local uploads or Cloudinary/remote sources
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
    return imagePath;
  }
  // Ensure we don't double slash if imagePath doesn't start with /
  const formattedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  const baseUrl = import.meta.env.VITE_BASE_URL;
  return `${baseUrl}${formattedPath}`;
};
