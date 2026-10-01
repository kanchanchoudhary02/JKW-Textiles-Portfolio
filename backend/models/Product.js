const mongoose = require('mongoose');
const slugify = require('slugify');

const colorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    hex: { type: String, default: '#1A1A70', trim: true },
    images: [{ type: String }],
  },
  { _id: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    description: { type: String, trim: true, default: '' },
    // Legacy fields are kept for existing database compatibility but are no longer
    // shown or edited because JKW Textiles is presented as a portfolio/catalogue site.
    price: { type: Number, default: 0, min: 0 },
    salePrice: { type: Number, min: 0 },
    category: {
      type: String,
      required: true,
      enum: ['Cotton', 'Linen', 'Rayon', 'Blended', 'Printed', 'Dyed', 'Yarn Dyed', 'Other'],
    },
    subcategory: { type: String, trim: true, default: '' },
    spec: { type: String, trim: true, default: '' },
    images: [{ type: String }],
    colors: { type: [colorSchema], default: [] },
    stock: { type: Number, default: 0, min: 0 },
    sku: { type: String, trim: true, unique: true, sparse: true },
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

productSchema.pre('validate', function generateSlug(next) {
  if (this.name && (!this.slug || this.isModified('name'))) {
    this.slug = `${slugify(this.name, { lower: true, strict: true })}-${Date.now().toString(36)}`;
  }
  next();
});

productSchema.index({ name: 'text', description: 'text', category: 'text', subcategory: 'text', spec: 'text' });

module.exports = mongoose.model('Product', productSchema);
