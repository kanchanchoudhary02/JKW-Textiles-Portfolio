const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, default: 'global' },
    company: {
      name: { type: String, default: 'JKW Textiles' },
      tagline: { type: String, default: 'Simplifying sourcing for fashion’s finest.' },
      email: { type: String, default: 'jkwtextile@gmail.com' },
      phones: { type: [String], default: ['+91 94140 70975', '+91 98282 70975'] },
      whatsapp: { type: String, default: '+919414070975' },
      hours: { type: String, default: 'Monday to Saturday, 10 am – 07 pm IST' },
      address: {
        line1: { type: String, default: 'JKW Textiles Pvt Ltd, Plot No. X-66A, Shyam Market, First Floor' },
        line2: { type: String, default: 'Near Mansarovar Flyover, Mahaveer Nagar, New Sanganer Road' },
        city: { type: String, default: 'Sanganer, Jaipur' },
        state: { type: String, default: 'Rajasthan' },
        pin: { type: String, default: '302029' },
        country: { type: String, default: 'India' },
      },
      socials: {
        instagram: { type: String, default: 'https://www.instagram.com/jkw.textile/' },
        facebook: { type: String, default: 'https://www.facebook.com/people/JKW-Textile/61592154050319/' },
      },
    },
    hero: {
      eyebrow: { type: String, default: 'Textile Sourcing & Manufacturing' },
      title: { type: String, default: 'Simplifying sourcing for fashion’s finest.' },
      description: { type: String, default: 'From fabric sourcing to production, one reliable partner for your next collection.' },
    },
    homeMediaVersion: { type: Number, default: 0 },
    megaMenuMediaVersion: { type: Number, default: 0 },
    resources: {
      enabled: { type: Boolean, default: true },
      label: { type: String, default: 'Resources' },
      description: { type: String, default: 'Guides, sourcing notes and textile resources for brands.' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
