const mongoose = require('mongoose');

const productImageSchema = new mongoose.Schema(
  {
    data: { type: Buffer, required: true },
    thumbnailData: { type: Buffer },
    thumbnailContentType: { type: String },
    sectionData: { type: Buffer },
    sectionContentType: { type: String },
    heroData: { type: Buffer },
    heroContentType: { type: String },
    contentType: { type: String, required: true },
    filename: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ProductImage', productImageSchema);
