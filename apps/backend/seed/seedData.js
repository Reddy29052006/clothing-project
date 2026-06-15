const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const User = require('../models/User');
const Product = require('../models/Product');
const Vendor = require('../models/Vendor');
const Order = require('../models/Order');
const Measurement = require('../models/Measurement');
const Feedback = require('../models/Feedback');

const ObjectId = mongoose.Types.ObjectId;

function castObjectIds(val) {
  if (val === null || val === undefined) return val;
  if (Array.isArray(val)) {
    return val.map(castObjectIds);
  }
  if (typeof val === 'object') {
    // Check if it is a MongoDB date serialization structure
    if (val.$date) {
      return new Date(val.$date);
    }
    const res = {};
    for (const key of Object.keys(val)) {
      res[key] = castObjectIds(val[key]);
    }
    return res;
  }
  if (typeof val === 'string') {
    if (/^[0-9a-fA-F]{24}$/.test(val)) {
      return new ObjectId(val);
    }
    // Try parsing ISO Date string
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(val)) {
      return new Date(val);
    }
  }
  return val;
}

const seedData = async () => {
  console.log(' Checking seed data...');

  const models = [
    { name: 'User', model: User, file: 'user.json' },
    { name: 'Product', model: Product, file: 'product.json' },
    { name: 'Vendor', model: Vendor, file: 'vendor.json' },
    { name: 'Order', model: Order, file: 'order.json' },
    { name: 'Measurement', model: Measurement, file: 'measurement.json' },
    { name: 'Feedback', model: Feedback, file: 'feedback.json' }
  ];

  for (const item of models) {
    const count = await item.model.countDocuments();
    if (count === 0) {
      const filePath = path.join(__dirname, 'data', item.file);
      if (fs.existsSync(filePath)) {
        console.log(`  Seeding ${item.name} collection...`);
        const raw = fs.readFileSync(filePath, 'utf8');
        const parsed = JSON.parse(raw);
        const docs = castObjectIds(parsed);
        
        // Use direct collection insert to bypass save middlewares & keep passwords/timestamps intact
        await item.model.collection.insertMany(docs);
        console.log(`  ✔ Successfully seeded ${docs.length} ${item.name} documents.`);
      } else {
        console.log(`  ⚠ Seed file ${item.file} not found. Skipping.`);
      }
    } else {
      console.log(`  ${item.name} collection already has data. Skipping.`);
    }
  }

  console.log(' Seeding check complete.');
};

module.exports = seedData;
