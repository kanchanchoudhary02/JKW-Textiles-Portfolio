const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const Product = require('../models/Product');
const ProductImage = require('../models/ProductImage');

async function createThumbnail(data) {
  return sharp(data)
    .rotate()
    .resize({ width: 480, height: 600, fit: 'cover', withoutEnlargement: true })
    .webp({ quality: 84, effort: 4 })
    .toBuffer();
}

async function createResponsiveImage(data, variant) {
  const dimensions = variant === 'hero'
    ? { width: 1600, height: 1000 }
    : { width: 1200, height: 1200 };
  return sharp(data)
    .rotate()
    .resize({ ...dimensions, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 86, effort: 4 })
    .toBuffer();
}

function isStoredImageUrl(value) {
  return typeof value === 'string' && value.startsWith('/api/images/');
}

async function deleteStoredImages(imagePaths = []) {
  const ids = imagePaths
    .filter(isStoredImageUrl)
    .map((value) => value.split('/').pop())
    .filter((id) => /^[0-9a-fA-F]{24}$/.test(id));

  if (ids.length) await ProductImage.deleteMany({ _id: { $in: ids } });

  imagePaths.filter((value) => typeof value === 'string' && value.startsWith('/uploads/')).forEach((img) => {
    const filePath = path.join(__dirname, '..', img.replace(/^\/+/, ''));
    fs.unlink(filePath, () => {});
  });
}

async function saveUploadedImages(files = []) {
  if (!files.length) return [];
  const imageDocs = [];
  for (const file of files) {
    const thumbnailData = file.mimetype === 'image/gif' ? undefined : await createThumbnail(file.buffer);
    imageDocs.push({
      data: file.buffer,
      thumbnailData,
      thumbnailContentType: thumbnailData ? 'image/webp' : undefined,
      contentType: file.mimetype,
      filename: file.originalname,
    });
  }
  const docs = await ProductImage.insertMany(imageDocs);
  return docs.map((doc) => `/api/images/${doc._id}`);
}

function parseJson(value, fallback) {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value !== 'string') return value;
  try { return JSON.parse(value); } catch { return fallback; }
}

function buildColors(rawColors, uploadedColorUrls) {
  const colors = Array.isArray(rawColors) ? rawColors : [];
  return colors
    .map((color) => {
      const existingImages = Array.isArray(color.images) ? color.images.filter(Boolean) : [];
      const newIndexes = Array.isArray(color.newImageIndexes) ? color.newImageIndexes : [];
      const addedImages = newIndexes.map((index) => uploadedColorUrls[index]).filter(Boolean);
      return {
        name: String(color.name || '').trim(),
        hex: String(color.hex || '#1A1A70').trim(),
        images: [...existingImages, ...addedImages],
      };
    })
    .filter((color) => color.name);
}

function allColorImages(colors = []) {
  return colors.flatMap((color) => color.images || []);
}

// GET /api/products
async function getProducts(req, res, next) {
  try {
    const { category, search, featured, page = 1, limit = 12 } = req.query;
    const filter = { status: 'active' };
    const andFilters = [];
    if (category && category !== 'All') {
      if (category === 'Yarn Dyed') {
        andFilters.push({ $or: [
          { category: 'Yarn Dyed' },
          { category: 'Dyed', subcategory: { $regex: /^yarn\s*dyed$/i } },
        ] });
      } else filter.category = category;
    }
    if (featured === 'true') filter.featured = true;
    if (search && search.trim()) {
      const term = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(term, 'i');
      andFilters.push({ $or: [{ name: regex }, { description: regex }, { category: regex }, { subcategory: regex }, { spec: regex }] });
    }
    if (andFilters.length) filter.$and = andFilters;
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 12, 1), 100);
    const [products, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip((pageNum - 1) * limitNum).limit(limitNum),
      Product.countDocuments(filter),
    ]);
    res.json({ success: true, products, pagination: { total, page: pageNum, pages: Math.ceil(total / limitNum) || 1 } });
  } catch (err) { next(err); }
}

async function getProductById(req, res, next) {
  try {
    const { id } = req.params;
    const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { slug: id };
    const product = await Product.findOne(query);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) { next(err); }
}

async function getAdminProducts(req, res, next) {
  try {
    const { category, status, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (category && category !== 'All') filter.category = category;
    if (status && status !== 'All') filter.status = status;
    if (search) filter.name = { $regex: search, $options: 'i' };
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
    const [products, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip((pageNum - 1) * limitNum).limit(limitNum),
      Product.countDocuments(filter),
    ]);
    res.json({ success: true, products, pagination: { total, page: pageNum, pages: Math.ceil(total / limitNum) || 1 } });
  } catch (err) { next(err); }
}

async function createProduct(req, res, next) {
  try {
    const mainFiles = req.files?.mainImages || [];
    const colorFiles = req.files?.colorImages || [];
    const [images, colorUrls] = await Promise.all([saveUploadedImages(mainFiles), saveUploadedImages(colorFiles)]);
    const colors = buildColors(parseJson(req.body.colors, []), colorUrls);
    const product = await Product.create({
      name: req.body.name,
      description: req.body.description || '',
      category: req.body.category || 'Other',
      subcategory: req.body.subcategory || '',
      spec: req.body.spec || '',
      stock: Number(req.body.stock) || 0,
      sku: req.body.sku || undefined,
      featured: req.body.featured === 'true' || req.body.featured === true,
      status: req.body.status || 'active',
      tags: parseJson(req.body.tags, []).filter(Boolean),
      images,
      colors,
    });
    res.status(201).json({ success: true, message: 'Product added successfully', product });
  } catch (err) { next(err); }
}

async function updateProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const mainFiles = req.files?.mainImages || [];
    const colorFiles = req.files?.colorImages || [];
    const [newMainImages, newColorUrls] = await Promise.all([saveUploadedImages(mainFiles), saveUploadedImages(colorFiles)]);

    const keepImages = parseJson(req.body.keepImages, product.images || []);
    const keptMain = Array.isArray(keepImages) ? keepImages.filter(Boolean) : (product.images || []);
    const removedMain = (product.images || []).filter((img) => !keptMain.includes(img));
    await deleteStoredImages(removedMain);

    const incomingColors = parseJson(req.body.colors, null);
    let colors = product.colors || [];
    if (incomingColors !== null) {
      colors = buildColors(incomingColors, newColorUrls);
      const oldColorImages = allColorImages(product.colors || []);
      const newColorImages = allColorImages(colors);
      await deleteStoredImages(oldColorImages.filter((img) => !newColorImages.includes(img)));
    }

    Object.assign(product, {
      name: req.body.name,
      description: req.body.description || '',
      category: req.body.category || product.category,
      subcategory: req.body.subcategory || '',
      spec: req.body.spec || '',
      stock: Number(req.body.stock) || 0,
      sku: req.body.sku || undefined,
      featured: req.body.featured === 'true' || req.body.featured === true,
      status: req.body.status || 'active',
      tags: parseJson(req.body.tags, product.tags || []).filter(Boolean),
      images: [...keptMain, ...newMainImages],
      colors,
    });

    await product.save();
    res.json({ success: true, message: 'Product updated successfully', product });
  } catch (err) { next(err); }
}

async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    await deleteStoredImages([
      ...(product.images || []),
      ...allColorImages(product.colors || []),
    ]);
    await product.deleteOne();
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) { next(err); }
}

async function getProductImage(req, res, next) {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).end();
    const { id } = req.params;
    const variant = req.query.variant;
    res.set('Cache-Control', 'public, max-age=31536000, immutable');

    if (variant === 'card') {
      const image = await ProductImage.findById(id).select('thumbnailData contentType');
      if (!image) return res.status(404).end();
      if (image.contentType === 'image/gif') {
        const original = await ProductImage.findById(id).select('data contentType');
        res.type(original.contentType);
        return res.send(original.data);
      }

      let thumbnailData = image.thumbnailData;
      if (!thumbnailData) {
        const original = await ProductImage.findById(id).select('data');
        thumbnailData = await createThumbnail(original.data);
        await ProductImage.updateOne(
          { _id: id, thumbnailData: { $exists: false } },
          { $set: { thumbnailData, thumbnailContentType: 'image/webp' } }
        );
      }
      res.type('image/webp');
      return res.send(thumbnailData);
    }

    if (variant === 'section' || variant === 'hero') {
      const dataField = variant === 'hero' ? 'heroData' : 'sectionData';
      const image = await ProductImage.findById(id).select(`${dataField} contentType`);
      if (!image) return res.status(404).end();
      if (image.contentType === 'image/gif') {
        const original = await ProductImage.findById(id).select('data contentType');
        res.type(original.contentType);
        return res.send(original.data);
      }

      let imageData = image[dataField];
      if (!imageData) {
        const original = await ProductImage.findById(id).select('data');
        imageData = await createResponsiveImage(original.data, variant);
        await ProductImage.updateOne(
          { _id: id, [dataField]: { $exists: false } },
          { $set: { [dataField]: imageData, [`${variant}ContentType`]: 'image/webp' } }
        );
      }
      res.type('image/webp');
      return res.send(imageData);
    }

    const image = await ProductImage.findById(id);
    if (!image) return res.status(404).end();
    res.type(image.contentType);
    res.send(image.data);
  } catch (err) { next(err); }
}

async function getCatalogThumbnail(req, res, next) {
  if (req.query.variant !== 'card') return next();

  try {
    const filename = req.params.filename;
    if (path.basename(filename) !== filename) return res.status(400).end();

    const sourcePath = path.join(__dirname, '..', 'catalog-images', filename);
    if (!fs.existsSync(sourcePath)) return next();

    const thumbnailPath = path.join(__dirname, '..', 'catalog-thumbnails', `${filename}.webp`);
    res.set('Cache-Control', 'public, max-age=2592000');
    res.type('image/webp');
    if (fs.existsSync(thumbnailPath)) return res.sendFile(thumbnailPath);

    const thumbnailData = await createThumbnail(fs.readFileSync(sourcePath));
    return res.send(thumbnailData);
  } catch (err) { return next(err); }
}

module.exports = { getProducts, getProductById, getAdminProducts, createProduct, updateProduct, deleteProduct, getProductImage, getCatalogThumbnail };
