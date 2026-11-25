const SiteMedia = require('../models/SiteMedia');
const ProductImage = require('../models/ProductImage');

async function getMedia(req, res, next) {
  try {
    const docs = await SiteMedia.find({}).sort({ group: 1, label: 1 }).lean();
    const media = {};
    docs.forEach((doc) => {
      media[doc.key] = { key: doc.key, label: doc.label, group: doc.group, url: doc.url, alt: doc.alt || '' };
    });
    res.json({ success: true, media });
  } catch (err) { next(err); }
}

async function getAdminMedia(req, res, next) {
  try {
    const docs = await SiteMedia.find({}).sort({ group: 1, label: 1 }).lean();
    res.json({ success: true, media: docs });
  } catch (err) { next(err); }
}

async function upsertMedia(req, res, next) {
  try {
    const { key } = req.params;
    const { label = key, group = 'Website', alt = '' } = req.body;
    if (!req.file) return res.status(400).json({ success: false, message: 'Please select an image' });

    const old = await SiteMedia.findOne({ key });
    const image = await ProductImage.create({
      data: req.file.buffer,
      contentType: req.file.mimetype,
      filename: req.file.originalname,
    });
    const url = `/api/images/${image._id}`;

    const saved = await SiteMedia.findOneAndUpdate(
      { key },
      { key, label, group, alt, url, imageId: image._id },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    if (old?.imageId) await ProductImage.deleteOne({ _id: old.imageId }).catch(() => {});
    res.json({ success: true, message: 'Website image updated', media: saved });
  } catch (err) { next(err); }
}

async function deleteMedia(req, res, next) {
  try {
    const old = await SiteMedia.findOne({ key: req.params.key });
    if (!old) return res.status(404).json({ success: false, message: 'Website image not found' });
    if (old.imageId) await ProductImage.deleteOne({ _id: old.imageId });
    await old.deleteOne();
    res.json({ success: true, message: 'Website image reset to default' });
  } catch (err) { next(err); }
}

module.exports = { getMedia, getAdminMedia, upsertMedia, deleteMedia };
