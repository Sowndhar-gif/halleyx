const Product = require('../models/Product');
const Order = require('../models/Order');

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, imageUrl } = req.body;
    if (!name || price == null || stock == null) {
      return res.status(400).json({ message: 'Name, price, and stock are required' });
    }
    if (price <= 0 || stock < 0) {
      return res.status(400).json({ message: 'Price must be > 0 and stock >= 0' });
    }
    const product = await Product.create({ name, description, price, stock, imageUrl });
    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error creating product' });
  }
};

// Get products with pagination, sorting, filtering
exports.getProducts = async (req, res) => {
  try {
    let { page = 1, limit = 20, sortBy = 'name', order = 'asc', search = '' } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const sortOrder = order === 'asc' ? 1 : -1;

    const filter = {};
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ total, page, limit, products });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error fetching products' });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({ message: 'Server error fetching product' });
  }
};

// Update product by ID
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, stock, imageUrl } = req.body;
    if (price != null && price <= 0) {
      return res.status(400).json({ message: 'Price must be > 0' });
    }
    if (stock != null && stock < 0) {
      return res.status(400).json({ message: 'Stock must be >= 0' });
    }
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (name != null) product.name = name;
    if (description != null) product.description = description;
    if (price != null) product.price = price;
    if (stock != null) product.stock = stock;
    if (imageUrl != null) product.imageUrl = imageUrl;

    await product.save();
    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error updating product' });
  }
};

// Delete product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const existingOrder = await Order.findOne({ productId });
    if (existingOrder) {
      return res.status(400).json({ message: 'Cannot delete product with existing orders' });
    }
    const product = await Product.findByIdAndDelete(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error deleting product' });
  }
};
