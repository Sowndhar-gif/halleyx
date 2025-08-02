const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const auth = require('../middleware/authMiddleware');
function authorizeRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
}
router.get('/', auth, authorizeRole('admin'), customerController.getCustomers);
router.get('/:id', auth, authorizeRole('admin'), customerController.getCustomerById);
router.post('/', auth, authorizeRole('admin'), customerController.createCustomer);
router.put('/:id', auth, authorizeRole('admin'), customerController.updateCustomer);
router.post('/:id/reset-password', auth, authorizeRole('admin'), customerController.resetPassword);
router.delete('/:id', auth, authorizeRole('admin'), customerController.deleteCustomer);
module.exports = router;
