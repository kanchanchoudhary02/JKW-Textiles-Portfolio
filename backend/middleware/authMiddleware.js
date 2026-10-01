const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User');

async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    if (!token) return res.status(401).json({ success: false, message: 'Not authorized, no token' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role === 'user') {
      const user = await User.findById(decoded.id);
      if (!user) return res.status(401).json({ success: false, message: 'User account not found' });
      req.authUser = { id: user._id, name: user.name, email: user.email, phone: user.phone, role: 'user' };
      return next();
    }

    const admin = await Admin.findById(decoded.id);
    if (!admin) return res.status(401).json({ success: false, message: 'Admin account not found' });
    req.authUser = { id: admin._id, name: admin.name, email: admin.email, role: admin.role };
    req.admin = admin;
    next();
  } catch (err) { return res.status(401).json({ success: false, message: 'Not authorized, invalid token' }); }
}

async function protect(req, res, next) {
  await requireAuth(req, res, () => {
    if (!req.admin) return res.status(403).json({ success: false, message: 'Admin access required' });
    next();
  });
}

module.exports = { protect, requireAuth };
