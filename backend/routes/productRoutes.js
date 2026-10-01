const express = require('express');
const {
  getProducts,
  getProductById,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductImage,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/', getProducts);
router.get('/admin/all', protect, getAdminProducts);

const productUpload = upload.fields([
  { name: 'mainImages', maxCount: 6 },
  { name: 'colorImages', maxCount: 24 },
]);
router.post('/', protect, productUpload, createProduct);
router.put('/:id', protect, productUpload, updateProduct);
router.delete('/:id', protect, deleteProduct);
router.get('/:id', getProductById);

module.exports = router;
