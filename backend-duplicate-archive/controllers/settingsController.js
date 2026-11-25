const SiteSettings = require('../models/SiteSettings');

const DEFAULTS = {
  key: 'global',
  company: {
    name: 'JKW Textiles', tagline: 'Simplifying sourcing for fashion’s finest.', email: 'jkwtextile@gmail.com',
    phones: ['+91 94140 70975', '+91 98282 70975'], whatsapp: '+919414070975', hours: 'Monday to Saturday, 10 am – 07 pm IST',
    address: { line1: 'JKW Textiles Pvt Ltd, Plot No. X-66A, Shyam Market, First Floor', line2: 'Near Mansarovar Flyover, Mahaveer Nagar, New Sanganer Road', city: 'Sanganer, Jaipur', state: 'Rajasthan', pin: '302029', country: 'India' },
    socials: { instagram: 'https://www.instagram.com/jkw.textile/', facebook: 'https://www.facebook.com/people/JKW-Textile/61592154050319/' },
  },
  hero: { eyebrow: 'Textile Sourcing & Manufacturing', title: 'Simplifying sourcing for fashion’s finest.', description: 'From fabric sourcing to production, one reliable partner for your next collection.' },
  resources: { enabled: true, label: 'Resources', description: 'Guides, sourcing notes and textile resources for brands.' },
};

async function getSettings(req, res, next) {
  try {
    let settings = await SiteSettings.findOne({ key: 'global' }).lean();
    if (!settings) settings = await SiteSettings.create(DEFAULTS);
    else {
      const socials = settings.company?.socials || {};
      const migratedSocials = {
        instagram: socials.instagram && socials.instagram !== '#' ? socials.instagram : DEFAULTS.company.socials.instagram,
        facebook: socials.facebook && socials.facebook !== '#' ? socials.facebook : DEFAULTS.company.socials.facebook,
      };
      if (socials.instagram !== migratedSocials.instagram || socials.facebook !== migratedSocials.facebook || socials.linkedin) {
        settings = await SiteSettings.findOneAndUpdate(
          { key: 'global' },
          { $set: { 'company.socials': migratedSocials } },
          { new: true }
        ).lean();
      }
    }
    res.json({ success: true, settings });
  } catch (err) { next(err); }
}

async function updateSettings(req, res, next) {
  try {
    const payload = { ...req.body, key: 'global' };
    const settings = await SiteSettings.findOneAndUpdate({ key: 'global' }, payload, { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true });
    res.json({ success: true, message: 'Site settings updated successfully', settings });
  } catch (err) { next(err); }
}

module.exports = { getSettings, updateSettings };
