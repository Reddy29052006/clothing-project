const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

// Load backend environment variables
const envPath = path.join(__dirname, '../apps/backend/.env');
require('dotenv').config({ path: envPath });

const Product = require('../apps/backend/models/Product');

// Configure Cloudinary
const isCloudinaryConfigured = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET;

if (!isCloudinaryConfigured) {
  console.error('❌ Cloudinary is not configured. Please fill CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your backend .env file.');
  process.exit(1);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function migrate() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected.');

    const products = await Product.find({});
    console.log(`🔍 Found ${products.length} products to check.`);

    const uploadsDir = path.join(__dirname, '../apps/backend/uploads');

    let migratedProductsCount = 0;
    let migratedImagesCount = 0;

    for (const product of products) {
      let isModified = false;

      // 1. Process primaryImage
      if (product.primaryImage && product.primaryImage.includes('/uploads/')) {
        const filename = path.basename(product.primaryImage);
        const localPath = path.join(uploadsDir, filename);

        if (fs.existsSync(localPath)) {
          console.log(`📤 Uploading primary image for "${product.name}": ${filename}`);
          const result = await cloudinary.uploader.upload(localPath, {
            folder: 'fitcraft',
            resource_type: 'image',
          });
          product.primaryImage = result.secure_url;
          isModified = true;
          migratedImagesCount++;
        } else {
          console.warn(`⚠️ Local file not found for primary image of "${product.name}": ${localPath}`);
        }
      }

      // 2. Process images array
      if (product.images && product.images.length > 0) {
        const updatedImages = [];
        for (const img of product.images) {
          if (img && img.includes('/uploads/')) {
            const filename = path.basename(img);
            const localPath = path.join(uploadsDir, filename);

            if (fs.existsSync(localPath)) {
              console.log(`📤 Uploading gallery image for "${product.name}": ${filename}`);
              const result = await cloudinary.uploader.upload(localPath, {
                folder: 'fitcraft',
                resource_type: 'image',
              });
              updatedImages.push(result.secure_url);
              isModified = true;
              migratedImagesCount++;
            } else {
              console.warn(`⚠️ Local file not found for gallery image of "${product.name}": ${localPath}`);
              updatedImages.push(img); // keep as-is if file doesn't exist
            }
          } else {
            updatedImages.push(img);
          }
        }
        product.images = updatedImages;
      }

      if (isModified) {
        await product.save();
        console.log(`✅ Product "${product.name}" successfully updated in MongoDB.`);
        migratedProductsCount++;
      }
    }

    console.log('\n=========================================');
    console.log(`🎉 Migration Completed!`);
    console.log(`📦 Products Migrated: ${migratedProductsCount}`);
    console.log(`🖼️ Images Uploaded to Cloudinary: ${migratedImagesCount}`);
    console.log('=========================================');

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Migration Failed:', error.message);
    process.exit(1);
  }
}

migrate();
