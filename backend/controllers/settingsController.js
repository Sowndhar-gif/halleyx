const fs = require('fs');
const path = require('path');
const settingsFilePath = path.join(__dirname, 'brandingSettings.json');
let brandingSettings = {
  logoUrl: '',
  primaryColor: '#FF5733',
  secondaryColor: '#00AACC',
  fontFamily: 'Roboto',
  customHtml: ''
};
if (fs.existsSync(settingsFilePath)) {
  try {
    const data = fs.readFileSync(settingsFilePath, 'utf-8');
    brandingSettings = JSON.parse(data);
  } catch (error) {
    console.error('Error reading branding settings file:', error);
  }
}
function saveBrandingSettingsToFile() {
  try {
    fs.writeFileSync(settingsFilePath, JSON.stringify(brandingSettings, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving branding settings file:', error);
  }
}
exports.getBrandingSettings = (req, res) => {
  res.json(brandingSettings);
};
exports.updateBrandingSettings = (req, res) => {
  const { primaryColor, secondaryColor, fontFamily, customHtml } = req.body;
  if (primaryColor) brandingSettings.primaryColor = primaryColor;
  if (secondaryColor) brandingSettings.secondaryColor = secondaryColor;
  if (fontFamily) brandingSettings.fontFamily = fontFamily;
  if (customHtml) brandingSettings.customHtml = customHtml;
  saveBrandingSettingsToFile();
  res.json({ message: 'Branding settings updated', brandingSettings });
};
exports.uploadLogo = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  brandingSettings.logoUrl = '/uploads/' + req.file.filename;
  saveBrandingSettingsToFile();
  res.json({ message: 'Logo uploaded', logoUrl: brandingSettings.logoUrl });
};
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');
exports.getAdminDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const statusCounts = {};
    ordersByStatus.forEach(item => {
      statusCounts[item._id] = item.count;
    });
    res.json({
      totalProducts,
      totalCustomers,
      ordersByStatus: statusCounts
    });
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error);
    res.status(500).json({ message: 'Server error fetching dashboard stats' });
  }
};
