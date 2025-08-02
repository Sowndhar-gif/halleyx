const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ firstName, lastName, email, password: hashed, role: 'customer' });
    res.status(201).json(user);
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email !== 'admin@example.com') {
      return res.status(400).json({ message: 'Invalid admin credentials' });
    }
    const user = await User.findOne({ email });
    if (!user || user.role !== 'admin' || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid admin credentials' });
    }
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error during admin login' });
  }
};
exports.impersonateCustomer = async (req, res) => {
  try {
    const adminUser = req.user;
    if (adminUser.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Only admins can impersonate' });
    }
    const customerId = req.params.customerId;
    const customer = await User.findById(customerId);
    if (!customer || customer.role !== 'customer') {
      return res.status(404).json({ message: 'Customer not found' });
    }
    const token = jwt.sign({ id: customer._id, email: customer.email, role: customer.role, impersonatedBy: adminUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: customer, impersonatedBy: adminUser.id });
  } catch (error) {
    console.error('Impersonate customer error:', error);
    res.status(500).json({ message: 'Server error during impersonation' });
  }
};
