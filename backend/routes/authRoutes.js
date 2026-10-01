const express = require('express');
const { login, register, logout, getMe } = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();
router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.get('/me', requireAuth, getMe);
module.exports = router;
