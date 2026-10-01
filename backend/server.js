require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { getProductImage } = require('./controllers/productController');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const leadRoutes = require('./routes/leadRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const mediaRoutes = require('./routes/mediaRoutes');

async function seedHomeMediaIfNeeded() {
  const fs = require('fs');
  const SiteMedia = require('./models/SiteMedia');
  const SiteSettings = require('./models/SiteSettings');
  const ProductImage = require('./models/ProductImage');
  const VERSION = 2;
  const keys = Array.from({ length: 10 }, (_, i) => `home-gallery-${i + 1}`);
  const settings = await SiteSettings.findOne({ key: 'global' }).lean();
  if (settings?.homeMediaVersion === VERSION) return;

  const mediaDir = path.join(__dirname, '..', 'frontend', 'public', 'home-gallery');
  if (!fs.existsSync(mediaDir)) return;

  const oldDocs = await SiteMedia.find({ key: { $in: keys } }).lean();
  const oldIds = oldDocs.map((doc) => doc.imageId).filter(Boolean);
  if (oldIds.length) await ProductImage.deleteMany({ _id: { $in: oldIds } }).catch(() => {});
  await SiteMedia.deleteMany({ key: { $in: keys } });

  for (let i = 0; i < keys.length; i += 1) {
    const filename = `home-textile-${String(i + 1).padStart(2, '0')}.webp`;
    const filePath = path.join(mediaDir, filename);
    if (!fs.existsSync(filePath)) continue;
    const image = await ProductImage.create({
      data: fs.readFileSync(filePath),
      contentType: 'image/webp',
      filename,
    });
    await SiteMedia.create({
      key: keys[i],
      label: `Home — Textile Gallery ${String(i + 1).padStart(2, '0')}`,
      group: 'Home Page',
      alt: 'JKW Textiles fabric collection',
      url: `/api/images/${image._id}`,
      imageId: image._id,
    });
  }

  await SiteSettings.findOneAndUpdate(
    { key: 'global' },
    { $set: { homeMediaVersion: VERSION } },
    { upsert: true, setDefaultsOnInsert: true }
  );
  console.log('Seeded JKW homepage textile gallery media.');
}



async function seedMegaMenuMediaIfNeeded() {
  const SiteMedia = require('./models/SiteMedia');
  const SiteSettings = require('./models/SiteSettings');
  const ProductImage = require('./models/ProductImage');
  const VERSION = 1;
  const items = [
    ['mega-cotton', 'Navigation — Dyeable / Cotton', 'dyeable-cotton.jpg'],
    ['mega-linen', 'Navigation — Dyeable / Linen', 'dyeable-linen.jpg'],
    ['mega-rayon', 'Navigation — Dyeable / Rayon', 'dyeable-rayon.jpg'],
    ['mega-reactive-dyed', 'Navigation — Dyed / Reactive Dyed', 'yarn-reactive-dyed.jpg'],
    ['mega-yarn-dyed', 'Navigation — Dyed / Yarn Dyed', 'yarn-dyed.jpg'],
    ['mega-custom-colour', 'Navigation — Dyed / Custom Colour', 'custom-colour.jpg'],
    ['mega-block-printing', 'Navigation — Printing / Block Printing', 'block-printing.jpg'],
    ['mega-digital-printing', 'Navigation — Printing / Digital Printing', 'digital-printing.jpg'],
    ['mega-custom-dyeing', 'Navigation — Printing / Custom Dyeing', 'custom-dyeing.jpg'],
    ['mega-bulk-production', 'Navigation — Manufacturing / Bulk Production', 'bulk-production.jpg'],
    ['mega-custom-development', 'Navigation — Manufacturing / Custom Development', 'custom-development.jpg'],
    ['mega-sourcing-support', 'Navigation — Manufacturing / Sourcing Support', 'sourcing-support.jpg'],
  ];
  const settings = await SiteSettings.findOne({ key: 'global' }).lean();
  if (settings?.megaMenuMediaVersion === VERSION) return;

  const keys = items.map(([key]) => key);
  const oldDocs = await SiteMedia.find({ key: { $in: keys } }).lean();
  const oldIds = oldDocs.map((doc) => doc.imageId).filter(Boolean);
  if (oldIds.length) await ProductImage.deleteMany({ _id: { $in: oldIds } }).catch(() => {});
  await SiteMedia.deleteMany({ key: { $in: keys } });

  const mediaDir = path.join(__dirname, '..', 'frontend', 'public', 'dropdown-menu');
  for (const [key, label, filename] of items) {
    const filePath = path.join(mediaDir, filename);
    const fs = require('fs');
    if (!fs.existsSync(filePath)) continue;
    const image = await ProductImage.create({
      data: fs.readFileSync(filePath),
      contentType: 'image/jpeg',
      filename,
    });
    await SiteMedia.create({
      key,
      label,
      group: 'Navigation',
      alt: label,
      url: `/api/images/${image._id}`,
      imageId: image._id,
    });
  }

  await SiteSettings.findOneAndUpdate(
    { key: 'global' },
    { $set: { megaMenuMediaVersion: VERSION } },
    { upsert: true, setDefaultsOnInsert: true }
  );
  console.log('Seeded new JKW navigation dropdown images.');
}

async function migrateCompanyAddressIfNeeded() {
  const SiteSettings = require('./models/SiteSettings');
  const ADDRESS = {
    line1: 'JKW Textiles Pvt Ltd, Plot No. X-66A, Shyam Market, First Floor',
    line2: 'Near Mansarovar Flyover, Mahaveer Nagar, New Sanganer Road',
    city: 'Sanganer, Jaipur',
    state: 'Rajasthan',
    pin: '302029',
    country: 'India',
  };
  const settings = await SiteSettings.findOne({ key: 'global' });
  if (!settings) {
    await SiteSettings.create({ key: 'global', company: { address: ADDRESS } });
    return;
  }
  const current = settings.company?.address || {};
  const isPlaceholder = !current.line1 || String(current.line1).includes('[REPLACE:');
  if (isPlaceholder) {
    settings.company.address = ADDRESS;
    await settings.save();
    console.log('Updated JKW company address from the supplied business card.');
  }
}

async function seedCatalogIfMissing() {
  const Product = require('./models/Product');
  const fs = require('fs');
  const manifestPath = path.join(__dirname, 'catalog', 'catalogManifest.json');
  if (!fs.existsSync(manifestPath)) return;
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  if (!Array.isArray(manifest) || manifest.length === 0) return;

  // Migrate the previous 3-family import to one record per photo.
  await Product.deleteMany({ sku: { $in: ['JKW-CATALOG-CHECKS', 'JKW-CATALOG-STRIPES', 'JKW-CATALOG-SOLIDS'] } });

  const individualCount = await Product.countDocuments({ sku: /^JKW-ITEM-/ });
  if (individualCount >= manifest.length) return;

  // Only generated JKW catalogue records are replaced; manually created products stay untouched.
  await Product.deleteMany({ sku: /^JKW-ITEM-/ });
  const docs = manifest.map((item) => {
    const image = `/catalog-images/${encodeURIComponent(item.filename)}`;
    return {
      name: item.name,
      description: `${item.fabricType} fabric with a ${item.designType.toLowerCase()} design in ${item.colorName}. Classified from the supplied JKW Textiles swatch photo.`,
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
  console.log(`Auto-imported ${docs.length} individual JKW textile photo records.`);
}

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || '')
  .split(',').map((o) => o.trim().replace(/\/$/, '')).filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin.replace(/\/$/, ''))) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

// Legacy/local images (kept for old VPS uploads). New uploads use MongoDB.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Bundled JKW textile catalogue photos. These are static source assets; catalogue metadata is stored in MongoDB.
app.use('/catalog-images', express.static(path.join(__dirname, 'catalog-images'), { maxAge: '30d' }));

app.get('/', (req, res) => res.json({ success: true, message: 'JKW Textiles API is running' }));
app.get('/api/health', (req, res) => res.json({ success: true, message: 'API is running' }));
app.get('/api/images/:id', getProductImage);

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/media', mediaRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connectDB().then(async () => {
  await seedCatalogIfMissing().catch((err) => console.error('Catalog auto-import skipped:', err.message));
  await seedHomeMediaIfNeeded().catch((err) => console.error('Homepage media seed skipped:', err.message));
  await seedMegaMenuMediaIfNeeded().catch((err) => console.error('Dropdown media seed skipped:', err.message));
  await migrateCompanyAddressIfNeeded().catch((err) => console.error('Company address migration skipped:', err.message));
  app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
});
