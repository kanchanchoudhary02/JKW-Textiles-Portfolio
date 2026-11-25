// Imports the supplied JKW textile photo set as INDIVIDUAL catalogue records.
// Each photo is kept separate and classified by both fabric type and visible design/pattern.
// Run: npm run seed:catalog
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Product = require('../models/Product');

const MANIFEST = path.join(__dirname, '..', 'catalog', 'catalogManifest.json');
const LEGACY_SKUS = ['JKW-CATALOG-CHECKS', 'JKW-CATALOG-STRIPES', 'JKW-CATALOG-SOLIDS'];

async function seed() {
  if (!fs.existsSync(MANIFEST)) throw new Error(`Catalog manifest not found: ${MANIFEST}`);
  const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  await connectDB();

  // Remove only the old auto-seeded family records from the previous version.
  await Product.deleteMany({ sku: { $in: LEGACY_SKUS } });

  const existingCount = await Product.countDocuments({ sku: /^JKW-ITEM-/ });
  if (existingCount >= manifest.length) {
    console.log(`Catalog already contains ${existingCount} individual photo records; nothing to import.`);
    return mongoose.disconnect();
  }

  // If a partial previous import exists, replace only our generated photo records.
  await Product.deleteMany({ sku: /^JKW-ITEM-/ });

  const docs = manifest.map((item) => {
    const image = `/catalog-images/${encodeURIComponent(item.filename)}`;
    const description = `${item.fabricType} fabric with a ${item.designType.toLowerCase()} design in ${item.colorName}. Classified from the supplied JKW Textiles swatch photo.`;
    return {
      name: item.name,
      description,
      category: item.fabricType,
      subcategory: item.designType,
      spec: `Fabric: ${item.fabricType} | Design: ${item.designType} | Colour: ${item.colorName}`,
      stock: 0,
      sku: `JKW-ITEM-${String(item.index).padStart(3, '0')}`,
      featured: item.index <= 8,
      status: 'active',
      tags: item.tags,
      images: [image],
      colors: [{ name: item.colorName, hex: item.hex, images: [image] }],
    };
  });

  await Product.insertMany(docs, { ordered: true });
  console.log(`Catalog import complete: ${docs.length} individual textile photos classified by fabric + design.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Catalog import failed:', err.message);
  process.exit(1);
});
