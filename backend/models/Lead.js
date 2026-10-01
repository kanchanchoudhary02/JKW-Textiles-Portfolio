const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true, default: '' },
    company: { type: String, trim: true, default: '' },
    message: { type: String, required: true, trim: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // optional, if enquiry is about a specific product
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Converted', 'Closed'],
      default: 'New',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lead', leadSchema);
