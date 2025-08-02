const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const auth = require('../middleware/authMiddleware');

// Role-based access control middleware
function authorizeRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
}

// Get branding settings (any authenticated user)
router.get('/branding', auth, settingsController.getBrandingSettings);

// Update branding settings (admin only)
router.put('/branding', auth, authorizeRole('admin'), settingsController.updateBrandingSettings);

// Upload logo (admin only) - file upload handling to be added later
router.post('/branding/logo', auth, authorizeRole('admin'), settingsController.uploadLogo);

// Get admin dashboard stats (admin only)
router.get('/admin-dashboard', auth, authorizeRole('admin'), settingsController.getAdminDashboardStats);

module.exports = router;
