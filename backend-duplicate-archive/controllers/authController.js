const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User');

function signToken(id, role) {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

async function login(req, res, next) {
  try {
    const { email, password, accountType = 'user' } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password are required' });

    const normalizedEmail = email.toLowerCase().trim();
    if (accountType === 'admin') {
      const admin = await Admin.findOne({ email: normalizedEmail }).select('+password');
      if (!admin || !(await admin.comparePassword(password))) return res.status(401).json({ success: false, message: 'Invalid admin login credentials' });
      const token = signToken(admin._id, admin.role);
      return res.json({ success: true, token, accountType: 'admin', user: { id: admin._id, name: admin.name, email: admin.email, role: admin.role } });
    }

    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user || !(await user.comparePassword(password))) return res.status(401).json({ success: false, message: 'Invalid login credentials' });
    const token = signToken(user._id, 'user');
    return res.json({ success: true, token, accountType: 'user', user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: 'user' } });
  } catch (err) { next(err); }
}

async function register(req, res, next) {
  try {
    const { name, email, password, phone = '' } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    if (password.length < 6) return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    const normalizedEmail = email.toLowerCase().trim();
    const [userExists, adminExists] = await Promise.all([
      User.findOne({ email: normalizedEmail }),
      Admin.findOne({ email: normalizedEmail }),
    ]);
    if (userExists || adminExists) return res.status(409).json({ success: false, message: 'An account with this email already exists' });

    const user = await User.create({ name, email: normalizedEmail, password, phone });
    const token = signToken(user._id, 'user');
    res.status(201).json({ success: true, token, accountType: 'user', user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: 'user' } });
  } catch (err) { next(err); }
}

function logout(req, res) { res.json({ success: true, message: 'Logged out' }); }

async function getMe(req, res, next) {
  try { res.json({ success: true, user: req.authUser }); } catch (err) { next(err); }
}
module.exports = { login, register, logout, getMe };
