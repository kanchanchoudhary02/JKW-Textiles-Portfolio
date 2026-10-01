const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');
const ProductImage = require('../models/ProductImage');

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
  const docs = await ProductImage.insertMany(
    files.map((file) => ({ data: file.buffer, contentType: file.mimetype, filename: file.originalname }))
  );
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
    if (category && category !== 'All') {
      if (category === 'Yarn Dyed') {
        filter.$or = [
          { category: 'Yarn Dyed' },
          { category: 'Dyed', subcategory: { $regex: /^yarn\s*dyed$/i } },
        ];
      } else filter.category = category;
    }
    if (featured === 'true') filter.featured = true;
    if (search && search.trim()) {
      const term = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(term, 'i');
      filter.$or = [{ name: regex }, { description: regex }, { category: regex }, { subcategory: regex }, { spec: regex }];
    }
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
    const image = await ProductImage.findById(req.params.id);
    if (!image) return res.status(404).end();
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    res.type(image.contentType);
    res.send(image.data);
  } catch (err) { next(err); }
}

module.exports = { getProducts, getProductById, getAdminProducts, createProduct, updateProduct, deleteProduct, getProductImage };
