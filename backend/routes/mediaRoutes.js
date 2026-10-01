const express = require('express');
const { getMedia, getAdminMedia, upsertMedia, deleteMedia } = require('../controllers/mediaController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();
router.get('/', getMedia);
router.get('/admin', protect, getAdminMedia);
router.post('/:key', protect, upload.single('image'), upsertMedia);
router.delete('/:key', protect, deleteMedia);

module.exports = router;
