const Product = require('../models/Product');
const Lead = require('../models/Lead');

// GET /api/dashboard/stats — admin only
async function getStats(req, res, next) {
  try {
    const [totalProducts, activeProducts, featuredProducts, totalLeads, recentProducts, recentLeads] =
      await Promise.all([
        Product.countDocuments(),
        Product.countDocuments({ status: 'active' }),
        Product.countDocuments({ featured: true }),
        Lead.countDocuments(),
        Product.find().sort({ createdAt: -1 }).limit(5),
        Lead.find().sort({ createdAt: -1 }).limit(5),
      ]);

    res.json({
      success: true,
      stats: { totalProducts, activeProducts, featuredProducts, totalLeads },
      recentProducts,
      recentLeads,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getStats };
