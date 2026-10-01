const mongoose = require('mongoose');

const productImageSchema = new mongoose.Schema(
  {
    data: { type: Buffer, required: true },
    contentType: { type: String, required: true },
    filename: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ProductImage', productImageSchema);
