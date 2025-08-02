const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
exports.placeOrder = async (req, res) => {
  try {
    const { productId, quantity, shippingAddress, billingAddress } = req.body;
    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Product ID and positive quantity are required' });
    }
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }
    product.stock -= quantity;
    await product.save();
    const order = await Order.create({
      userId: req.user.id,
      productId,
      quantity,
      status: 'Pending',
      shippingAddress,
      billingAddress,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    res.status(201).json(order);
  } catch (error) {
    console.error('Place order error:', error);
    res.status(500).json({ message: 'Server error placing order' });
  }
};
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).populate('productId');
    res.json(orders);
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
};
exports.getOrders = async (req, res) => {
  try {
    let { page = 1, limit = 20, status, customerId, productId, startDate, endDate } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const filter = {};
    if (status) filter.status = status;
    if (customerId) filter.userId = customerId;
    if (productId) filter.productId = productId;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .populate('productId')
      .populate('userId', 'firstName lastName email')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
    res.json({ total, page, limit, orders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
};
exports.updateOrder = async (req, res) => {
  try {
    const { status, quantity, shippingAddress, billingAddress } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (quantity != null && quantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be positive' });
    }
    if (quantity != null && quantity !== order.quantity) {
      const product = await Product.findById(order.productId);
      if (!product) return res.status(404).json({ message: 'Product not found' });
      const stockChange = quantity - order.quantity;
      if (product.stock < stockChange) {
        return res.status(400).json({ message: 'Insufficient stock for update' });
      }
      product.stock -= stockChange;
      await product.save();
      order.quantity = quantity;
    }
    if (status != null) order.status = status;
    if (shippingAddress != null) order.shippingAddress = shippingAddress;
    if (billingAddress != null) order.billingAddress = billingAddress;
    order.updatedAt = new Date();
    await order.save();
    res.json(order);
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ message: 'Server error updating order' });
  }
};
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    const product = await Product.findById(order.productId);
    if (product) {
      product.stock += order.quantity;
      await product.save();
    }
    res.json({ message: 'Order deleted' });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ message: 'Server error deleting order' });
  }
};
