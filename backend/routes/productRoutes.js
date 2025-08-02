const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/authMiddleware');
function authorizeRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
}
router.get('/', auth, productController.getProducts);
router.post('/', auth, authorizeRole('admin'), productController.createProduct);
router.get('/:id', auth, authorizeRole('admin'), productController.getProductById);
router.put('/:id', auth, authorizeRole('admin'), productController.updateProduct);
router.delete('/:id', auth, authorizeRole('admin'), productController.deleteProduct);
module.exports = router;
