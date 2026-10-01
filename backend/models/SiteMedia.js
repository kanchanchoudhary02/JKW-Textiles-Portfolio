const mongoose = require('mongoose');

const siteMediaSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, index: true, trim: true },
    label: { type: String, required: true, trim: true },
    group: { type: String, default: 'Website', trim: true },
    url: { type: String, required: true },
    alt: { type: String, default: '' },
    imageId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductImage' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteMedia', siteMediaSchema);
