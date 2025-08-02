const User = require('../models/User');
const bcrypt = require('bcryptjs');
exports.getCustomers = async (req, res) => {
  try {
    let { page = 1, limit = 20, search = '', status } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const filter = { role: 'customer' };
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (status === 'active') {
      filter.isBlocked = { $ne: true };
    } else if (status === 'blocked') {
      filter.isBlocked = true;
    }
    const total = await User.countDocuments(filter);
    const customers = await User.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-password')
      .sort({ firstName: 1 });
    res.json({ total, page, limit, customers });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ message: 'Server error fetching customers' });
  }
};
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await User.findById(req.params.id).select('-password');
    if (!customer || customer.role !== 'customer') {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    console.error('Get customer by ID error:', error);
    res.status(500).json({ message: 'Server error fetching customer' });
  }
};
exports.createCustomer = async (req, res) => {
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
    const customer = await User.create({ firstName, lastName, email, password: hashed, role: 'customer' });
    res.status(201).json({ ...customer.toObject(), password: undefined });
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({ message: 'Server error creating customer' });
  }
};
exports.updateCustomer = async (req, res) => {
  try {
    const { firstName, lastName, email, isBlocked } = req.body;
    const customer = await User.findById(req.params.id);
    if (!customer || customer.role !== 'customer') {
      return res.status(404).json({ message: 'Customer not found' });
    }
    if (email && email !== customer.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }
      customer.email = email;
    }
    if (firstName != null) customer.firstName = firstName;
    if (lastName != null) customer.lastName = lastName;
    if (isBlocked != null) customer.isBlocked = isBlocked;
    await customer.save();
    res.json({ ...customer.toObject(), password: undefined });
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({ message: 'Server error updating customer' });
  }
};
exports.resetPassword = async (req, res) => {
  try {
    const customer = await User.findById(req.params.id);
    if (!customer || customer.role !== 'customer') {
      return res.status(404).json({ message: 'Customer not found' });
    }
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashed = await bcrypt.hash(tempPassword, 10);
    customer.password = hashed;
    await customer.save();
    res.json({ message: 'Password reset', tempPassword });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error resetting password' });
  }
};
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await User.findById(req.params.id);
    if (!customer || customer.role !== 'customer') {
      return res.status(404).json({ message: 'Customer not found' });
    }
    await customer.remove();
    res.json({ message: 'Customer deleted' });
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({ message: 'Server error deleting customer' });
  }
};
