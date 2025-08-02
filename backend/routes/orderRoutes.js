const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/authMiddleware');
function authorizeRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
}
router.post('/', auth, orderController.placeOrder);
router.get('/mine', auth, orderController.getUserOrders);
router.get('/', auth, authorizeRole('admin'), orderController.getOrders);
router.put('/:id', auth, authorizeRole('admin'), orderController.updateOrder);
router.delete('/:id', auth, authorizeRole('admin'), orderController.deleteOrder);
module.exports = router;
