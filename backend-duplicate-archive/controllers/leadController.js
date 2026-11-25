const Lead = require('../models/Lead');
const Product = require('../models/Product');
const { sendLeadEmails } = require('../services/emailService');

// POST /api/leads — public, used by the website's contact/enquiry form
async function createLead(req, res, next) {
  try {
    const { name, email, phone, company, message, product } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email and message are required' });
    }

    const lead = await Lead.create({ name, email, phone, company, message, product: product || undefined });

    let productName = '';
    if (product) {
      const selectedProduct = await Product.findById(product).select('name').lean();
      productName = selectedProduct?.name || '';
    }

    try {
      await sendLeadEmails({ name, email, phone, company, message, productName });
    } catch (emailError) {
      console.error('Lead email failed:', emailError.message);
      return res.status(502).json({
        success: false,
        message: 'Your enquiry was saved, but the email could not be sent. Please try again shortly.',
        leadId: lead._id,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Your requirement has been received. A confirmation email has been sent.',
      lead,
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/leads — admin only. Supports ?status=&page=&limit=
async function getLeads(req, res, next) {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (status && status !== 'All') filter.status = status;

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);

    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .populate('product', 'name slug')
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Lead.countDocuments(filter),
    ]);

    res.json({
      success: true,
      leads,
      pagination: { total, page: pageNum, pages: Math.ceil(total / limitNum) || 1 },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/leads/:id — admin only
async function getLeadById(req, res, next) {
  try {
    const lead = await Lead.findById(req.params.id).populate('product', 'name slug');
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    res.json({ success: true, lead });
  } catch (err) {
    next(err);
  }
}

// PUT /api/leads/:id — admin only, mainly used to update status
async function updateLead(req, res, next) {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });

    res.json({ success: true, message: 'Lead updated successfully', lead });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/leads/:id — admin only
async function deleteLead(req, res, next) {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    res.json({ success: true, message: 'Lead deleted successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = { createLead, getLeads, getLeadById, updateLead, deleteLead };
