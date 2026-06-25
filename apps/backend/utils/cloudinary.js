const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary if credentials are set
const isConfigured = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET;

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

/**
 * Uploads a local file to Cloudinary and deletes the local file if successful.
 * If Cloudinary is not configured, it gracefully falls back to local static serving.
 * @param {string} filePath - Absolute path to the local file
 * @returns {Promise<string>} - The web URL of the uploaded image
 */
const uploadToCloudinary = async (filePath) => {
  if (!isConfigured) {
    console.log(`⚠️ Cloudinary is not configured. Falling back to local serving for: ${filePath}`);
    const filename = path.basename(filePath);
    return `/uploads/${filename}`;
  }

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'fitcraft',
      resource_type: 'image',
    });

    // Clean up local temp file synchronously
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return result.secure_url;
  } catch (error) {
    console.error('❌ Cloudinary Upload Failed:', error.message);
    // If upload failed but file exists locally, keep it and return local path as secondary fallback
    if (fs.existsSync(filePath)) {
      console.log('⚠️ Upload failed, falling back to local file path.');
      const filename = path.basename(filePath);
      return `/uploads/${filename}`;
    }
    throw error;
  }
};

module.exports = {
  uploadToCloudinary,
  isConfigured,
};
